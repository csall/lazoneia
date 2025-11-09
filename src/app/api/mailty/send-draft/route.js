import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new Response('unauthorized', { status: 401 });
  
  try {
    const { draftId } = await req.json();
    
    if (!draftId) return new Response('missing draft id', { status: 400 });
    
    // Envoyer le brouillon
    const r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/drafts/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: draftId })
    });
    
    if (!r.ok) {
      const errorText = await r.text();
      return new Response(`gmail error: ${errorText}`, { status: r.status });
    }
    
    const data = await r.json();
    return Response.json({ ok: true, message: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
