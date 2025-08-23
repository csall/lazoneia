
"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import LingoWaveBackground from "../../components/LingoWaveBackground";
import ChatGPTMicIcon from "../../components/ChatGPTMicIcon";
import ChatGPTMicAnimation from "@/components/ChatGPTMicAnimation";

export default function LingoPage() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [translationTone, setTranslationTone] = useState("pro");
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef(null);
  // Gestion micro façon ChatGPT (MediaRecorder)
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [micState, setMicState] = useState("idle"); // idle | recording | loading | error
  const [micReady, setMicReady] = useState(false); // Permission micro accordée
  const [micError, setMicError] = useState("");


  // Démarrage / arrêt / annulation dictée
  const startRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording || recordingActiveRef.current) return; // Empêche le double démarrage
    tempTranscriptRef.current = "";
    setIsCancelled(false);
    setMicButtonActive(true);
    recordingActiveRef.current = true;
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recordingActiveRef.current = false;
    recognitionRef.current.stop();

    if (!isCancelled && tempTranscriptRef.current) {
      const newInput = userInput ? userInput + " " + tempTranscriptRef.current : tempTranscriptRef.current;
      setUserInput(newInput);
      handleSubmit({ preventDefault: () => {} }, newInput); // auto-submit
    }
    tempTranscriptRef.current = "";
  };

  const cancelRecording = () => {
    setIsCancelled(true);
    recordingActiveRef.current = false;
    if (recognitionRef.current && recognitionRef.current.state !== "inactive") {
      recognitionRef.current.stop();
    }
    tempTranscriptRef.current = "";
  };

  // Gestion souris (WhatsApp-like)
  // Micro façon ChatGPT : maintien = enregistrement, relâchement = transcription
  const startMicRecording = async () => {
    if (micState !== "idle" && micState !== "error") return;
    setMicError("");
    if (!micReady) {
      setMicState("loading");
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Micro non disponible");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!stream || !stream.active) {
          setMicState("error");
          return;
        }
        setMicReady(true);
        setMicState("idle");
      } catch (err) {
        setMicState("idle");
      }
      return;
    }
    // Permission déjà accordée, démarre l'enregistrement avec un nouveau stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!stream || !stream.active) {
        setMicState("error");
        return;
      }
      setMicError("");
      setMicState("recording");
      const recorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => handleAudioStop(stream);
      recorder.start();
      // Strict press-and-hold: stop/cancel recording immediately on release
      const stopOnMicRelease = (e) => {
        stopMicRecording();
        window.removeEventListener("mouseup", stopOnMicRelease);
        window.removeEventListener("touchend", stopOnMicRelease);
        window.removeEventListener("mousemove", cancelOnMove);
        window.removeEventListener("touchmove", cancelOnMove);
      };
      window.addEventListener("mouseup", stopOnMicRelease);
      window.addEventListener("touchend", stopOnMicRelease);
      // Cancel if pointer leaves button while held (mouse/touch)
      const micButton = document.getElementById("mic-btn-lingo");
      const cancelOnMove = (e) => {
        let x, y;
        if (e.type === "mousemove") {
          x = e.clientX; y = e.clientY;
        } else if (e.type === "touchmove") {
          x = e.touches[0].clientX; y = e.touches[0].clientY;
        }
        if (micButton) {
          const rect = micButton.getBoundingClientRect();
          if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            stopMicRecording();
            window.removeEventListener("mousemove", cancelOnMove);
            window.removeEventListener("touchmove", cancelOnMove);
            window.removeEventListener("mouseup", stopOnMicRelease);
            window.removeEventListener("touchend", stopOnMicRelease);
          }
        }
      };
      window.addEventListener("mousemove", cancelOnMove);
      window.addEventListener("touchmove", cancelOnMove);
    } catch (err) {
      setMicState("error");
    }
  };

  const stopMicRecording = () => {
    if (micState === "recording" && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setMicState("loading");
    }
    if (micState === "error") {
      setMicState("idle");
      setMicError("");
    }
  };

  // Envoi backend et gestion état
  const handleAudioStop = async (stream) => {
    setMicState("loading");
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    stream.getTracks().forEach(track => track.stop());
    if (audioBlob.size < 1000) {
      setMicState("error");
      return;
    }
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    try {
      const res = await fetch('/api/whisper-transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.text) {
        setUserInput(data.text);
        setMicState("idle");
        // Déclenche la traduction automatiquement après transcription
        handleSubmit({ preventDefault: () => {} }, data.text);
      } else {
        setMicState("error");
      }
    } catch (err) {
      setMicError("Erreur réseau ou backend");
      setMicState("error");
    }
  };
  // Fonction pour gérer la soumission du message (compatible soumission auto)
  const handleSubmit = async (e, overrideInput) => {
    if (e && e.preventDefault) e.preventDefault();
    const input = overrideInput !== undefined ? overrideInput : userInput;
    if (!input.trim()) return;
    setIsLoading(true);
    setResponse("");
    try {
      // Utilise la nouvelle API whisper-transcribe si input commence par 'audio:'
      if (input.startsWith('audio:')) {
        const audioUrl = input.slice(6);
        const res = await fetch('/api/whisper-transcribe', {
          method: 'POST',
          body: JSON.stringify({ audioUrl }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.text) {
          setUserInput(data.text);
          // Enchaîne la traduction après transcription
          await handleSubmit({ preventDefault: () => {} }, data.text);
        }
        setIsLoading(false);
        return;
      }
      // Sinon, workflow classique
      const res = await fetch("https://cheikh06000.app.n8n.cloud/webhook/lingo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input, tone: translationTone, target: targetLang })
      });
      let resultText = "";
      if (!res.ok) {
        resultText = `Erreur réseau (${res.status})`;
      } else {
        resultText = await res.text();
        resultText=JSON.parse(resultText)[0].text;
      }
      setResponse(resultText);
    } catch (err) {
      setResponse("Erreur lors de la requête : " + err.message);
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse("");
    setIsCopied(false);
  };
  
  // Fonction pour copier la réponse dans le presse-papiers
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setIsCopied(true);
      
      // Réinitialiser l'état après 2 secondes
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Échec lors de la copie:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-amber-900 to-yellow-800 text-white relative overflow-hidden">
      <LingoWaveBackground />
      {/* Header avec navigation - sans rechargement forcé */}
      <header className="py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/" replace={true}>
              <motion.button
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Retour à l'accueil"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
          <GoogleMenu />
        </div>
      </header>

      {/* Espace supplémentaire après le header */}
      <div className="h-8"></div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 md:w-32 md:h-32"
          >
            <Image 
              src="/lingo-bot.svg"
              alt="Lingo"
              width={128}
              height={128}
              className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" 
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-200">
              Lingo
            </h1>
            <p className="text-sm md:text-base text-amber-200 max-w-xl">
              Le globe-trotteur des langues. Traduit tout en conservant le ton voulu.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-amber-800/50 to-yellow-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-amber-500/30"
          >
            <h2 className="text-lg font-bold mb-2">Texte à traduire</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-amber-200 mb-1 block">De :</label>
                  <div className="w-full bg-amber-900/50 rounded-lg p-2 border border-amber-600/50 flex items-center gap-2 opacity-75">
                    <span className="text-sm text-gray-400">Détection automatique</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-amber-200 mb-1 block">Vers :</label>
                  <select 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-amber-900/50 text-white rounded-lg p-2 border border-amber-600/50 focus:border-amber-400 text-sm"
                  >
                    <option value="en">Anglais</option>
                    <option value="fr">Français</option>
                    <option value="es">Espagnol</option>
                    <option value="de">Allemand</option>
                    <option value="it">Italien</option>
                    <option value="pt">Portugais</option>
                    <option value="zh">Chinois</option>
                    <option value="ja">Japonais</option>
                    <option value="ar">Arabe</option>
                    <option value="ru">Russe</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="text-xs text-amber-200 mb-1 block">Ton de la traduction :</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTranslationTone("pro")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      translationTone === "pro"
                        ? "bg-amber-500 text-white"
                        : "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70"
                    }`}
                  >
                    Professionnel
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationTone("amical")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      translationTone === "amical"
                        ? "bg-amber-500 text-white"
                        : "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70"
                    }`}
                  >
                    Amical
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationTone("seduisant")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      translationTone === "seduisant"
                        ? "bg-amber-500 text-white"
                        : "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70"
                    }`}
                  >
                    Séduisant
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationTone("humoristique")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      translationTone === "humoristique"
                        ? "bg-amber-500 text-white"
                        : "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70"
                    }`}
                  >
                    Humoristique
                  </button>
                </div>
                  <div className="relative w-full">
                    {/* ...existing code... */}
                      <div className="relative w-full">
                        <textarea
                          ref={textareaRef}
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder={micState === 'recording' ? '' : "Entrez votre texte à traduire..."}
                          className={`w-full h-[120px] bg-amber-900/50 text-white placeholder-amber-300 rounded-lg p-3 border border-amber-600/50 focus:border-amber-400 focus:ring focus:ring-amber-300/50 focus:outline-none resize-none transition text-sm pr-12 select-none touch-none ${micState === 'recording' ? 'bg-gray-300 text-gray-500 opacity-80 cursor-not-allowed' : ''}`}
                          rows={4}
                          disabled={micState === 'recording'}
                          onContextMenu={e => e.preventDefault()}
                          style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none', background: micState === 'recording' ? '#e5e7eb' : undefined, color: micState === 'recording' ? '#6b7280' : undefined, opacity: micState === 'recording' ? 0.8 : 1, cursor: micState === 'recording' ? 'not-allowed' : 'auto' }}
                        />
                        {/* Microphone button only if no text */}
                        {(!userInput || userInput.trim().length === 0) && (
                          <motion.button
                            id="mic-btn-lingo"
                            type="button"
                            onMouseDown={startMicRecording}
                            onTouchStart={startMicRecording}
                            onMouseUp={stopMicRecording}
                            onTouchEnd={stopMicRecording}
                            onClick={e => e.preventDefault()} // Désactive le simple clic/tap
                            onContextMenu={e => e.preventDefault()}
                            className={`absolute right-2 top-2 bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-400 text-white rounded-full p-2 shadow-lg transition-all duration-200 select-none touch-none border-2 border-amber-300/60 ${micState === 'recording' ? 'animate-pulse opacity-80' : ''} ${micState === 'loading' ? 'opacity-60 cursor-wait' : ''}`}
                            aria-label={micState === 'idle' ? 'Appuyez et maintenez pour parler' : micState === 'recording' ? 'Relâchez pour envoyer' : 'Micro en cours'}
                            style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none', background: micState === 'recording' ? 'linear-gradient(90deg, #f59e11 60%, #fde68a 100%)' : undefined, opacity: micState === 'loading' ? 0.6 : 1, cursor: micState === 'loading' ? 'wait' : 'pointer' }}
                            initial={{ scale: 1 }}
                            animate={micState === 'recording' ? { scale: 1.25, boxShadow: '0 0 32px #fde68a' } : { scale: 1, boxShadow: 'none' }}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.1 }}
                            disabled={micState === 'loading'}
                          >
                            <ChatGPTMicIcon className="h-7 w-7 opacity-80" />
                          </motion.button>
                        )}
                        {/* Animation d'enregistrement façon ChatGPT */}
                        {micState === 'recording' && (
                          <ChatGPTMicAnimation text="Enregistrement en cours..." />
                        )}
                      </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Traduire"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent border border-amber-400 hover:bg-amber-800/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                >
                  Effacer
                </button>
              </div>
            </div>
            </form>
          </motion.div>

          {/* Section pour afficher la réponse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-yellow-800/50 to-amber-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-yellow-500/30 min-h-[240px] flex flex-col"
          >
            <h2 className="text-lg font-bold mb-2">Traduction de Lingo</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-amber-200 text-sm">Lingo traduit votre texte...</p>
              </div>
            ) : response ? (
              <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-700/30 h-full relative">
                <p className="whitespace-pre-wrap text-amber-100 text-sm mb-10">{response}</p>
                <button
                  onClick={copyToClipboard}
                  className={`absolute bottom-3 right-3 flex items-center gap-1.5 ${
                    isCopied 
                      ? 'bg-green-600/70 hover:bg-green-600/90' 
                      : 'bg-amber-600/60 hover:bg-amber-600/80'
                  } text-white text-xs py-1.5 px-3 rounded-lg transition-all duration-300`}
                >
                  {isCopied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copié!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copier
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-amber-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <p className="text-sm">La traduction de Lingo apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
