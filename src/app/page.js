"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getCardStyle } from "@/styles/cardStyles";
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
  lines = 6,
}) => {
  const { theme } = useTheme();

  const style = getCardStyle(theme, color);
  const isLight = theme === 'light';
  const textSecondary = isLight ? 'text-gray-600 group-hover:text-gray-800' : 'text-gray-300 group-hover:text-white';

  // Background layers adapted for light vs dark to éviter un aspect trop sombre en mode clair
  const cardBackground = isLight
   ? `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 70%),
     linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)`
   : `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%),
     linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
      viewport={{ once: true, margin: "-100px" }}
      className="perspective-1000 h-full flex"
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
  className={`relative backdrop-blur-xl px-2 py-1 sm:px-3 sm:py-2 rounded-xl overflow-hidden border ${style.border} group w-full flex flex-col h-full transition-shadow ${isLight ? 'shadow-[0_2px_6px_-1px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)]' : 'shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'}`}
        style={{
          background: cardBackground,
        }}
        whileHover={{
          y: -15,
          zIndex: 20,
          transition: { type: "spring", stiffness: 400, damping: 15 },
        }}
      >
        {/* Mesh gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${style.bg} ${isLight ? 'opacity-70 mix-blend-multiply' : 'opacity-80'} transition-opacity`}
        ></div>
        <div
          className={`absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10`}
        ></div>
        <div
          className={`absolute -inset-[100%] bg-gradient-conic ${style.mesh} ${isLight ? 'opacity-20' : 'opacity-30'} blur-3xl animate-slow-spin`}
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
          <div className="flex items-center justify-between gap-1 mb-1">
            {/* Name & Tagline */}
            <div className="flex items-center gap-2 mx-auto">
              <motion.h3
                className={`text-base font-semibold leading-tight ${style.hover} transition-colors duration-300 ${isLight ? 'text-gray-900' : 'text-white'}`}
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {name}
              </motion.h3>
              <motion.span
                className={`text-[10px] py-0.5 px-2 ${style.accent} text-white rounded-full opacity-90 leading-none`}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {tagline}
              </motion.span>
            </div>
            {/* Favorite button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(name);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                className={`w-4 h-4 ${
                  isFavorite ? "text-yellow-400" : "text-gray-300"
                }`}
                strokeWidth={isFavorite ? "0" : "2"}
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </motion.button>
          </div>

          {/* Image centrée style PlayStation */}
          <div className="w-full flex flex-col items-center my-1">
          <motion.div
            className="h-16 flex items-center justify-center relative"
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
              className={`absolute w-16 h-16 rounded-full bg-gradient-to-r ${style.glow} blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-700`}
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
                width={56}
                height={56}
                className="object-contain w-[56px] h-[56px] sm:w-[90px] sm:h-[90px]"
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
          {/* Description sous l'image (marge ajoutée) */}
          <div className="relative overflow-hidden mt-3 mb-7 pb-3 w-full px-1">
            <motion.p
              className={`text-[11px] leading-snug transition-colors duration-500 ${textSecondary}`}
              style={{ display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {description}
            </motion.p>
          </div>
          </div>

          {/* Bouton pour réduire la description (visible uniquement sur mobile quand étendu) */}
          {/* Zone expansion supprimée pour uniformité des hauteurs */}

          {/* Button */}
          {/* Séparateur et bouton */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className={`h-px w-full mr-2 rounded-sm ${isLight ? 'bg-gray-300/70' : 'bg-white/10'}`} />
            <motion.div
              className="pointer-events-auto"
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            >
              <Link
              href={name.split(" ")[0] === "to_be_desactivated" ? "#" : link} // Désactive le lien si Reply
              className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center text-white text-[10px] backdrop-blur-sm border border-white/10
                ${
                  name.split(" ")[0] === "to_be_desactivated"
                    ? "bg-gray-500 cursor-not-allowed opacity-50 pointer-events-none"
                    : `bg-gradient-to-r ${isLight ? 'from-indigo-400 to-violet-500 hover:from-indigo-500 hover:to-violet-600' : 'from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700'}`
                }`}
              aria-label={`Ouvrir ${name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
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
  // Récupération du thème global
  const { theme } = useTheme();

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

  const isLight = theme === 'light';
  return (
    <main className={`min-h-screen font-sans transition-colors duration-500 ${isLight ? 'text-gray-800 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(167,139,250,0.25),transparent_55%),linear-gradient(to_bottom_right,#f8fafc,#ffffff,#f5f3ff)]' : 'text-white bg-gradient-to-br from-blue-950 via-blue-900 to-purple-950'} relative overflow-hidden`}>      
      {/* Theme animated overlay */}
      <div className="pointer-events-none absolute inset-0 ${isLight ? 'opacity-60' : 'opacity-40'} mix-blend-overlay">
        <div className={`absolute inset-0 ${isLight ? 'bg-[radial-gradient(circle_at_25%_30%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(167,139,250,0.18),transparent_60%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.6),transparent_65%)]' : 'bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.08),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(167,139,250,0.08),transparent_60%)]'} transition-all duration-700`}></div>
      </div>
      <section className="relative py-6 text-center px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10 transition-opacity"></div>

        <div className="container mx-auto mb-12 relative">
          {/* Barre de navigation unifiée (alignée avec pages agents) */}
          <header className="fixed top-0 left-0 w-full z-50 py-3 px-4 backdrop-blur-2xl shadow-2xl border-b border-white/10 dark:border-white/10 bg-gradient-to-r from-indigo-900/80 via-violet-900/70 to-transparent">
            <div className="container mx-auto flex justify-end items-center gap-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ scale: 1.04 }}
              >
                <GoogleMenu />
              </motion.div>
            </div>
          </header>

          {/* Espace compensateur même hauteur que header agents */}
          <div className="h-16"></div>

          {/* Titre LaZoneIA avec animations avancées */}
          <div className="relative mb-6 mt-1 pt-2 pb-2 select-none">
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
                  className={`text-4xl md:text-5xl font-bold transition-colors ${
                    letter === "Z" || letter === "I" || letter === "A"
                      ? isLight ? 'bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-violet-500' : "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                      : isLight ? 'text-gray-900' : "text-white"
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
              className={`text-sm text-center mt-2 ${isLight ? 'text-sky-600/70' : 'text-blue-200/80'}`}
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
  {/* Bloc unique d'affichage des agents */}

        {/* Decorative elements */}
  <div className="absolute top-20 left-10 opacity-20 dark:opacity-30 transition-opacity">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 0L26 14H14L20 0Z" fill="white" />
            <path d="M20 40L14 26H26L20 40Z" fill="white" />
            <path d="M0 20L14 14V26L0 20Z" fill="white" />
            <path d="M40 20L26 26V14L40 20Z" fill="white" />
          </svg>
        </div>
  <div className="absolute bottom-20 right-10 opacity-20 dark:opacity-30 transition-opacity">
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

  {/* Grille d'agents : 5 colonnes sur écrans larges */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 sm:p-4 max-w-[1500px] mx-auto">
          {agents
            .filter((agent) => {
              if (filter === "all") return true;
              if (filter === "favorites") return favorites.includes(agent.name);
              return agent.category === filter;
            })
            .map((agent, i) => (
              <div
                key={i}
                className="h-[270px] flex w-full flex-1 min-w-0"
              >
                <AgentCard
                  name={agent.name}
                  description={agent.description}
                  image={agent.image}
                  color={agent.color}
                  link={agent.link}
                  tagline={agent.tagline}
                  isFavorite={favorites.includes(agent.name)}
                  onToggleFavorite={toggleFavorite}
                  lines={6}
                />
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
