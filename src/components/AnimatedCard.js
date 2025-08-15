"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Lottie from "lottie-react";

export default function AnimatedCard({ title, description, icon, animationData, delay = 0 }) {
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
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay * 0.2 + 0.3
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-white/10 overflow-hidden group w-80"
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)" 
      }}
    >
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 rounded-3xl" />
      
      {/* Card content */}
      <div className="relative z-10">
        <motion.div 
          className="h-48 flex items-center justify-center mb-6"
          variants={iconVariants}
        >
          {animationData ? (
            <Lottie animationData={animationData} loop={true} />
          ) : (
            icon && (
              <Image 
                src={icon} 
                alt={title}
                width={120}
                height={120}
                className="object-contain" 
              />
            )
          )}
        </motion.div>
        
        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-300 mb-6 group-hover:text-white transition-colors duration-300">
          {description}
        </p>
        
        <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group-hover:translate-y-0">
          <span>En savoir plus</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
