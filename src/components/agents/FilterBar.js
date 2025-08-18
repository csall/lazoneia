"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const FilterBar = ({ filter, setFilter, favorites = [] }) => {
  const isFavoriteMode = filter === "favorites";
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Effet pour réinitialiser l'état de clic après un délai
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  // Animation au clic avec retour visuel
  const handleToggle = () => {
    setIsClicked(true);
    const newFilter = filter === "favorites" ? "all" : "favorites";
    setFilter(newFilter);
  };

  // Génération de particules aléatoires pour les animations
  const generateParticles = (count) => {
    return Array.from({ length: count }).map((_, index) => {
      const angle = (index / count) * Math.PI * 2;
      const distance = Math.random() * 30 + 20;
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 0.8 + 0.6
      };
    });
  };

  const particles = generateParticles(12);
  
  return (
    <div className="relative h-12 w-12 mx-auto -mb-2 flex items-center justify-center">
      {/* Effet de halo dynamique */}
      <AnimatePresence>
        {(isFavoriteMode || isHovered) && (
          <motion.div
            className={`absolute rounded-full ${
              isFavoriteMode 
                ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20" 
                : "bg-white/5"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 1], 
              opacity: 0.7
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ width: "48px", height: "48px" }}
          />
        )}
      </AnimatePresence>
      
      {/* Cercle de fond avec lueur */}
      <motion.div
        className={`absolute rounded-full backdrop-blur-sm ${
          isFavoriteMode 
            ? "bg-gradient-to-br from-amber-500/30 to-yellow-600/30 shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
            : "bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        } transition-all duration-300`}
        style={{ width: "48px", height: "48px" }}
        animate={{
          boxShadow: isFavoriteMode 
            ? [
                "0 0 20px rgba(245,158,11,0.2)",
                "0 0 30px rgba(245,158,11,0.4)",
                "0 0 20px rgba(245,158,11,0.2)"
              ]
            : "0 0 15px rgba(255,255,255,0.1)"
        }}
        transition={{ 
          duration: 2, 
          repeat: isFavoriteMode ? Infinity : 0,
          ease: "easeInOut"
        }}
      />

      {/* Particules flottantes en mode favoris */}
      <AnimatePresence>
        {isFavoriteMode && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`float-${i}`}
                className="absolute rounded-full bg-amber-300"
                style={{
                  width: 2 + i % 3,
                  height: 2 + i % 3,
                }}
                initial={{ 
                  x: (i % 2 === 0 ? -1 : 1) * 10, 
                  y: (i % 2 === 0 ? 1 : -1) * 10,
                  opacity: 0
                }}
                animate={{ 
                  x: (i % 2 === 0 ? 1 : -1) * (10 + i * 2),
                  y: (i % 2 === 0 ? -1 : 1) * (10 + i * 2),
                  opacity: [0.2, 0.7, 0.2]
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3 + i,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Le bouton lui-même avec animations */}
      <motion.button
        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
          isFavoriteMode ? "text-amber-300" : "text-gray-300"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleToggle}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {/* Fond lumineux du bouton */}
        <motion.div 
          className={`absolute inset-0 rounded-full ${
            isFavoriteMode 
              ? "bg-gradient-to-br from-amber-500/20 to-yellow-600/30" 
              : "bg-white/5"
          }`}
          animate={{ 
            opacity: isFavoriteMode ? [0.5, 0.7, 0.5] : 0.3
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Bordure animée */}
        <motion.div 
          className={`absolute inset-0 rounded-full border-2 ${
            isFavoriteMode ? "border-amber-400/50" : "border-white/10"
          }`}
          animate={{ 
            opacity: isHovered || isFavoriteMode ? [0.4, 0.8, 0.4] : 0.2,
            scale: isHovered ? [0.95, 1.05, 0.95] : 1
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Étoile avec animation avancée */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            rotateY: isFavoriteMode ? [0, 360] : 0
          }}
          transition={{
            rotateY: {
              duration: isFavoriteMode ? 5 : 0,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          <motion.span 
            className="text-2xl relative"
            animate={{ 
              scale: isClicked ? [1, 1.5, 1] : 1,
              rotate: isFavoriteMode ? [0, 10, -10, 0] : 0
            }}
            transition={{ 
              scale: { duration: 0.5 },
              rotate: { 
                duration: 2, 
                repeat: isFavoriteMode ? Infinity : 0,
                ease: "easeInOut" 
              }
            }}
          >
            ★
          </motion.span>
        </motion.div>
      </motion.button>

      {/* Explosion de particules lors du clic */}
      <AnimatePresence>
        {isClicked && (
          <>
            {particles.map((particle, i) => (
              <motion.div
                key={`particle-${i}`}
                className={`absolute rounded-full ${
                  isFavoriteMode ? "bg-amber-300" : "bg-gray-300"
                }`}
                style={{ width: particle.size, height: particle.size }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 0.8 }}
                animate={{ 
                  scale: [0, 1, 0.5],
                  x: particle.x,
                  y: particle.y,
                  opacity: [0.8, 0.4, 0]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: particle.duration }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Compteur de favoris */}
      <AnimatePresence>
        {favorites.length > 0 && (
          <motion.div
            className="absolute -top-1 -right-1"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 30 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
                <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-70" style={{ animationDuration: "2s" }} />
                <span className="text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
