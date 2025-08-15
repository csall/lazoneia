"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PitchyPage() {
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
      const formattedText = userInput
        .replace(/\./g, "... [pause courte] ")
        .replace(/,/g, ", [respiration] ")
        .replace(/\?/g, "? [ton montant] ")
        .replace(/!/g, "! [ton affirmatif] ");
        
      const speechTips = [
        "👉 Commencez fort pour capter l'attention",
        "👉 Accentuez les mots-clés en gras",
        "👉 Parlez plus lentement sur les concepts complexes",
        "👉 Modulez votre voix pour maintenir l'intérêt",
        "👉 Regardez votre audience, pas vos notes"
      ];
      
      const randomTips = speechTips.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      const responseText = `Voici votre texte optimisé pour l'oral:\n\n${formattedText}\n\n---\n\nConseils pour la présentation:\n${randomTips.join("\n")}`;
      
      setResponse(responseText);
      setIsLoading(false);
    }, 1500);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-emerald-900 to-green-800 text-white">
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
              src="/max-bot.svg"
              alt="Pitchy"
              width={128}
              height={128}
              className="w-full h-full drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-green-200">
              Pitchy
            </h1>
            <p className="text-sm md:text-base text-emerald-200 max-w-xl">
              Le coach qui te met à l&apos;aise à l&apos;oral. Transforme un texte en discours fluide avec respirations et intonations.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-emerald-800/50 to-green-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-emerald-500/30"
          >
            <h2 className="text-lg font-bold mb-2">Votre texte</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Collez votre texte à transformer en discours..."
                  className="w-full h-[120px] bg-emerald-900/50 text-white placeholder-emerald-300 rounded-lg p-3 border border-emerald-600/50 focus:border-emerald-400 focus:ring focus:ring-emerald-300/50 focus:outline-none resize-none transition text-sm"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Optimiser pour l'oral"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent border border-emerald-400 hover:bg-emerald-800/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
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
            className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-green-500/30 min-h-[240px] flex flex-col"
          >
            <h2 className="text-lg font-bold mb-2">Conseils de Pitchy</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-emerald-200 text-sm">Pitchy améliore votre discours...</p>
              </div>
            ) : response ? (
              <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-700/30 h-full overflow-auto">
                <p className="whitespace-pre-wrap text-emerald-100 text-sm">{response}</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-emerald-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <p className="text-sm">Les conseils de Pitchy apparaîtront ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
