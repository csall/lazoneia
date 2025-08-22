

"use client";
// Vérifie si l'API SpeechRecognition est supportée
const isSpeechRecognitionSupported = typeof window !== 'undefined' && (
  'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
);

import GoogleMenu from "@/components/navigation/GoogleMenu";
import { useState, useRef, useEffect } from "react";
import ChatGPTMicIcon from "../../components/ChatGPTMicIcon";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PunchyPage() {
  // Gestion micro façon ChatGPT
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [micState, setMicState] = useState("idle"); // idle | recording | loading | error
  const [micReady, setMicReady] = useState(false); // Permission micro accordée
  const [micStream, setMicStream] = useState(null);
  const [micError, setMicError] = useState("");

  // Micro façon ChatGPT : maintien = enregistrement, relâchement = transcription
  const startMicRecording = async () => {
    if (micState !== "idle" && micState !== "error") return;
   // setMicError("");
    if (!micReady) {
      setMicState("loading");
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Micro non disponible");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!stream || !stream.active) {
        //  setMicError("Permission micro refusée");
          setMicState("error");
          return;
        }
        setMicReady(true);
        setMicState("idle");
     //   setMicError("Micro prêt. Appuyez à nouveau pour enregistrer.");
      } catch (err) {
      //  setMicError("Impossible d'accéder au micro");
        setMicState("error");
      }
      return;
    }
    // Permission déjà accordée, démarre l'enregistrement avec un nouveau stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!stream || !stream.active) {
       // setMicError("Impossible d'obtenir le flux audio");
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
      // Ajoute un listener pour stopper sur mouseup/touchend
      const stopOnMicRelease = () => {
        stopMicRecording();
        window.removeEventListener("mouseup", stopOnMicRelease);
        window.removeEventListener("touchend", stopOnMicRelease);
      };
      window.addEventListener("mouseup", stopOnMicRelease);
      window.addEventListener("touchend", stopOnMicRelease);
    } catch (err) {
      //setMicError("Impossible d'obtenir le flux audio");
      setMicState("error");
    }
  };

  const stopMicRecording = () => {
    if (micState === "recording" && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setMicState("loading");
    }
    // Si on relâche le bouton alors qu'on est en erreur, on repasse en idle
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
    // Contrôle taille minimale (env. 1kB) pour éviter les transcriptions fantômes
    if (audioBlob.size < 1000) {
     // setMicError("Aucun son détecté. Veuillez parler plus fort ou plus longtemps.");
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
        // Déclenche la blague automatiquement après transcription
        handleSubmit({ preventDefault: () => {} }, data.text);
      } else {
        setMicState("error");
      }
    } catch (err) {
      setMicError("Erreur réseau ou backend");
      setMicState("error");
    }
  };
  // Démarrer l'enregistrement audio
  const startAudioRecording = async () => {
    setMicError("");
    setIsMicLoading(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Micro non disponible");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => handleAudioStop(stream);
      recorder.start();
      setIsAudioRecording(true);
    } catch (err) {
     // setMicError("Impossible d'accéder au micro");
    }
    setIsMicLoading(false);
  };

  // Arrêter l'enregistrement audio
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isAudioRecording) {
      mediaRecorderRef.current.stop();
      setIsAudioRecording(false);
    }
  };

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
  const [micSupported, setMicSupported] = useState(true);

  const recognitionRef = useRef(null);
  const micButtonRef = useRef(null);
  const tempTranscriptRef = useRef("");
  const recordingActiveRef = useRef(false);

  // Initialisation SpeechRecognition
  useEffect(() => {
    // Cross-browser SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }
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
                {/* Animation centrale d'enregistrement façon ChatGPT */}
                {micState === 'recording' && (
                  <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: [0.9, 1.1, 0.9] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="relative flex flex-col items-center justify-center"
                    >
                      <span className="absolute w-32 h-32 rounded-full bg-indigo-400/30 blur-2xl animate-pulse" />
                      <span className="absolute w-48 h-48 rounded-full bg-violet-400/20 blur-3xl animate-pulse" />
                      <span className="absolute w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl animate-pulse" />
                      <div className="relative z-10 flex flex-col items-center">
                        <ChatGPTMicIcon className="h-16 w-16 text-white drop-shadow-lg animate-pulse" />
                        <span className="mt-4 text-lg font-bold text-white drop-shadow tracking-wide animate-fade-in">Enregistrement en cours...</span>
                      </div>
                    </motion.div>
                  </div>
                )}
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
                    placeholder={isRecording ? '' : "Écrivez ou enregistrez une phrase banale à transformer..."}
                    className={`w-full h-[120px] bg-indigo-900/50 text-white placeholder-indigo-300 rounded-lg p-3 border border-indigo-600/50 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 focus:outline-none resize-none transition-all duration-200 text-sm pr-12 select-none touch-none ${isRecording ? 'bg-gray-400 text-gray-700 opacity-70 cursor-not-allowed' : ''}`}
                    rows={4}
                    disabled={isRecording}
                    onContextMenu={e => e.preventDefault()}
                    style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
                  />
                  {showMic && (
                    <div className="absolute top-2 right-2 flex items-center justify-end" style={{ minWidth: 48 }}>
                      <motion.button
                        ref={micButtonRef}
                        type="button"
                        onMouseDown={startMicRecording}
                        onTouchStart={startMicRecording}
                        onMouseUp={stopMicRecording}
                        onTouchEnd={stopMicRecording}
                        onContextMenu={e => e.preventDefault()}
                        className={`bg-gradient-to-br from-indigo-500 via-violet-400 to-indigo-400 text-white rounded-full p-2 shadow-lg transition-all duration-200 select-none touch-none border-2 border-indigo-300/60 ${micButtonActive ? 'scale-125 ring-4 ring-violet-300/60 shadow-violet-400/40' : ''} ${micState === 'recording' ? 'opacity-80' : ''} ${micState === 'loading' ? 'opacity-60 cursor-wait' : ''} ${isCancelled ? 'bg-red-600/80 ring-red-400/40' : ''}`}
                        aria-label={micState === 'idle' ? 'Appuyez et maintenez pour parler' : micState === 'recording' ? 'Relâchez pour envoyer' : 'Micro en cours'}
                        style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none', background: micState === 'recording' ? 'linear-gradient(90deg, #6366f1 60%, #a78bfa 100%)' : undefined, filter: micButtonActive ? 'drop-shadow(0 0 16px #a78bfa)' : undefined, opacity: micState === 'loading' ? 0.6 : 1, cursor: micState === 'loading' ? 'wait' : 'pointer', marginRight: 0 }}
                        initial={{ scale: 1 }}
                        animate={micButtonActive ? { scale: 1.25, boxShadow: '0 0 32px #a78bfa' } : { scale: 1, boxShadow: 'none' }}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.1 }}
                        disabled={micState === 'loading'}
                      >
                        <ChatGPTMicIcon className="h-7 w-7 opacity-80" />
                      </motion.button>
                      {micState === 'recording' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: [0.95, 1.1, 0.95] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="absolute right-0 z-10 flex items-center justify-center"
                          style={{ pointerEvents: 'none' }}
                        >
                          <span className="absolute w-12 h-12 rounded-full bg-indigo-400/30 blur-md animate-pulse" />
                          <span className="absolute w-20 h-20 rounded-full bg-violet-400/20 blur-lg animate-pulse" />
                          <span className="absolute w-28 h-28 rounded-full bg-indigo-500/10 blur-2xl animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
                  </div>
                {micState === 'error' && micError && (
                  <div className="absolute right-2 top-24 bg-red-700/80 text-white rounded-lg px-3 py-2 text-xs shadow-lg border border-red-400/40 z-30">
                    {micError}
                  </div>
                )}
                {/* Transcript en direct */}
                {isRecording && tempTranscriptRef.current && (
                  <p className="mt-2 text-indigo-300 text-xs italic">{tempTranscriptRef.current}</p>
                )}
                <div className="flex gap-2 mt-4">
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
