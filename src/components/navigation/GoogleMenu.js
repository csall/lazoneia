"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const GoogleMenu = () => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  const items = [
    {
      name: "Accueil",
      link: "/",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v10h14V10" />
        </svg>
      ),
      keywords: "home accueil start"
    },
    {
      name: "À propos",
      link: "/a-propos",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      keywords: "about apropos info"
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16v12H5.17L4 17.17V4Z" />
          <path d="m4 4 8 7 8-7" />
        </svg>
      ),
      keywords: "contact email message"
    }
  ];

  const filtered = items; // pas de recherche mobile

  // Fermer en cliquant hors du panneau
  useEffect(() => {
    const handler = (e) => {
      if (open && containerRef.current && !containerRef.current.contains(e.target) && !triggerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Rendre le focus au bouton quand on ferme
  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);

  const handleSelect = useCallback(() => setOpen(false), []);

  return (
    <div className="relative z-50">
      <motion.button
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group w-10 h-10 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl flex items-center justify-center text-white/80 hover:text-white shadow-[0_0_0_0_rgba(255,255,255,0.3)] hover:shadow-[0_0_0_4px_rgba(255,255,255,0.07)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="grid grid-cols-3 gap-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-fuchsia-400 via-purple-400 to-indigo-400 opacity-80 group-hover:opacity-100"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>
        <span className="sr-only">Ouvrir le menu</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="topbar"
            ref={containerRef}
            role="menubar"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed top-0 left-0 right-0 z-[60] flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-fuchsia-600/30 via-purple-700/30 to-indigo-700/30 backdrop-blur-xl border-b border-white/15 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]"
          >
            <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {filtered.map(item => (
                <Link
                  key={item.link}
                  href={item.link}
                  onClick={handleSelect}
                  className="relative group flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-fuchsia-400/40 transition-colors"
                >
                  <motion.span
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white text-[11px] shadow-inner shadow-black/40"
                    whileHover={{ rotate: 4 }}
                    whileTap={{ scale: 0.92 }}
                    layoutId={`icon-${item.name}`}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="text-xs font-medium text-white whitespace-nowrap group-hover:text-fuchsia-100 tracking-wide">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
            <motion.button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 hover:text-white"
            >
              ✕
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleMenu;
