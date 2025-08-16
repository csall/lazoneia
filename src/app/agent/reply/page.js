"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ReplyPage() {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
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

  // Fonction pour gérer la soumission du message
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    
    // Simulation d'une réponse d'API (à remplacer par votre véritable appel API)
    setTimeout(() => {
      const generatedResponses = {
        pro: `Je vous remercie pour votre message concernant "${userInput.substring(0, 40)}...". Je vais étudier cette question avec attention et reviendrai vers vous dans les meilleurs délais avec une réponse complète. N'hésitez pas si vous avez besoin d'informations supplémentaires.`,
        cool: `Hey ! Merci pour ton message à propos de "${userInput.substring(0, 40)}...". J'ai bien noté, je m'en occupe et je te réponds très vite. À plus !`,
        humoristique: `Alors comme ça on me parle de "${userInput.substring(0, 40)}..." ? J'ai failli renverser mon café en lisant ça ! Ne t'inquiète pas, je m'occupe de tout, même si je dois sacrifier ma pause déjeuner (ce qui est un ÉNORME sacrifice, crois-moi).`
      };
      
      setResponses(Object.entries(generatedResponses).map(([tone, text]) => ({ tone, text })));
      setIsLoading(false);
    }, 1500);
  };

  const handleClear = () => {
    setUserInput("");
    setResponses([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-sky-800 text-white">
      {/* Header avec navigation - sans rechargement forcé */}
      <header className="py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold text-base">Retour à l&apos;accueil</span>
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
                </div>
              </div>
              
              <div>
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Collez le message auquel vous voulez répondre..."
                  className="w-full h-[120px] bg-blue-900/50 text-white placeholder-blue-300 rounded-lg p-3 border border-blue-600/50 focus:border-blue-400 focus:ring focus:ring-blue-300/50 focus:outline-none resize-none transition text-sm"
                  rows={4}
                />
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
            <h2 className="text-lg font-bold mb-2">Suggestions de Reply</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-blue-200 text-sm">Reply génère des options de réponse...</p>
              </div>
            ) : responses.length > 0 ? (
              <div className="space-y-3 overflow-auto">
                {responses.map((response, index) => (
                  <div 
                    key={index} 
                    className={`bg-blue-900/30 rounded-lg p-3 border ${
                      response.tone === selectedTone 
                        ? "border-blue-400 shadow-lg shadow-blue-500/20" 
                        : "border-blue-700/30"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        response.tone === "pro" 
                          ? "bg-blue-600/50" 
                          : response.tone === "cool" 
                            ? "bg-sky-600/50" 
                            : "bg-indigo-600/50"
                      }`}>
                        {response.tone === "pro" 
                          ? "Professionnel" 
                          : response.tone === "cool" 
                            ? "Décontracté" 
                            : "Humoristique"}
                      </span>
                      <button 
                        className="text-xs text-blue-300 hover:text-white transition"
                        onClick={() => navigator.clipboard.writeText(response.text)}
                      >
                        Copier
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap text-blue-100 text-sm">{response.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-blue-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-sm">Les suggestions de Reply apparaîtront ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
