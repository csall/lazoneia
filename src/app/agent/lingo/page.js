
"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LingoPage() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [translationTone, setTranslationTone] = useState("pro");
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
    
    // Simulation d'une réponse d'API (à remplacer par votre véritable appel API)
    setTimeout(() => {
      // Détection automatique de la langue (simulation)
      // Dans une application réelle, un service comme Google Cloud Translation API pourrait être utilisé
      const detectedLang = userInput.toLowerCase().includes("the") || 
                         userInput.toLowerCase().includes("and") || 
                         userInput.toLowerCase().includes("is") ? "en" : "fr";
      
      const effectiveSourceLang = sourceLang === "auto" ? detectedLang : sourceLang;
      
      // Exemples de traductions simplifiées
      const translations = {
        // Pour les langues détectées automatiquement
        "fr-en": {
          pro: `Thank you for your message: "${userInput.substring(0, 40)}...". We will carefully analyze this information and get back to you promptly with our professional assessment.`,
          amical: `Hey there! Thanks for the message: "${userInput.substring(0, 40)}...". That's really cool, I'll take a look and get back to you soon, friend!`,
          seduisant: `Well hello... "${userInput.substring(0, 40)}..." - what an intriguing message. I find your perspective absolutely fascinating. Perhaps we could discuss more... soon?`,
          humoristique: `So you said "${userInput.substring(0, 40)}..."? That's like asking if pineapple belongs on pizza - controversial but I'm here for the debate! Let me respond properly once I stop laughing!`
        },
        "en-fr": {
          pro: `Merci pour votre message : "${userInput.substring(0, 40)}...". Nous analyserons attentivement ces informations et reviendrons vers vous rapidement avec notre évaluation professionnelle.`,
          amical: `Salut ! Merci pour ton message : "${userInput.substring(0, 40)}...". C'est vraiment cool, je vais y jeter un œil et je te réponds bientôt, l'ami !`,
          seduisant: `Eh bien bonjour... "${userInput.substring(0, 40)}..." - quel message intrigant. Je trouve ton point de vue absolument fascinant. Peut-être pourrions-nous en discuter davantage... bientôt ?`,
          humoristique: `Donc tu as dit "${userInput.substring(0, 40)}..." ? C'est comme demander si l'ananas a sa place sur une pizza - controversé mais je suis prêt pour le débat ! Je te réponds correctement dès que j'arrête de rire !`
        },
        // Traductions vers d'autres langues (exemples simplifiés)
        "fr-es": {
          pro: `Gracias por su mensaje: "${userInput.substring(0, 40)}...". Analizaremos cuidadosamente esta información y le responderemos con prontitud.`,
          amical: `¡Hola! Gracias por el mensaje: "${userInput.substring(0, 40)}...". ¡Qué genial! Lo revisaré y te responderé pronto, ¡amigo!`,
          seduisant: `Vaya, hola... "${userInput.substring(0, 40)}..." - qué mensaje tan intrigante. Encuentro tu perspectiva absolutamente fascinante. ¿Quizás podríamos hablar más... pronto?`,
          humoristique: `¿Así que dijiste "${userInput.substring(0, 40)}..."? ¡Eso es como preguntar si la piña va en la pizza - controvertido pero estoy listo para el debate!`
        },
        "en-es": {
          pro: `Gracias por su mensaje: "${userInput.substring(0, 40)}...". Analizaremos cuidadosamente esta información y le responderemos con prontitud.`,
          amical: `¡Hola! Gracias por el mensaje: "${userInput.substring(0, 40)}...". ¡Qué genial! Lo revisaré y te responderé pronto, ¡amigo!`,
          seduisant: `Vaya, hola... "${userInput.substring(0, 40)}..." - qué mensaje tan intrigante. Encuentro tu perspectiva absolutamente fascinante. ¿Quizás podríamos hablar más... pronto?`,
          humoristique: `¿Así que dijiste "${userInput.substring(0, 40)}..."? ¡Eso es como preguntar si la piña va en la pizza - controvertido pero estoy listo para el debate!`
        }
      };

      const langPair = `${effectiveSourceLang}-${targetLang}`;
      let responseText = `Traduction de ${effectiveSourceLang} vers ${targetLang} non disponible pour le moment. Nous travaillons à élargir nos capacités linguistiques.`;
      
      if (translations[langPair] && translations[langPair][translationTone]) {
        responseText = translations[langPair][translationTone];
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
    <main className="min-h-screen bg-gradient-to-r from-amber-900 to-yellow-800 text-white">
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

      {/* Espace supplémentaire après le header */}
      <div className="h-8"></div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 md:w-32 md:h-32"
          >
            <Image 
              src="/lingo-bot.svg"
              alt="Lingo"
              width={128}
              height={128}
              className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" 
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-200">
              Lingo
            </h1>
            <p className="text-sm md:text-base text-amber-200 max-w-xl">
              Le globe-trotteur des langues. Traduit tout en conservant le ton voulu.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section pour écrire le message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-amber-800/50 to-yellow-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-amber-500/30"
          >
            <h2 className="text-lg font-bold mb-2">Texte à traduire</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-amber-200 mb-1 block">De :</label>
                  <div className="w-full bg-amber-900/50 rounded-lg p-2 border border-amber-600/50 flex items-center gap-2 opacity-75">
                    <span className="text-sm text-gray-400">Détection automatique</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-amber-200 mb-1 block">Vers :</label>
                  <select 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-amber-900/50 text-white rounded-lg p-2 border border-amber-600/50 focus:border-amber-400 text-sm"
                  >
                    <option value="en">Anglais</option>
                    <option value="fr">Français</option>
                    <option value="es">Espagnol</option>
                    <option value="de">Allemand</option>
                    <option value="it">Italien</option>
                    <option value="pt">Portugais</option>
                    <option value="zh">Chinois</option>
                    <option value="ja">Japonais</option>
                    <option value="ar">Arabe</option>
                    <option value="ru">Russe</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="text-xs text-amber-200 mb-1 block">Ton de la traduction :</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTranslationTone("pro")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      translationTone === "pro"
                        ? "bg-amber-500 text-white"
                        : "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70"
                    }`}
                  >
                    Professionnel
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationTone("amical")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      translationTone === "amical"
                        ? "bg-amber-500 text-white"
                        : "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70"
                    }`}
                  >
                    Amical
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationTone("seduisant")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      translationTone === "seduisant"
                        ? "bg-amber-500 text-white"
                        : "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70"
                    }`}
                  >
                    Séduisant
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationTone("humoristique")}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      translationTone === "humoristique"
                        ? "bg-amber-500 text-white"
                        : "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70"
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
                  placeholder="Entrez votre texte à traduire..."
                  className="w-full h-[120px] bg-amber-900/50 text-white placeholder-amber-300 rounded-lg p-3 border border-amber-600/50 focus:border-amber-400 focus:ring focus:ring-amber-300/50 focus:outline-none resize-none transition text-sm"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Traduire"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent border border-amber-400 hover:bg-amber-800/30 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm"
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
            className="bg-gradient-to-br from-yellow-800/50 to-amber-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-yellow-500/30 min-h-[240px] flex flex-col"
          >
            <h2 className="text-lg font-bold mb-2">Traduction de Lingo</h2>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-amber-200 text-sm">Lingo traduit votre texte...</p>
              </div>
            ) : response ? (
              <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-700/30 h-full relative">
                <p className="whitespace-pre-wrap text-amber-100 text-sm mb-10">{response}</p>
                <button
                  onClick={copyToClipboard}
                  className={`absolute bottom-3 right-3 flex items-center gap-1.5 ${
                    isCopied 
                      ? 'bg-green-600/70 hover:bg-green-600/90' 
                      : 'bg-amber-600/60 hover:bg-amber-600/80'
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
              <div className="flex-1 flex flex-col items-center justify-center text-amber-300/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <p className="text-sm">La traduction de Lingo apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
