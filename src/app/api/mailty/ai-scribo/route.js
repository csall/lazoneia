export async function POST(req) {
    try {
        const { text, tone } = await req.json();

        const scriboEndpoint = "https://cheikh06000.app.n8n.cloud/webhook/scribo"; // même logique que Reply
        const payload = { message: (text || '').slice(0, 6000), tone: tone || 'neutre', targetLang: 'français' };
        console.log(payload);
        const r = await fetch(scriboEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!r.ok) {
            const txt = await r.text().catch(() => '');
            throw new Error('Réponse agent Scribo non OK: ' + r.status + ' ' + txt);
        }
        let data = {};
        try { data = await r.json(); } catch { }
        // Recherche la première clé non vide parmi les champs attendus
        const resultText = [data.text, data.result, data.output, data.scribo, Array.isArray(data) ? data[0]?.text : undefined]
            .find(val => typeof val === 'string' && val.trim().length > 0) || JSON.stringify(data);
        return Response.json({ scribo: resultText });
    } catch (e) {
        return Response.json({ scribo: `(erreur génération) ${e.message}` }, { status: 500 });
    }
}
