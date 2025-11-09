import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Récupérer un brouillon spécifique
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new Response('unauthorized', { status: 401 });
  
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get('id');
    
    if (!draftId) return new Response('missing draft id', { status: 400 });
    
    const r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/drafts/${draftId}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    
    if (!r.ok) return new Response('gmail error', { status: r.status });
    
    const draft = await r.json();
    const message = draft.message;
    
    // Parser les headers
    const headers = message.payload?.headers || [];
    const headerMap = Object.fromEntries(headers.map(h => [h.name.toLowerCase(), h.value]));
    
    // Décoder le body
    function decodeBase64Url(str = "") {
      try {
        return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
      } catch { return ""; }
    }
    
    let body = "";
    if (message.payload?.body?.data) {
      body = decodeBase64Url(message.payload.body.data);
    } else if (message.payload?.parts) {
      for (const part of message.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          body = decodeBase64Url(part.body.data);
          break;
        }
      }
    }
    
    return Response.json({
      id: draft.id,
      messageId: message.id,
      to: headerMap['to'] || '',
      subject: headerMap['subject'] || '',
      body: body,
      threadId: message.threadId
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// POST - Créer ou mettre à jour un brouillon
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new Response('unauthorized', { status: 401 });
  
  try {
    const { to, subject, body, draftId, threadId } = await req.json();
    
    if (!to || !subject) return new Response('missing to or subject', { status: 400 });
    
    // Construire le message RFC 2822
    const raw = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      body || ''
    ].join('\n');
    
    const encoded = Buffer.from(raw).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    const payload = {
      message: {
        raw: encoded,
        ...(threadId ? { threadId } : {})
      }
    };
    
    let url, method;
    if (draftId) {
      // Mettre à jour un brouillon existant
      url = `https://gmail.googleapis.com/gmail/v1/users/me/drafts/${draftId}`;
      method = 'PUT';
    } else {
      // Créer un nouveau brouillon
      url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts';
      method = 'POST';
    }
    
    const r = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!r.ok) {
      const errorText = await r.text();
      return new Response(`gmail error: ${errorText}`, { status: r.status });
    }
    
    const data = await r.json();
    return Response.json({ ok: true, draft: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// DELETE - Supprimer un brouillon
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new Response('unauthorized', { status: 401 });
  
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get('id');
    
    if (!draftId) return new Response('missing draft id', { status: 400 });
    
    const r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/drafts/${draftId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    
    if (!r.ok && r.status !== 204) {
      return new Response('gmail error', { status: r.status });
    }
    
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
