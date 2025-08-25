import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ChatGPTMicAnimation({ text = "Enregistrement...", amplitude = [], color = "bg-blue-400/80" }) {
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
        {/* Animation de la voix façon ChatGPT */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/3 flex gap-1 items-end h-8 w-32">
          {levels.map((lvl, i) => (
            <motion.div
              key={i}
              className={`w-3 rounded-full ${color}`}
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
