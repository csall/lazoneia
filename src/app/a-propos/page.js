"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useImagePath, normalizeImagePath } from "@/hooks/useImagePath";
import { useTheme } from "@/components/theme/ThemeProvider";
import GoogleMenu from "@/components/navigation/GoogleMenu";

// ...existing code...

export default function AboutPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <main className={`min-h-screen ${isLight ? 'text-gray-800 bg-gradient-to-br from-sky-50 via-white to-violet-50' : 'text-white bg-gradient-to-br from-blue-950 via-blue-900 to-purple-950'} transition-colors duration-500 relative overflow-hidden`}>      
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay">
        <div className={`absolute inset-0 ${isLight ? 'bg-[radial-gradient(circle_at_15%_35%,rgba(56,189,248,0.25),transparent_60%),radial-gradient(circle_at_85%_65%,rgba(167,139,250,0.25),transparent_60%)]' : 'bg-[radial-gradient(circle_at_15%_35%,rgba(56,189,248,0.08),transparent_60%),radial-gradient(circle_at_85%_65%,rgba(167,139,250,0.08),transparent_60%)]'} transition-all duration-700`}></div>
      </div>
      {/* Barre de navigation avec menu Google et flèche retour */}
  <div className="flex justify-between items-center w-full fixed top-0 left-0 right-0 z-40 px-4 py-4 backdrop-blur-sm bg-gradient-to-b from-white/70 to-transparent dark:from-blue-900/70 transition-colors">
        {/* Flèche de retour */}
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
        {/* Menu Google factorisé */}
        <GoogleMenu />
      </div>
      
      {/* Espace pour compenser la barre de navigation fixe */}
      <div className="h-16"></div>
      
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${isLight ? 'from-gray-900 to-sky-600' : 'from-white to-blue-200'} transition-colors`}>
              À propos de La Zone IA
            </h1>
            <p className={`text-xl ${isLight ? 'text-sky-700/70' : 'text-blue-100'} transition-colors`}>
              Découvrez notre histoire et notre mission d&apos;innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className={`text-3xl font-semibold mb-4 ${isLight ? 'text-sky-700' : 'text-blue-200'} transition-colors`}>Notre Vision</h2>
              <p className={`text-lg mb-4 ${isLight ? 'text-gray-600' : 'text-blue-50'} transition-colors`}>
                Chez La Zone IA, nous croyons que l&apos;intelligence artificielle devrait être accessible, 
                utile et amusante. Notre vision est de créer des agents IA qui ne sont pas seulement 
                technologiquement avancés mais aussi dotés de personnalités uniques.
              </p>
              <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-blue-50'} transition-colors`}>
                Nous combinons les dernières avancées en IA avec une approche centrée sur l&apos;humain 
                pour créer des assistants qui comprennent vraiment vos besoins et y répondent de 
                manière engageante.
              </p>
            </motion.div>
            <motion.div
              className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${isLight ? 'from-sky-300/30 to-violet-300/30 border-white/40' : 'from-indigo-600/30 to-purple-600/30 border-white/10'} backdrop-blur-md rounded-2xl border transition-colors`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8">
                  <Image
                    src="/punchy-bot.svg"
                    alt="Olivier l'humoriste"
                    width={100}
                    height={100}
                  />
                  <Image
                    src="/glow-bot.svg"
                    alt="Clara la séductrice"
                    width={100}
                    height={100}
                  />
                  <Image
                    src="/reply-bot.svg"
                    alt="Max l'analyste"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className={`p-8 rounded-3xl backdrop-blur-md shadow-lg mb-16 border transition-colors ${isLight ? 'bg-gradient-to-br from-sky-200/60 to-violet-200/60 border-sky-300/50' : 'bg-gradient-to-br from-blue-800/40 to-indigo-800/40 border-blue-500/20'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className={`text-3xl font-semibold mb-6 text-center ${isLight ? 'text-sky-700' : 'text-blue-200'} transition-colors`}>Notre Équipe</h2>
            <p className={`text-lg mb-6 ${isLight ? 'text-gray-600' : 'text-blue-50'} transition-colors`}>
              Fondée en 2025 par une équipe de passionnés d&apos;intelligence artificielle et 
              d&apos;expérience utilisateur, La Zone IA réunit des talents exceptionnels du monde 
              de la technologie, du design et de la psychologie cognitive.
            </p>
            <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-blue-50'} transition-colors`}>
              Notre équipe multidisciplinaire travaille sans relâche pour créer des agents IA qui 
              ne sont pas seulement intelligents, mais aussi empathiques et engageants. Nous croyons 
              que la technologie devrait se mettre au service de l&apos;humain et non l&apos;inverse.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className={`text-3xl font-semibold mb-4 ${isLight ? 'text-sky-700' : 'text-blue-200'} transition-colors`}>Notre Technologie</h2>
            <p className={`text-lg mb-4 ${isLight ? 'text-gray-600' : 'text-blue-50'} transition-colors`}>
              Nos agents IA sont construits sur des modèles de langage avancés, optimisés pour 
              comprendre le contexte, reconnaître les émotions et générer des réponses pertinentes 
              et engageantes.
            </p>
            <p className={`text-lg mb-8 ${isLight ? 'text-gray-600' : 'text-blue-50'} transition-colors`}>
              Nous avons également développé des algorithmes propriétaires permettant à nos agents 
              d&apos;adopter des personnalités distinctes et cohérentes, rendant chaque interaction plus 
              humaine et mémorable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "IA Conversationnelle",
                  description: "Dialogues naturels et contextuels pour une expérience fluide"
                },
                {
                  title: "Reconnaissance d'Émotions",
                  description: "Nos agents peuvent détecter et répondre aux émotions humaines"
                },
                {
                  title: "Personnalisation Avancée",
                  description: "Adaptation des réponses au style et aux préférences de l'utilisateur"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className={`p-5 rounded-xl backdrop-blur-sm transition-colors ${isLight ? 'bg-sky-100/60 border border-sky-200/60' : 'bg-blue-800/20'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + (i * 0.1) }}
                >
                  <h3 className={`text-xl font-semibold mb-2 ${isLight ? 'text-sky-700' : 'text-blue-200'} transition-colors`}>{feature.title}</h3>
                  <p className={`${isLight ? 'text-gray-600' : 'text-blue-50'} transition-colors`}>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
