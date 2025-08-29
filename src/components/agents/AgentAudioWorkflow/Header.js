import GoogleMenu from "@/components/navigation/GoogleMenu";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ branding, botImage, tagline, targetLang, handleLanguageChange, colors, messages, clearHistory }) {
  return (
    <header className="z-50 py-3 px-4 fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-900/80 via-violet-900/70 to-transparent animate-gradient-move backdrop-blur-2xl shadow-2xl border-b border-indigo-900/20">
      <div className="container mx-auto flex justify-between items-center gap-4">
        {/* Flèche retour en haut à droite, visible uniquement sur desktop */}
        <div className="hidden md:flex items-center justify-end w-16">
          <Link href="/" replace>
            <motion.button
              className={`w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-lg hover:bg-white/20 transition-colors relative overflow-hidden`}
              whileHover={{ scale: 1.12, x: 4, boxShadow: '0 0 0 6px #6366f1' }}
              whileTap={{ scale: 0.92, rotate: -8 }}
              aria-label="Retour à l'accueil"
            >
              <span className="absolute inset-0 pointer-events-none">
                <motion.span
                  className="block w-full h-full bg-gradient-to-br from-indigo-400/30 to-violet-400/30 rounded-full blur-xl opacity-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${colors.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" initial={{ x: 0 }} animate={{ x: 0 }} whileHover={{ x: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />
              </svg>
            </motion.button>
          </Link>
        </div>
  <div className="flex items-center gap-4 flex-1 justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="relative"
          >
            <Image src={branding?.botImage || botImage} alt={branding?.name} width={48} height={48} className="w-12 h-12 rounded-full drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] border-2 border-white/30 bg-gradient-to-br from-indigo-500/30 to-violet-500/30" priority />
            <motion.div className="absolute inset-0 rounded-full pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 0.18 }} transition={{ duration: 0.4 }} style={{ background: 'radial-gradient(circle, #a5b4fc 0%, #c4b5fd 100%)', filter: 'blur(8px)' }} />
          </motion.div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-white drop-shadow-lg">{branding?.name}</div>
              {tagline && (<motion.span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-700/80 text-indigo-100 ml-2 drop-shadow animate-gradient-move" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }}>{tagline}</motion.span>)}
              <motion.select id="language-select-header" value={targetLang} onChange={handleLanguageChange} className={`px-2 py-1 rounded-lg border ${colors.borderColor} bg-gray-900 ${colors.textColor} focus:ring focus:outline-none transition-all text-xs cursor-pointer ml-2`} style={{ background: `#E3DEDE` }} whileFocus={{ scale: 1.05, boxShadow: '0 0 0 4px #6366f1' }} whileHover={{ scale: 1.04 }}>
                <option value="français">FR</option>
                <option value="anglais">EN</option>
                <option value="espagnol">ES</option>
                <option value="allemand">DE</option>
                <option value="italien">IT</option>
                <option value="wolof">WO</option>
                <option value="portuguais">PT</option>
              </motion.select>
              <AnimatePresence>
                {messages.length > 0 && (
                  <motion.button
                    onClick={clearHistory}
                    className="p-2 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-red-600 transition cursor-pointer ml-2 relative overflow-hidden"
                    title="Supprimer tout l'historique"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    whileTap={{ scale: 0.85, rotate: 12 }}
                    whileHover={{ scale: 1.12, boxShadow: '0 0 0 6px #ef4444' }}
                  >
                    <span className="absolute inset-0 pointer-events-none">
                      <motion.span
                        className="block w-full h-full bg-gradient-to-br from-red-400/30 to-red-600/30 rounded-full blur-xl opacity-0"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.18 }}
                        transition={{ duration: 0.4 }}
                      />
                    </span>
                    <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0 }}
                      whileTap={{ rotate: 24 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6m5 10v-6" initial={{ y: 0 }} animate={{ y: 0 }} whileHover={{ y: -2 }} />
                    </motion.svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              <motion.span className="text-[10px] text-white/80 max-w-xs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }}>{branding?.description}</motion.span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }} whileHover={{ scale: 1.08 }}>
            <GoogleMenu />
          </motion.div>
        </div>
      </div>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradientMove 6s ease-in-out infinite alternate;
        }
      `}</style>
    </header>
  );
}
