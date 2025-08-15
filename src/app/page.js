"use client";

import Link from "next/link";
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
    { name: "Agent Marketing", description: "Boostez vos ventes grâce à l’automatisation marketing.", animationData: botMarketing },
    { name: "Agent Support", description: "Répondez automatiquement à vos clients 24/7.", animationData: botSupport },
    { name: "Agent Data", description: "Analysez vos données et prenez de meilleures décisions.", animationData: botData },
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
            Automatisez, optimisez et propulsez votre business avec nos agents IA intelligents.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="#agents"
              className="inline-block bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-yellow-500/30"
            >
              <div className="flex items-center gap-2">
                <span>Découvrez nos agents</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="relative py-32 bg-gradient-to-b from-purple-900/80 to-blue-900/90 text-center px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full filter blur-[150px] opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full filter blur-[150px] opacity-20"></div>
        
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AnimatedText>Nos agents IA</AnimatedText>
          </motion.h2>
          
          <motion.p 
            className="mb-16 max-w-2xl mx-auto text-blue-100 text-xl"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Chaque agent est conçu pour résoudre un problème précis et automatiser vos processus.
          </motion.p>
          
          <div className="flex flex-wrap justify-center gap-10">
            {agents.map((agent, i) => (
              <AnimatedCard 
                key={i}
                title={agent.name}
                description={agent.description}
                animationData={agent.animationData}
                delay={i}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-36 text-center px-4 bg-gradient-to-t from-blue-950 to-blue-900/70 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-transparent to-blue-900/80 blur-md"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AnimatedText>Contactez-nous</AnimatedText>
          </motion.h2>
          
          <motion.p 
            className="mb-12 max-w-xl mx-auto text-blue-100 text-xl"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Posez vos questions ou demandez une démonstration personnalisée.
          </motion.p>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-yellow-500/30"
            >
              <span>Envoyer un message</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="absolute -inset-1 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300 group-hover:duration-200 bg-gradient-to-r from-yellow-400 to-amber-300"></div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Footer avec effet visuel */}
      <footer className="relative py-8 bg-blue-950 text-center">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(62, 116, 255, 0.8) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(148, 99, 255, 0.8) 0%, transparent 40%)'
          }}></div>
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <p className="text-blue-300 text-sm">© 2025 La Zone IA. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}
