"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedText({ children, delay = 0, className = "", once = true }) {
  const [isVisible, setIsVisible] = useState(!once);
  
  useEffect(() => {
    if (once) {
      setIsVisible(true);
    }
  }, [once]);

  // Splitting text into individual words
  const words = children.split(" ");
  
  // Animation variants for words
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i }
    })
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      style={{ overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={`inline-block ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          variants={child}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.div>
  );
}
