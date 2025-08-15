"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ScriboPage() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("professionnel");
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
      let responseText = "";
      
      // Différentes réponses selon le style sélectionné
      if (selectedStyle === "professionnel") {
        responseText = `Version professionnelle :\n\n${userInput.trim().replace(/fautes?|erreurs?|typos?/gi, "")}\n\nCorrections appliquées :\n- Structure de phrases optimisée\n- Ponctuation professionnelle\n- Vocabulaire enrichi\n- Ton formel approprié`;
      } else if (selectedStyle === "décontracté") {
        responseText = `Version décontractée :\n\n${userInput.trim().replace(/fautes?|erreurs?|typos?/gi, "")}\n\nAmélioration apportées :\n- Phrases plus fluides et naturelles\n- Expressions familières mais correctes\n- Ton amical et accessible\n- Ponctuation simplifiée`;
      } else if (selectedStyle === "créatif") {
        responseText = `Version créative :\n\n${userInput.trim().replace(/fautes?|erreurs?|typos?/gi, "")}\n\nTransformations créatives :\n- Métaphores et images ajoutées\n- Rythme dynamique\n- Vocabulaire expressif\n- Structure narrative améliorée`;
      } else if (selectedStyle === "concis") {
        responseText = `Version concise :\n\n${userInput.trim().replace(/fautes?|erreurs?|typos?/gi, "")}\n\nOptimisations :\n- Message raccourci et direct\n- Élimination des redondances\n- Points clés conservés\n- Impact maximal en peu de mots`;
      }
      
      setResponse(responseText);
      setIsLoading(false);
    }, 1500);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-teal-900 to-cyan-800 text-white">
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
              src="/max-bot.svg" // À remplacer par l'image spécifique à Scribo
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-teal-800/50 to-cyan-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-teal-500/30"
          >
            <h2 className="text-lg font-bold mb-2">Votre texte</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="mb-3">
                <label className="text-sm text-teal-200 mb-1 block">Choisissez votre style d&apos;écriture :</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStyle("professionnel")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedStyle === "professionnel"
                        ? "bg-teal-500 text-white"
                        : "bg-teal-900/50 text-teal-300 hover:bg-teal-800/70"
                    }`}
                  >
                    Professionnel
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStyle("décontracté")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedStyle === "décontracté"
                        ? "bg-teal-500 text-white"
                        : "bg-teal-900/50 text-teal-300 hover:bg-teal-800/70"
                    }`}
                  >
                    Décontracté
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStyle("créatif")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedStyle === "créatif"
                        ? "bg-teal-500 text-white"
                        : "bg-teal-900/50 text-teal-300 hover:bg-teal-800/70"
                    }`}
                  >
                    Créatif
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStyle("concis")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedStyle === "concis"
                        ? "bg-teal-500 text-white"
                        : "bg-teal-900/50 text-teal-300 hover:bg-teal-800/70"
                    }`}
                  >
                    Concis
                  </button>
                </div>
              </div>
              
              <div>
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Écrivez votre texte à améliorer ou corriger..."
                  className="w-full h-[120px] bg-teal-900/50 text-white placeholder-teal-300 rounded-lg p-3 border border-teal-600/50 focus:border-teal-400 focus:ring focus:ring-teal-300/50 focus:outline-none resize-none transition text-sm"
                  rows={4}
                />
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
            className="bg-gradient-to-br from-cyan-800/50 to-teal-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-cyan-500/30 min-h-[240px] flex flex-col"
          >
            <h2 className="text-lg font-bold mb-2">Texte amélioré par Scribo</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-teal-200 text-sm">Scribo améliore votre texte...</p>
              </div>
            ) : response ? (
              <div className="bg-teal-900/30 rounded-lg p-3 border border-teal-700/30 h-full">
                <p className="whitespace-pre-wrap text-teal-100 text-sm">{response}</p>
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
          className="mt-8 bg-gradient-to-br from-teal-900/30 to-cyan-900/30 backdrop-blur-md p-4 rounded-xl shadow-lg border border-teal-500/20"
        >
          <h2 className="text-xl font-bold mb-3 text-teal-200">Pourquoi utiliser Scribo ?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
