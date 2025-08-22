import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Ta clé API OpenAI stockée dans .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Textes parasites connus à filtrer
const BLACKLIST = [
  "Sous-titres réalisés par la communauté",
  "Transcription automatique",
  "Subtitles provided",
  "Amara.org",
  "Sous-titres",
  "Sous-titrage ST' 501"
];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio"); // Nom du champ côté frontend

    // Vérifications basiques
    if (!audioFile) {
      return NextResponse.json({ error: "Aucun fichier audio fourni." }, { status: 400 });
    }
    if (!audioFile.type.startsWith("audio/")) {
      return NextResponse.json({ error: "Le fichier n'est pas audio.", type: audioFile.type }, { status: 400 });
    }
    if (audioFile.size < 5000) { // ~5 Ko minimum
      return NextResponse.json({ text: "", warning: "Fichier audio trop court ou silence détecté." });
    }

    // Préparer FormData pour Whisper
    const openaiForm = new FormData();
    openaiForm.append("file", audioFile, audioFile.name || "audio.webm");
    openaiForm.append("model", "whisper-1");

    // Prompt exact utilisé pour imiter ChatGPT
    openaiForm.append(
      "prompt",
      "Transcris fidèlement ce que tu entends. Ne rajoute aucun mot, signe ou ponctuation non prononcé. Supprime les bruits parasites et hésitations. Langue : français."
    );
    openaiForm.append("language", "fr");

    // Timeout 60s
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: openaiForm,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const result = await response.json();
    console.log("Whisper API result:", result);

    if (result.text) {
      // Nettoyer caractères invisibles
      let cleanText = result.text.replace(/[\x00-\x1F\x7F]/g, "").trim();

      // Supprimer textes parasites connus
      if (BLACKLIST.some(b => cleanText.includes(b))) {
        cleanText = "";
      }

      return NextResponse.json({ text: cleanText });
    } else {
      return NextResponse.json({ error: "La transcription a échoué.", details: result }, { status: 500 });
    }
  } catch (err) {
    const errorMessage = err.name === "AbortError" ? "Transcription timeout" : err.message;
    return NextResponse.json({ error: "Erreur serveur", details: errorMessage }, { status: 500 });
  }
}
