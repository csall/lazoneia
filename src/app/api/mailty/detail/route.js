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
  if (!payload) return "";
  if (payload.parts && Array.isArray(payload.parts)) {
    // Chercher plain text sinon html
    for (const p of payload.parts) {
      if (p.mimeType === 'text/plain' && p.body?.data) return decodeBase64Url(p.body.data);
    }
    for (const p of payload.parts) {
      if (p.mimeType === 'text/html' && p.body?.data) return decodeBase64Url(p.body.data).replace(/<[^>]+>/g,'');
    }
  }
  return decodeBase64Url(payload.body?.data || '');
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
    const body = extractBody(data.payload);
    return Response.json({
      id,
      threadId: data.threadId,
      subject: headerMap['subject'] || '',
      fromEmail: fromParsed.email,
      fromName: fromParsed.name,
      body,
      snippet: data.snippet || ''
    });
  } catch (e) {
    return new Response('exception', { status: 500 });
  }
}
