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

      {/* Agents Section */}
      <section id="agents" className="relative py-32 bg-gradient-to-b from-purple-900/80 to-blue-900/90 text-center px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        
        {/* Colorful blurred shapes */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600 rounded-full filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-purple-500 rounded-full filter blur-[80px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-blue-500 rounded-full filter blur-[90px] opacity-10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 0L26 14H14L20 0Z" fill="white" />
            <path d="M20 40L14 26H26L20 40Z" fill="white" />
            <path d="M0 20L14 14V26L0 20Z" fill="white" />
            <path d="M40 20L26 26V14L40 20Z" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 opacity-30">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="2" />
            <circle cx="20" cy="20" r="20" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
        
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full backdrop-blur-sm mb-6 border border-white/10">
            <span className="text-sm text-blue-200 font-medium tracking-wider uppercase">Rencontrez nos assistants virtuels</span>
          </div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-100"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AnimatedText>Le Trio IA Irrésistible</AnimatedText>
          </motion.h2>
          
          <motion.p 
            className="mb-10 max-w-2xl mx-auto text-blue-100 text-xl leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Découvrez Olivier, Clara et Max, une équipe d&apos;agents IA conçue pour transformer votre entreprise avec humour, charme et intelligence analytique.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
            >
              <span>Voir tous nos agents</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
            {agents.slice(0, 3).map((agent, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 mb-4 relative">
                  <Image 
                    src={agent.botType === "olivier" ? "/olivier-bot.svg" : agent.botType === "clara" ? "/clara-bot.svg" : "/max-bot.svg"}
                    alt={agent.name}
                    width={112}
                    height={112}
                    className="w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{agent.name.split(" ")[0]}</h3>
                <p className="text-blue-200 text-sm">{agent.name.split(" ")[1]}</p>
              </motion.div>
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
