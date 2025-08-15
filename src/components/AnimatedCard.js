"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import Lottie from "lottie-react";

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
  const getBotImage = () => {
    if (botType === "olivier" || title.toLowerCase().includes("olivier")) {
      return "/olivier-bot.svg";
    } else if (botType === "clara" || title.toLowerCase().includes("clara")) {
      return "/clara-bot.svg";
    } else if (botType === "data" || title.toLowerCase().includes("max")) {
      return "/max-bot.svg";
    }
    return null;
  };

  // Définir les couleurs selon le type d'agent
  const getCardStyles = () => {
    if (botType === "olivier" || title.toLowerCase().includes("olivier")) {
      return {
        card: "relative bg-gradient-to-br from-indigo-900/60 to-violet-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-violet-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-violet-500 to-indigo-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    } else if (botType === "clara" || title.toLowerCase().includes("clara")) {
      return {
        card: "relative bg-gradient-to-br from-pink-900/60 to-rose-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-pink-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    } else {
      return {
        card: "relative bg-gradient-to-br from-blue-900/60 to-sky-900/60 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-blue-500/20 overflow-hidden group w-80",
        glow: "absolute -inset-1 bg-gradient-to-r from-blue-500 to-sky-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl"
      };
    }
  };
  
  const styles = getCardStyles();
  const botImage = getBotImage();

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
          {botImage ? (
            <Image 
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
          (botType === "olivier" || title.toLowerCase().includes("olivier")) 
            ? "text-white group-hover:text-indigo-200" 
            : (botType === "clara" || title.toLowerCase().includes("clara"))
              ? "text-white group-hover:text-pink-200"
              : "text-white group-hover:text-blue-200"
        } transition-colors duration-300`}>
          {title}
        </h3>
        
        <p className="text-gray-300 mb-6 group-hover:text-white transition-colors duration-300 leading-relaxed">
          {description}
        </p>
        
        <Link 
          href={
            (botType === "olivier" || title.toLowerCase().includes("olivier")) 
              ? "/olivier" 
              : (botType === "clara" || title.toLowerCase().includes("clara")) 
                ? "/clara" 
                : "/max"
          } 
          className={`w-full py-3 px-6 ${
            (botType === "olivier" || title.toLowerCase().includes("olivier"))
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
              : (botType === "clara" || title.toLowerCase().includes("clara"))
                ? "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
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
