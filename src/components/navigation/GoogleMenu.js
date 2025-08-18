"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useImagePath } from "@/hooks/useImagePath";

// Composant de menu style Google avec SVG animés
const GoogleMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { getImagePath } = useImagePath();

  // Liste des applications/options du menu avec SVG animés
  const menuItems = [
    { 
      name: "Accueil", 
      link: "/",
      svgIcon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
          whileHover={{ scale: 1.1 }}
          animate={{ 
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <motion.path 
            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
            animate={{ 
              rotateZ: 360,
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear" 
            }}
          ></motion.path>
          <motion.path 
            d="M2 12h20" 
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.path>
        </motion.svg>
      )
    },
    { 
      name: "À propos", 
      link: "/a-propos",
      svgIcon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
          whileHover={{ scale: 1.1 }}
        >
          <motion.path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            animate={{ 
              y: [0, -1, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.path>
          <motion.polyline 
            points="14 2 14 8 20 8"
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          ></motion.polyline>
          <motion.line 
            x1="16" y1="13" x2="8" y2="13"
            animate={{ 
              scaleX: [0.9, 1, 0.9],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          ></motion.line>
          <motion.line 
            x1="16" y1="17" x2="8" y2="17"
            animate={{ 
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
          ></motion.line>
        </motion.svg>
      )
    },
    { 
      name: "Contact", 
      link: "/contact",
      svgIcon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
          whileHover={{ scale: 1.1 }}
        >
          <motion.rect 
            x="2" y="3" width="20" height="14" rx="2" ry="2"
            animate={{ 
              y: [0, -1, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.rect>
          <motion.line 
            x1="8" y1="21" x2="16" y2="21"
            animate={{ 
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.line>
          <motion.line 
            x1="12" y1="17" x2="12" y2="21"
            animate={{ 
              scaleY: [0.9, 1, 0.9],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          ></motion.line>
          <motion.path 
            d="M2 8h20"
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          ></motion.path>
        </motion.svg>
      )
    },
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
        <motion.div 
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { rotate: 90 },
            closed: { rotate: 0 }
          }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none"
        >
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div 
                key={i} 
                className="w-1.5 h-1.5 bg-white rounded-full"
                variants={{
                  open: { 
                    scale: 1.2,
                    opacity: [1, 0.8, 1],
                    transition: { 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      duration: 0.8,
                      delay: i * 0.05
                    }
                  },
                  closed: { scale: 1, opacity: 1 }
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.button>

      {/* Menu déroulant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              boxShadow: [
                "0 10px 40px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.2)",
                "0 10px 40px rgba(0,0,0,0.3), 0 0 30px rgba(80,70,230,0.3)",
                "0 10px 40px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.2)"
              ]
            }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ 
              type: "spring", 
              bounce: 0.2, 
              duration: 0.5,
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="absolute right-0 mt-2 p-2 w-64 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
            style={{
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
                    <motion.div 
                      className="w-12 h-12 mb-2 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center"
                      whileHover={{ 
                        boxShadow: "0 0 15px rgba(255,255,255,0.3)",
                        backgroundColor: "rgba(255,255,255,0.25)" 
                      }}
                      animate={{ 
                        boxShadow: ["0 0 5px rgba(255,255,255,0.1)", "0 0 10px rgba(255,255,255,0.2)", "0 0 5px rgba(255,255,255,0.1)"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {item.svgIcon}
                    </motion.div>
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

export default GoogleMenu;
