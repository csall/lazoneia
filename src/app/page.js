"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import agents from "@/config/agents";
import FilterBar from "@/components/agents/FilterBar";

// Cette configuration est nécessaire pour éviter les erreurs de prérendu
export const dynamic = "force-dynamic";

// Import du hook pour les chemins d'images et de la fonction utilitaire
import { normalizeImagePath } from "@/hooks/useImagePath";
import GoogleMenu from "@/components/navigation/GoogleMenu";

// Composant pour chaque carte d'agent
const AgentCard = ({
  name,
  description,
  image,
  color,
  link,
  tagline,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardStyles = {
    charm: {
      bg: "bg-gradient-to-br from-pink-900/60 to-rose-900/60",
      border: "border-pink-500/20",
      glow: "from-pink-500 to-rose-600",
      button: "from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
      hover: "group-hover:text-pink-200",
      accent: "bg-pink-500",
      mesh: "from-pink-500/40 via-rose-600/30 to-pink-500/40",
    },
    glow: {
      bg: "bg-gradient-to-br from-pink-900/60 to-rose-900/60",
      border: "border-pink-500/20",
      glow: "from-pink-500 to-rose-600",
      button: "from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
      hover: "group-hover:text-pink-200",
      accent: "bg-pink-500",
      mesh: "from-pink-500/40 via-rose-600/30 to-pink-500/40",
    },
    punchy: {
      bg: "bg-gradient-to-br from-indigo-900/60 to-violet-900/60",
      border: "border-violet-500/20",
      glow: "from-violet-500 to-indigo-600",
      button:
        "from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700",
      hover: "group-hover:text-indigo-200",
      accent: "bg-indigo-500",
      mesh: "from-violet-500/40 via-indigo-600/30 to-violet-500/40",
    },
    
    fitzy: {
      bg: "bg-gradient-to-br from-green-900/60 to-teal-900/60",
      border: "border-green-500/20",
      glow: "from-green-500 to-teal-600",
      button: "from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700",
      hover: "group-hover:text-green-200",
      accent: "bg-green-500",
      mesh: "from-green-500/40 via-teal-600/30 to-green-500/40",
    },
    psyco: {
      bg: "bg-gradient-to-br from-blue-900/60 to-sky-900/60",
      border: "border-blue-500/20",
      glow: "from-blue-500 to-sky-600",
      button: "from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700",
      hover: "group-hover:text-blue-200",
      accent: "bg-blue-500",
      mesh: "from-blue-500/40 via-sky-600/30 to-blue-500/40",
    },
    foody: {
      bg: "bg-gradient-to-br from-yellow-900/60 to-amber-900/60",
      border: "border-yellow-500/20",
      glow: "from-yellow-500 to-amber-600",
      button: "from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700",
      hover: "group-hover:text-yellow-200",
      accent: "bg-yellow-500",
      mesh: "from-yellow-500/40 via-amber-600/30 to-yellow-500/40",
    },
    globo: {
      bg: "bg-gradient-to-br from-blue-900/60 to-sky-900/60",
      border: "border-blue-500/20",
      glow: "from-blue-500 to-sky-600",
      button: "from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700",
      hover: "group-hover:text-blue-200",
      accent: "bg-blue-500",
      mesh: "from-blue-500/40 via-sky-600/30 to-blue-500/40",
    },
    talko: {
      bg: "bg-gradient-to-br from-purple-900/60 to-magenta-900/60",
      border: "border-purple-500/20",
      glow: "from-purple-500 to-magenta-600",
      button: "from-purple-500 to-magenta-600 hover:from-purple-600 hover:to-magenta-700",
      hover: "group-hover:text-purple-200",
      accent: "bg-purple-500",
      mesh: "from-purple-500/40 via-magenta-600/30 to-purple-500/40",
    },
    reply: {
      bg: "bg-gradient-to-br from-blue-900/60 to-sky-900/60",
      border: "border-blue-500/20",
      glow: "from-blue-500 to-sky-600",
      button: "from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700",
      hover: "group-hover:text-blue-200",
      accent: "bg-blue-500",
      mesh: "from-blue-500/40 via-sky-600/30 to-blue-500/40",
    },
    lingo: {
      bg: "bg-gradient-to-br from-amber-900/60 to-yellow-900/60",
      border: "border-amber-500/20",
      glow: "from-amber-500 to-yellow-600",
      button:
        "from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700",
      hover: "group-hover:text-amber-200",
      accent: "bg-amber-500",
      mesh: "from-amber-500/40 via-yellow-600/30 to-amber-500/40",
    },
    scribo: {
      bg: "bg-gradient-to-br from-teal-900/60 to-cyan-900/60",
      border: "border-teal-500/20",
      glow: "from-teal-500 to-cyan-600",
      button: "from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700",
      hover: "group-hover:text-teal-200",
      accent: "bg-teal-500",
      mesh: "from-teal-500/40 via-cyan-600/30 to-teal-500/40",
    },
  };

  const style = cardStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
      viewport={{ once: true, margin: "-100px" }}
      className="perspective-1000"
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className={`relative backdrop-blur-xl p-4 rounded-xl overflow-hidden border ${style.border} group w-full flex flex-col min-h-[360px] shadow-xl`}
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 75%), 
                       linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)`,
          boxShadow: `0 20px 70px -15px rgba(0,0,0,0.7), 
                      0 0 30px -5px rgba(0,0,0,0.4), 
                      inset 0 0 15px rgba(255,255,255,0.05)`,
        }}
        whileHover={{
          y: -15,
          zIndex: 20,
          transition: { type: "spring", stiffness: 400, damping: 15 },
        }}
      >
        {/* Mesh gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-80`}
        ></div>
        <div
          className={`absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10`}
        ></div>
        <div
          className={`absolute -inset-[100%] bg-gradient-conic ${style.mesh} opacity-30 blur-3xl animate-slow-spin`}
        ></div>

        {/* Floating particles */}
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Utilisation de positions prédéfinies pour éviter les erreurs d'hydratation */}
          {[
            { x: "-20%", y: "30%", delay: 0 },
            { x: "10%", y: "60%", delay: 2 },
            { x: "-30%", y: "70%", delay: 4 },
            { x: "25%", y: "20%", delay: 6 },
            { x: "-15%", y: "40%", delay: 8 },
            { x: "15%", y: "80%", delay: 10 },
            { x: "-25%", y: "50%", delay: 12 },
            { x: "30%", y: "35%", delay: 14 },
          ].map((particle, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${style.accent} blur-[1px]`}
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0.5,
              }}
              animate={{
                x: [particle.x, i % 2 === 0 ? "10%" : "-10%", particle.x],
                y: [particle.y, i % 2 === 0 ? "20%" : "70%", particle.y],
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>

        {/* Highlight effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-10"></div>
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${style.glow} opacity-20 blur-xl rounded-3xl`}
          ></div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            {/* Tagline badge */}
            <motion.span
              className={`text-xs py-1 px-3 ${style.accent} text-white rounded-full self-start opacity-90`}
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {tagline}
            </motion.span>

            {/* Favorite button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(name);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                className={`w-5 h-5 ${
                  isFavorite ? "text-yellow-400" : "text-gray-300"
                }`}
                strokeWidth={isFavorite ? "0" : "2"}
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </motion.button>
          </div>

          {/* Name */}
          <motion.h3
            className={`text-2xl font-bold mb-1 text-white ${style.hover} transition-colors duration-300`}
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {name}
          </motion.h3>

          {/* Image */}
          <motion.div
            className="h-32 flex items-center justify-center my-3 relative"
            whileHover={{
              scale: 1.05,
              rotateZ: [0, -2, 2, -2, 0],
              transition: {
                rotateZ: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                },
              },
            }}
          >
            {/* Glow behind image */}
            <motion.div
              className={`absolute w-20 h-20 rounded-full bg-gradient-to-r ${style.glow} blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700`}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src={normalizeImagePath(image)}
                alt={name}
                width={100}
                height={100}
                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.35)]"
                priority
                unoptimized
              />
            </motion.div>

            {/* Orbiting particles */}
            <motion.div
              className="absolute w-full h-full pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className={`absolute w-2 h-2 rounded-full ${style.accent} top-0 left-1/2 -translate-x-1/2`}
                animate={{ opacity: [0.7, 0.2, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <motion.div
              className="absolute w-full h-full pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className={`absolute w-1.5 h-1.5 rounded-full ${style.accent} bottom-0 left-1/2 -translate-x-1/2`}
                animate={{ opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Description */}
          <div className="relative overflow-hidden mb-3">
            <motion.p
              className={`text-gray-300 text-xs group-hover:text-white transition-all duration-500 leading-relaxed ${
                isExpanded
                  ? "max-h-[400px]"
                  : "max-h-[70px] md:group-hover:max-h-[400px]"
              }`}
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {description}
            </motion.p>
            {/* Dégradé qui masque le texte tronqué avec flèche intégrée */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent ${
                isExpanded ? "opacity-0" : "md:group-hover:opacity-0"
              } transition-opacity duration-500 flex justify-center items-end pb-1`}
            >
              {/* Flèche vers le bas visible uniquement sur mobile et quand non-étendu */}
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`md:hidden w-6 h-6 rounded-full ${
                  style.accent
                } flex items-center justify-center shadow-lg opacity-80 ${
                  isExpanded ? "hidden" : "flex"
                }`}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -2, 0] }}
                transition={{
                  y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Bouton pour réduire la description (visible uniquement sur mobile quand étendu) */}
          <div className="md:hidden flex justify-center mb-3">
            {isExpanded && (
              <motion.button
                onClick={() => setIsExpanded(false)}
                className={`w-8 h-8 rounded-full ${style.accent} flex items-center justify-center shadow-lg`}
                whileTap={{ scale: 0.9 }}
                initial={{ rotate: 180 }}
                animate={{ y: [0, -2, 0] }}
                transition={{
                  y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Button */}
          <motion.div
            className="mt-auto"
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href={name.split(" ")[0] === "to_be_desactivated" ? "#" : link} // Désactive le lien si Reply
              className={`block w-full py-2 px-3 text-white font-bold rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center text-xs backdrop-blur-sm
    ${
      name.split(" ")[0] === "to_be_desactivated"
        ? "bg-gray-500 cursor-not-allowed opacity-50 pointer-events-none"
        : `bg-gradient-to-r ${style.button} hover:shadow-xl`
    }
  `}
            >
              <span>Discuter avec {name.split(" ")[0]}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AgentsPage() {
  // État pour stocker les favoris et le chargement initial
  const [favorites, setFavorites] = useState([]);
  // État pour stocker le filtre actif - peut être "all", "favorites", "marketing" ou "communication"
  const [filter, setFilter] = useState("all");
  // Plus besoin d'attendre que le client soit monté pour améliorer la performance
  const [isClientMounted, setIsClientMounted] = useState(true);

  // Effet d'initialisation exécuté immédiatement
  useEffect(() => {
    // Initialiser immédiatement pour éviter le délai de chargement
    setIsClientMounted(true);

    // Récupérer les données du localStorage directement
    try {
      const storedFavorites = localStorage.getItem("agentFavorites");
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

      const storedFilter = localStorage.getItem("agentFilterPreference");
      if (storedFilter) setFilter(JSON.parse(storedFilter));
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }, []);

  // On a retiré l'effet de chargement des favoris et du filtre
  // car il est maintenant intégré dans l'effet d'initialisation

  // Sauvegarder les favoris dans le localStorage lorsqu'ils changent
  useEffect(() => {
    if (!isClientMounted) return; // Ne rien faire si le client n'est pas encore monté

    try {
      localStorage.setItem("agentFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des favoris:", error);
    }
  }, [favorites, isClientMounted]);

  // Sauvegarder le choix de filtre dans le localStorage lorsqu'il change
  useEffect(() => {
    if (!isClientMounted) return; // Ne rien faire si le client n'est pas encore monté

    try {
      localStorage.setItem("agentFilterPreference", JSON.stringify(filter));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du filtre:", error);
    }
  }, [filter, isClientMounted]);

  // Fonction pour basculer l'état favori d'un agent
  const toggleFavorite = (agentName) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(agentName)) {
        return prevFavorites.filter((name) => name !== agentName);
      } else {
        return [...prevFavorites, agentName];
      }
    });
  };



  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 animate-gradient-x text-white font-sans">
      <section className="relative py-6 text-center px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>

        <div className="container mx-auto mb-12 relative">
          {/* Barre de navigation avec menu Google */}
          <div className="flex justify-end items-center w-full fixed top-0 left-0 right-0 z-40 px-4 py-1 bg-gradient-to-b from-blue-900/80 to-transparent backdrop-blur-sm">
            {/* Menu style Google en haut à droite */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <GoogleMenu />
            </motion.div>
          </div>

          {/* Espace pour compenser la barre de navigation fixe - réduit */}
          <div className="h-10"></div>

          {/* Titre LaZoneIA avec animations avancées */}
          <div className="relative mb-6 mt-1 pt-2 pb-2">
            {/* Effet de glow animé derrière le titre */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-4/5 h-16 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600/30 via-indigo-500/30 to-purple-600/30 rounded-full blur-2xl"
              animate={{
                width: ["60%", "75%", "60%"],
                height: ["140%", "200%", "140%"],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Particules flottantes autour du titre */}
            <div className="absolute inset-0 overflow-hidden">
              {[
                { x: "20%", y: "20%", size: "2px", delay: 0, duration: 7 },
                { x: "80%", y: "30%", size: "3px", delay: 1, duration: 9 },
                { x: "30%", y: "70%", size: "1.5px", delay: 2, duration: 8 },
                { x: "70%", y: "80%", size: "2px", delay: 3, duration: 6 },
                { x: "40%", y: "40%", size: "2.5px", delay: 0.5, duration: 10 },
                { x: "60%", y: "60%", size: "1px", delay: 1.5, duration: 7 },
                { x: "90%", y: "40%", size: "2px", delay: 2.5, duration: 8 },
                { x: "10%", y: "50%", size: "1.5px", delay: 3.5, duration: 9 },
              ].map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    left: particle.x,
                    top: particle.y,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.5, 1],
                    x: [0, 10, -10, 0],
                    y: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Ligne décorative avec animation */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "50%", "0%"] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ top: "calc(50% + 24px)" }}
            />

            {/* Titre principal avec animation lettre par lettre */}
            <div className="relative flex justify-center items-center">
              {["L", "a", "Z", "o", "n", "e", "I", "A"].map((letter, index) => (
                <motion.span
                  key={index}
                  className={`text-4xl md:text-5xl font-bold ${
                    letter === "Z" || letter === "I" || letter === "A"
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                      : "text-white"
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 120,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [-5, 5, 0],
                    transition: { duration: 0.3 },
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Tagline animée */}
            <motion.div
              className="text-sm text-blue-200/80 text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1] }}
              transition={{ delay: 1, duration: 1 }}
            >
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                L&apos;intelligence artificielle à votre service
              </motion.span>
            </motion.div>

            {/* Accents décoratifs */}
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="3 6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </motion.div>
          </div>

          {/* Bloc de filtres catégorie mobile first sans bouton étoile */}
          <FilterBar filter={filter} setFilter={setFilter} agents={agents} favorites={favorites} />
        </div>

        {/* Colorful blurred shapes */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600 rounded-full filter blur-[100px] opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-40 h-40 bg-purple-500 rounded-full filter blur-[80px] opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-blue-500 rounded-full filter blur-[90px] opacity-10 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 0L26 14H14L20 0Z" fill="white" />
            <path d="M20 40L14 26H26L20 40Z" fill="white" />
            <path d="M0 20L14 14V26L0 20Z" fill="white" />
            <path d="M40 20L26 26V14L40 20Z" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 opacity-30">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="2" />
            <circle
              cx="20"
              cy="20"
              r="20"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        <motion.div
          className="relative z-10 container mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {filter === "favorites" && favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full p-10 text-center"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 max-w-md mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto mb-4 text-yellow-400 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <h3 className="text-xl font-medium mb-2">Aucun favori</h3>
                <p className="text-blue-200 mb-6">
                  Cliquez sur l&apos;étoile d&apos;un agent pour l&apos;ajouter
                  à vos favoris.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter("all")}
                  className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  Voir tous les agents
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 p-4 max-w-7xl mx-auto">
              {agents
                .filter((agent) => {
                  if (filter === "all") return true;
                  if (filter === "favorites")
                    return favorites.includes(agent.name);
                  return agent.category === filter;
                })
                .map((agent, i) => (
                  <AgentCard
                    key={i}
                    name={agent.name}
                    description={agent.description}
                    image={agent.image}
                    color={agent.color}
                    link={agent.link}
                    tagline={agent.tagline}
                    isFavorite={favorites.includes(agent.name)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
}
