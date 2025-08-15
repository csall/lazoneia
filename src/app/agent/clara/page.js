"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ClaraPage() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    
    // Simulation d'une réponse d'API (à remplacer par votre véritable appel API)
    setTimeout(() => {
      setResponse(`Bonjour ! Je suis Clara, la séductrice virtuelle. Votre message était : "${userInput}"\n\nMerci de m'avoir partagé cela. Je trouve votre manière de vous exprimer vraiment captivante. Comment puis-je vous aider à créer une expérience plus engageante pour vos clients ?`);
      setIsLoading(false);
    }, 1500);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-pink-900 to-rose-800 text-white">
      {/* Header avec navigation */}
      <header className="py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/agents" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold text-base">Retour aux agents</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 md:w-32 md:h-32"
          >
            <Image 
              src="/clara-bot.svg"
              alt="Clara la séductrice"
              width={128}
              height={128}
              className="w-full h-full drop-shadow-[0_0_20px_rgba(244,114,182,0.5)]" 
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-rose-200">
              Clara la séductrice
            </h1>
            <p className="text-sm md:text-base text-pink-200 max-w-xl">
              Partagez votre projet et je vous aiderai à créer une communication captivante.
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
              <div>
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Décrivez votre projet ou posez votre question..."
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
                    "Envoyer"
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
            <h2 className="text-lg font-bold mb-2">Réponse de Clara</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-pink-200 text-sm">Clara prépare une réponse captivante...</p>
              </div>
            ) : response ? (
              <div className="bg-pink-900/30 rounded-lg p-3 border border-pink-700/30 h-full">
                <p className="whitespace-pre-wrap text-pink-100 text-sm">{response}</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-pink-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-sm">La réponse de Clara apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
