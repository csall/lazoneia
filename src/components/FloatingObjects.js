"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function FloatingObjects() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });

  const { scrollY } = useScroll();
  
  // Parallax effects based on scroll
  const y1 = useTransform(scrollY, [0, 800], [0, -100]);
  const y2 = useTransform(scrollY, [0, 800], [0, -180]);
  const y3 = useTransform(scrollY, [0, 800], [0, -60]);
  const y4 = useTransform(scrollY, [0, 800], [0, -140]);
  const y5 = useTransform(scrollY, [0, 800], [0, -200]);
  const rotate1 = useTransform(scrollY, [0, 800], [0, 20]);
  const rotate2 = useTransform(scrollY, [0, 800], [0, -15]);
  
  // Update window dimensions when resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Objects to float around the hero section
  const objects = [
    {
      src: "/globe.svg", // Using your existing SVGs in public folder
      width: 60,
      height: 60,
      style: {
        top: '15%',
        left: '8%',
        y: y1,
        rotate: rotate1,
      },
      initialAnimation: {
        x: [-10, 10],
        y: [-5, 8],
        transition: {
          x: { repeat: Infinity, repeatType: "reverse", duration: 4 },
          y: { repeat: Infinity, repeatType: "reverse", duration: 3 },
        },
      },
    },
    {
      src: "/window.svg",
      width: 80,
      height: 80,
      style: {
        top: '30%',
        right: '10%',
        y: y2,
        rotate: rotate2,
      },
      initialAnimation: {
        x: [15, -15],
        y: [8, -8],
        transition: {
          x: { repeat: Infinity, repeatType: "reverse", duration: 5 },
          y: { repeat: Infinity, repeatType: "reverse", duration: 4 },
        },
      },
    },
    {
      src: "/file.svg",
      width: 70,
      height: 70,
      style: {
        bottom: '25%',
        left: '12%',
        y: y3,
      },
      initialAnimation: {
        x: [-5, 5],
        y: [-10, 10],
        rotate: [-5, 5],
        transition: {
          x: { repeat: Infinity, repeatType: "reverse", duration: 3.5 },
          y: { repeat: Infinity, repeatType: "reverse", duration: 2.5 },
          rotate: { repeat: Infinity, repeatType: "reverse", duration: 4 },
        },
      },
    },
    {
      src: "/vercel.svg",
      width: 90,
      height: 90,
      style: {
        bottom: '15%',
        right: '15%',
        y: y4,
      },
      initialAnimation: {
        x: [10, -10],
        y: [5, -5],
        rotate: [0, 360],
        transition: {
          x: { repeat: Infinity, repeatType: "reverse", duration: 6 },
          y: { repeat: Infinity, repeatType: "reverse", duration: 5 },
          rotate: { repeat: Infinity, duration: 20, ease: "linear" },
        },
      },
    },
    {
      src: "/next.svg",
      width: 50,
      height: 50,
      style: {
        top: '55%',
        left: '25%',
        y: y5,
      },
      initialAnimation: {
        x: [8, -8],
        y: [12, -12],
        rotate: [0, 360],
        transition: {
          x: { repeat: Infinity, repeatType: "reverse", duration: 5 },
          y: { repeat: Infinity, repeatType: "reverse", duration: 4 },
          rotate: { repeat: Infinity, duration: 15, ease: "linear" },
        },
      },
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {objects.map((object, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={object.style}
          animate={object.initialAnimation}
        >
          <Image 
            src={object.src}
            alt="Floating object"
            width={object.width}
            height={object.height}
            className="filter drop-shadow-lg"
          />
        </motion.div>
      ))}
    </div>
  );
}
