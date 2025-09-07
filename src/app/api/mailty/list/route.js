import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper pour parser l'expéditeur
function parseFrom(value = "") {
  const emailMatch = value.match(/<([^>]+)>/);
  const email = emailMatch ? emailMatch[1] : value;
  const name = value.includes("<") ? value.split("<")[0].replace(/"/g, '').trim() : email.split('@')[0];
  return { name, email };
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return Response.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const pageToken = searchParams.get('pageToken') || '';
    const q = searchParams.get('q') || '';
    const params = new URLSearchParams({ maxResults: '15' });
    if (pageToken) params.set('pageToken', pageToken);
    if (q) params.set('q', q);
    // Limiter les champs retournés pour performance
    params.set('includeSpamTrash', 'false');

    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`;
    const listRes = await fetch(listUrl, { headers: { Authorization: `Bearer ${session.accessToken}` } });
    if (!listRes.ok) {
      const errTxt = await listRes.text();
      return Response.json({ error: 'gmail_list_failed', detail: errTxt }, { status: listRes.status });
    }
    const listData = await listRes.json();
    const rawMessages = listData.messages || [];
    if (!rawMessages.length) {
      return Response.json({ messages: [], nextPageToken: listData.nextPageToken || null });
    }

    // Récupération des métadonnées pour chaque message
    const messages = await Promise.all(rawMessages.map(async ({ id }) => {
      const metaUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`;
      const metaRes = await fetch(metaUrl, { headers: { Authorization: `Bearer ${session.accessToken}` } });
      if (!metaRes.ok) return { id, error: true };
      const metaData = await metaRes.json();
      const headerMap = Object.fromEntries((metaData.payload?.headers || []).map(h => [h.name.toLowerCase(), h.value]));
      const fromParsed = parseFrom(headerMap['from'] || '');
      return {
        id,
        threadId: metaData.threadId,
        subject: headerMap['subject'] || '',
        fromName: fromParsed.name,
        fromEmail: fromParsed.email,
        snippet: metaData.snippet || ''
      };
    }));

    return Response.json({ messages, nextPageToken: listData.nextPageToken || null });
  } catch (e) {
    return Response.json({ error: 'exception', message: e.message }, { status: 500 });
  }
}
