import ChatGPTMicAnimation from "../../ChatGPTMicAnimation";
import ChatGPTMicIcon from "../../ChatGPTMicIcon";
import { motion } from "framer-motion";

export default function InputBar({ micState, micAmplitude, isLoading, textareaRef, userInput, setUserInput, handleSubmit, cancelRecording, handleMicClick, colors }) {
  return (
    <form onSubmit={handleSubmit} className={`p-3 bg-gradient-to-r from-black/60 to-transparent backdrop-blur-md shadow-lg fixed bottom-0 left-0 w-full z-50 ${colors.textColor}`} style={{ width: '100vw', zIndex: 100, position: 'fixed', bottom: 0, left: 0, boxShadow: '0 -2px 16px rgba(0,0,0,0.08)', paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
      {micState === "recording" && (
        <ChatGPTMicAnimation amplitude={micAmplitude} text="Enregistrement..." color={colors.responseBg} />
      )}
      <div className="relative flex items-end">
        <div className="relative w-full">
          {micState === "recording" && (
            <button type="button" onClick={cancelRecording} className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-2 shadow border border-gray-300 flex items-center justify-center transition-all duration-200 cursor-pointer absolute left-2 top-1/2 -translate-y-1/2" aria-label="Annuler" style={{ width: 36, height: 36, zIndex: 10 }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
          <textarea
            className={`pl-12 min-h-[44px] max-h-[160px] resize-none rounded-xl p-3 pr-20 border w-full mx-auto text-base sm:text-lg ${colors.responseBorder} focus:${colors.buttonHoverFrom} focus:${colors.buttonHoverTo} focus:ring ${colors.buttonHoverFrom}/50 focus:outline-none transition-all duration-200 shadow-lg ${(micState === "recording" || micState === "transcribing") ? "bg-gray-300 text-gray-500" : isLoading ? `${colors.responseBg} text-gray-400` : "bg-white/80 text-gray-900"} ${micState === "transcribing" ? "text-center font-semibold" : ""}`}
            ref={textareaRef}
            value={isLoading ? "" : (micState === "transcribing" ? "Transcription en cours..." : userInput)}
            onChange={e => {
              setUserInput(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onFocus={() => {}}
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={isLoading || micState === "recording" || micState === "transcribing"}
            style={{resize: "none", overflow: "hidden", minHeight: "44px", maxHeight: "160px", boxSizing: 'border-box', paddingBottom: 'env(safe-area-inset-bottom, 20px)', textAlign: micState === "transcribing" ? "center" : undefined, fontSize: '1rem'}}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
            {micState === "recording" ? (
              <>
                <button type="button" onClick={handleMicClick} className="bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-2 shadow border border-green-200 flex items-center justify-center transition-all duration-200 cursor-pointer" aria-label="Valider" style={{ width: 40, height: 40 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </button>
              </>
            ) :
              (!userInput || userInput.trim().length === 0) ? (
                <motion.button type="button" onClick={handleMicClick} className="bg-white/80 hover:bg-indigo-100 text-indigo-700 rounded-full p-2 shadow border border-indigo-200 flex items-center justify-center transition-all duration-200 cursor-pointer" aria-label={micState === "idle" ? "Démarrer l'enregistrement" : micState === "recording" ? "Valider" : "Transcription en cours"} disabled={micState === "transcribing"} style={{ width: 40, height: 40 }}>
                  <ChatGPTMicIcon className="h-6 w-6 opacity-80" />
                </motion.button>
              ) : null
            }
            {micState !== "recording" && (
              <button type="submit" disabled={isLoading || !userInput.trim()} className={`bg-gradient-to-r ${colors.buttonGradientFrom} ${colors.buttonGradientTo} ${colors.buttonHoverFrom} ${colors.buttonHoverTo} text-white font-bold p-2 rounded-full shadow-lg flex items-center justify-center text-xl transition-all duration-300 cursor-pointer align-middle`} style={{ width: 40, height: 40, marginTop: 0, alignSelf: 'center' }}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center ml-2">
          {/* Sélecteur de langue retiré de la zone d'input */}
        </div>
      </div>
    </form>
  );
}
