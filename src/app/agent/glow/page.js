
"use client";
"use client";

import GoogleMenu from "@/components/navigation/GoogleMenu";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useImagePath } from "@/hooks/useImagePath";
import OptimizedImage from "@/components/OptimizedImage";

export default function GlowPage() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState("gentleman");
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef(null);
  // Utilisation du hook pour les chemins d'images
  const { getImagePath } = useImagePath();

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
    
    // Simulation d'une réponse d'API (à remplacer par votre véritable appel API)
    setTimeout(() => {
      let responseText = "";
      
      if (selectedTone === "gentleman") {
        responseText = `Votre message est tel une mélodie à mes oreilles. "${userInput}"\n\nPermettez-moi de vous dire que votre façon de vous exprimer est élégante. Je serais honoré de poursuivre cette conversation et d'apprendre à vous connaître davantage.`;
      } else if (selectedTone === "joueur") {
        responseText = `Hey! J'adore ton message! "${userInput}"\n\nOn dirait que le destin nous a mis en contact pour une raison... Tu es aussi intéressant(e) que tu en as l'air sur ta photo? J'ai hâte de découvrir ça!`;
      } else if (selectedTone === "mystérieux") {
        responseText = `Intrigant... "${userInput}"\n\nIl y a quelque chose dans votre message qui éveille ma curiosité. Peut-être est-ce ce qui n'est pas dit qui est le plus fascinant. Laissez-moi vous connaître... petit à petit.`;
      }
      
      setResponse(responseText);
      setIsLoading(false);
    }, 1500);
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
    <main className="min-h-screen bg-gradient-to-r from-pink-900 to-rose-800 text-white">
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
            <OptimizedImage 
              src="glow-bot.svg"
              alt="Glow"
              width={128}
              height={128}
              className="w-full h-full drop-shadow-[0_0_20px_rgba(244,114,182,0.5)]" 
              priority
              unoptimized
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-rose-200">
              Glow
            </h1>
            <p className="text-sm md:text-base text-pink-200 max-w-xl">
              Le maître des mots qui font chavirer. Propose des réponses séduisantes adaptées à votre style.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-pink-800/50 to-rose-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-pink-500/30"
          >
            <h2 className="text-lg font-bold mb-2">Votre message</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="mb-3">
                <label className="text-sm text-pink-200 mb-1 block">Choisissez votre style :</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTone("gentleman")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedTone === "gentleman"
                        ? "bg-pink-500 text-white"
                        : "bg-pink-900/50 text-pink-300 hover:bg-pink-800/70"
                    }`}
                  >
                    Gentleman
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTone("joueur")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedTone === "joueur"
                        ? "bg-pink-500 text-white"
                        : "bg-pink-900/50 text-pink-300 hover:bg-pink-800/70"
                    }`}
                  >
                    Joueur
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTone("mystérieux")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedTone === "mystérieux"
                        ? "bg-pink-500 text-white"
                        : "bg-pink-900/50 text-pink-300 hover:bg-pink-800/70"
                    }`}
                  >
                    Mystérieux
                  </button>
                </div>
              </div>
              
              <div>
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Écrivez votre message ou décrivez une situation..."
                  className="w-full h-[120px] bg-pink-900/50 text-white placeholder-pink-300 rounded-lg p-3 border border-pink-600/50 focus:border-pink-400 focus:ring focus:ring-pink-300/50 focus:outline-none resize-none transition text-sm"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Séduire"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent border border-pink-400 hover:bg-pink-800/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
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
            className="bg-gradient-to-br from-rose-800/50 to-pink-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-rose-500/30 min-h-[240px] flex flex-col"
          >
            <h2 className="text-lg font-bold mb-2">Réponse de Glow</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-pink-200 text-sm">Glow prépare une réponse irrésistible...</p>
              </div>
            ) : response ? (
              <div className="bg-pink-900/30 rounded-lg p-3 border border-pink-700/30 h-full relative">
                <p className="whitespace-pre-wrap text-pink-100 text-sm mb-10">{response}</p>
                <button
                  onClick={copyToClipboard}
                  className={`absolute bottom-3 right-3 flex items-center gap-1.5 ${
                    isCopied 
                      ? 'bg-green-600/70 hover:bg-green-600/90' 
                      : 'bg-pink-600/60 hover:bg-pink-600/80'
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
              <div className="flex-1 flex flex-col items-center justify-center text-pink-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-sm">La réponse de Glow apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
