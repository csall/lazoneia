"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

// Import JSON Lottie depuis assets
import botMarketing from "../assets/lotties/bot-marketing.json";
import botSupport from "../assets/lotties/bot-support.json";
import botData from "../assets/lotties/bot-data.json";

// Composants chargés dynamiquement (côté client uniquement)
const ParticlesBackground = dynamic(() => import("../components/ParticlesBackground"), { ssr: false });
const HeroAnimation = dynamic(() => import("../components/HeroAnimation"), { ssr: false });
const FloatingObjects = dynamic(() => import("../components/FloatingObjects"), { ssr: false });
const AnimatedText = dynamic(() => import("../components/AnimatedText"), { ssr: false });
const AnimatedCard = dynamic(() => import("../components/AnimatedCard"), { ssr: false });

export default function Home() {
  const agents = [
    { 
      name: "Olivier l'humoriste", 
      description: "L'assistant IA qui transforme vos journées en spectacle de stand-up et apporte une touche de légèreté à votre entreprise. Il améliore l'engagement client grâce à son humour personnalisé.", 
      animationData: null,
      botType: "olivier" 
    },
    { 
      name: "Clara la séductrice", 
      description: "Attire et fidélise vos clients grâce à ses stratégies de communication captivantes et son charme irrésistible. Elle crée des expériences personnalisées qui convertissent les visiteurs en clients fidèles.", 
      animationData: null,
      botType: "clara"
    },
    { 
      name: "Max l'analyste", 
      description: "Expert en données qui transforme les chiffres complexes en insights actionnables. Il identifie les tendances cachées et vous aide à prendre des décisions stratégiques éclairées.", 
      animationData: botData,
      botType: "data"
    }
  ];

  return (
    <main className="relative bg-gradient-to-r from-blue-900 to-purple-900 animate-gradient-x text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <ParticlesBackground />
        <HeroAnimation />
        <FloatingObjects />
        <div className="absolute inset-0 bg-black opacity-30 backdrop-blur-[2px]"></div>
        
        <motion.div 
          className="relative z-10 max-w-3xl px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            <AnimatedText>La Zone IA</AnimatedText>
          </h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-10 text-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Exprimez-vous parfaitement dans toutes les situations avec nos agents IA spécialisés en communication.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/agents"
              className="inline-block bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-yellow-500/30"
            >
              <div className="flex items-center gap-2">
                <span>Découvrez nos agents</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
