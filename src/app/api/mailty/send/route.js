import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new Response('unauthorized', { status: 401 });
  const { to, subject, body, threadId } = await req.json();
  if (!to || !subject || !body) return new Response('missing fields', { status: 400 });
  const raw = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body
  ].join('\n');
  const encoded = Buffer.from(raw).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const r = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessToken}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ raw: encoded, ...(threadId?{threadId}:{}) })
  });
  if (!r.ok) return new Response('gmail send error', { status: 500 });
  const data = await r.json();
  return Response.json({ ok: true, id: data.id });
}
