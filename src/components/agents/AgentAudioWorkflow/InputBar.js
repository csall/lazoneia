import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function InputBar({
  micState,
  micAmplitude,
  isLoading,
  textareaRef,
  userInput,
  setUserInput,
  handleSubmit,
  cancelRecording,
  handleMicClick,
  colors,
  targetLang,
  handleLanguageChange,
  selectedTone,
  handleToneSelection,
  tones,
  clearHistory, // Ajout de la prop
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderAnim, setPlaceholderAnim] = useState(false);
  const inputRef = textareaRef;

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-end px-2 pb-3 sm:px-0 sm:pb-4"
      style={{
        background: "none",
        boxShadow: "none",
        border: "none",
        minHeight: "72px",
      }}
    >
      <motion.div
        className="flex flex-col items-center w-full max-w-full mx-auto rounded-3xl px-2 py-2 sm:max-w-2xl sm:px-4 sm:py-3 bg-white/60 backdrop-blur-lg shadow-2xl border border-indigo-200"
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        whileFocus={{ boxShadow: '0 0 0 4px #6366f1' }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        style={{
          boxShadow: "0 8px 32px rgba(80,80,180,0.10)",
          background: "rgba(255,255,255,0.7)",
          borderRadius: 24,
          border: '1.5px solid #c7d2fe',
        }}
      >
        {/* Input animé avec bouton envoyer à l'intérieur */}
        <div className="relative w-full">
          <motion.textarea
            ref={inputRef}
            value={
              micState === "recording"
                ? ""
                : micState === "transcribing"
                ? "Transcription en cours..."
                : userInput
            }
            onChange={(e) => {
              setUserInput(e.target.value);
              if (inputRef.current) {
                inputRef.current.style.height = "auto";
                inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
              }
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                userInput.trim().length > 0
              ) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              setPlaceholderAnim(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setPlaceholderAnim(false);
            }}
            disabled={
              isLoading ||
              micState === "recording" ||
              micState === "transcribing"
            }
            rows={1}
            className={`w-full min-h-[44px] max-h-[120px] resize-none rounded-2xl px-4 pr-16 py-3 text-base bg-white/80 text-gray-900 shadow-none border-2 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/80 transition-all duration-300 scrollbar-hide placeholder:italic placeholder:text-indigo-400 placeholder:opacity-80 ${
              micState === "transcribing" ? "text-center font-semibold" : ""
            } sm:text-lg sm:px-5 sm:pr-20 sm:py-4`}
            style={{
              boxSizing: "border-box",
              fontSize: "1.12rem",
              letterSpacing: "0.01em",
              scrollbarWidth: "none",
              fontFamily: 'Inter, ui-sans-serif, system-ui',
              outline: 'none',
              background: 'rgba(255,255,255,0.85)',
              transition: 'all 0.3s cubic-bezier(.4,2,.3,1)',
            }}
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder=''
            animate={{ boxShadow: isFocused ? '0 0 0 2px #6366f1' : '0 2px 16px rgba(60,60,120,0.10)' }}
          />
          {/* Boutons micro, envoyer, annuler et check positionnés à droite dans le textarea */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-3">
            {micState === "recording" ? (
              <>
                <motion.button
                  type="button"
                  onClick={cancelRecording}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full p-3 shadow border border-gray-400 flex items-center justify-center transition-all duration-200 cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Annuler l'enregistrement"
                  style={{ width: 44, height: 44, minWidth: 36, minHeight: 36 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleMicClick}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow border border-green-300 flex items-center justify-center transition-all duration-200 cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Valider l'enregistrement"
                  style={{ width: 44, height: 44, minWidth: 36, minHeight: 36 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.button>
              </>
            ) : (
              <>
                {userInput.trim().length === 0 && (
                  <motion.button
                    type="button"
                    onClick={handleMicClick}
                    disabled={isLoading}
                    className="bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-full p-3 shadow-xl border border-indigo-300 flex items-center justify-center transition-all duration-300 cursor-pointer"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Démarrer l'enregistrement"
                    style={{ width: 44, height: 44, minWidth: 36, minHeight: 36, boxShadow: '0 0 0 4px rgba(120,120,255,0.10)' }}
                  >
                    {/* Icône micro Material Filled, arrondie, glassy */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 drop-shadow-lg">
                      <rect x="9" y="4" width="6" height="12" rx="3" fill="#fff" stroke="#fff" strokeWidth="1.5" />
                      <path d="M12 18c2.21 0 4-1.79 4-4V8a4 4 0 10-8 0v6c0 2.21 1.79 4 4 4z" fill="#fff" stroke="#fff" strokeWidth="1.2" />
                      <path d="M19 11v2a7 7 0 01-14 0v-2" stroke="#fff" strokeWidth="2" fill="none" />
                      <path d="M12 22v-2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="22" r="1.5" fill="#fff" />
                      <ellipse cx="12" cy="8" rx="2.5" ry="1.2" fill="#fff" fillOpacity="0.7" />
                    </svg>
                  </motion.button>
                )}
                {userInput.trim().length > 0 && (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold p-3 rounded-full shadow-2xl flex items-center justify-center text-xl transition-all duration-300 cursor-pointer align-middle"
                    whileTap={{ scale: 0.9 }}
                    style={{ width: 44, height: 44, minWidth: 36, minHeight: 36, boxShadow: "0 0 0 4px rgba(120,120,255,0.08)" }}
                  >
                    <AnimatePresence>
                      {isLoading ? (
                        <motion.div
                          className="animate-spin rounded-full h-7 w-7 sm:h-6 sm:w-6 border-b-2 border-white border-t-2 border-indigo-400"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      ) : (
                        <span className="flex items-center justify-center h-full">
                          <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 sm:h-6 sm:w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            initial={{ x: 0 }}
                            animate={{ x: isFocused ? 4 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <path
                              d="M4 12L20 12"
                              stroke="#fff"
                              strokeWidth="3.2"
                              strokeLinecap="round"
                              filter="drop-shadow(0px 1px 2px #6366f1)"
                            />
                            <path
                              d="M14 6L20 12L14 18"
                              stroke="#fff"
                              strokeWidth="3.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              filter="drop-shadow(0px 1px 2px #6366f1)"
                            />
                            <circle cx="20" cy="12" r="1.5" fill="#fff" fillOpacity="0.85" />
                          </motion.svg>
                        </span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </>
            )}
          </div>
  </div>
          {/* Animation amplitude micro en overlay dans le textarea */}
          {micState === "recording" && micAmplitude && (
            <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-end gap-1 h-8 mx-auto" style={{ width: 'fit-content' }}>
                {micAmplitude.map((amp, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 8 }}
                    animate={{ height: amp }}
                    transition={{ type: "spring", stiffness: 180, damping: 18 }}
                    className="w-1.5 rounded bg-indigo-400/80"
                    style={{ minHeight: 8, maxHeight: 40 }}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Placeholder animé */}
          {/* Placeholder natif utilisé, pas d'animation custom */}
        {/* Boutons micro et envoyer à droite du textarea, dans la barre d'input */}
  <div className="flex items-center ml-2 w-full">
          {micState !== "recording" && (
              <>
              <span className="flex items-center gap-1 ml-2">
                <motion.select id="language-select-inputbar" value={targetLang} onChange={handleLanguageChange} className={`px-2 py-1 rounded-lg border ${colors.border || colors.borderColor || 'border-indigo-500/30'} bg-gray-900 ${colors.textColor || 'text-white'} focus:ring focus:outline-none transition-all text-xs cursor-pointer`} style={{ background: `#E3DEDE` }} whileFocus={{ scale: 1.05, boxShadow: '0 0 0 4px #6366f1' }} whileHover={{ scale: 1.04 }}>
                  <option value="français">FR</option>
                  <option value="anglais">EN</option>
                  <option value="espagnol">ES</option>
                  <option value="allemand">DE</option>
                  <option value="italien">IT</option>
                  <option value="wolof">WO</option>
                  <option value="portuguais">PT</option>
                </motion.select>
                  {/* Drapeau selon la langue sélectionnée */}
                  {targetLang === "français" && (
                    <span className="inline-block w-5 h-5 mr-1 align-middle">
                      <Image src="https://flagcdn.com/fr.svg" alt="FR" width={20} height={20} className="w-full h-full rounded-sm shadow" />
                    </span>
                  )}
                  {targetLang === "anglais" && (
                    <span className="inline-block w-5 h-5 mr-1 align-middle">
                      <Image src="https://flagcdn.com/gb.svg" alt="EN" width={20} height={20} className="w-full h-full rounded-sm shadow" />
                    </span>
                  )}
                  {targetLang === "espagnol" && (
                    <span className="inline-block w-5 h-5 mr-1 align-middle">
                      <Image src="https://flagcdn.com/es.svg" alt="ES" width={20} height={20} className="w-full h-full rounded-sm shadow" />
                    </span>
                  )}
                  {targetLang === "allemand" && (
                    <span className="inline-block w-5 h-5 mr-1 align-middle">
                      <Image src="https://flagcdn.com/de.svg" alt="DE" width={20} height={20} className="w-full h-full rounded-sm shadow" />
                    </span>
                  )}
                  {targetLang === "italien" && (
                    <span className="inline-block w-5 h-5 mr-1 align-middle">
                      <Image src="https://flagcdn.com/it.svg" alt="IT" width={20} height={20} className="w-full h-full rounded-sm shadow" />
                    </span>
                  )}
                  {targetLang === "wolof" && (
                    <span className="inline-block w-5 h-5 mr-1 align-middle">
                      <Image src="https://flagcdn.com/sn.svg" alt="WO" width={20} height={20} className="w-full h-full rounded-sm shadow" />
                    </span>
                  )}
                  {targetLang === "portuguais" && (
                    <span className="inline-block w-5 h-5 mr-1 align-middle">
                      <Image src="https://flagcdn.com/pt.svg" alt="PT" width={20} height={20} className="w-full h-full rounded-sm shadow" />
                    </span>
                  )}
                {/* Sélecteur de ton moderne */}
                  <motion.select
                    id="tone-select-inputbar"
                    value={selectedTone}
                    onChange={e => handleToneSelection(e.target.value)}
                    className={`px-2 py-1 rounded-lg border ${colors.border || 'border-indigo-300'} focus:ring focus:outline-none transition-all text-xs cursor-pointer ml-1`}
                    style={{
                      background: colors.bg || '#6366f1',
                      color: colors.textColor || '#fff',
                      borderColor: colors.border || '#6366f1',
                    }}
                    whileFocus={{ scale: 1.05, boxShadow: `0 0 0 4px ${colors.bg || '#6366f1'}` }}
                    whileHover={{ scale: 1.04 }}
                  >
                    {tones && tones.length > 0 && tones.map(tone => (
                      <option key={tone.value} value={tone.value}>{tone.label}</option>
                    ))}
                  </motion.select>
                  {/* Bouton supprimer l'historique après le bouton ton */}
                  <motion.button
                    type="button"
                    onClick={clearHistory}
                    className="p-3 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-red-600 transition cursor-pointer mr-2 ml-3 relative overflow-hidden"
                    title="Supprimer tout l'historique"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    whileTap={{ scale: 0.85, rotate: 12 }}
                    whileHover={{ scale: 1.12, boxShadow: '0 0 0 6px #ef4444' }}
                    aria-label="Supprimer tout l'historique"
                    style={{ minWidth: 44, minHeight: 44 }}
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
           
              </span>
              <div className="flex-1" />
        </>
        )}
      </div>
           
      </motion.div>
    </form>
  );
}
