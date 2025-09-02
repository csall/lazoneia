"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useImagePath, normalizeImagePath } from "@/hooks/useImagePath";
import { useTheme } from "@/components/theme/ThemeProvider";
import GoogleMenu from "@/components/navigation/GoogleMenu";

// ...existing code...

export default function ContactPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
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
    <main className={`min-h-screen ${isLight ? 'text-gray-800 bg-gradient-to-br from-sky-50 via-white to-violet-50' : 'text-white bg-gradient-to-br from-blue-950 via-blue-900 to-purple-950'} transition-colors duration-500 relative overflow-hidden`}>      
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay">
        <div className={`absolute inset-0 ${isLight ? 'bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.25),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(167,139,250,0.25),transparent_60%)]' : 'bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.08),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(167,139,250,0.08),transparent_60%)]'} transition-all duration-700`}></div>
      </div>
      {/* Barre de navigation avec menu Google et flèche retour */}
  <div className="flex justify-between items-center w-full fixed top-0 left-0 right-0 z-40 px-4 py-4 backdrop-blur-sm bg-gradient-to-b from-white/70 to-transparent dark:from-blue-900/70 transition-colors">
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
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${isLight ? 'from-gray-900 to-sky-600' : 'from-white to-blue-200'} transition-colors`}>
              Contactez-nous
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${isLight ? 'text-sky-700/70' : 'text-blue-100'} transition-colors`}>
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
                  className={`p-8 rounded-3xl backdrop-blur-md shadow-lg h-full flex flex-col items-center justify-center text-center border transition-colors ${isLight ? 'bg-gradient-to-br from-green-200/60 to-teal-200/60 border-green-300/50' : 'bg-gradient-to-br from-green-700/40 to-teal-700/40 border-green-500/20'}`}
                >
                  <div className="bg-green-500/30 p-4 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Message envoyé !</h2>
                  <p className={`${isLight ? 'text-gray-600' : 'text-blue-100'} mb-6 transition-colors`}>
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
                    <label htmlFor="name" className={`block mb-2 transition-colors ${isLight ? 'text-sky-700' : 'text-blue-200'}`}>Nom</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-lg py-3 px-4 focus:outline-none transition placeholder-opacity-60 ${isLight ? 'bg-white/70 border border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-300/40 text-gray-800 placeholder-gray-500' : 'bg-blue-900/50 border border-blue-700/50 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 text-white placeholder-blue-300'}`}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={`block mb-2 transition-colors ${isLight ? 'text-sky-700' : 'text-blue-200'}`}>Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-lg py-3 px-4 focus:outline-none transition placeholder-opacity-60 ${isLight ? 'bg-white/70 border border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-300/40 text-gray-800 placeholder-gray-500' : 'bg-blue-900/50 border border-blue-700/50 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 text-white placeholder-blue-300'}`}
                      placeholder="votre.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className={`block mb-2 transition-colors ${isLight ? 'text-sky-700' : 'text-blue-200'}`}>Sujet</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-lg py-3 px-4 focus:outline-none transition placeholder-opacity-60 ${isLight ? 'bg-white/70 border border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-300/40 text-gray-800 placeholder-gray-500' : 'bg-blue-900/50 border border-blue-700/50 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 text-white placeholder-blue-300'}`}
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className={`block mb-2 transition-colors ${isLight ? 'text-sky-700' : 'text-blue-200'}`}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`w-full rounded-lg py-3 px-4 focus:outline-none transition placeholder-opacity-60 resize-none ${isLight ? 'bg-white/70 border border-sky-200 focus:border-sky-400 focus:ring focus:ring-sky-300/40 text-gray-800 placeholder-gray-500' : 'bg-blue-900/50 border border-blue-700/50 focus:border-indigo-400 focus:ring focus:ring-indigo-300/50 text-white placeholder-blue-300'}`}
                      placeholder="Votre message ici..."
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex justify-center items-center"
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
