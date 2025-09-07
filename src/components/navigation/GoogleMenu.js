"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Image from 'next/image';

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

  // Forcer l'affichage vertical sur toutes les pages
  const verticalVariant = true;

  const { theme, toggle } = useTheme();
  const { data: session } = useSession();
  const user = session?.user;
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);

  // Fermer le menu user en cliquant dehors
  useEffect(() => {
    const close = (e) => {
      if (!userMenuOpen) return;
      if (userMenuRef.current && !userMenuRef.current.contains(e.target) && userButtonRef.current && !userButtonRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [userMenuOpen]);

  const handleLogout = useCallback(() => {
    setUserMenuOpen(false);
    signOut();
  }, []);
  return (
    <div className="relative z-50 flex items-center gap-2">
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
      {/* Toggle thème global */}
      <button
        onClick={toggle}
        aria-label="Basculer le thème"
        className={`group relative w-11 h-11 rounded-full flex items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60
          ${theme === 'light' ? 'bg-white shadow-[0_2px_6px_-1px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] text-gray-700 hover:text-gray-900 hover:shadow-[0_4px_14px_-2px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.06)]' : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'} backdrop-blur-xl`}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-400/0 via-purple-400/0 to-indigo-400/0 group-hover:from-fuchsia-400/10 group-hover:via-purple-400/10 group-hover:to-indigo-400/10 transition-opacity" />
        {theme === 'light' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M3 12h2m14 0h2M7.06 16.94l1.42-1.42M16.94 7.06l1.42-1.42" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
  </button>
      {user && (
        <div className="relative hidden sm:block">
          <button
            ref={userButtonRef}
            onClick={() => setUserMenuOpen(o => !o)}
            className={`group flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full max-w-[220px] backdrop-blur-xl transition-colors
              ${theme === 'light'
                ? 'bg-white text-gray-700 border border-gray-200 shadow-[0_2px_6px_-1px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.18)]'
                : 'bg-white/10 text-white/90 border border-white/15 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] hover:bg-white/15'}
              focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60`}
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            {user.image ? (
              <Image
                src={user.image}
                width={32}
                height={32}
                alt={user.name || user.email || 'Utilisateur'}
                className={`w-8 h-8 rounded-full object-cover border ${theme === 'light' ? 'border-gray-200' : 'border-white/20'}`}
              />
            ) : (
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shadow-inner shadow-black/30
                ${theme === 'light'
                  ? 'bg-gradient-to-br from-fuchsia-500/90 via-purple-500/90 to-indigo-600/90 text-white'
                  : 'bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600 text-white'}`}
              >
                {(user.name || user.email || '?').charAt(0).toUpperCase()}
              </span>
            )}
            <span className={`text-xs font-medium truncate leading-tight text-left ${theme === 'light' ? 'text-gray-700' : 'text-white/90'}`}>
              {user.name || user.email}
            </span>
            <svg className={`w-3.5 h-3.5 ml-1 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 7l5 6 5-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                ref={userMenuRef}
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-60 p-2 rounded-2xl bg-gradient-to-br from-fuchsia-900/85 via-purple-900/85 to-indigo-900/85 backdrop-blur-2xl border border-white/15 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.55)] flex flex-col gap-1 text-sm"
                role="menu"
              >
                <div className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  {user.image ? (
                    <Image src={user.image} width={36} height={36} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-white/20" />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600 flex items-center justify-center text-[12px] font-semibold text-white shadow-inner shadow-black/30">
                      {(user.name || user.email || '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-medium truncate leading-tight">{user.name || 'Utilisateur'}</span>
                    <span className="text-[11px] text-white/60 truncate leading-tight">{user.email}</span>
                  </div>
                </div>
                {/* Liens Profil & Paramètres retirés */}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/85 hover:text-white hover:bg-rose-500/15 border border-transparent hover:border-rose-400/40 transition text-left" role="menuitem">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-rose-500/70 via-pink-500/70 to-amber-500/70 text-white shadow-inner shadow-black/30">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M10 14 21 3"/><path d="M21 10v11a2 2 0 0 1-2 2h-4"/><path d="M7 21H5a2 2 0 0 1-2-2v-4"/><path d="M3 9V5a2 2 0 0 1 2-2h4"/><path d="M10 3h4"/><path d="M3 10h4"/></svg>
                  </span>
                  Déconnexion
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>
  {/* Variante horizontale supprimée: toujours vertical */}
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
              <div className="mt-2 pt-2 border-t border-white/15 flex flex-col gap-2">
                {!session && (
                  <Link href="/auth/login" onClick={handleSelect} className="relative group flex items-center gap-3 px-3 py-2 rounded-xl transition-colors border bg-white/5 border-white/10 hover:bg-white/10 hover:border-fuchsia-400/30" role="menuitem">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white text-[11px]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M10 14 21 3"/><path d="M21 10v11a2 2 0 0 1-2 2h-4"/><path d="M3 15v-3a4 4 0 0 1 4-4h4"/><path d="M3 21v-3a4 4 0 0 1 4-4h4"/></svg>
                    </span>
                    <span className="text-sm font-medium text-white flex-1">Se connecter</span>
                  </Link>
                )}
                {session && (
                  <button onClick={() => { signOut(); handleSelect(); }} className="relative group flex items-center gap-3 px-3 py-2 rounded-xl transition-colors border bg-white/5 border-white/10 hover:bg-white/10 hover:border-rose-400/40 text-left" role="menuitem">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 text-white text-[11px]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M10 14 21 3"/><path d="M21 10v11a2 2 0 0 1-2 2h-4"/><path d="M7 21H5a2 2 0 0 1-2-2v-4"/><path d="M3 9V5a2 2 0 0 1 2-2h4"/><path d="M10 3h4"/><path d="M3 10h4"/></svg>
                    </span>
                    <span className="text-sm font-medium text-white flex-1">Se déconnecter</span>
                  </button>
                )}
              </div>
            </div>
            {/* Bouton fermer supprimé selon la demande */}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleMenu;
