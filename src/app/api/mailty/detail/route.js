import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function decodeBase64Url(str = "") {
  try {
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  } catch { return ""; }
}

function parseFrom(value = "") {
  const emailMatch = value.match(/<([^>]+)>/);
  const email = emailMatch ? emailMatch[1] : value;
  const name = value.includes('<') ? value.split('<')[0].replace(/"/g,'').trim() : email.split('@')[0];
  return { name, email };
}

function extractBody(payload) {
  if (!payload) return { html: "", text: "", type: "text" };
  
  let htmlContent = "";
  let textContent = "";
  
  if (payload.parts && Array.isArray(payload.parts)) {
    // Chercher text/plain et text/html
    for (const p of payload.parts) {
      if (p.mimeType === 'text/plain' && p.body?.data) {
        textContent = decodeBase64Url(p.body.data);
      }
      if (p.mimeType === 'text/html' && p.body?.data) {
        htmlContent = decodeBase64Url(p.body.data);
      }
      // Support des parties imbriquées (multipart/alternative)
      if (p.parts && Array.isArray(p.parts)) {
        for (const subPart of p.parts) {
          if (subPart.mimeType === 'text/plain' && subPart.body?.data) {
            textContent = decodeBase64Url(subPart.body.data);
          }
          if (subPart.mimeType === 'text/html' && subPart.body?.data) {
            htmlContent = decodeBase64Url(subPart.body.data);
          }
        }
      }
    }
  } else {
    // Pas de parties multiples
    const bodyData = decodeBase64Url(payload.body?.data || '');
    if (payload.mimeType === 'text/html') {
      htmlContent = bodyData;
    } else {
      textContent = bodyData;
    }
  }
  
  // Retourner HTML si disponible, sinon text converti avec line breaks
  if (htmlContent) {
    return { html: htmlContent, text: textContent, type: "html" };
  }
  if (textContent) {
    // Convertir le texte brut en HTML simple avec préservation des retours à la ligne
    const htmlFromText = textContent
      .split('\n')
      .map(line => line.trim() ? `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : '<br/>')
      .join('');
    return { html: htmlFromText, text: textContent, type: "text" };
  }
  
  return { html: "", text: "", type: "text" };
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new Response('unauthorized', { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return new Response('missing id', { status: 400 });
  try {
    const fullUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`;
    const res = await fetch(fullUrl, { headers: { Authorization: `Bearer ${session.accessToken}` } });
    if (!res.ok) return new Response('gmail error', { status: res.status });
    const data = await res.json();
    const headersArr = data.payload?.headers || [];
    const headerMap = Object.fromEntries(headersArr.map(h => [h.name.toLowerCase(), h.value]));
    const fromParsed = parseFrom(headerMap['from'] || '');
    const bodyParsed = extractBody(data.payload);
    
    // Extraire la date
    const dateStr = headerMap['date'] || '';
    let formattedDate = '';
    if (dateStr) {
      try {
        const date = new Date(dateStr);
        formattedDate = date.toLocaleString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch {}
    }
    
    return Response.json({
      id,
      threadId: data.threadId,
      subject: headerMap['subject'] || '',
      fromEmail: fromParsed.email,
      fromName: fromParsed.name,
      to: headerMap['to'] || '',
      date: formattedDate,
      body: bodyParsed.html,
      bodyText: bodyParsed.text,
      bodyType: bodyParsed.type,
      snippet: data.snippet || '',
      labelIds: data.labelIds || []
    });
  } catch (e) {
    return new Response('exception', { status: 500 });
  }
}
