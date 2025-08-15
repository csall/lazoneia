"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Composant pour chaque carte d'agent
const AgentCard = ({ name, description, image, color, link }) => {
  const cardStyles = {
    olivier: {
      bg: "bg-gradient-to-br from-indigo-900/60 to-violet-900/60",
      border: "border-violet-500/20",
      glow: "from-violet-500 to-indigo-600",
      button: "from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700",
      hover: "group-hover:text-indigo-200"
    },
    clara: {
      bg: "bg-gradient-to-br from-pink-900/60 to-rose-900/60",
      border: "border-pink-500/20",
      glow: "from-pink-500 to-rose-600",
      button: "from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
      hover: "group-hover:text-pink-200"
    },
    max: {
      bg: "bg-gradient-to-br from-blue-900/60 to-sky-900/60",
      border: "border-blue-500/20",
      glow: "from-blue-500 to-sky-600",
      button: "from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700",
      hover: "group-hover:text-blue-200"
    }
  };
  
  const style = cardStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative ${style.bg} backdrop-blur-lg p-8 rounded-3xl shadow-lg border ${style.border} overflow-hidden group w-full md:w-80 lg:w-96 flex flex-col`}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 15px -6px rgba(0, 0, 0, 0.2)" 
      }}
    >
      {/* Background glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${style.glow} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 rounded-3xl`} />
      
      {/* Card content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <motion.div 
          className="h-60 flex items-center justify-center mb-6"
          whileHover={{ scale: 1.05, rotate: [-2, 2, -2], transition: { rotate: { repeat: Infinity, duration: 2 } } }}
        >
          <Image 
            src={image}
            alt={name}
            width={200}
            height={200}
            className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
            priority
          />
        </motion.div>
        
        <h3 className={`text-2xl font-bold mb-3 text-white ${style.hover} transition-colors duration-300`}>
          {name}
        </h3>
        
        <p className="text-gray-300 mb-6 group-hover:text-white transition-colors duration-300 leading-relaxed flex-grow">
          {description}
        </p>
        
        <Link 
          href={link}
          className={`w-full py-3 px-6 bg-gradient-to-r ${style.button} text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mt-auto`}
        >
          <span>Discuter avec {name.split(" ")[0]}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default function AgentsPage() {
  const agents = [
    { 
      name: "Olivier l&apos;humoriste", 
      description: "L&apos;assistant IA qui transforme vos journées en spectacle de stand-up et apporte une touche de légèreté à votre entreprise. Il améliore l&apos;engagement client grâce à son humour personnalisé.", 
      image: "/olivier-bot.svg",
      color: "olivier",
      link: "/olivier"
    },
    { 
      name: "Clara la séductrice", 
      description: "Attire et fidélise vos clients grâce à ses stratégies de communication captivantes et son charme irrésistible. Elle crée des expériences personnalisées qui convertissent les visiteurs en clients fidèles.", 
      image: "/clara-bot.svg",
      color: "clara",
      link: "/clara"
    },
    { 
      name: "Max l&apos;analyste", 
      description: "Expert en données qui transforme les chiffres complexes en insights actionnables. Il identifie les tendances cachées et vous aide à prendre des décisions stratégiques éclairées.", 
      image: "/max-bot.svg",
      color: "max",
      link: "/max"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 animate-gradient-x text-white font-sans">
      {/* Header avec navigation */}
      <header className="py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold text-xl">Retour à l&apos;accueil</span>
          </Link>
        </div>
      </header>

      <section className="relative py-20 text-center px-4 overflow-hidden">
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
          className="relative z-10 container mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-100"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Le Trio IA Irrésistible
          </motion.h1>
          
          <motion.p 
            className="mb-16 max-w-2xl mx-auto text-blue-100 text-xl leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Découvrez Olivier, Clara et Max, une équipe d&apos;agents IA conçue pour transformer votre entreprise avec humour, charme et intelligence analytique.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {agents.map((agent, i) => (
              <AgentCard 
                key={i}
                name={agent.name}
                description={agent.description}
                image={agent.image}
                color={agent.color}
                link={agent.link}
              />
            ))}
          </div>
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
