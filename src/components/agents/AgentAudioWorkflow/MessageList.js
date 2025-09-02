import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function MessageList({ messages, colors, lastBotMsgRef, resultRef, handleCopy, copiedIdx, deleteMessage }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  // Hauteurs de base
  const headerHeight = 80; // hauteur approximative du header
  const inputHeight = 80;  // hauteur approximative de la barre d'input

  // Offsets dynamiques selon viewport (desktop vs mobile) pour éviter les gros espacements sur desktop
  const [layoutOffsets, setLayoutOffsets] = React.useState({ top: headerHeight + 50, bottom: inputHeight + 150 });

  React.useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w >= 1024) { // desktop
        // Ajout d'espace supplémentaire sous les messages pour dégager l'input (demande utilisateur)
        const extraDesktopGap  = 50 ; // espace additionnel
        setLayoutOffsets({ top: headerHeight + 16, bottom: inputHeight + 40 + extraDesktopGap });
      } else if (w >= 640) { // tablette
        setLayoutOffsets({ top: headerHeight + 32, bottom: inputHeight + 80 });
      } else { // mobile
        setLayoutOffsets({ top: headerHeight + 50, bottom: inputHeight + 150 });
      }
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Scroll automatique sur le dernier message du bot
  React.useEffect(() => {
    if (lastBotMsgRef && lastBotMsgRef.current) {
      lastBotMsgRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages, lastBotMsgRef]);

  // Focus automatique sur l'input après chaque réponse du bot
  React.useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'bot') {
      const textarea = document.querySelector('form textarea');
      if (textarea) textarea.focus();
    }
  }, [messages]);

  return (
    <div
      ref={resultRef}
      className="message-scroll w-full flex justify-center px-3 sm:px-8"
      style={{
        position: 'absolute',
        top: layoutOffsets.top,
        bottom: layoutOffsets.bottom,
        left: 0,
        right: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        background: 'transparent',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* Masque le scroll bar visuellement */}
      <style>{`
        .message-scroll::-webkit-scrollbar { width: 10px; }
        .message-scroll::-webkit-scrollbar-track { background: transparent; }
        .message-scroll::-webkit-scrollbar-thumb { background: ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
        .message-scroll::-webkit-scrollbar-thumb:hover { background: ${isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)'}; border: 2px solid transparent; background-clip: content-box; }
        @media (min-width: 640px) {
          .message-bubble {
            font-size: 1.08rem !important;
            padding: 22px 28px !important;
            min-height: 56px !important;
          }
        }
      `}</style>
  <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
        {messages.length === 0 && (
          <div className={`flex flex-col items-center justify-center h-full ${isLight ? 'text-gray-400' : 'text-gray-300'}`}>
            <svg className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" /></svg>
            <p className="text-sm">La conversation apparaîtra ici.</p>
          </div>
        )}
        {/* Affiche les messages du plus ancien au plus récent */}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-10 group`}
            style={{
              marginLeft: msg.role === "user" ? "auto" : 0,
              marginRight: msg.role === "bot" ? "auto" : 0,
              maxWidth: '100%',
              width: '100%',
              position: 'relative',
            }}
          >
            <div className="flex items-end w-full">
              {/* Avatar supprimé pour un look épuré */}
              {/* Bulle glassmorphism + anim */}
              <div
                ref={msg.role === 'bot' && idx === messages.length - 1 ? lastBotMsgRef : null}
                className={`inline-block rounded-xl shadow-md text-base sm:text-lg relative font-sans message-bubble transition-all duration-300 ${msg.role === 'user'
                  ? (isLight
                      ? 'text-gray-900 bg-white/95 border border-gray-200/80'
                      : 'text-white bg-gradient-to-br from-slate-700/60 via-slate-800/60 to-slate-900/60 border border-slate-600/40 backdrop-blur-xl')
                  : (isLight
                      ? 'text-indigo-900 bg-indigo-50/95 border border-indigo-200/70'
                      : 'text-indigo-50 bg-gradient-to-br from-indigo-900/50 via-violet-900/40 to-indigo-950/60 border border-indigo-700/40 backdrop-blur-xl')}
                    ${msg.role === 'user' ? 'ml-auto' : ''}`}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  borderRadius: 16,
                  boxShadow: isLight
                    ? (msg.role === 'user'
                        ? '0 4px 12px -2px rgba(0,0,0,0.06)'
                        : '0 4px 12px -2px rgba(79,70,229,0.15)')
                    : (msg.role === 'user'
                        ? '0 4px 14px -2px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
                        : '0 4px 14px -2px rgba(59,7,100,0.4), 0 0 0 1px rgba(255,255,255,0.04)'),
                  padding: msg.role === "user" ? '10px 16px' : '12px 18px',
                  fontSize: '1.01rem',
                  lineHeight: '1.6',
                  maxWidth: '80vw',
                  backdropFilter: 'blur(18px)',
                  marginBottom: '1.2rem',
                  transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
                  marginLeft: msg.role === "user" ? 'auto' : 0,
                  marginRight: msg.role === "bot" ? 'auto' : 0,
                  minWidth: 0,
                  width: 'fit-content',
                  display: 'inline-block',
                  position: 'relative'
                }}
              >
                {/* Accent glow on hover */}
                <span className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: msg.role === 'user' ? (isLight ? 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6), transparent 70%)' : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 70%)') : (isLight ? 'radial-gradient(circle at 20% 20%, rgba(129,140,248,0.35), transparent 70%)' : 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.25), transparent 75%)'), mixBlendMode: 'overlay' }} />
                <span style={{flex: 1, width: '100%', transition: 'all 0.3s'}}>
                  {msg.role === "bot" && msg.text === "__loading__" ? (
                    <span className="inline-block text-2xl" style={{ display: 'inline-flex', gap: '0.3em' }}>
                      <span className="animate-pulse">•</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>•</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>•</span>
                    </span>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                  )}
                </span>
                {/* Actions bot en bas à gauche, animées */}
                {msg.role === "bot" && msg.text !== "__loading__" && (
                  <div className="flex gap-2 mt-4">
                    <motion.button
                      type="button"
                      onClick={() => handleCopy(msg.text, idx)}
                      aria-label="Copier le message"
                      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 cursor-pointer shadow-lg border ${copiedIdx === idx ? (isLight ? 'animate-pulse bg-green-100 text-green-700 border-green-300' : 'animate-pulse bg-green-600/30 text-green-200 border-green-400/40') : (isLight ? 'bg-white/90 hover:bg-indigo-50 text-indigo-600 border-indigo-200/70' : 'bg-slate-800/70 hover:bg-indigo-900/50 text-indigo-200 border-indigo-600/40')}`}
                      style={{ minWidth: '38px', minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', zIndex: 10 }}
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.08, boxShadow: '0 0 0 4px #6366f1' }}
                    >
                      {copiedIdx === idx ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => deleteMessage(idx)}
                      aria-label="Supprimer le message"
                      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 cursor-pointer shadow-lg border ${isLight ? 'bg-white/90 hover:bg-gray-100 text-gray-500 border-gray-200/70' : 'bg-slate-800/70 hover:bg-slate-700/70 text-gray-300 border-slate-600/40'}`}
                      style={{ minWidth: '38px', minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', zIndex: 10 }}
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.08, boxShadow: '0 0 0 4px #6b7280' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <line x1="6" y1="6" x2="18" y2="18" stroke={isLight ? '#6b7280' : '#d1d5db'} strokeWidth="2" strokeLinecap="round"/>
                        <line x1="6" y1="18" x2="18" y2="6" stroke={isLight ? '#6b7280' : '#d1d5db'} strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
