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
      <AnimatePresence>
        <motion.div
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
                    aria-label="Démarrer l'enregistrement"
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative group w-11 h-11 rounded-full flex items-center justify-center overflow-hidden
                      border border-indigo-300/60 bg-indigo-500/70
                      backdrop-blur-xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.15)]
                      transition-all duration-300
                      disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
                  >
                    {/* Glow gradient layer */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.35),transparent_65%)]" />
                    {/* Animated pulse ring */}
                    <span className="absolute inset-0 rounded-full ring-0 group-hover:ring-4 ring-indigo-400/20 transition-all duration-500" />
                    {/* Icon */}
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-white drop-shadow-lg"
                      initial={{ y: 0 }}
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <rect x="9" y="5" width="6" height="10" rx="3" fill="currentColor" />
                      <path d="M5 11v2a7 7 0 0014 0v-2" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M12 22v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </motion.svg>
                  </motion.button>
                )}
                {userInput.trim().length > 0 && (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.08, rotate: -2 }}
                    whileTap={{ scale: 0.92 }}
                    className={`relative group w-11 h-11 rounded-full flex items-center justify-center
                      bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600
                      text-white shadow-[0_4px_18px_-4px_rgba(109,40,217,0.55),0_0_0_1px_rgba(255,255,255,0.15)]
                      transition-all duration-300 font-medium overflow-hidden cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.25),transparent_70%)]" />
                    <span className="absolute inset-0 rounded-full ring-0 group-hover:ring-4 ring-fuchsia-400/25 transition-all duration-500" />
                    <AnimatePresence mode="wait" initial={false}>
                      {isLoading ? (
                        <motion.div
                          key="loader"
                          className="relative h-6 w-6"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                        >
                          <motion.span
                            className="absolute inset-0 rounded-full border-2 border-t-transparent border-white/90"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                          />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="arrow"
                          className="flex items-center justify-center h-6 w-6"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 6 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                        >
                          <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            animate={{ x: isFocused ? 2 : 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                          >
                            <path d="M4 12H20" />
                            <path d="M14 6L20 12L14 18" />
                          </motion.svg>
                        </motion.span>
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
                    aria-label="Annuler l'enregistrement"
                    whileHover={{ scale: 1.06, rotate: -4 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-zinc-600 via-neutral-600 to-zinc-700 text-white/90 border border-white/15 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.12)] overflow-hidden"
                  >
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
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
                    aria-label="Valider l'enregistrement"
                    whileHover={{ scale: 1.06, rotate: 3 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white border border-white/15 shadow-[0_4px_16px_-4px_rgba(16,185,129,0.55),0_0_0_1px_rgba(255,255,255,0.15)] overflow-hidden"
                  >
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </motion.svg>
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
                <span className="flex items-center gap-1 ml-2 mt-1">
                  {/* Icône du drapeau à gauche du select natif */}
                  <span className="flex items-center justify-center w-6 h-6 rounded overflow-hidden border border-indigo-300 bg-white/80 mr-1">
                    <Image
                      src={`https://flagcdn.com/${
                        languages.find((l) => l.value === targetLang)?.flag
                      }.svg`}
                      alt={targetLang + " flag"}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                      style={{
                        minWidth: 20,
                        minHeight: 20,
                        maxWidth: 24,
                        maxHeight: 24,
                      }}
                      unoptimized
                    />
                  </span>
                  {/* Sélecteur langue */}
                  <label htmlFor="language-select-inputbar" className="sr-only">Langue</label>
                  <div className="relative group ml-1">
                    <select
                      id="language-select-inputbar"
                      value={targetLang}
                      onChange={handleLanguageChange}
                      className={`peer relative z-10 px-3 pr-8 h-11 rounded-2xl border ${(colors.border || 'border-indigo-300/60')} appearance-none
                        bg-white/10 backdrop-blur-xl shadow-[0_4px_24px_-6px_rgba(99,102,241,0.25),0_0_0_1px_rgba(255,255,255,0.10)]
                        text-white text-[13px] font-semibold tracking-wide
                        focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-fuchsia-400 transition-all cursor-pointer
                        active:scale-95 active:ring-4 active:ring-fuchsia-400/30`}
                      style={{
                        background: colors.bg ? colors.bg : 'rgba(255,255,255,0.12)',
                        color: colors.textColor || '#fff',
                        borderColor: colors.border || undefined,
                        WebkitTapHighlightColor: 'transparent',
                        boxShadow: '0 2px 16px rgba(99,102,241,0.13)',
                        transition: 'box-shadow .25s cubic-bezier(.4,2,.3,1)',
                      }}
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value} className="bg-white text-gray-900 text-base">
                          {lang.value.charAt(0).toUpperCase() + lang.value.slice(1)}
                        </option>
                      ))}
                    </select>
                    {/* Chevron */}
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-fuchsia-300 peer-focus:text-fuchsia-400 transition-colors" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                    {/* Animated focus ring */}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 peer-focus:ring-4 peer-focus:ring-fuchsia-400/30 peer-hover:ring-2 peer-hover:ring-indigo-400/30 transition-all duration-300" aria-hidden />
                  </div>
                  {/* Sélecteur de ton */}
                  <label htmlFor="tone-select-inputbar" className="sr-only">Ton</label>
                  <div className="relative group ml-1">
                    <motion.select
                      id="tone-select-inputbar"
                      value={selectedTone}
                      onChange={(e) => handleToneSelection(e.target.value)}
                      className={`peer relative z-10 px-3 pr-8 h-11 rounded-2xl border ${(colors.border || 'border-indigo-300/60')} appearance-none
                        bg-white/10 backdrop-blur-xl shadow-[0_4px_24px_-6px_rgba(139,92,246,0.22),0_0_0_1px_rgba(255,255,255,0.10)]
                        text-white text-[13px] font-semibold tracking-wide
                        focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-fuchsia-400 transition-all cursor-pointer
                        active:scale-95 active:ring-4 active:ring-fuchsia-400/30`}
                      style={{
                        background: colors.bg ? colors.bg : 'rgba(255,255,255,0.12)',
                        color: colors.textColor || '#fff',
                        borderColor: colors.border || undefined,
                        WebkitTapHighlightColor: 'transparent',
                        boxShadow: '0 2px 16px rgba(139,92,246,0.13)',
                        transition: 'box-shadow .25s cubic-bezier(.4,2,.3,1)',
                      }}
                      whileFocus={{ scale: 1.03 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {tones && tones.length > 0 && tones.map((tone) => (
                        <option key={tone.value} value={tone.value} className="bg-white text-gray-900 text-base">
                          {tone.label}
                        </option>
                      ))}
                    </motion.select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-fuchsia-300 peer-focus:text-fuchsia-400 transition-colors" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                    <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 peer-focus:ring-4 peer-focus:ring-fuchsia-400/30 peer-hover:ring-2 peer-hover:ring-indigo-400/30 transition-all duration-300" aria-hidden />
                  </div>
                  {/* Bouton supprimer l'historique après le bouton ton */}
                  {messages && messages.length > 0 && (
                    <motion.button
                      type="button"
                      onClick={clearHistory}
                      aria-label="Supprimer tout l'historique"
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      whileTap={{ scale: 0.9, rotate: -6 }}
                      className="relative ml-2 w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-neutral-500 via-zinc-500 to-stone-500 text-white/90 border border-white/20 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.15)] overflow-hidden backdrop-blur-sm"
                      style={{ boxShadow: "0 0 0 2px rgba(148,141,141,0.12)" }}
                    >
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 4h6M10 4.5v-1A1.5 1.5 0 0111.5 2h1A1.5 1.5 0 0114 3.5v1" />
                        <path d="M5 7h14" />
                        <path d="M8 7v11a2 2 0 002 2h4a2 2 0 002-2V7" />
                        <path d="M10 11v5M14 11v5" />
                      </svg>
                    </motion.button>
                  )}
                </span>
                <div className="flex-1" />
              </>
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
