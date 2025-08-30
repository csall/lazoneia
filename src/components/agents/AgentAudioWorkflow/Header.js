import GoogleMenu from "@/components/navigation/GoogleMenu";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ branding, botImage, tagline, targetLang, handleLanguageChange, colors, messages, clearHistory }) {
  return (
    <header
      className={`z-50 py-3 px-4 fixed top-0 left-0 w-full backdrop-blur-2xl shadow-2xl border-b ${colors.border || 'border-indigo-900/20'} ${colors.bg || 'bg-gradient-to-r from-indigo-900/80 via-violet-900/70 to-transparent animate-gradient-move'}`}
      style={colors.bg ? { background: undefined } : {}}
    >
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
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${colors.textColor || 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" initial={{ x: 0 }} animate={{ x: 0 }} whileHover={{ x: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />
              </svg>
            </motion.button>
          </Link>
        </div>
  <div className="flex items-center gap-4 flex-1 justify-center">
          <Link href="/" replace>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.08, boxShadow: '0 0 0 8px #6366f1' }}
              whileTap={{ scale: 0.92, rotate: -8 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              className="relative cursor-pointer"
              aria-label="Retour à l'accueil"
            >
              <Image src={branding?.botImage || botImage} alt={branding?.name} width={48} height={48} className={`w-12 h-12 rounded-full drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] border-2 ${colors.border || 'border-white/30'} ${colors.bg ? '' : 'bg-gradient-to-br from-indigo-500/30 to-violet-500/30'}`} priority />
              <motion.div className="absolute inset-0 rounded-full pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 0.18 }} transition={{ duration: 0.4 }} style={{ background: 'radial-gradient(circle, #a5b4fc 0%, #c4b5fd 100%)', filter: 'blur(8px)' }} />
            </motion.div>
          </Link>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className={`text-lg font-bold ${colors.textColor || 'text-white'} drop-shadow-lg`}>{branding?.name}</div>
              {tagline && (<motion.span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.button || 'bg-indigo-700/80'} ${colors.textColor || 'text-indigo-100'} ml-2 drop-shadow animate-gradient-move`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }}>{tagline}</motion.span>)}
              {/* ...bouton supprimer l'historique supprimé... */}
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
