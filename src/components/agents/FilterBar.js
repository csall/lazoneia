import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterBar({ filter, setFilter, agents, favorites }) {
  const allCount = agents.length;
  const favoritesCount = agents.filter(a => favorites.includes(a.name)).length;
  const marketingCount = agents.filter(a => a.category === "marketing").length;
  const communicationCount = agents.filter(a => a.category === "communication").length;

  const options = [
    { value: "all", label: "Tous", count: allCount, gradient: "from-blue-500 to-purple-600" },
    { value: "favorites", label: "Favoris", count: favoritesCount, gradient: "from-yellow-400 to-orange-500" },
    { value: "marketing", label: "Marketing", count: marketingCount, gradient: "from-pink-500 to-rose-600" },
    { value: "communication", label: "Communication", count: communicationCount, gradient: "from-indigo-500 to-sky-500" },
  ];

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selected = options.find(o => o.value === filter) || options[0];

  // Fermer au clic extérieur / échappe
  useEffect(() => {
    const onClick = (e) => {
      if (open && containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Gestion clavier sur le bouton (flèches pour naviguer)
  const handleKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "Enter", " ", "Escape"].includes(e.key)) return;
    e.preventDefault();
    if (e.key === "Escape") return setOpen(false);
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " " || e.key === "Enter")) {
      return setOpen(true);
    }
    if (open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      const idx = options.findIndex(o => o.value === selected.value);
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = (idx + dir + options.length) % options.length;
      setFilter(options[next].value);
    }
    if (open && (e.key === "Enter" || e.key === " ")) setOpen(false);
  };

  return (
    <div className="w-full mb-3 sm:mb-5 px-2 sm:px-0 relative z-50 flex justify-center" ref={containerRef}>
      <motion.div layout className="relative inline-block w-full sm:w-56">
        {/* Bouton principal (combobox) */}
        <motion.button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          onKeyDown={handleKeyDown}
          className={`group w-full relative cursor-pointer rounded-md border border-white/15 backdrop-blur-xl px-2.5 py-1.5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_6px_-2px_rgba(0,0,0,0.5),0_0_12px_-4px_rgba(59,130,246,0.3)] focus:outline-none focus:ring-1 focus:ring-blue-400/40 transition-all overflow-hidden`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
        {/* Halo animé */}
        <motion.div
          className={`absolute inset-0 rounded-md opacity-40 bg-gradient-to-r ${selected.gradient}`}
          style={{ filter: "blur(12px)" }}
          animate={{ opacity: open ? [0.4, 0.8, 0.4] : 0.5 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Overlay verre */}
        <div className="absolute inset-0 rounded-lg bg-slate-900/60 backdrop-blur-xl border border-white/10" />
        {/* Brillance diagonale */}
        <motion.div
          className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-25"
          style={{
            background: "linear-gradient(120deg, rgba(255,255,255,0.15), rgba(255,255,255,0), rgba(255,255,255,0.15))",
            mixBlendMode: "overlay"
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%" ] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative flex items-center justify-between gap-2.5">
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] uppercase tracking-wider text-blue-300/70 font-semibold">Filtre</span>
            <span className="text-[13px] sm:text-sm font-semibold text-white flex items-center gap-1">
              {selected.label}
              <span className="px-1 py-0.5 rounded-full text-[9px] bg-white/10 text-blue-100 font-medium border border-white/10">
                {selected.count}
              </span>
            </span>
          </div>
          <motion.span
            className="flex items-center justify-center w-6 h-6 rounded-sm border border-white/15 bg-white/5 backdrop-blur-md"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-200">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </div>
        {/* Surlignage animé bas */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-1 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
          initial={{ width: "15%" }}
          animate={{ width: open ? "60%" : "40%" }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
        />
        </motion.button>

        {/* Liste déroulante avec animation de hauteur (espace dynamique) */}
  <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              key="dropdown"
              role="listbox"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="mt-1.5 w-full overflow-hidden rounded-xl bg-transparent relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl" />
              <div className="absolute inset-0 rounded-2xl opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.35),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.35),transparent_60%)]" />
              {options.map((opt, i) => {
                const active = opt.value === filter;
                return (
                  <motion.li
                    key={opt.value}
                    role="option"
                    aria-selected={active}
                    onClick={() => { setFilter(opt.value); setOpen(false); }}
                    tabIndex={-1}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * i }}
                    className={`group relative flex items-center justify-between gap-2.5 px-2.5 py-1.5 cursor-pointer select-none text-[12px] ${active ? "text-white" : "text-blue-100/80 hover:text-white"}`}
                  >
                    {active && (
                      <motion.div
                        layoutId="filter-active-bg"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${opt.gradient} opacity-60`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col leading-tight">
                      <span className="text-[12px] font-medium tracking-wide">{opt.label}</span>
                      <span className="text-[8px] uppercase tracking-wider text-blue-300/70 font-medium">{opt.count} éléments</span>
                    </div>
                    <div className="relative flex items-center gap-2">
                      {active && (
                        <motion.span
                          layoutId="filter-check"
                          className="flex items-center justify-center w-4.5 h-4.5 rounded bg-white/20 border border-white/20"
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.span>
                      )}
                      {!active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/40 group-hover:bg-blue-300 transition-colors" />
                      )}
                      <span className="px-1 py-0.5 rounded-full text-[9px] bg-white/10 text-blue-100 font-medium border border-white/10">{opt.count}</span>
                    </div>
                  </motion.li>
                );
              })}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-gradient-to-t from-blue-500/30 to-transparent blur-2xl pointer-events-none" />
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
