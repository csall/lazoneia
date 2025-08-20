
"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ReplyPage() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState("pro");
  const textareaRef = useRef(null);

  // Ajuster automatiquement la hauteur du textarea en fonction du contenu
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  // Micro pour dictée vocale
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "fr-FR";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput((prev) => prev ? prev + " " + transcript : transcript);
        setIsRecording(false);
      };
      recognitionRef.current.onerror = () => { setIsRecording(false); };
      recognitionRef.current.onend = () => { setIsRecording(false); };
    }
  }, []);
  const handleMicClick = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  // Fonction pour gérer la soumission du message (API n8n, une seule réponse)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setIsLoading(true);
    setResponse("");
    try {
      const res = await fetch("https://cheikh06000.app.n8n.cloud/webhook/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput, tone: selectedTone })
      });
      let resultText = "";
      if (!res.ok) {
        resultText = `Erreur réseau (${res.status})`;
      } else {
        const raw = await res.text();
        try {
          // On suppose que l'API renvoie [{text: ...}] ou {text: ...}
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            resultText = parsed[0]?.text || "";
          } else {
            resultText = parsed.text || raw;
          }
        } catch {
          resultText = raw;
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

  // Fonction pour copier la réponse dans le presse-papiers
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
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-sky-800 text-white">
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
              src="/reply-bot.svg"
              alt="Reply"
              width={128}
              height={128}
              className="w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-sky-200">
              Reply
            </h1>
            <p className="text-sm md:text-base text-blue-200 max-w-xl">
              Le génie des réponses parfaites. Suggère plusieurs options adaptées à chaque situation.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-blue-800/50 to-sky-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-blue-500/30"
          >
            <h2 className="text-lg font-bold mb-2">Message à répondre</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="mb-3">
                <label className="text-sm text-blue-200 mb-1 block">Ton préféré:</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTone("pro")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedTone === "pro"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-900/50 text-blue-300 hover:bg-blue-800/70"
                    }`}
                  >
                    Professionnel
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTone("cool")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedTone === "cool"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-900/50 text-blue-300 hover:bg-blue-800/70"
                    }`}
                  >
                    Décontracté
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTone("humoristique")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedTone === "humoristique"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-900/50 text-blue-300 hover:bg-blue-800/70"
                    }`}
                  >
                    Humoristique
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTone("seduisant")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedTone === "seduisant"
                        ? "bg-pink-500 text-white"
                        : "bg-pink-900/50 text-pink-300 hover:bg-pink-800/70"
                    }`}
                  >
                    Séduisant
                  </button>
                </div>
              </div>
              
              <div className="relative flex items-center">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Collez ou enregistrez le message auquel vous voulez répondre..."
                  className="w-full h-[120px] bg-blue-900/50 text-white placeholder-blue-300 rounded-lg p-3 border border-blue-600/50 focus:border-blue-400 focus:ring focus:ring-blue-300/50 focus:outline-none resize-none transition text-sm pr-12"
                  rows={4}
                />
                <button
                  type="button"
                  onClick={handleMicClick}
                  disabled={isRecording}
                  className={`absolute right-2 top-2 bg-blue-600/80 hover:bg-blue-700 text-white rounded-full p-2 shadow transition ${isRecording ? 'animate-pulse opacity-70' : ''}`}
                  aria-label="Enregistrer via le micro"
                >
                  {isRecording ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="red" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="6" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v2m0-2a6 6 0 006-6V9a6 6 0 10-12 0v3a6 6 0 006 6zm0 0v2m0 0h-2m2 0h2" /></svg>
                  )}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Générer des réponses"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent border border-blue-400 hover:bg-blue-800/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
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
            className="bg-gradient-to-br from-sky-800/50 to-blue-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-sky-500/30 min-h-[240px] flex flex-col"
          >
            <h2 className="text-lg font-bold mb-2">Réponse de Reply</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-blue-200 text-sm">Reply prépare une réponse...</p>
              </div>
            ) : response ? (
              <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/30 h-full relative">
                <p className="whitespace-pre-wrap text-blue-100 text-sm mb-10">{response}</p>
                <button
                  onClick={copyToClipboard}
                  className={`absolute bottom-3 right-3 flex items-center gap-1.5 ${
                    isCopied 
                      ? 'bg-green-600/70 hover:bg-green-600/90' 
                      : 'bg-blue-600/60 hover:bg-blue-600/80'
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
              <div className="flex-1 flex flex-col items-center justify-center text-blue-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-sm">La réponse de Reply apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
