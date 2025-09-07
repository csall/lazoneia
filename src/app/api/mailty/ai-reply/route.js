export async function POST(req){
  try {
    const { subject, body, tone } = await req.json();
    const replyEndpoint = "https://cheikh06000.app.n8n.cloud/webhook/reply"; // même route que l'agent Reply
    const message = `Email reçu:\nSujet: ${subject || '(Sans objet)'}\n\n${(body||'').slice(0,6000)}`;
    const payload = { message, tone: tone || 'professionnel', targetLang: 'français' };
    const r = await fetch(replyEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if(!r.ok){
      const txt = await r.text().catch(()=> '');
      throw new Error('Réponse agent Reply non OK: '+r.status+' '+txt);
    }
    // essaye d'extraire texte
    let data = {};
    try { data = await r.json(); } catch{}
    const resultText = data.result || data.output || data[0]?.text || data.reply || JSON.stringify(data);
    return Response.json({ reply: resultText });
  } catch(e){
    return Response.json({ reply: `(erreur génération) ${e.message}` }, { status: 500 });
  }
}
