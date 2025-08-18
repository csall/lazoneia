"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useImagePath, normalizeImagePath } from "@/hooks/useImagePath";

// Composant de menu style Google
const GoogleMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { getImagePath } = useImagePath();

  // Liste des applications/options du menu
  const menuItems = [
    { name: "Accueil", icon: "globe.svg", link: "/" },
    { name: "À propos", icon: "file.svg", link: "/a-propos" },
    { name: "Contact", icon: "window.svg", link: "/contact" },
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
        <div className="grid grid-cols-3 gap-1 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
          ))}
        </div>
      </motion.button>

      {/* Menu déroulant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            className="absolute right-0 mt-2 p-2 w-64 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
            style={{
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.2)",
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
                    <div className="w-12 h-12 mb-2 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Image
                        src={normalizeImagePath(item.icon)}
                        alt={item.name}
                        width={24}
                        height={24}
                        className="opacity-90 pointer-events-none"
                        unoptimized
                      />
                    </div>
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

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi de formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      {/* Barre de navigation avec menu Google et flèche retour */}
      <div className="flex justify-between items-center w-full fixed top-0 left-0 right-0 z-40 px-4 py-4 bg-gradient-to-b from-blue-900/80 to-transparent backdrop-blur-sm">
        {/* Flèche de retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/">
            <motion.button
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Retour à l'accueil"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
        
        {/* Menu style Google en haut à droite */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GoogleMenu />
        </motion.div>
      </div>
      
      {/* Espace pour compenser la barre de navigation fixe */}
      <div className="h-16"></div>
      
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Contactez-nous
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Une question, une suggestion ou besoin d&apos;une démo ? Notre équipe est à votre écoute.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-1 gap-12 max-w-xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-green-700/40 to-teal-700/40 p-8 rounded-3xl backdrop-blur-md shadow-lg border border-green-500/20 h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="bg-green-500/30 p-4 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Message envoyé !</h2>
                  <p className="text-blue-100 mb-6">
                    Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-blue-200 mb-2">Nom</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-blue-900/50 border border-blue-700/50 rounded-lg py-3 px-4 text-white placeholder-blue-300 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 focus:outline-none transition"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-blue-200 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-blue-900/50 border border-blue-700/50 rounded-lg py-3 px-4 text-white placeholder-blue-300 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 focus:outline-none transition"
                      placeholder="votre.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-blue-200 mb-2">Sujet</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-blue-900/50 border border-blue-700/50 rounded-lg py-3 px-4 text-white placeholder-blue-300 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 focus:outline-none transition"
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-blue-200 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-blue-900/50 border border-blue-700/50 rounded-lg py-3 px-4 text-white placeholder-blue-300 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 focus:outline-none transition resize-none"
                      placeholder="Votre message ici..."
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex justify-center items-center"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        "Envoyer"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  );
}
