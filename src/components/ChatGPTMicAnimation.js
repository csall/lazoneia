import { motion } from "framer-motion";

export default function ChatGPTMicAnimation({ text = "Enregistrement en cours..." }) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-30" style={{ pointerEvents: 'none' }}>
      {/* Cercles pulsants */}
      <motion.span
        className="absolute w-16 h-16 rounded-full bg-indigo-400/30 blur-2xl"
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
      <motion.span
        className="absolute w-28 h-28 rounded-full bg-violet-400/20 blur-3xl"
        animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      />
      <motion.span
        className="absolute w-40 h-40 rounded-full bg-indigo-500/10 blur-2xl"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      {/* Micro SVG stylisé */}
      <div className="relative z-10 flex flex-col items-center">
        <svg className="h-10 w-10 text-white drop-shadow-lg animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor" />
          <rect x="7" y="15" width="10" height="2" rx="1" fill="currentColor" />
          <rect x="10" y="17" width="4" height="2" rx="1" fill="currentColor" />
        </svg>
        <span className="mt-2 text-base font-bold text-white drop-shadow tracking-wide animate-fade-in">{text}</span>
      </div>
      {/* Ondes animées */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border-2 border-indigo-300/40"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      />
      <motion.div
        className="absolute w-44 h-44 rounded-full border-2 border-violet-300/30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
}
