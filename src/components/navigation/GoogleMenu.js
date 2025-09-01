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
          <motion.div
            key="panel"
            ref={containerRef}
            role="menu"
            aria-label="Menu navigation"
            initial={{ opacity: 0, x: 12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute top-0 right-full mr-3 w-64 max-h-[70vh] rounded-2xl border border-white/12 bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-xl shadow-[0_8px_30px_-5px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <span className="text-xs uppercase tracking-wide text-white/50">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 text-sm"
              >✕</button>
            </div>
            <div className="overflow-y-auto custom-scroll px-2 py-3">
              <ul className="flex flex-col gap-2">
                {filtered.map(item => (
                  <li key={item.link}>
                    <Link
                      href={item.link}
                      onClick={handleSelect}
                      className="group flex items-center gap-3 rounded-xl border border-white/10 hover:border-fuchsia-400/40 bg-white/5 hover:bg-white/10 p-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                    >
                      <motion.span
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-inner shadow-black/40"
                        whileHover={{ rotate: 3 }}
                        whileTap={{ scale: 0.94 }}
                        layoutId={`icon-${item.name}`}
                      >
                        {item.icon}
                      </motion.span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white group-hover:text-fuchsia-100">{item.name}</span>
                          <span className="text-[11px] text-white/50">{item.keywords.split(" ").slice(0,2).join(", ")}</span>
                        </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleMenu;
