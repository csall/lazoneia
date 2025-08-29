import React from "react";

export default function MessageList({ messages, colors, lastBotMsgRef, resultRef, handleCopy, copiedIdx, deleteMessage }) {
  // Header et input height fixes (à ajuster si besoin)
  const headerHeight = 80;
  const inputHeight = 80;

  // Scroll automatique sur le dernier message du bot
  React.useEffect(() => {
    if (lastBotMsgRef && lastBotMsgRef.current) {
      lastBotMsgRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
      className="w-full relative"
      style={{
        position: 'absolute',
        top: headerHeight,
        bottom: inputHeight+200,
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
      `}</style>
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-300">
          <svg className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" /></svg>
          <p className="text-sm">La conversation apparaîtra ici.</p>
        </div>
      )}
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-6 group"}`}
          style={{
            marginLeft: msg.role === "user" ? "auto" : 0,
            marginRight: msg.role === "bot" ? "auto" : 0,
            maxWidth: '100%',
            width: '100%',
            position: 'relative',
          }}
        >
          <div className="flex items-start w-full">
            <div
              ref={msg.role === 'bot' && idx === messages.length - 1 ? lastBotMsgRef : null}
              className={`max-w-[90vw] sm:max-w-[60vw] px-4 py-3 rounded-2xl shadow-lg text-base sm:text-lg relative ${msg.role === "user" ? "bg-white text-gray-900 border border-gray-200" : `${colors.responseBg} text-white border border-indigo-200"}`}`}
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                marginLeft: msg.role === "user" ? "auto" : 0,
                marginRight: msg.role === "bot" ? "auto" : 0,
                borderRadius: 18,
                boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
                padding: '18px 22px',
                fontSize: '1.08rem',
                lineHeight: '1.7',
                maxWidth: '90vw',
                background: msg.role === "user" ? "#fff" : undefined,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                minHeight: '48px',
              }}
            >
              <span style={{flex: 1, width: '100%'}}>
                {msg.role === "bot" && msg.text === "__loading__" ? (
                  <span className="inline-block animate-pulse text-2xl">•</span>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                )}
              </span>
              {/* Ligne d'action en bas à droite, sans doublon */}
              <div className="flex gap-2 mt-4">
                {msg.role === "bot" && msg.text !== "__loading__" && (
                  <button type="button" onClick={() => handleCopy(msg.text, idx)} aria-label="Copier le message"
                    className={`p-2 rounded-full focus:outline-none focus:ring text-base transition cursor-pointer bg-white border border-indigo-300 shadow hover:bg-indigo-50 hover:text-indigo-800 ${copiedIdx === idx ? 'animate-pulse bg-green-100 text-green-700' : 'text-indigo-600'}`}
                    style={{ minWidth: '36px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}
                  >
                    {copiedIdx === idx ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
