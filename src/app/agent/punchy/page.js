"use client";

import GoogleMenu from "@/components/navigation/GoogleMenu";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PunchyPage() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const textareaRef = useRef(null);

  // Microphone / dictée vocale
  const [isRecording, setIsRecording] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [micButtonActive, setMicButtonActive] = useState(false);
  const [showMic, setShowMic] = useState(true);

  const recognitionRef = useRef(null);
  const micButtonRef = useRef(null);
  const tempTranscriptRef = useRef("");
  const recordingActiveRef = useRef(false);

  // Initialisation SpeechRecognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "fr-FR";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      if (!recordingActiveRef.current) return;
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      tempTranscriptRef.current = transcript;
    };

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      recordingActiveRef.current = true;
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      setMicButtonActive(false);
      setIsCancelled(false);
      recordingActiveRef.current = false;
    };

    recognitionRef.current.onerror = () => {
      setIsRecording(false);
      setMicButtonActive(false);
      recordingActiveRef.current = false;
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, []);

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
      handleSubmit({ preventDefault: () => {} }, newInput);
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
  const handleMicMouseDown = (e) => {
    e.preventDefault();
    startRecording();
    window.addEventListener("mouseup", handleMicMouseUp);
    window.addEventListener("mousemove", handleMicMouseMove);
  };

  const handleMicMouseUp = (e) => {
    if (!micButtonRef.current) return;
    const rect = micButtonRef.current.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      cancelRecording();
    } else {
      stopRecording();
    }
    window.removeEventListener("mouseup", handleMicMouseUp);
    window.removeEventListener("mousemove", handleMicMouseMove);
  };

  const handleMicMouseMove = (e) => {
    if (!micButtonRef.current) return;
    const rect = micButtonRef.current.getBoundingClientRect();
    setIsCancelled(
      e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom
    );
  };

  // Gestion tactile
  const handleMicTouchStart = (e) => {
    e.preventDefault();
    startRecording();
    window.addEventListener("touchend", handleMicTouchEnd);
    window.addEventListener("touchmove", handleMicTouchMove);
  };

  const handleMicTouchEnd = (e) => {
    if (!micButtonRef.current) return;
    const touch = e.changedTouches[0];
    const rect = micButtonRef.current.getBoundingClientRect();
    if (
      touch.clientX < rect.left ||
      touch.clientX > rect.right ||
      touch.clientY < rect.top ||
      touch.clientY > rect.bottom
    ) {
      cancelRecording();
    } else {
      stopRecording();
    }
    window.removeEventListener("touchend", handleMicTouchEnd);
    window.removeEventListener("touchmove", handleMicTouchMove);
  };

  const handleMicTouchMove = (e) => {
    if (!micButtonRef.current) return;
    const touch = e.touches[0];
    const rect = micButtonRef.current.getBoundingClientRect();
    setIsCancelled(
      touch.clientX < rect.left || touch.clientX > rect.right || touch.clientY < rect.top || touch.clientY > rect.bottom
    );
  };

  // Ajustement automatique textarea + gestion affichage micro
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    setShowMic(!userInput || userInput.trim().length === 0);
  }, [userInput]);

  // Soumission texte à n8n
  const handleSubmit = async (e, overrideInput) => {
    if (e && e.preventDefault) e.preventDefault();
    const input = overrideInput !== undefined ? overrideInput : userInput;
    if (!input.trim()) return;
    setIsLoading(true);
    setIsCopied(false);
    try {
      const res = await fetch("https://cheikh06000.app.n8n.cloud/webhook/punchy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      let resultText = "";
      if (!res.ok) {
        resultText = `Erreur réseau (${res.status})`;
      } else {
        try {
          const json = await res.json();
          resultText = json[0]?.text || "";
        } catch {
          resultText = await res.text();
          resultText = JSON.parse(resultText)[0]?.text || "";
        }
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Échec lors de la copie:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-900 to-violet-800 text-white">
      {/* Header */}
      <header className="py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link href="/" replace>
              <motion.button
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Retour à l'accueil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
          <GoogleMenu />
        </div>
      </header>

      <div className="h-6" />

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-24 h-24 md:w-32 md:h-32">
            <Image src="/punchy-bot.svg" alt="Punchy" width={128} height={128} className="w-full h-full drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]" priority />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-violet-200">Punchy</h1>
            <p className="text-sm md:text-base text-indigo-200 max-w-xl">
              L&apos;ami qui trouve toujours la blague qui tombe juste. Transforme une phrase banale en punchline.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section texte */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-gradient-to-br from-indigo-800/50 to-violet-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-indigo-500/30">
            <h2 className="text-lg font-bold mb-2">Votre texte</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative flex items-center">
                <div className="relative w-full">
                  <textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={isRecording ? "" : "Écrivez ou enregistrez une phrase banale à transformer..."}
                    className={`w-full h-[120px] bg-indigo-900/50 text-white placeholder-indigo-300 rounded-lg p-3 border border-indigo-600/50 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 focus:outline-none resize-none transition-all duration-200 text-sm pr-12 ${isRecording ? 'bg-gray-400 text-gray-700 placeholder-white opacity-70 cursor-not-allowed select-none' : ''}`}
                    rows={4}
                    disabled={isRecording}
                    style={isRecording ? { userSelect: 'none', WebkitUserSelect: 'none' } : {}}
                  />
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      className="absolute left-1/2 top-2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-gradient-to-br from-indigo-500/80 via-violet-600/70 to-indigo-900/80 backdrop-blur-lg shadow-2xl border border-indigo-300/30 flex flex-col items-center z-20"
                      style={{ boxShadow: '0 4px 32px 0 rgba(139,92,246,0.25)' }}
                    >
                      <motion.div
                        className="relative flex items-center justify-center mb-1"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: [0.9, 1.1, 0.9] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      >
                        <span className="absolute w-12 h-12 rounded-full bg-indigo-400/30 blur-md animate-pulse" />
                        <span className="absolute w-20 h-20 rounded-full bg-violet-400/20 blur-lg animate-pulse" />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 z-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 18v2m0-2a6 6 0 006-6V9a6 6 0 10-12 0v3a6 6 0 006 6zm0 0v2m0 0h-2m2 0h2" />
                        </svg>
                      </motion.div>
                      <span className="text-base font-bold text-white drop-shadow-sm tracking-wide animate-fade-in">Relâcher pour envoyer</span>
                    </motion.div>
                  )}
                </div>
                {showMic && (
                  <motion.button
                    ref={micButtonRef}
                    type="button"
                    onMouseDown={handleMicMouseDown}
                    onTouchStart={handleMicTouchStart}
                    className={`absolute right-2 top-2 rounded-full p-2 shadow transition-all duration-200
                      ${micButtonActive ? 'scale-110 ring-4 ring-indigo-400/40' : ''}
                      ${isRecording ? 'bg-indigo-400/80 animate-pulse opacity-80' : 'bg-indigo-600/80 hover:bg-indigo-700'}
                      ${isCancelled ? 'bg-red-600/80 ring-red-400/40' : ''}`}
                    aria-label="Appuyez et maintenez pour parler"
                    style={{ touchAction: 'none' }}
                    initial={{ scale: 1 }}
                    animate={micButtonActive ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {isRecording ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="6" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v2m0-2a6 6 0 006-6V9a6 6 0 10-12 0v3a6 6 0 006 6zm0 0v2m0 0h-2m2 0h2" /></svg>
                    )}
                  </motion.button>
                )}
              </div>
              {/* Transcript en direct */}
              {isRecording && tempTranscriptRef.current && (
                <p className="mt-2 text-indigo-300 text-xs italic">{tempTranscriptRef.current}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center text-sm"
                >
                  {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : "Faire une blague"}
                </button>
                <button type="button" onClick={handleClear} className="bg-transparent border border-indigo-400 hover:bg-indigo-800/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                  Effacer
                </button>
              </div>
            </form>
          </motion.div>

          {/* Section réponse */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="bg-gradient-to-br from-violet-800/50 to-indigo-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-violet-500/30 min-h-[240px] flex flex-col">
            <h2 className="text-lg font-bold mb-2">Réponse de Punchy</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-indigo-200 text-sm">Punchy prépare une punchline...</p>
              </div>
            ) : response ? (
              <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-700/30 h-full relative">
                <p className="whitespace-pre-wrap text-indigo-100 text-sm mb-8">{response}</p>
                <button
                  onClick={copyToClipboard}
                  disabled={isRecording}
                  className={`absolute bottom-3 right-3 flex items-center gap-1.5 ${
                    isCopied
                      ? 'bg-green-600/70 hover:bg-green-600/90'
                      : isRecording
                        ? 'bg-gray-400/60 cursor-not-allowed'
                        : 'bg-indigo-600/60 hover:bg-indigo-600/80'
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
              <div className="flex-1 flex flex-col items-center justify-center text-indigo-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" />
                </svg>
                <p className="text-sm">La réponse de Punchy apparaîtra ici.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
