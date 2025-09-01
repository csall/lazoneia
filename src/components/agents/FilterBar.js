import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Nouveau filtre moderne : contrôle segmenté animé (sans menu déroulant)
// Props conservées pour compatibilité.
export default function FilterBar({ filter, setFilter, agents, favorites }) {
  const counts = useMemo(() => ({
    all: agents.length,
    favorites: agents.filter(a => favorites.includes(a.name)).length,
    marketing: agents.filter(a => a.category === "marketing").length,
    communication: agents.filter(a => a.category === "communication").length,
  }), [agents, favorites]);

  const options = useMemo(() => ([
    { value: "all", label: "Tous", icon: "grid", grad: "from-blue-500 via-indigo-500 to-purple-600" },
    { value: "favorites", label: "Favoris", icon: "star", grad: "from-amber-400 via-orange-400 to-pink-500" },
    { value: "marketing", label: "Marketing", icon: "megaphone", grad: "from-fuchsia-500 via-pink-500 to-rose-600" },
    { value: "communication", label: "Com", icon: "chat", grad: "from-sky-500 via-cyan-400 to-teal-400" },
  ]), []);

  const currentIndex = options.findIndex(o => o.value === filter) ?? 0;

  // Refs & indicator metrics for horizontal scroll version
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const itemRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const key = filter;
    const el = itemRefs.current[key];
    const track = trackRef.current;
    if (el && track) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [filter]);

  // Update indicator on filter change & resize
  useEffect(() => { updateIndicator(); }, [updateIndicator, options.length]);
  useEffect(() => {
    // Re-measure after fonts/images load
    const onLoad = () => updateIndicator();
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [updateIndicator]);
  useEffect(() => {
    const fn = () => updateIndicator();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [updateIndicator]);

  // Scroll active into view smoothly on mobile only
  useEffect(() => {
    const el = itemRefs.current[filter];
    if (el && scrollRef.current && window.innerWidth < 768) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [filter]);

  // Drag to scroll (mobile)
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    let isDown = false; let startX = 0; let scrollStart = 0; let lockDirection = null;
    const onPointerDown = (e) => {
      if (window.innerWidth >= 768) return; // only mobile
      isDown = true; lockDirection = null;
      startX = e.clientX; scrollStart = scroller.scrollLeft;
      scroller.classList.add('cursor-grabbing');
    };
    const onPointerMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (!lockDirection) {
        if (Math.abs(dx) > 5) lockDirection = 'x';
      }
      if (lockDirection === 'x') {
        scroller.scrollLeft = scrollStart - dx;
      }
    };
    const end = () => { isDown = false; scroller.classList.remove('cursor-grabbing'); };
    scroller.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', end);
    window.addEventListener('pointerleave', end);
    return () => {
      scroller.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointerleave', end);
    };
  }, []);

  const onKey = useCallback((e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    if (e.key === "Home") return setFilter(options[0].value);
    if (e.key === "End") return setFilter(options[options.length - 1].value);
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (currentIndex + dir + options.length) % options.length;
    setFilter(options[next].value);
  }, [currentIndex, options, setFilter]);

  return (
    <div className="w-full flex justify-center mb-1 px-2 sm:px-0 select-none">
      <div className="relative w-full">
        <div
          ref={scrollRef}
          className="relative flex w-auto md:w-full overflow-x-auto md:overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 gap-1 rounded-full px-1 py-0.5 backdrop-blur-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_3px_10px_-4px_rgba(0,0,0,0.55),0_2px_24px_-6px_rgba(56,132,255,0.40)] no-scrollbar touch-pan-x select-none"
          role="tablist"
          aria-label="Filtrer les agents"
          onKeyDown={onKey}
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Track container for indicator positioning */}
          <div ref={trackRef} className="absolute inset-0 pointer-events-none" />
        {/* Halo animé global */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-6 opacity-40"
          style={{ filter: "blur(40px)" }}
          animate={{ opacity: [0.25, 0.55, 0.25], rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full bg-[conic-gradient(at_30%_30%,#3b82f6,#8b5cf6,#ec4899,#f59e0b,#3b82f6)]" />
        </motion.div>

          {/* Indicateur actif glissant (mesuré) */}
          <motion.div
            key="indicator"
            className="absolute z-0 h-8 rounded-full bg-gradient-to-r from-white/14 via-white/10 to-white/5 backdrop-blur-xl border border-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_3px_10px_-4px_rgba(0,0,0,0.55)]"
            initial={false}
            animate={{ left: indicator.left, width: indicator.width }}
            transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.6 }}
            style={{ top: 0 }}
          />

    {options.map((opt, i) => {
          const active = filter === opt.value;
          return (
            <motion.button
              key={opt.value}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${opt.value}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setFilter(opt.value)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -1 }}
      ref={el => { if (el) itemRefs.current[opt.value] = el; }}
              className={`group relative z-10 flex flex-none md:flex-1 md:justify-center items-center gap-1.5 px-2.5 sm:px-3 h-8 rounded-full text-[11px] sm:text-[12px] font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 scroll-mx-2 ${active ? 'text-white' : 'text-white/55 hover:text-white'}`}
              style={{ scrollSnapAlign: 'center' }}
            >
              {/* Gradient accent fine ligne top */}
              {active && (
                <motion.span
                  layoutId={`accent-${opt.value}`}
                  className="absolute left-2 right-2 top-[3px] h-[2px] rounded-full bg-gradient-to-r from-white/70 via-white to-white/70"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <span className="flex items-center gap-1.5">
                <Icon name={opt.icon} active={active} />
                <span className="inline-block leading-none">{opt.label}</span>
              </span>
              <span className={`ml-0.5 -mr-0.5 px-1 py-0.5 rounded-full border text-[9px] leading-none font-semibold transition-all ${active ? 'bg-white/25 border-white/15 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)]' : 'bg-white/5 border-white/10 text-white/55 group-hover:text-white'}`}>{counts[opt.value]}</span>
              {/* Effet gradient de fond spécifique actif */}
              {active && (
                <motion.span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 rounded-full overflow-hidden`}
                >
                  <motion.span
                    className={`absolute inset-0 opacity-60 bg-gradient-to-r ${opt.grad}`}
                    style={{ mixBlendMode: 'overlay' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.65 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.span>
              )}
            </motion.button>
          );
        })}

          {/* Bordure interne subtile */}
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
          {/* Fades gauche/droite */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent md:hidden" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-slate-950/80 via-slate-950/40 to-transparent md:hidden" />
          {/* Scroll snap only mobile */}
          <style>{`@media (max-width: 767px){[role=tablist]{scroll-snap-type:x mandatory;} }`}</style>
        </div>
      </div>
    </div>
  );
}

function Icon({ name, active }) {
  const base = "w-4 h-4 transition-colors";
  const common = active ? "text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.55)]" : "text-white/55 group-hover:text-white";
  switch (name) {
    case 'star':
      return <svg className={`${base} ${common}`} viewBox="0 0 24 24" fill="currentColor"><path d="M11.48 3.5a.6.6 0 011.04 0l2.1 5.07c.07.17.23.29.41.31l5.49.44c.56.04.79.74.36 1.08l-4.18 3.58a.6.6 0 00-.19.6l1.28 5.31a.6.6 0 01-.88.64l-4.66-2.85a.6.6 0 00-.62 0l-4.66 2.85a.6.6 0 01-.88-.64l1.28-5.31a.6.6 0 00-.19-.6L2.12 10.4a.6.6 0 01.36-1.08l5.49-.44c.18-.02.34-.14.41-.31L11.48 3.5z"/></svg>;
    case 'megaphone':
      return <svg className={`${base} ${common}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11v2a1 1 0 001 1h3l6 4V6L7 10H4a1 1 0 00-1 1z" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 6v12" strokeLinecap="round"/></svg>;
    case 'chat':
      return <svg className={`${base} ${common}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'grid':
    default:
      return <svg className={`${base} ${common}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
  }
}
