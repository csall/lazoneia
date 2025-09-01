"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cardStyles } from "@/styles/cardStyles";

const AgentCard = ({ agent, isFavorite, toggleFavorite }) => {
  const { id, name, description, role } = agent;
  
  // Adaptation du thème de couleur en fonction du rôle
  const color = role === "marketing" ? "max" : "clara";
  const link = `/agent/${name.toLowerCase()}`;
  const tagline = role === "marketing" 
    ? "Expert en marketing digital" 
    : "Spécialiste en communication";
  const style = cardStyles[color] || cardStyles.charm;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef(null);
  const descriptionRef = useRef(null);
  
  // Détection des appareils mobiles
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Gestion du clic sur le bouton d'expansion
  const toggleExpand = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Empêcher les clics multiples pendant l'animation
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsExpanded(prev => !prev);
    
    // Réinitialiser l'état d'animation après la transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  }, [isAnimating]);

  // Gestion de fermeture lors du clic en dehors de la carte
  useEffect(() => {
    if (isExpanded) {
      const handleClickOutside = (e) => {
        if (
          cardRef.current && 
          !cardRef.current.contains(e.target) &&
          !e.target.closest('.expansion-toggle')
        ) {
          toggleExpand();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isExpanded, toggleExpand]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
      viewport={{ once: true, margin: "-80px" }}
      className="perspective-1000 flex flex-col w-full h-full"
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        className={`relative h-full flex flex-col group rounded-xl overflow-hidden p-3 border ${style.border} ${style.bg} backdrop-blur-sm hover:shadow-lg transition-all duration-500`}
        onClick={() => !isMobile && toggleExpand()}
        style={{
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Mesh gradient background */}
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute inset-0 bg-gradient-to-br ${style.mesh}`}></div>
        </div>

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
  <div className="relative z-10 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1">
            {/* Tagline badge */}
            <motion.span
              className={`text-xs py-0.5 px-2 ${style.accent} text-white rounded-full self-start opacity-90`}
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {agent.tagline}
            </motion.span>

            {/* Favorite button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(id);
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
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

          {/* Name */}
          <motion.h3
            className={`text-lg font-bold mb-0.5 text-white ${style.hover} transition-colors duration-300`}
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {name}
          </motion.h3>

          {/* Image */}
          <motion.div
            className="h-20 flex items-center justify-center my-1 relative"
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
              className={`absolute w-16 h-16 rounded-full bg-gradient-to-r ${style.glow} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700`}
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
                src={image}
                alt={name}
                width={65}
                height={65}
                className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]"
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
          <div className="relative overflow-hidden mb-2 flex-shrink-0">
            <div 
              ref={descriptionRef}
              className="description-container relative"
            >
              <motion.div
                className="content-wrapper"
                animate={{ 
                  height: isExpanded ? 'auto' : '42px',
                }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                <p className={`text-gray-300 text-[10px] leading-relaxed line-clamp-4 ${
                  isExpanded ? 'text-white' : ''
                } transition-all duration-300`}>
                  {description}
                </p>

                {/* Bouton d'expansion flottant */}
                {isMobile && (
                  <div className={`absolute left-0 right-0 bottom-0 flex justify-center ${
                    isAnimating ? 'pointer-events-none' : ''
                  }`}>
                    <div
                      className="expansion-toggle-wrapper bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-1 px-3 w-full flex justify-center"
                    >
                      <button 
                        className={`expansion-toggle w-10 h-10 rounded-full bg-gradient-to-r ${style.button} text-white shadow-lg flex items-center justify-center transform transition-all duration-400`}
                        style={{
                          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4), 0px 0px 10px rgba(255, 255, 255, 0.1)',
                          transform: `rotate(${isExpanded ? '180deg' : '0deg'})`,
                        }}
                        onClick={toggleExpand}
                        aria-label={isExpanded ? "Réduire" : "Voir plus"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Button */}
          <motion.div
            className="mt-auto pt-1"
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href={link}
              className={`block w-full py-2 md:py-1 px-2 bg-gradient-to-r ${style.button} text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center text-[10px] backdrop-blur-sm min-h-[30px]`}
              onClick={(e) => {
                // Empêcher la propagation au parent
                e.stopPropagation();
              }}
            >
              <span>Discuter avec {name.split(" ")[0]}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 ml-1 transition-transform duration-300 group-hover:translate-x-1"
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

export default AgentCard;
