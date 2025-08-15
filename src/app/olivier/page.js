"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function OlivierPage() {
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
      setResponse(`Salut ! Je suis Olivier, l'humoriste virtuel. Voici ma réponse à votre message : "${userInput}"\n\nSavez-vous pourquoi les développeurs confondent Halloween et Noël ? Parce que Oct(31) = Dec(25) ! 🤣`);
      setIsLoading(false);
    }, 1500);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-900 to-violet-900 text-white">
      {/* Header avec navigation */}
      <header className="py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/agents" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold text-xl">Retour aux agents</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-40 h-40 md:w-60 md:h-60"
          >
            <Image 
              src="/olivier-bot.svg"
              alt="Olivier l'humoriste"
              width={240}
              height={240}
              className="w-full h-full drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]" 
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-violet-200">
              Olivier l&apos;humoriste
            </h1>
            <p className="text-xl text-indigo-200 max-w-2xl">
              Posez-moi une question ou partagez une situation, et je vous répondrai avec humour !
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-800/50 to-violet-800/50 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-indigo-500/30"
          >
            <h2 className="text-2xl font-bold mb-4">Votre message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Écrivez ou collez votre texte ici..."
                  className="w-full h-[200px] bg-indigo-900/50 text-white placeholder-indigo-300 rounded-xl p-4 border border-indigo-600/50 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 focus:outline-none resize-none transition"
                  rows={6}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex justify-center items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Envoyer"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent border border-indigo-400 hover:bg-indigo-800/30 text-white py-3 px-6 rounded-xl transition-all duration-300"
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
            className="bg-gradient-to-br from-violet-800/50 to-indigo-800/50 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-violet-500/30 min-h-[360px] flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-4">Réponse d&apos;Olivier</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="mt-4 text-indigo-200">Olivier réfléchit à une réponse drôle...</p>
              </div>
            ) : response ? (
              <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30 h-full">
                <p className="whitespace-pre-wrap text-indigo-100">{response}</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-indigo-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>La réponse d&apos;Olivier apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
