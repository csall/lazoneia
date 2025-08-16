"use client";

import { useState, useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

// Hook pour animer les SVG interactifs dans l'application
export const useSvgAnimation = (options = {}) => {
  const {
    rotationDuration = 20,
    hoverIntensity = 1.5,
    pulseSpeed = 0.8,
    initialDelay = 0
  } = options;
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Valeurs de mouvement pour les animations
  const rotation = useMotionValue(0);
  const scale = useSpring(1, {
    stiffness: 200,
    damping: 20
  });
  
  useEffect(() => {
    // Animation de délai initial
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, initialDelay * 1000);
    
    // Nettoyage
    return () => clearTimeout(timeout);
  }, [initialDelay]);
  
  // Gestionnaires d'événements
  const handleMouseEnter = () => {
    setIsHovering(true);
    scale.set(hoverIntensity);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    scale.set(1);
  };
  
  return {
    isHovering,
    isVisible,
    rotation,
    scale,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    },
    animationProps: {
      animate: isVisible ? { 
        opacity: 1, 
        scale: 1,
        y: 0
      } : { 
        opacity: 0, 
        scale: 0.9,
        y: 20
      },
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      },
      style: { 
        scale,
        filter: isHovering ? 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.5))' : 'none',
        transition: 'filter 0.5s ease-in-out'
      }
    }
  };
};
