"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const GoogleMenu = () => {
  const [open, setOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState('desktop'); // 'mobile' | 'desktop'
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const pathname = usePathname();
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

  // Items mis en mémoire pour éviter une nouvelle référence à chaque rendu (sinon useCallback redéclenché en boucle)
  const items = useMemo(() => [
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
  ], []);

  const filtered = items; // pas de recherche mobile

  // Détection responsive initiale + resize
  useEffect(() => {
    const decide = () => {
      const w = window.innerWidth;
      setLayoutMode(w < 640 ? 'mobile' : 'desktop');
    };
    decide();
    window.addEventListener('resize', decide);
    return () => window.removeEventListener('resize', decide);
  }, []);

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

  // Met à jour l'indicateur actif
  const updateIndicator = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const activeIndex = filtered.findIndex(it => (it.link === '/' ? pathname === '/' : pathname.startsWith(it.link)));
    if (activeIndex === -1) {
      setIndicator(prev => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pr = scroller.getBoundingClientRect();
    const left = r.left - pr.left + scroller.scrollLeft;
    setIndicator(prev => {
      if (prev.left === left && prev.width === r.width && prev.visible) return prev; // éviter setState inutile
      return { left, width: r.width, visible: true };
    });
    const centerOffset = left + r.width / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left: Math.max(0, centerOffset), behavior: 'smooth' });
  }, [filtered, pathname]);

  // Màj indicateur quand open ou pathname change
  useEffect(() => { if (open) { const t = setTimeout(updateIndicator, 60); return () => clearTimeout(t); } }, [open, updateIndicator]);
  useEffect(() => { if (open) updateIndicator(); }, [pathname, open, updateIndicator]);
  useEffect(() => {
    const onResize = () => { if (open) updateIndicator(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, updateIndicator]);

  const isAgentPage = pathname.startsWith('/agent/');
  // Variante verticale forcée sur toutes les pages agent (mobile + desktop)
  const verticalVariant = isAgentPage; // toujours vertical pour agent

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
        {open && !verticalVariant && (
          <motion.nav
            key="topbar"
            ref={containerRef}
            role="menubar"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={[
              'fixed inset-x-0 z-[60] flex gap-3',
              layoutMode === 'mobile' ? 'top-0 items-stretch px-2 pt-[max(env(safe-area-inset-top),0.35rem)] pb-2' : 'top-0 items-center px-4 py-2',
              'bg-gradient-to-r from-fuchsia-600/30 via-purple-700/30 to-indigo-700/30 backdrop-blur-xl border-b border-white/15 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]',
              isAgentPage && layoutMode==='mobile' ? 'backdrop-saturate-150' : ''
            ].join(' ')}
            style={layoutMode==='desktop' ? {justifyContent:'center'}:undefined}
          >
            {/* Animated ambient gradient */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_60%),radial-gradient(circle_at_80%_30%,rgba(255,0,255,0.12),transparent_55%),radial-gradient(circle_at_50%_80%,rgba(0,180,255,0.12),transparent_55%)]"
              animate={{ opacity:[0.35,0.55,0.35] }}
              transition={{ duration:9, repeat:Infinity, ease:"easeInOut" }}
            />
            {/* Subtle noise */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.4\'/></svg>')]" />
            <div
              ref={scrollRef}
              className={[
                'relative flex items-center gap-2 overflow-x-auto scrollbar-hide',
                layoutMode==='desktop' ? 'flex-1 max-w-4xl' : 'w-full'
              ].join(' ')}
              style={{scrollSnapType:'x proximity'}}
            >
              {/* Indicateur actif */}
              {indicator.visible && (
                <motion.div
                  key="indicator"
                  className="absolute top-1/2 -translate-y-1/2 h-9 rounded-full bg-gradient-to-r from-fuchsia-500/25 via-purple-500/20 to-indigo-500/25 backdrop-blur-md border border-fuchsia-400/30 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_12px_-4px_rgba(0,0,0,0.5)]"
                  animate={{ left: indicator.left, width: indicator.width }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ left: indicator.left, width: indicator.width }}
                />
              )}
              {filtered.map((item, idx) => (
                <Link
                  key={item.link}
                  href={item.link}
                  onClick={handleSelect}
                  ref={el => { itemRefs.current[idx] = el; }}
                  className={`relative group flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-colors border backdrop-blur-sm scroll-snap-align-start ${ (item.link==='/'? pathname==='/' : pathname.startsWith(item.link)) ? 'bg-white/15 border-fuchsia-400/40 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_10px_-4px_rgba(0,0,0,0.5)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-fuchsia-400/30'}`}
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
        {open && verticalVariant && (
          <motion.nav
            key="vertical"
            ref={containerRef}
            role="menu"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed top-20 right-4 z-[70] w-64 max-h-[70vh] flex flex-col gap-2 p-3 rounded-2xl bg-gradient-to-br from-fuchsia-800/75 via-purple-900/70 to-indigo-900/70 backdrop-blur-2xl border border-white/15 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.55)] overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none opacity-35 mix-blend-screen bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.18),transparent_60%),radial-gradient(circle_at_85%_25%,rgba(255,0,255,0.18),transparent_60%),radial-gradient(circle_at_50%_85%,rgba(0,180,255,0.18),transparent_60%)]" />
            <div className="relative overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-1" style={{ scrollbarWidth:'none' }}>
              {filtered.map((item, idx) => {
                const active = (item.link === '/' ? pathname === '/' : pathname.startsWith(item.link));
                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    onClick={handleSelect}
                    ref={el => { itemRefs.current[idx] = el; }}
                    className={`relative group flex items-center gap-3 px-3 py-2 rounded-xl transition-colors border ${active ? 'bg-white/15 border-fuchsia-400/40 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_10px_-4px_rgba(0,0,0,0.5)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-fuchsia-400/30'}`}
                    role="menuitem"
                  >
                    <span className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white text-[11px] shadow-inner shadow-black/40">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium text-white whitespace-nowrap group-hover:text-fuchsia-100 tracking-wide flex-1">{item.name}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_0_3px_rgba(255,255,255,0.15)]" />}
                  </Link>
                );
              })}
            </div>
            <motion.button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white py-2 text-sm"
            >
              ✕ <span className="text-xs uppercase tracking-wide">Fermer</span>
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleMenu;
