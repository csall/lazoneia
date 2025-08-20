import { motion } from "framer-motion";

export default function LingoWaveBackground() {
  return (
    <motion.div
      className="absolute inset-0 -z-10 w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="lingo-gradient" x1="0" y1="0" x2="1440" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="0.5" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,160L60,149.3C120,139,240,117,360,138.7C480,160,600,224,720,229.3C840,235,960,181,1080,154.7C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="url(#lingo-gradient)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ filter: "blur(12px)", opacity: 0.7 }}
        />
      </svg>
      {/* Particules animées */}
      <motion.div
        className="absolute left-1/2 top-1/3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: 0.5 }}
        transition={{ repeat: Infinity, duration: 3 }}
        style={{ filter: "blur(8px)" }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="40" fill="#fbbf24" opacity="0.2" />
          <circle cx="60" cy="60" r="25" fill="#a78bfa" opacity="0.3" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
