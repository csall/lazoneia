"use client";

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

  // Ajuster automatiquement la hauteur du textarea en fonction du contenu
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  // Ajouter des gestionnaires d'événements pour le collage
  useEffect(() => {
    const textarea = textareaRef.current;
    
    if (!textarea) return;
    
    // Gestionnaire d'événements pour le collage natif (Ctrl+V / Cmd+V)
    const handleNativePaste = (e) => {
      // On laisse le comportement par défaut du navigateur coller le texte
      // React mettra à jour userInput automatiquement via onChange
      
      // Puis on ajuste la hauteur après que le contenu soit mis à jour
      setTimeout(() => {
        if (textarea) {
          textarea.style.height = "auto";
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      }, 10);
    };
    
    // Gestionnaire de raccourcis clavier pour mettre en évidence Ctrl+V
    const handleKeyDown = (e) => {
      // Détecter Ctrl+V ou Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        // Ajouter une classe pour l'effet visuel
        textarea.classList.add('paste-highlight');
        
        // Retirer la classe après un moment
        setTimeout(() => {
          textarea.classList.remove('paste-highlight');
        }, 500);
      }
    };
    
    // Ajouter les écouteurs d'événements
    textarea.addEventListener('paste', handleNativePaste);
    textarea.addEventListener('keydown', handleKeyDown);
    
    // Nettoyer les écouteurs d'événements
    return () => {
      textarea.removeEventListener('paste', handleNativePaste);
      textarea.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fonction pour gérer la soumission du message
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    
    // Simulation d'une réponse d'API (à remplacer par votre véritable appel API)
    setTimeout(() => {
      const humorResponses = [
        `"${userInput}"\n\nC'est comme demander à un poisson de grimper à un arbre – techniquement possible, mais tellement absurde que même Darwin abandonnerait l'évolution.`,
        `"${userInput}"\n\nSi cette phrase était un plat, ce serait une pizza à l'ananas... controversée mais étrangement addictive pour ceux qui osent essayer.`,
        `"${userInput}"\n\nC'est le genre de logique qui fait que les chats nous regardent comme si on était stupides – et franchement, ils n'ont peut-être pas tort.`
      ];
      
      const randomResponse = humorResponses[Math.floor(Math.random() * humorResponses.length)];
      setResponse(randomResponse);
      setIsLoading(false);
      setIsCopied(false); // Réinitialiser l'état de copie
    }, 1500);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse("");
    setIsCopied(false);
  };
  
  // Cette section contenait précédemment la fonction de gestion du collage qui n'est plus nécessaire
  
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
    <main className="min-h-screen bg-gradient-to-r from-indigo-900 to-violet-800 text-white">
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
              src="/olivier-bot.svg"
              alt="Punchy"
              width={128}
              height={128}
              className="w-full h-full drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]" 
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-violet-200">
              Punchy
            </h1>
            <p className="text-sm md:text-base text-indigo-200 max-w-xl">
              L&apos;ami qui trouve toujours la blague qui tombe juste. Transforme une phrase banale en punchline.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-800/50 to-violet-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-indigo-500/30"
          >
            <h2 className="text-lg font-bold mb-2">Votre texte</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <style jsx global>{`
                  .paste-highlight {
                    border-color: #818cf8 !important;
                    box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.3) !important;
                    animation: paste-flash 0.5s;
                  }
                  
                  @keyframes paste-flash {
                    0%, 100% { background-color: rgba(79, 70, 229, 0.5); }
                    50% { background-color: rgba(99, 102, 241, 0.7); }
                  }
                `}</style>
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Écrivez une phrase banale à transformer..."
                  className="w-full h-[120px] bg-indigo-900/50 text-white placeholder-indigo-300 rounded-lg p-3 border border-indigo-600/50 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 focus:outline-none resize-none transition-all duration-200 text-sm"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Faire une blague"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent border border-indigo-400 hover:bg-indigo-800/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
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
            className="bg-gradient-to-br from-violet-800/50 to-indigo-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-violet-500/30 min-h-[240px] flex flex-col"
          >
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
                  className={`absolute bottom-3 right-3 flex items-center gap-1.5 ${
                    isCopied 
                      ? 'bg-green-600/70 hover:bg-green-600/90' 
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">La punchline de Punchy apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
