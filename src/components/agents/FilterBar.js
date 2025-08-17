"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const FilterBar = ({ filter, setFilter, favorites }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [indicatorDimensions, setIndicatorDimensions] = useState({ 
    width: 0, 
    height: 0, 
    left: 0, 
    top: 0 
  });
  
  const allButtonRef = useRef(null);
  const favButtonRef = useRef(null);
  
  // Initialisation
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Mise à jour des dimensions de l'indicateur
  useEffect(() => {
    const updateIndicator = () => {
      const activeRef = filter === "all" ? allButtonRef : favButtonRef;
      
      if (activeRef.current) {
        const rect = activeRef.current.getBoundingClientRect();
        const parentRect = activeRef.current.parentElement.getBoundingClientRect();
        
        setIndicatorDimensions({
          width: rect.width,
          height: rect.height,
          left: rect.left - parentRect.left,
          top: rect.top - parentRect.top
        });
      }
    };
    
    // Mise à jour initiale
    updateIndicator();
    
    // Mise à jour lors des redimensionnements
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [filter]);
  
  return (
    <div className="relative flex justify-center">
      <motion.div
        className="relative max-w-md py-2 px-1 mb-6 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        whileHover={{ scale: 1.03 }}
      >
        {/* Fond néomorphique avec effet glass amélioré */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden z-0">
          {/* Effet de reflet sur le dessus */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent"></div>
          
          {/* Reflet latéral */}
          <motion.div
            className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-white/10 to-transparent"
            animate={{
              opacity: [0.05, 0.15, 0.05],
              x: [-10, 30, -10],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          />
          
          {/* Halo lumineux qui suit le filtre actif */}
          <motion.div
            className="absolute rounded-xl blur-2xl"
            layoutId="filterHalo"
            animate={{
              background: filter === "all" 
                ? "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)" 
                : "radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 70%)",
              width: `${indicatorDimensions.width + 30}px`,
              height: `${indicatorDimensions.height + 20}px`,
              left: `${indicatorDimensions.left - 15}px`,
              top: `${indicatorDimensions.top - 10}px`
            }}
            transition={{ 
              type: "spring", 
              stiffness: 50,
              damping: 14
            }}
          />
          
          {/* Particules dynamiques améliorées en arrière-plan */}
          <div className="absolute inset-0 overflow-hidden opacity-40">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/40"
                style={{
                  width: Math.random() * 3 + 1 + "px",
                  height: Math.random() * 3 + 1 + "px",
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  x: [0, Math.random() * 40 - 20, 0],
                  y: [0, Math.random() * 40 - 20, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, Math.random() * 0.5 + 1.5, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: Math.random() * 5 + 3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          {/* Multiple effets de lignes animées */}
          <motion.div 
            className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent -left-1/2"
            style={{ top: "30%" }}
            animate={{ 
              left: ["-100%", "100%"],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "linear" 
            }}
          />
          <motion.div 
            className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-purple-400/25 to-transparent -right-1/2"
            style={{ top: "70%" }}
            animate={{ 
              right: ["-100%", "100%"],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "linear",
              delay: 0.5
            }}
          />
          
          {/* Effet de pulsation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl"
            animate={{
              opacity: [0, 0.1, 0],
              scale: [0.8, 1.03, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 px-3 py-1">
          {/* Groupe de filtres avec indicateur de sélection animé */}
          <div className="relative flex flex-wrap justify-center gap-4">
            {/* Indicateur de sélection animé */}
            <AnimatePresence>
              {isVisible && (
                <motion.div
                  className="absolute backdrop-blur-sm shadow-lg z-0"
                  layoutId="filterIndicator"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                    background: filter === "all"
                      ? "linear-gradient(90deg, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.4) 100%)"
                      : "linear-gradient(90deg, rgba(234, 179, 8, 0.4) 0%, rgba(217, 119, 6, 0.4) 100%)",
                    borderColor: filter === "all"
                      ? "rgba(99, 102, 241, 0.3)"
                      : "rgba(234, 179, 8, 0.3)",
                    boxShadow: [
                      "0 0 0 rgba(99, 102, 241, 0)",
                      filter === "all" 
                        ? "0 0 12px rgba(99, 102, 241, 0.4)" 
                        : "0 0 12px rgba(234, 179, 8, 0.4)",
                      "0 0 0 rgba(99, 102, 241, 0)"
                    ]
                  }}
                  style={{ 
                    top: indicatorDimensions.top,
                    left: indicatorDimensions.left,
                    width: indicatorDimensions.width,
                    height: indicatorDimensions.height,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderRadius: "12px"
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    bounce: 0.15,
                    damping: 14,
                    stiffness: 120,
                    duration: 0.4,
                    boxShadow: {
                      repeat: Infinity,
                      duration: 2.5
                    }
                  }}
                />
              )}
            </AnimatePresence>
            
            {/* Filtre "Tous" */}
            <motion.button
              ref={allButtonRef}
              className={`relative z-10 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                filter === "all" ? "text-white" : "text-blue-200/80 hover:text-white"
              }`}
              onMouseEnter={() => setHoverIndex(0)}
              onMouseLeave={() => setHoverIndex(null)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const clickEffect = document.createElement('div');
                clickEffect.style.position = 'absolute';
                clickEffect.style.borderRadius = '50%';
                clickEffect.style.backgroundColor = 'rgba(99, 102, 241, 0.3)';
                clickEffect.style.width = '5px';
                clickEffect.style.height = '5px';
                clickEffect.style.transition = 'all 0.6s ease-out';
                clickEffect.style.zIndex = '0';
                
                document.body.appendChild(clickEffect);
                
                // Animation avec setTimeout
                setTimeout(() => {
                  clickEffect.style.transform = 'scale(40)';
                  clickEffect.style.opacity = '0';
                }, 10);
                
                // Nettoyage
                setTimeout(() => {
                  document.body.removeChild(clickEffect);
                  setFilter("all");
                }, 300);
              }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1.5"
              >
                <motion.div
                  animate={hoverIndex === 0 ? { 
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.5 }
                  } : {}}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </motion.div>
                <span>Tous</span>
                
                {/* Petit éclat sur hover */}
                {hoverIndex === 0 && (
                  <motion.span
                    className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.span>
            </motion.button>

            {/* Filtre "Favoris" */}
            <motion.button
              ref={favButtonRef}
              className={`relative z-10 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                filter === "favorites" ? "text-white" : "text-yellow-200/80 hover:text-white"
              }`}
              onMouseEnter={() => setHoverIndex(1)}
              onMouseLeave={() => setHoverIndex(null)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const clickEffect = document.createElement('div');
                clickEffect.style.position = 'absolute';
                clickEffect.style.borderRadius = '50%';
                clickEffect.style.backgroundColor = 'rgba(234, 179, 8, 0.3)';
                clickEffect.style.width = '5px';
                clickEffect.style.height = '5px';
                clickEffect.style.transition = 'all 0.6s ease-out';
                clickEffect.style.zIndex = '0';
                
                document.body.appendChild(clickEffect);
                
                // Animation avec setTimeout
                setTimeout(() => {
                  clickEffect.style.transform = 'scale(40)';
                  clickEffect.style.opacity = '0';
                }, 10);
                
                // Nettoyage
                setTimeout(() => {
                  document.body.removeChild(clickEffect);
                  setFilter("favorites");
                }, 300);
              }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-1.5"
              >
                <motion.div
                  animate={filter === "favorites" || hoverIndex === 1 ? { 
                    rotate: [0, 15, -15, 10, -10, 0],
                    scale: [1, 1.2, 1],
                    transition: { duration: 1.2, repeat: filter === "favorites" ? Infinity : 0, repeatDelay: 0.5 }
                  } : {}}
                >
                  <motion.svg
                    className="w-5 h-5"
                    fill={filter === "favorites" ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={filter === "favorites" ? {
                      filter: ["drop-shadow(0 0 2px rgba(234, 179, 8, 0))", "drop-shadow(0 0 4px rgba(234, 179, 8, 0.6))", "drop-shadow(0 0 2px rgba(234, 179, 8, 0))"]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </motion.svg>
                </motion.div>
                <span>Favoris</span>
                {favorites.length > 0 && (
                  <motion.span 
                    className="ml-1 bg-yellow-500/80 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 10
                    }}
                  >
                    {favorites.length}
                  </motion.span>
                )}
                
                {/* Petites étoiles qui volent sur hover */}
                {hoverIndex === 1 && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                        initial={{ 
                          top: "50%", 
                          left: "30%", 
                          scale: 0, 
                          opacity: 0 
                        }}
                        animate={{ 
                          top: ["50%", `${30 + i * 10}%`],
                          left: ["30%", `${20 + i * 20}%`],
                          scale: [0, 1, 0], 
                          opacity: [0, 1, 0] 
                        }}
                        transition={{ 
                          duration: 1 + i * 0.2, 
                          repeat: Infinity,
                          repeatDelay: i * 0.3
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterBar;
