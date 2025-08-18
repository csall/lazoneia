"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useImagePath, normalizeImagePath } from "@/hooks/useImagePath";

// Composant de menu style Google
const GoogleMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { getImagePath } = useImagePath();

  // Liste des applications/options du menu
  const menuItems = [
    { name: "Accueil", icon: "globe.svg", link: "/" },
    { name: "À propos", icon: "file.svg", link: "/a-propos" },
    { name: "Contact", icon: "window.svg", link: "/contact" },
  ];

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative z-10" ref={menuRef}>
      {/* Bouton du menu avec l'icône à 9 points */}
      <motion.button
        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg hover:bg-white/20 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu applications"
        type="button"
      >
        <div className="grid grid-cols-3 gap-1 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
          ))}
        </div>
      </motion.button>

      {/* Menu déroulant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            className="absolute right-0 mt-2 p-2 w-64 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
            style={{
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.2)",
              transformOrigin: "top right",
            }}
          >
            <div className="p-1 grid grid-cols-2 gap-2">
              {menuItems.map((item, i) => (
                <Link href={item.link} key={i} className="block">
                  <motion.div
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-12 h-12 mb-2 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Image
                        src={normalizeImagePath(item.icon)}
                        alt={item.name}
                        width={24}
                        height={24}
                        className="opacity-90 pointer-events-none"
                        unoptimized
                      />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      {/* Barre de navigation avec menu Google et flèche retour */}
      <div className="flex justify-between items-center w-full fixed top-0 left-0 right-0 z-40 px-4 py-4 bg-gradient-to-b from-blue-900/80 to-transparent backdrop-blur-sm">
        {/* Flèche de retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/">
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
        
        {/* Menu style Google en haut à droite */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GoogleMenu />
        </motion.div>
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              À propos de La Zone IA
            </h1>
            <p className="text-xl text-blue-100">
              Découvrez notre histoire et notre mission d&apos;innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-semibold mb-4 text-blue-200">Notre Vision</h2>
              <p className="text-lg mb-4 text-blue-50">
                Chez La Zone IA, nous croyons que l&apos;intelligence artificielle devrait être accessible, 
                utile et amusante. Notre vision est de créer des agents IA qui ne sont pas seulement 
                technologiquement avancés mais aussi dotés de personnalités uniques.
              </p>
              <p className="text-lg text-blue-50">
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
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-md rounded-2xl border border-white/10"></div>
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
            className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 p-8 rounded-3xl backdrop-blur-md shadow-lg border border-blue-500/20 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-semibold mb-6 text-center text-blue-200">Notre Équipe</h2>
            <p className="text-lg mb-6 text-blue-50">
              Fondée en 2025 par une équipe de passionnés d&apos;intelligence artificielle et 
              d&apos;expérience utilisateur, La Zone IA réunit des talents exceptionnels du monde 
              de la technologie, du design et de la psychologie cognitive.
            </p>
            <p className="text-lg text-blue-50">
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
            <h2 className="text-3xl font-semibold mb-4 text-blue-200">Notre Technologie</h2>
            <p className="text-lg mb-4 text-blue-50">
              Nos agents IA sont construits sur des modèles de langage avancés, optimisés pour 
              comprendre le contexte, reconnaître les émotions et générer des réponses pertinentes 
              et engageantes.
            </p>
            <p className="text-lg mb-8 text-blue-50">
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
                  className="bg-blue-800/20 p-5 rounded-xl backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + (i * 0.1) }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-blue-200">{feature.title}</h3>
                  <p className="text-blue-50">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
