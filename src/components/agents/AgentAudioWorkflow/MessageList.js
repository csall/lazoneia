import React from "react";

export default function MessageList({ messages, colors, lastBotMsgRef, resultRef, handleCopy, copiedIdx, deleteMessage }) {
  const [headerHeight, setHeaderHeight] = React.useState(80);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const headerBar = document.querySelector('header');
      if (headerBar && headerBar.offsetHeight) {
        setHeaderHeight(headerBar.offsetHeight);
      }
    }
  }, []);
  return (
    <div ref={resultRef} className={`flex-1 overflow-y-auto px-4 py-3 pt-[80px] pb-[110px]`} style={{ WebkitOverflowScrolling: "touch" }}>
      {/* Espace imaginaire en haut pour le scroll, égal à la hauteur du header */}
      <div style={{height: headerHeight + 'px'}}></div>
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-300">
          <svg className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" /></svg>
          <p className="text-sm">La conversation apparaîtra ici.</p>
        </div>
      )}
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2 group"}`}>
          <div className="flex items-start">
            <button onClick={() => deleteMessage(idx)} className="mr-2 mt-1 text-gray-400 hover:text-red-500 transition cursor-pointer" title="Supprimer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-sm relative ${msg.role === "user" ? "bg-white text-gray-900" : `${colors.responseBg} text-white border ${colors.responseBorder}`}`}
              style={msg.role === "user" ? {whiteSpace: 'pre-wrap', wordBreak: 'break-word'} : {}}>
              {msg.role === "bot" && msg.text === "__loading__" ? (
                <span className="inline-block animate-pulse text-2xl">•</span>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              )}
              {msg.role === "bot" && msg.text !== "__loading__" && (
                <div className="flex justify-end mt-1">
                  <button type="button" onClick={() => handleCopy(msg.text, idx)} aria-label="Copier le message" className={`relative p-1 rounded focus:outline-none focus:ring text-xs transition cursor-pointer ${copiedIdx === idx ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-indigo-600'}`}
                    onMouseEnter={e => {
                      const tooltip = document.createElement('span');
                      tooltip.textContent = 'Copier';
                      tooltip.className = 'absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap z-10';
                      tooltip.style.pointerEvents = 'none';
                      tooltip.setAttribute('id', 'copy-tooltip-' + idx);
                      e.currentTarget.appendChild(tooltip);
                    }}
                    onMouseLeave={e => {
                      const tooltip = e.currentTarget.querySelector('#copy-tooltip-' + idx);
                      if (tooltip) e.currentTarget.removeChild(tooltip);
                    }}
                  >
                    {copiedIdx === idx ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* Ajoute un espace imaginaire à la fin de la dernière réponse du bot, égal à la hauteur de l'input */}
      {(() => {
        if (messages.length > 0 && messages[messages.length-1].role === 'bot') {
          const inputBar = typeof window !== 'undefined' ? document.querySelector('form') : null;
          const inputHeight = inputBar && inputBar.offsetHeight ? inputBar.offsetHeight : 110;
          return <div style={{height: inputHeight + 'px'}}></div>;
        }
        return null;
      })()}
    </div>
  );
}
