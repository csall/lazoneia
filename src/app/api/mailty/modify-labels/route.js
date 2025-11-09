import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new Response('unauthorized', { status: 401 });
  
  try {
    const { messageId, addLabelIds, removeLabelIds } = await req.json();
    if (!messageId) return new Response('missing messageId', { status: 400 });
    
    const body = {};
    if (addLabelIds && addLabelIds.length > 0) body.addLabelIds = addLabelIds;
    if (removeLabelIds && removeLabelIds.length > 0) body.removeLabelIds = removeLabelIds;
    
    const r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${session.accessToken}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(body)
    });
    
    if (!r.ok) {
      const errorText = await r.text();
      return new Response(`gmail modify error: ${errorText}`, { status: r.status });
    }
    
    const data = await r.json();
    return Response.json({ ok: true, message: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
