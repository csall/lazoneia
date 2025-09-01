import { useState, useRef, useEffect, useMemo } from "react";
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
  messages,
}) {
  // Panels (bottom sheets) for custom selection to avoid native select blocking input on mobile
  const [showLangPanel, setShowLangPanel] = useState(false);
  const [showTonePanel, setShowTonePanel] = useState(false);
  // Liste brute (sans doublons intentionnels). On déduplique pour éviter les clés React identiques.
  const languagesRaw = useMemo(() => ([
    { value: "français", label: "FR", flag: "fr" },
    { value: "anglais", label: "EN", flag: "gb" },
    { value: "allemand", label: "DE", flag: "de" },
    { value: "espagnol", label: "ES", flag: "es" },
    { value: "wolof", label: "WO", flag: "sn" },
    { value: "italien", label: "IT", flag: "it" },
    { value: "portuguais", label: "PT", flag: "pt" },
    { value: "arabe", label: "AR", flag: "sa" },
    { value: "chinois", label: "ZH", flag: "cn" },
    { value: "russe", label: "RU", flag: "ru" },
    { value: "turc", label: "TR", flag: "tr" },
    { value: "néerlandais", label: "NL", flag: "nl" },
    { value: "suédois", label: "SV", flag: "se" },
    { value: "grec", label: "EL", flag: "gr" },
    { value: "coréen", label: "KO", flag: "kr" },
  ]), []);
  const languages = useMemo(() => {
    const map = new Map();
    for (const lang of languagesRaw) {
      if (!map.has(lang.value)) map.set(lang.value, lang);
    }
    return Array.from(map.values());
  }, [languagesRaw]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = textareaRef;
  const inputBarRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(100);

  useEffect(() => {
    const measure = () => {
      if (inputBarRef.current) {
        const rect = inputBarRef.current.getBoundingClientRect();
        setInputHeight(rect.height || 100);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const suppressSendRef = useRef(false); // empêche envoi auto après changement langue/ton

  // Ouvre/ferme les panneaux en gérant le blur pour éviter le "premier tap" perdu sur mobile quand le clavier est ouvert
  const togglePanelSafely = (panel) => {
    const open = () => {
      if (panel === 'lang') {
        setShowTonePanel(false);
        setShowLangPanel((o) => !o);
      } else if (panel === 'tone') {
        setShowLangPanel(false);
        setShowTonePanel((o) => !o);
      }
    };
    const el = inputRef?.current;
    // Si le textarea est focus (clavier affiché), on blur d'abord puis on ouvre après un léger délai
    if (el && document.activeElement === el) {
      el.blur();
      // Delay suffisant pour que le clavier commence à se rétracter et que le tap ne soit pas gobé
      setTimeout(open, 60);
    } else {
      open();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        if (suppressSendRef.current) {
          e.preventDefault();
          return;
        }
        handleSubmit(e);
      }}
      className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-end px-2 pb-3 sm:px-0 sm:pb-4"
      style={{
        background: "none",
        boxShadow: "none",
        border: "none",
        minHeight: "72px",
      }}
    >
      <AnimatePresence>
        <motion.div
          ref={inputBarRef}
          className="flex flex-col items-center w-full max-w-full mx-auto rounded-3xl px-2 py-2 sm:max-w-4xl sm:px-4 sm:py-3 bg-white/60 backdrop-blur-lg shadow-2xl border border-indigo-200"
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          whileFocus={{ boxShadow: "0 0 0 4px #6366f1" }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          style={{
            boxShadow: "0 8px 32px rgba(80,80,180,0.10)",
            background: "rgba(255,255,255,0.7)",
            borderRadius: 24,
            border: "1.5px solid #c7d2fe",
          }}
        >
          {/* Annuler enregistrement */}
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
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
                fontFamily: "Inter, ui-sans-serif, system-ui",
                outline: "none",
                background: "rgba(255,255,255,0.85)",
                transition: "all 0.3s cubic-bezier(.4,2,.3,1)",
              }}
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder=""
              animate={{
                boxShadow: isFocused
                  ? "0 0 0 2px #6366f1"
                  : "0 2px 16px rgba(60,60,120,0.10)",
              }}
            />
            {/* Boutons micro et envoyer positionnés à droite dans le textarea */}
            {micState !== "recording" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 items-center">
                {userInput.trim().length === 0 && (
                  <motion.button
                    type="button"
                    onClick={handleMicClick}
                    disabled={isLoading}
                    className="bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-full p-3 shadow-xl border border-indigo-300 flex items-center justify-center transition-all duration-300 cursor-pointer"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Démarrer l'enregistrement"
                    style={{
                      width: 36,
                      height: 36,
                      minWidth: 28,
                      minHeight: 28,
                      boxShadow: "0 0 0 3px rgba(120,120,255,0.10)",
                    }}
                  >
                    {/* Icône micro Material Filled, arrondie, glassy */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-7 w-7 drop-shadow-lg"
                    >
                      <rect
                        x="9"
                        y="4"
                        width="6"
                        height="12"
                        rx="3"
                        fill="#fff"
                      />
                      <path
                        d="M12 18c2.21 0 4-1.79 4-4V8a4 4 0 10-8 0v6c0 2.21 1.79 4 4 4z"
                        fill="#fff"
                      />
                      <path
                        d="M19 11v2a7 7 0 01-14 0v-2"
                        stroke="#fff"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M12 22v-2"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="22" r="1.5" fill="#fff" />
                      <ellipse
                        cx="12"
                        cy="8"
                        rx="2.5"
                        ry="1.2"
                        fill="#fff"
                        fillOpacity="0.5"
                      />
                    </svg>
                  </motion.button>
                )}
                {userInput.trim().length > 0 && (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold p-3 rounded-full shadow-2xl flex items-center justify-center text-xl transition-all duration-300 cursor-pointer align-middle"
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: 36,
                      height: 36,
                      minWidth: 28,
                      minHeight: 28,
                      boxShadow: "0 0 0 3px rgba(120,120,255,0.08)",
                    }}
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
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            <defs>
                              <linearGradient
                                id="arrowGradient"
                                x1="0"
                                y1="0"
                                x2="24"
                                y2="24"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#4f46e5" />
                                <stop offset="0.5" stopColor="#6366f1" />
                                <stop offset="1" stopColor="#a78bfa" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M4 12L20 12"
                              stroke="#fff"
                              strokeWidth="3.2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M14 6L20 12L14 18"
                              stroke="#fff"
                              strokeWidth="3.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        </span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </div>
            )}
          </div>
          {/* Animation amplitude micro en overlay dans le textarea */}
          {micState === "recording" && micAmplitude && (
            <div
              className="absolute inset-0 flex items-center"
              style={{ pointerEvents: "none" }}
            >
              <div className="flex items-center w-full justify-center relative">
                {/* Bouton annuler à gauche */}
                <div
                  className="absolute left-3 top-1/2"
                  style={{
                    transform: "translateY(-50%)",
                    pointerEvents: "auto",
                    marginLeft: "6px",
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={cancelRecording}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full p-3 shadow border border-gray-400 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Annuler l'enregistrement"
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 36,
                      minHeight: 36,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
                {/* Animation amplitude au centre */}
                <div
                  className="flex items-end gap-1 h-8 mx-auto"
                  style={{ width: "fit-content" }}
                >
                  {micAmplitude.map((amp, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 8 }}
                      animate={{ height: amp }}
                      transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 18,
                      }}
                      className="w-1.5 rounded bg-indigo-400/80"
                      style={{ minHeight: 8, maxHeight: 40 }}
                    />
                  ))}
                </div>
                {/* Bouton check à droite */}
                <div
                  className="absolute right-3 top-1/2"
                  style={{
                    transform: "translateY(-50%)",
                    pointerEvents: "auto",
                    marginRight: "6px",
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={handleMicClick}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow border border-green-300 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Valider l'enregistrement"
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 36,
                      minHeight: 36,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          )}
          {/* Placeholder animé */}
          {/* Placeholder natif utilisé, pas d'animation custom */}
          {/* Boutons micro et envoyer à droite du textarea, dans la barre d'input */}
          <div className="flex items-center ml-2 w-full">
            {micState !== "recording" && (
              <>
                <span className="flex items-center gap-2 ml-2 mt-1">
                  {/* Bouton langue */}
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={showLangPanel}
                    onClick={() => togglePanelSafely('lang')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/90 text-white text-xs font-medium shadow-md border border-indigo-300 active:scale-95 transition"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded overflow-hidden bg-white/20">
                      <Image
                        src={`https://flagcdn.com/${
                          languages.find((l) => l.value === targetLang)?.flag
                        }.svg`}
                        alt={targetLang + ' flag'}
                        width={20}
                        height={20}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </span>
                    <span className="uppercase tracking-wide">
                      {languages.find((l) => l.value === targetLang)?.label || 'LANG'}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3 w-3 transition-transform ${showLangPanel ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                    </svg>
                  </button>
                  {/* Bouton ton */}
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={showTonePanel}
                    onClick={() => togglePanelSafely('tone')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/90 text-white text-xs font-medium shadow-md border border-violet-300 active:scale-95 transition"
                  >
                    <span className="truncate max-w-[72px]">
                      {tones?.find((t) => t.value === selectedTone)?.label || 'Ton'}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3 w-3 transition-transform ${showTonePanel ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                    </svg>
                  </button>
                  {/* Bouton supprimer l'historique après le bouton ton */}
                  {messages && messages.length > 0 && (
                    <motion.button
                      type="button"
                      onClick={clearHistory}
                      className="bg-[#948D8D] text-white rounded-full p-2 shadow-xl border border-[#948D8D] flex items-center justify-center transition-all duration-300 cursor-pointer ml-2 backdrop-blur-md"
                      whileTap={{ scale: 0.94, rotate: 8 }}
                      whileHover={{
                        scale: 1.08,
                        boxShadow: "0 0 0 4px #948D8D",
                      }}
                      aria-label="Supprimer tout l'historique"
                      style={{
                        height: 32,
                        minHeight: 32,
                        width: 32,
                        minWidth: 32,
                        boxShadow: "0 0 0 2px rgba(148,141,141,0.12)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="7"
                          y="9"
                          width="10"
                          height="9"
                          rx="2"
                          fill="#fff"
                          fillOpacity="0.9"
                        />
                        <rect
                          x="9"
                          y="4"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#fff"
                          fillOpacity="1"
                        />
                        <path
                          d="M10 12v4M14 12v4"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <rect
                          x="5"
                          y="7"
                          width="14"
                          height="2"
                          rx="1"
                          fill="#fff"
                          fillOpacity="0.8"
                        />
                      </svg>
                    </motion.button>
                  )}
                </span>
                <div className="flex-1" />
              </>
            )}
          </div>
          {/* Modales centrées langue / ton */}
          <AnimatePresence>
            {(showLangPanel || showTonePanel) && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] p-2 sm:p-4 bg-black/30 backdrop-blur-sm"
                onClick={() => { setShowLangPanel(false); setShowTonePanel(false); }}
                aria-modal="true"
                role="dialog"
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  initial={{ x: -10, opacity: 0, scale: 0.97 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -10, opacity: 0, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  style={{ position: 'absolute', left: 12, bottom: inputHeight + 12 }}
                  className="w-[86%] sm:w-[420px] max-h-[55vh] sm:max-h-[60vh] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border bg-white/95 backdrop-blur-lg border-indigo-200 flex flex-col"
                >
                  <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b bg-gradient-to-r from-indigo-500/15 to-violet-500/15">
                    <h2 className="text-xs sm:text-sm font-semibold text-indigo-700 tracking-wide uppercase">
                      {showLangPanel ? 'Choisir une langue' : 'Choisir un ton'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => { setShowLangPanel(false); setShowTonePanel(false); }}
                      className="p-1.5 rounded-full hover:bg-indigo-100 text-indigo-600 transition active:scale-95"
                      aria-label="Fermer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="p-3 sm:p-4 overflow-y-auto custom-scrollbar">
                    {showLangPanel && (
                      <div className="grid grid-cols-4 sm:grid-cols-3 gap-2 sm:gap-3">
                        {languages.map((lang) => (
                          <button
                            key={lang.value}
                            onClick={() => {
                              suppressSendRef.current = true;
                              setTimeout(() => (suppressSendRef.current = false), 350);
                              handleLanguageChange({ target: { value: lang.value } });
                              setShowLangPanel(false);
                            }}
                            className={`group flex flex-col items-center gap-1 px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-medium transition active:scale-[0.95] ${lang.value === targetLang ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white/70 border-indigo-200 text-indigo-700 hover:bg-indigo-100'}`}
                          >
                            <Image
                              src={`https://flagcdn.com/${lang.flag}.svg`}
                              alt={lang.label}
                              width={28}
                              height={28}
                              className="rounded object-cover w-7 h-7 sm:w-8 sm:h-8"
                              unoptimized
                            />
                            <span className="truncate w-full text-center">{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {showTonePanel && (
                      <div className="flex flex-col gap-1.5 sm:gap-2">
                        {tones?.map((tone) => (
                          <button
                            key={tone.value}
                            onClick={() => {
                              suppressSendRef.current = true;
                              setTimeout(() => (suppressSendRef.current = false), 350);
                              handleToneSelection(tone.value);
                              setShowTonePanel(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border text-xs sm:text-sm font-medium transition active:scale-[0.97] ${tone.value === selectedTone ? 'bg-violet-600 text-white border-violet-600 shadow' : 'bg-white/70 border-violet-200 text-violet-700 hover:bg-violet-100'}`}
                          >
                            <span className="truncate pr-3 sm:pr-4">{tone.label}</span>
                            {tone.value === selectedTone && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton envoyer animé : affiché uniquement si pas d'enregistrement */}
          {/* (supprimé le doublon, le bouton est dans la barre d'input) */}
          {/* Boutons check et annuler pendant l'enregistrement */}
        </motion.div>
      </AnimatePresence>
    </form>
  );
}