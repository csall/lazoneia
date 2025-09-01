import { useState, useRef, useEffect, useCallback } from "react";
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
  const [showLangMenu, setShowLangMenu] = useState(false);
  const languages = [
    { value: "français", label: "FR", flag: "fr" },
    { value: "anglais", label: "EN", flag: "gb" },
    { value: "espagnol", label: "ES", flag: "es" },
    { value: "allemand", label: "DE", flag: "de" },
    { value: "italien", label: "IT", flag: "it" },
    { value: "wolof", label: "WO", flag: "sn" },
    { value: "portuguais", label: "PT", flag: "pt" },
    { value: "arabe", label: "AR", flag: "sa" },
    { value: "chinois", label: "ZH", flag: "cn" },
    { value: "russe", label: "RU", flag: "ru" },
    { value: "japonais", label: "JA", flag: "jp" },
    { value: "turc", label: "TR", flag: "tr" },
    { value: "néerlandais", label: "NL", flag: "nl" },
    { value: "polonais", label: "PL", flag: "pl" },
    { value: "suédois", label: "SV", flag: "se" },
    { value: "grec", label: "EL", flag: "gr" },
    { value: "coréen", label: "KO", flag: "kr" },
    { value: "hindi", label: "HI", flag: "in" },
  ];
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = textareaRef;
  // Visual viewport / safe-area management (iOS & modern browsers)
  const [viewportOffset, setViewportOffset] = useState(0); // distance from bottom keyboard -> for future use if needed
  const [safePadding, setSafePadding] = useState(0);
  // Key to force remount of textarea (iOS focus reset after native select)
  const [textareaKey, setTextareaKey] = useState(0);

  // rAF throttled auto-resize
  const resizeFrame = useRef(null);
  const autoResize = useCallback(() => {
    if (!inputRef?.current) return;
    const el = inputRef.current;
    el.style.height = 'auto';
    // Clamp max height for mobile so it doesn't cover the selects
    const max = 160; // px
    el.style.height = Math.min(el.scrollHeight, max) + 'px';
  }, [inputRef]);

  const scheduleResize = useCallback(() => {
    if (resizeFrame.current) cancelAnimationFrame(resizeFrame.current);
    resizeFrame.current = requestAnimationFrame(autoResize);
  }, [autoResize]);

  useEffect(() => {
    scheduleResize();
  }, [userInput, scheduleResize]);

  useEffect(() => {
    const vv = window.visualViewport;
    const update = () => {
      if (!vv) return;
      // When keyboard opens on mobile, visualViewport.height shrinks; we can compute offset if needed
      const offset = window.innerHeight - vv.height - vv.offsetTop; // area possibly covered by keyboard
      setViewportOffset(offset > 0 ? offset : 0);
      // Safe-area inset bottom (iOS notch) — fallback 0
      try {
        const inset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            'padding-bottom'
          ) || '0',
          10
        );
        setSafePadding(inset || 0);
      } catch {
        setSafePadding(0);
      }
    };
    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
      update();
    }
    return () => {
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
    };
  }, []);

  useEffect(() => () => resizeFrame.current && cancelAnimationFrame(resizeFrame.current), []);

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-end px-2 sm:px-0"
      style={{
        background: 'none',
        boxShadow: 'none',
        border: 'none',
        minHeight: '72px',
        paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + ${Math.max(12, safePadding)}px)`,
      }}
    >
      <AnimatePresence>
        <motion.div
          className="flex flex-col items-stretch w-full max-w-full mx-auto rounded-3xl px-2 pt-2 pb-2 sm:max-w-4xl sm:px-4 sm:pt-3 sm:pb-3 bg-white/60 backdrop-blur-lg shadow-2xl border border-indigo-200"
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
              key={textareaKey}
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
        scheduleResize();
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
              className={`w-full min-h-[44px] max-h-[160px] resize-none rounded-2xl px-4 pr-16 py-3 text-base bg-white/80 text-gray-900 shadow-none border-2 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/80 transition-all duration-300 scrollbar-hide placeholder:italic placeholder:text-indigo-400 placeholder:opacity-80 ${
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
          <div className="w-full">
            {micState !== "recording" && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2 px-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center justify-center w-7 h-7 rounded overflow-hidden border border-indigo-300 bg-white/80">
                    <Image
                      src={`https://flagcdn.com/${
                        languages.find((l) => l.value === targetLang)?.flag
                      }.svg`}
                      alt={targetLang + " flag"}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                      style={{
                        minWidth: 24,
                        minHeight: 24,
                        maxWidth: 28,
                        maxHeight: 28,
                      }}
                      unoptimized
                    />
                  </span>
                  <select
                    id="language-select-inputbar"
                    aria-label="Langue cible"
                    value={targetLang}
                    onChange={(e) => {
                      handleLanguageChange(e);
                      // Remount + refocus to avoid iOS dead tap zone after picker
                      setTimeout(() => {
                        setTextareaKey((k) => k + 1);
                        requestAnimationFrame(() => {
                          if (inputRef.current) {
                            inputRef.current.focus({ preventScroll: true });
                          }
                        });
                      }, 40);
                    }}
                    className={`px-3 py-2 rounded-xl border focus:ring focus:outline-none transition-all text-sm sm:text-xs cursor-pointer font-medium shadow-sm ${
                      colors.border || 'border-indigo-300'
                    }`}
                    style={{
                      background: colors.bg || '#6366f1',
                      color: colors.textColor || '#fff',
                      borderColor: colors.border || '#6366f1',
                    }}
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.value.charAt(0).toUpperCase() + lang.value.slice(1)}
                      </option>
                    ))}
                  </select>
                  <motion.select
                    id="tone-select-inputbar"
                    aria-label="Sélection du ton"
                    value={selectedTone}
                    onChange={(e) => {
                      handleToneSelection(e.target.value);
                      setTimeout(() => {
                        setTextareaKey((k) => k + 1);
                        requestAnimationFrame(() => {
                          if (inputRef.current) {
                            inputRef.current.focus({ preventScroll: true });
                          }
                        });
                      }, 40);
                    }}
                    className={`px-3 py-2 rounded-xl border focus:ring focus:outline-none transition-all text-sm sm:text-xs cursor-pointer font-medium shadow-sm ${
                      colors.border || 'border-indigo-300'
                    }`}
                    style={{
                      background: colors.bg || '#6366f1',
                      color: colors.textColor || '#fff',
                      borderColor: colors.border || '#6366f1',
                    }}
                    whileFocus={{
                      scale: 1.05,
                      boxShadow: `0 0 0 4px ${colors.bg || '#6366f1'}`,
                    }}
                    whileHover={{ scale: 1.04 }}
                  >
                    {tones &&
                      tones.length > 0 &&
                      tones.map((tone) => (
                        <option key={tone.value} value={tone.value}>
                          {tone.label}
                        </option>
                      ))}
                  </motion.select>
                  {messages && messages.length > 0 && (
                    <motion.button
                      type="button"
                      onClick={clearHistory}
                      className="bg-[#948D8D] text-white rounded-full p-2 shadow-xl border border-[#948D8D] flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md"
                      whileTap={{ scale: 0.94, rotate: 8 }}
                      whileHover={{
                        scale: 1.08,
                        boxShadow: '0 0 0 4px #948D8D',
                      }}
                      aria-label="Supprimer tout l'historique"
                      style={{
                        height: 36,
                        minHeight: 36,
                        width: 36,
                        minWidth: 36,
                        boxShadow: '0 0 0 2px rgba(148,141,141,0.12)',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                </div>
              </div>
            )}
          </div>

          {/* Bouton envoyer animé : affiché uniquement si pas d'enregistrement */}
          {/* (supprimé le doublon, le bouton est dans la barre d'input) */}
          {/* Boutons check et annuler pendant l'enregistrement */}
        </motion.div>
      </AnimatePresence>
    </form>
  );
}