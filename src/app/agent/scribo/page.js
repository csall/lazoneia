
"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ScriboPage() {
  // Micro WhatsApp-like
  const [isRecording, setIsRecording] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [micButtonActive, setMicButtonActive] = useState(false);
  const recognitionRef = useRef(null);
  const micButtonRef = useRef(null);
  const tempTranscriptRef = useRef("");
  const recordingActiveRef = useRef(false);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
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

  const startRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording || recordingActiveRef.current) return;
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
      setUserInput((prev) => prev ? prev + " " + tempTranscriptRef.current : tempTranscriptRef.current);
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
  // Gestion souris
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
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("professionnel");
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef(null);

  // Ajuster automatiquement la hauteur du textarea en fonction du contenu
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  // Fonction pour gérer la soumission du message
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!userInput.trim()) return;
  setIsLoading(true);
  setResponse("");
  try {
    const res = await fetch("https://cheikh06000.app.n8n.cloud/webhook/scribo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userInput, tone: selectedStyle })
    });
    let resultText = "";
    if (!res.ok) {
      resultText = `Erreur réseau (${res.status})`;
    } else {
      // Si la réponse n'est pas du JSON
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
    <main className="min-h-screen bg-gradient-to-r from-teal-900 to-cyan-800 text-white">
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

      <div className="h-6">{/* Espace supplémentaire */}</div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 md:w-32 md:h-32"
          >
            <Image 
              src="/scribo-bot.svg"
              alt="Scribo"
              width={128}
              height={128}
              className="w-full h-full drop-shadow-[0_0_20px_rgba(20,184,166,0.5)]" 
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-200">
              Scribo
            </h1>
            <p className="text-sm md:text-base text-teal-200 max-w-xl">
              Ton assistant personnel d&apos;écriture qui transforme tes phrases en textes clairs, fluides et impactants.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-teal-800/50 to-cyan-800/50 backdrop-blur-md p-3 rounded-lg shadow-lg border border-teal-500/30"
          >
            <h2 className="text-lg font-bold mb-2">Votre texte</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="mb-3">
                <label className="text-sm text-teal-200 mb-1 block">Choisissez votre style d&apos;écriture :</label>
                <div className="flex flex-wrap gap-2">
                  {/* ...boutons de style... */}
                  <button type="button" onClick={() => setSelectedStyle("professionnel")} className={`px-3 py-1 rounded-lg text-xs transition ${selectedStyle === "professionnel" ? "bg-teal-500 text-white" : "bg-teal-900/50 text-teal-300 hover:bg-teal-800/70"}`}>Professionnel</button>
                  <button type="button" onClick={() => setSelectedStyle("décontracté")} className={`px-3 py-1 rounded-lg text-xs transition ${selectedStyle === "décontracté" ? "bg-teal-500 text-white" : "bg-teal-900/50 text-teal-300 hover:bg-teal-800/70"}`}>Décontracté</button>
                  <button type="button" onClick={() => setSelectedStyle("créatif")} className={`px-3 py-1 rounded-lg text-xs transition ${selectedStyle === "créatif" ? "bg-teal-500 text-white" : "bg-teal-900/50 text-teal-300 hover:bg-teal-800/70"}`}>Créatif</button>
                  <button type="button" onClick={() => setSelectedStyle("concis")} className={`px-3 py-1 rounded-lg text-xs transition ${selectedStyle === "concis" ? "bg-teal-500 text-white" : "bg-teal-900/50 text-teal-300 hover:bg-teal-800/70"}`}>Concis</button>
                </div>
              </div>
              <div className="relative flex items-center">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Écrivez ou enregistrez votre texte..."
                  className="w-full h-[120px] bg-teal-900/50 text-white placeholder-teal-300 rounded-lg p-3 border border-teal-600/50 focus:border-teal-400 focus:ring focus:ring-teal-300/50 focus:outline-none resize-none transition text-sm pr-12"
                  rows={4}
                />
                <button
                  ref={micButtonRef}
                  type="button"
                  onMouseDown={handleMicMouseDown}
                  onTouchStart={handleMicTouchStart}
                  className={`absolute right-2 top-2 bg-teal-600/80 hover:bg-teal-700 text-white rounded-full p-2 shadow transition-all duration-200
                    ${micButtonActive ? 'scale-110 ring-4 ring-teal-400/40' : ''}
                    ${isRecording ? 'animate-pulse opacity-80' : ''}
                    ${isCancelled ? 'bg-red-600/80 ring-red-400/40' : ''}`}
                  aria-label="Appuyez et maintenez pour parler"
                  style={{ touchAction: 'none' }}
                >
                  {isRecording ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="cyan" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="6" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v2m0-2a6 6 0 006-6V9a6 6 0 10-12 0v3a6 6 0 006 6zm0 0v2m0 0h-2m2 0h2" /></svg>
                  )}
                  {micButtonActive && (
                    <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 px-2 py-1 text-xs rounded bg-teal-700/90 text-white shadow-lg animate-fade-in">
                      {isCancelled ? 'Annulé' : 'Enregistrement...'}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Améliorer"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent border border-teal-400 hover:bg-teal-800/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                >
                  Effacer
                </button>
              </div>
            </form>
          </motion.div>

          {/* Section pour afficher la réponse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-cyan-800/50 to-teal-800/50 backdrop-blur-md p-3 rounded-lg shadow-lg border border-cyan-500/30 min-h-[200px] flex flex-col"
          >
            <h2 className="text-lg font-bold mb-2">Texte amélioré par Scribo</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-teal-200 text-sm">Scribo améliore votre texte...</p>
              </div>
            ) : response ? (
              <div className="bg-teal-900/30 rounded-lg p-3 border border-teal-700/30 h-full relative">
                <p className="whitespace-pre-wrap text-teal-100 text-sm mb-10">{response}</p>
                <button
                  onClick={copyToClipboard}
                  className={`absolute bottom-3 right-3 flex items-center gap-1.5 ${
                    isCopied 
                      ? 'bg-green-600/70 hover:bg-green-600/90' 
                      : 'bg-teal-600/60 hover:bg-teal-600/80'
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
              <div className="flex-1 flex flex-col items-center justify-center text-teal-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-sm">Le texte amélioré apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Section d'explications supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 bg-gradient-to-br from-teal-900/30 to-cyan-900/30 backdrop-blur-md p-3 rounded-lg shadow-lg border border-teal-500/20"
        >
          <h2 className="text-xl font-bold mb-3 text-teal-200">Pourquoi utiliser Scribo ?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-teal-800/30 p-3 rounded-lg border border-teal-700/30">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm">Textes sans erreurs</h3>
              </div>
              <p className="text-xs text-teal-200">Correction automatique d&apos;orthographe, de grammaire et de ponctuation pour des messages impeccables.</p>
            </div>
            
            <div className="bg-teal-800/30 p-3 rounded-lg border border-teal-700/30">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm">Style adapté</h3>
              </div>
              <p className="text-xs text-teal-200">Ajustement du ton et du style selon vos besoins : professionnel, décontracté, créatif ou concis.</p>
            </div>
            
            <div className="bg-teal-800/30 p-3 rounded-lg border border-teal-700/30">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm">Impact immédiat</h3>
              </div>
              <p className="text-xs text-teal-200">Transformez instantanément vos idées brutes en textes percutants et structurés qui captent l&apos;attention.</p>
            </div>
            
            <div className="bg-teal-800/30 p-3 rounded-lg border border-teal-700/30">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm">Personnalisation</h3>
              </div>
              <p className="text-xs text-teal-200">L&apos;IA apprend de vos préférences pour proposer des formulations qui correspondent à votre style personnel.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
