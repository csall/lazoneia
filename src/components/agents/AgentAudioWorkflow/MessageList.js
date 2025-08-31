import React from "react";
import { motion } from "framer-motion";

export default function MessageList({ messages, colors, lastBotMsgRef, resultRef, handleCopy, copiedIdx, deleteMessage }) {
  // Header et input height fixes (à ajuster si besoin)
  const headerHeight = 80;
  const inputHeight = 80;

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
      className="w-full flex justify-center px-3 sm:px-8"
      style={{
        position: 'absolute',
        top: headerHeight+50,
        bottom: inputHeight+150,
        left: 0,
        right: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        background: 'transparent',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE 10+
      }}
    >
      {/* Masque le scroll bar visuellement */}
      <style>{`
        .w-full::-webkit-scrollbar { display: none; }
        @media (min-width: 640px) {
          .message-bubble {
            font-size: 1.08rem !important;
            padding: 22px 28px !important;
            min-height: 56px !important;
          }
        }
      `}</style>
  <div className="w-full max-w-4xl mx-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <svg className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" /></svg>
            <p className="text-sm">La conversation apparaîtra ici.</p>
          </div>
        )}
        {/* Affiche les messages du plus ancien au plus récent */}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-10 group"}`}
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
                className={`inline-block px-4 py-2 rounded-xl shadow-md text-base sm:text-lg relative font-sans message-bubble backdrop-blur-lg bg-white/60 border border-white/30 transition-all duration-300 ${msg.role === "user" ? "text-gray-900 bg-white/95 border border-gray-200 ml-auto" : "text-indigo-900 bg-indigo-50 border border-indigo-100"}`}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  borderRadius: 16,
                  boxShadow: msg.role === "user" ? '0 2px 8px rgba(80,80,180,0.07)' : '0 2px 8px rgba(120,120,255,0.08)',
                  padding: msg.role === "user" ? '8px 14px' : '10px 14px',
                  fontSize: '1.01rem',
                  lineHeight: '1.6',
                  maxWidth: '80vw',
                  background: msg.role === "user" ? "rgba(255,255,255,0.98)" : "rgba(224,231,255,0.98)",
                  marginBottom: '1.2rem',
                  border: msg.role === "user" ? '1px solid #e5e7eb' : '1px solid #c7d2fe',
                  transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
                  marginLeft: msg.role === "user" ? 'auto' : 0,
                  marginRight: msg.role === "bot" ? 'auto' : 0,
                  minWidth: 0,
                  width: 'fit-content',
                  display: 'inline-block',
                }}
              >
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
                      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 cursor-pointer bg-white/80 hover:bg-indigo-100 text-indigo-600 shadow-lg border border-indigo-200 ${copiedIdx === idx ? 'animate-pulse bg-green-100 text-green-700' : ''}`}
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
                      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 cursor-pointer bg-white/80 hover:bg-gray-100 text-gray-500 shadow-lg border border-gray-200"
                      style={{ minWidth: '38px', minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', zIndex: 10 }}
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.08, boxShadow: '0 0 0 4px #6b7280' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <line x1="6" y1="6" x2="18" y2="18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="6" y1="18" x2="18" y2="6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
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
