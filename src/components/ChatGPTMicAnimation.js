import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ChatGPTMicAnimation({ text = "Enregistrement...", amplitude = [] }) {
  const [levels, setLevels] = useState([8, 12, 18, 24, 18, 12, 8]);

  // Simule l'amplitude si aucune donnée réelle n'est fournie
  useEffect(() => {
    if (!amplitude.length) {
      const interval = setInterval(() => {
        setLevels(l => l.map((_, i) => 8 + Math.round(Math.random() * 24)));
      }, 120);
      return () => clearInterval(interval);
    } else {
      setLevels(amplitude);
    }
  }, [amplitude]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30" style={{ pointerEvents: 'none' }}>
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Cercles pulsants centrés */}
        <motion.span
          className="absolute left-1/2 top-1/2 w-16 h-16 rounded-full bg-indigo-400/30 blur-2xl"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
        <motion.span
          className="absolute left-1/2 top-1/2 w-28 h-28 rounded-full bg-violet-400/20 blur-3xl"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        />
        <motion.span
          className="absolute left-1/2 top-1/2 w-40 h-40 rounded-full bg-indigo-500/10 blur-2xl"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        {/* Micro SVG stylisé */}
  {/* Micro SVG et texte supprimés, seule l'animation d'amplitude est affichée */}
        {/* Ondes animées */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-32 h-32 rounded-full border-2 border-indigo-300/40"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 w-44 h-44 rounded-full border-2 border-violet-300/30"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
        />
        {/* Animation de la voix façon ChatGPT */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/3 flex gap-1 items-end h-8 w-32">
          {levels.map((lvl, i) => (
            <motion.div
              key={i}
              className="w-3 rounded-full bg-indigo-400/80"
              animate={{ height: lvl }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              style={{ minHeight: 8, maxHeight: 32 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
