"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import Lottie from "lottie-react";
import { useImagePath } from "@/hooks/useImagePath";
import OptimizedImage from "@/components/OptimizedImage";
import AgentAvatar from "@/components/agents/AgentAvatar";

export default function AnimatedCard({ title, description, icon, animationData, delay = 0, botType = "" }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        delay: delay * 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -10 },
    visible: { 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay * 0.2 + 0.3
      }
    }
  };
  
  // Déterminer quelle image SVG utiliser en fonction du botType ou du nom
  // Alias getImagePath en 'get' pour simplifier les appels
  const { getImagePath: get } = useImagePath();
  const getBotImage = () => {
    // Image collective pour les agents (utilisée pour la page agents)
    if (botType === "agents" || title.toLowerCase().includes("agents")) {
  return get("/agents-bot.svg");
    }
    // Utiliser des images spécifiques pour chaque agent
    else if (botType === "punchy" || title.toLowerCase().includes("punchy")) {
  return get("/punchy-bot.svg");
    } else if (botType === "reply" || title.toLowerCase().includes("reply")) {
  return get("/reply-bot.svg");
    } else if (botType === "scribo" || title.toLowerCase().includes("scribo")) {
  return get("/scribo-bot.svg");
    } else if (botType === "lingo" || title.toLowerCase().includes("lingo")) {
  return get("/lingo-bot.svg");
    } else if (botType === "charm" || title.toLowerCase().includes("charm") || botType === "glow" || title.toLowerCase().includes("glow")) {
  return get("/glow-bot.svg");
    } else if (botType === "pitchy" || title.toLowerCase().includes("pitchy")) {
  return get("/pitchy-bot.svg");
    } else if (botType === "fitzy" || title.toLowerCase().includes("fitzy")) {
  return get("/fitzy-bot.svg");
    } else if (botType === "postoto" || title.toLowerCase().includes("postoto")) {
  return get("/postoto-bot.svg");
    }
    // Les anciens agents ont été remplacés par les nouveaux
    return null;
  };

  // Définir les couleurs selon le type d'agent
  const getCardStyles = () => {
    // Agents (page collective) - style multicolor
    if (botType === "agents" || title.toLowerCase().includes("agents")) {
      return {
        card: "relative bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-indigo-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-purple-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    }
    // Punchy - style violet/indigo
    else if (botType === "punchy" || title.toLowerCase().includes("punchy")) {
      return {
        card: "relative bg-gradient-to-br from-indigo-900/60 to-violet-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-violet-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-violet-500 to-indigo-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    } 
    // Reply - style bleu
    else if (botType === "reply" || title.toLowerCase().includes("reply")) {
      return {
        card: "relative bg-gradient-to-br from-blue-900/60 to-sky-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-blue-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-blue-500 to-sky-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    } 
    // Scribo - style teal/cyan
    else if (botType === "scribo" || title.toLowerCase().includes("scribo")) {
      return {
        card: "relative bg-gradient-to-br from-teal-900/60 to-cyan-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-teal-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    } 
    // Lingo - style amber/yellow
    else if (botType === "lingo" || title.toLowerCase().includes("lingo")) {
      return {
        card: "relative bg-gradient-to-br from-amber-900/60 to-yellow-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-amber-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    } 
    // Charm/Glow - style rose/pink
    else if (botType === "charm" || title.toLowerCase().includes("charm") || botType === "glow" || title.toLowerCase().includes("glow")) {
      return {
        card: "relative bg-gradient-to-br from-pink-900/60 to-rose-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-pink-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    } 
    // Pitchy - style emerald/green
    else if (botType === "pitchy" || title.toLowerCase().includes("pitchy")) {
      return {
        card: "relative bg-gradient-to-br from-emerald-900/60 to-green-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-emerald-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    }
    // Postoto - fuchsia/purple
    else if (botType === "postoto" || title.toLowerCase().includes("postoto")) {
      return {
        card: "relative bg-gradient-to-br from-fuchsia-900/60 to-purple-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-fuchsia-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-purple-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    }
    // Valeur par défaut pour tout autre type non spécifié
    else {
      return {
        card: "relative bg-gradient-to-br from-blue-900/60 to-sky-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-blue-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-blue-500 to-sky-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    }
  };
  
  const styles = getCardStyles();
  const botImage = getBotImage();
  const useAvatarComponent = ["lingo","punchy","reply"].includes(botType.toLowerCase());

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={styles.card}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 15px -6px rgba(0, 0, 0, 0.2)" 
      }}
    >
      {/* Background glow effect */}
      <div className={styles.glow} />
      
      {/* Card content */}
      <div className="relative z-10">
        <motion.div 
          className="h-48 flex items-center justify-center mb-6"
          variants={iconVariants}
          whileHover={{ scale: 1.05, rotate: [-2, 2, -2], transition: { rotate: { repeat: Infinity, duration: 2 } } }}
        >
          {useAvatarComponent ? (
            <AgentAvatar type={botType.toLowerCase()} size={180} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
          ) : botImage ? (
            <OptimizedImage
              src={botImage}
              alt={title}
              width={180}
              height={180}
              className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
              priority
            />
          ) : animationData ? (
            <Lottie animationData={animationData} loop={true} />
          ) : (
            icon && (
              <Image 
                src={icon}
                alt={title}
                width={140} 
                height={140}
                className="object-contain"
              />
            )
          )}
        </motion.div>
        
        <h3 className={`text-2xl font-bold mb-3 ${
          // Agents - multicolor
          (botType === "agents" || title.toLowerCase().includes("agents"))
            ? "text-white group-hover:text-purple-200"
          // Punchy - violet
          : (botType === "punchy" || title.toLowerCase().includes("punchy"))
            ? "text-white group-hover:text-indigo-200"
          // Reply - bleu
          : (botType === "reply" || title.toLowerCase().includes("reply"))
            ? "text-white group-hover:text-blue-200"
          // Scribo - teal
          : (botType === "scribo" || title.toLowerCase().includes("scribo"))
            ? "text-white group-hover:text-teal-200"
          // Lingo - amber
          : (botType === "lingo" || title.toLowerCase().includes("lingo"))
            ? "text-white group-hover:text-amber-200"
          // Charm/Glow - rose/pink
          : (botType === "charm" || title.toLowerCase().includes("charm") || botType === "glow" || title.toLowerCase().includes("glow"))
            ? "text-white group-hover:text-pink-200"
          // Pitchy - green
          : (botType === "pitchy" || title.toLowerCase().includes("pitchy"))
            ? "text-white group-hover:text-emerald-200"
          : (botType === "postoto" || title.toLowerCase().includes("postoto"))
            ? "text-white group-hover:text-fuchsia-200"
          // Style par défaut
          : "text-white group-hover:text-blue-200"
        } transition-colors duration-300`}>
          {title}
        </h3>
        
        <p className="text-gray-300 mb-6 group-hover:text-white transition-colors duration-300 leading-relaxed">
          {description}
        </p>
        
        <Link 
          href={
            // Agents collectifs
            (botType === "agents" || title.toLowerCase().includes("agents"))
              ? "/agents"
              // Nouveaux agents
              : (botType === "punchy" || title.toLowerCase().includes("punchy"))
                ? "/agent/punchy"
                : (botType === "reply" || title.toLowerCase().includes("reply"))
                  ? "/agent/reply"
                  : (botType === "scribo" || title.toLowerCase().includes("scribo"))
                    ? "/agent/scribo"
                    : (botType === "lingo" || title.toLowerCase().includes("lingo"))
                      ? "/agent/lingo"
                      : (botType === "charm" || title.toLowerCase().includes("charm"))
                        ? "/agent/charm"
                        : (botType === "glow" || title.toLowerCase().includes("glow"))
                          ? "/agent/glow"
                          : (botType === "pitchy" || title.toLowerCase().includes("pitchy"))
                            ? "/agent/pitchy"
                          : (botType === "postoto" || title.toLowerCase().includes("postoto"))
                            ? "/agent/postoto"
                            // Valeur par défaut - rediriger vers la page des agents
                            : "/agents"
          } 
          className={`w-full py-3 px-6 ${
            // Agents - multicolor
            (botType === "agents" || title.toLowerCase().includes("agents"))
              ? "bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 hover:from-purple-600 hover:via-blue-600 hover:to-pink-600"
            // Punchy - violet
            : (botType === "punchy" || title.toLowerCase().includes("punchy"))
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
            // Reply - bleu
            : (botType === "reply" || title.toLowerCase().includes("reply"))
              ? "bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700"
            // Scribo - teal/cyan
            : (botType === "scribo" || title.toLowerCase().includes("scribo"))
              ? "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
            // Lingo - amber/yellow
            : (botType === "lingo" || title.toLowerCase().includes("lingo"))
              ? "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
            // Charm/Glow - rose/pink
            : (botType === "charm" || title.toLowerCase().includes("charm") || botType === "glow" || title.toLowerCase().includes("glow"))
              ? "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
            // Pitchy - emerald/green
            : (botType === "pitchy" || title.toLowerCase().includes("pitchy"))
              ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            : (botType === "postoto" || title.toLowerCase().includes("postoto"))
              ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700"
            // Style par défaut (bleu)
            : "bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700"
          } text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center`}
        >
          <span>En savoir plus</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
