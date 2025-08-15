"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MaxPage() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataPreview, setDataPreview] = useState(null);
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
    
    // Simulation d'une réponse d'API avec données d'analyse (à remplacer par votre véritable appel API)
    setTimeout(() => {
      setResponse(`Bonjour, je suis Max, votre analyste de données. Concernant votre requête : "${userInput}"\n\nVoici mon analyse:\n\nBien que les données soient limitées, je peux identifier quelques tendances potentielles. La compréhension de ces informations pourrait vous aider à prendre des décisions plus éclairées et stratégiques pour votre entreprise.\n\nJe recommande d'explorer les variables suivantes pour une analyse plus approfondie...`);
      
      // Simuler des données pour le graphique
      setDataPreview({
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [
          { name: 'Tendance A', values: [65, 72, 68, 79, 82, 93] },
          { name: 'Tendance B', values: [40, 35, 49, 62, 58, 70] }
        ]
      });
      
      setIsLoading(false);
    }, 2000);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse("");
    setDataPreview(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-sky-900 text-white">
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
              src="/max-bot.svg"
              alt="Max l'analyste"
              width={240}
              height={240}
              className="w-full h-full drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" 
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-sky-200">
              Max l&apos;analyste
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl">
              Partagez vos données et je vous fournirai des insights stratégiques pour vous aider à prendre des décisions éclairées.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-blue-800/50 to-sky-800/50 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-blue-500/30"
          >
            <h2 className="text-2xl font-bold mb-4">Votre demande d&apos;analyse</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Décrivez les données que vous souhaitez analyser ou posez une question spécifique..."
                  className="w-full h-[200px] bg-blue-900/50 text-white placeholder-blue-300 rounded-xl p-4 border border-blue-600/50 focus:border-blue-400 focus:ring focus:ring-blue-300/50 focus:outline-none resize-none transition"
                  rows={6}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex justify-center items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Analyser"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent border border-blue-400 hover:bg-blue-800/30 text-white py-3 px-6 rounded-xl transition-all duration-300"
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
            className="bg-gradient-to-br from-sky-800/50 to-blue-800/50 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-sky-500/30 min-h-[360px] flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-4">Analyse de Max</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="mt-4 text-blue-200">Max analyse vos données...</p>
              </div>
            ) : response ? (
              <div className="flex flex-col space-y-4">
                <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30 flex-1">
                  <p className="whitespace-pre-wrap text-blue-100">{response}</p>
                </div>
                
                {dataPreview && (
                  <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30">
                    <h3 className="text-lg font-semibold mb-3">Aperçu des données</h3>
                    <div className="h-48 relative">
                      {/* Représentation simplifiée d'un graphique */}
                      <div className="absolute inset-0 flex items-end justify-around px-4">
                        {dataPreview.labels.map((label, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className="relative w-8 flex flex-col items-center mb-1">
                              <div 
                                className="w-4 bg-blue-500 rounded-t-sm" 
                                style={{ height: `${dataPreview.datasets[0].values[index] / 1.5}px` }}
                              ></div>
                              <div 
                                className="w-4 bg-sky-500 rounded-t-sm mt-[-4px] ml-4" 
                                style={{ height: `${dataPreview.datasets[1].values[index] / 1.5}px` }}
                              ></div>
                            </div>
                            <span className="text-xs text-blue-200">{label}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Légende */}
                      <div className="absolute top-0 right-0 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                          <span className="text-xs">{dataPreview.datasets[0].name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-sky-500 rounded-sm"></div>
                          <span className="text-xs">{dataPreview.datasets[1].name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-blue-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>L&apos;analyse de Max apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
