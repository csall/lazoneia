import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return Response.json({ error: 'unauthorized' }, { status: 401 });
  
  try {
    const { searchParams } = new URL(req.url);
    const maxResults = searchParams.get('maxResults') || '15';
    
    // Récupérer la liste des brouillons
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/drafts?maxResults=${maxResults}`;
    const listRes = await fetch(listUrl, { 
      headers: { Authorization: `Bearer ${session.accessToken}` } 
    });
    
    if (!listRes.ok) {
      const errTxt = await listRes.text();
      return Response.json({ error: 'gmail_list_failed', detail: errTxt }, { status: listRes.status });
    }
    
    const listData = await listRes.json();
    const rawDrafts = listData.drafts || [];
    
    if (!rawDrafts.length) {
      return Response.json({ drafts: [] });
    }
    
    // Récupérer les métadonnées de chaque brouillon
    const drafts = await Promise.all(rawDrafts.map(async (draft) => {
      const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/drafts/${draft.id}`;
      const detailRes = await fetch(detailUrl, { 
        headers: { Authorization: `Bearer ${session.accessToken}` } 
      });
      
      if (!detailRes.ok) return { id: draft.id, error: true };
      
      const detailData = await detailRes.json();
      const message = detailData.message;
      const headers = message.payload?.headers || [];
      const headerMap = Object.fromEntries(headers.map(h => [h.name.toLowerCase(), h.value]));
      
      return {
        id: draft.id,
        messageId: message.id,
        threadId: message.threadId,
        subject: headerMap['subject'] || '(Sans objet)',
        to: headerMap['to'] || '',
        fromName: 'Brouillon',
        fromEmail: headerMap['to'] || '',
        snippet: message.snippet || '',
        internalDate: message.internalDate || null,
        labelIds: ['DRAFT'],
        isDraft: true
      };
    }));
    
    return Response.json({ drafts });
  } catch (e) {
    return Response.json({ error: 'exception', message: e.message }, { status: 500 });
  }
}
