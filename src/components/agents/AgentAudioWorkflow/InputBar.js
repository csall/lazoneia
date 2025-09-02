import { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
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
  // Ajout d'un identifiant de clé stable
  const languagesSafe = useMemo(() => {
    return languages.map((l, idx) => {
      const base = (l.value || '').toString().trim().replace(/\s+/g,'-') || idx;
      return { ...l, _kid: `lang-${idx}-${base}` };
    });
  }, [languages]);
  // Déduplication préventive des tons (évite clés dupliquées ou vides)
  const tonesSafe = useMemo(() => {
    if (!Array.isArray(tones)) return [];
    const seen = new Set();
    return tones.filter((t) => {
      const val = (t && t.value) ? String(t.value) : '';
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }, [tones]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = textareaRef;
  const inputBarRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(100);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { theme, toggle } = useTheme();

  // Thème géré globalement

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setReducedMotion(mq.matches);
      update();
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
  }, []);

  useEffect(() => {
    const measure = () => {
      if (inputBarRef.current) {
        const rect = inputBarRef.current.getBoundingClientRect();
        setInputHeight(rect.height || 100);
      }
    };
    window.addEventListener('resize', measure);
    measure();
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Ref pour empêcher l'envoi immédiat après un clic panel
  const suppressSendRef = useRef(false);

  // Fonctions fiables d'ouverture/fermeture modales (évite toggle hasardeux + blur mobile)
  const openLangPanel = () => {
    const el = inputRef?.current;
    const action = () => {
      setShowTonePanel(false);
      setShowLangPanel(prev => !prev);
    };
    if (el && document.activeElement === el) { el.blur(); setTimeout(action, 60); } else { action(); }
  };
  const openTonePanel = () => {
    const el = inputRef?.current;
    const action = () => {
      setShowLangPanel(false);
      setShowTonePanel(prev => !prev);
    };
    if (el && document.activeElement === el) { el.blur(); setTimeout(action, 60); } else { action(); }
  };

  return (
    <form
      data-theme={theme}
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
      <style>{`
  :root { --acc:#0ea5e9; --acc-strong:#0284c7; --acc-soft:rgba(14,165,233,0.20); --danger:#dc2626; --border:#d1d5db; --border-strong:#c3c7ce; --bg-card:rgba(255,255,255,0.85); --bg-alt:rgba(255,255,255,0.85); --bg-btn:#f3f5f7; --bg-btn-hover:#eef2f5; --bg-btn-active:#e3e7eb; --text:#1f2937; --text-dim:#6b7280; }
  [data-theme='dark'] { --acc:#10b981; --acc-strong:#059669; --acc-soft:rgba(16,185,129,0.25); --border:#454954; --border-strong:#5b606d; --bg-card:rgba(50,53,60,0.9); --bg-alt:rgba(50,53,60,0.9); --bg-btn:#3b3f47; --bg-btn-hover:#454a53; --bg-btn-active:#50555f; --text:#f3f4f6; --text-dim:#9ca3af; }
        .container-shell{background:var(--bg-card);backdrop-filter:blur(18px);} 
        .fancy-btn{position:relative;overflow:hidden;}
        .fancy-btn:after{content:'';position:absolute;inset:0;opacity:0;transition:opacity .35s;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.6),rgba(255,255,255,0));}
        .fancy-btn:hover:after{opacity:1;}
        .neutral-btn{background:var(--bg-btn);border:1px solid var(--border);color:var(--text-dim);} 
        .neutral-btn:hover{background:var(--bg-btn-hover);color:var(--text);} 
        .neutral-btn:active{background:var(--bg-btn-active);} 
        .accent-outline:focus-visible{box-shadow:0 0 0 3px var(--acc-soft),0 0 0 4px var(--acc);outline:none;}
  /* Boutons micro / envoyer en gris (demande) */
  .send-active{background:#6b7280!important;border-color:#6b7280!important;color:#fff!important;}
  .send-active:hover{background:#4b5563!important;}
        .send-disabled{background:var(--bg-btn)!important;border-color:var(--border)!important;opacity:.55;color:var(--text-dim);} 
        .textarea-base{background:rgba(255,255,255,0.9);border:1px solid var(--border);color:var(--text);} .textarea-base:focus{border-color:var(--border-strong);} 
        .placeholder-dim::placeholder{color:var(--text-dim);} 
        .panel-light{background:rgba(255,255,255,0.92);border:1px solid var(--border);backdrop-filter:blur(20px);} .panel-header{background:linear-gradient(90deg,rgba(14,165,233,0.08),rgba(14,165,233,0));} 
        .panel-item{background:var(--bg-btn);border:1px solid var(--border);color:var(--text-dim);transition:background .25s,border-color .25s,color .25s;} 
        .panel-item:hover{background:var(--bg-btn-hover);color:var(--text);} 
        .panel-item-active{background:var(--acc);color:#fff!important;border:1px solid var(--acc);} 
        .list-scroll-smooth{scrollbar-width:thin;scrollbar-color:var(--border) transparent;} .list-scroll-smooth::-webkit-scrollbar{width:6px;} .list-scroll-smooth::-webkit-scrollbar-thumb{background:var(--border);border-radius:20px;} .list-scroll-smooth::-webkit-scrollbar-track{background:transparent;} 
        @keyframes pulseRing {0%{transform:scale(.9);opacity:.5}50%{transform:scale(1.05);opacity:0}100%{transform:scale(1.15);opacity:0}} 
  .mic-ready:before{content:'';position:absolute;inset:0;border-radius:9999px;background:radial-gradient(circle,#6b7280 0%,rgba(107,114,128,0) 70%);opacity:0;} 
        .mic-ready[data-active="true"]:before{animation:pulseRing 2s ease-out infinite;} 
        ${reducedMotion ? '.fancy-btn:after,.mic-ready[data-active="true"]:before{animation:none !important;}' : ''}
        /* Fond bas: radial + bruit léger */
        .input-bg-floor{position:absolute;left:0;bottom:0;width:100%;height:240px;pointer-events:none;z-index:0;background:
          radial-gradient(circle at 50% 110%,rgba(14,165,233,0.22),rgba(14,165,233,0.08) 38%,rgba(255,255,255,0) 72%),
          linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0.65));
          mask:linear-gradient(to top,rgba(0,0,0,0.9),rgba(0,0,0,0));
        }
        [data-theme='dark'] .input-bg-floor{background:
          radial-gradient(circle at 50% 110%,rgba(16,185,129,0.25),rgba(16,185,129,0.06) 40%,rgba(0,0,0,0) 75%),
          linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.6));
          mask:linear-gradient(to top,rgba(0,0,0,0.9),rgba(0,0,0,0));}
        .input-bg-noise{position:absolute;inset:0;mix-blend-mode:overlay;opacity:.22;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='160' height='160' fill='rgba(255,255,255,0.9)' filter='url(%23n)'/></svg>");background-size:320px 320px;}
        /* Variantes (non utilisées mais prêtes) */
        .input-bg-gradient-wave{background:linear-gradient(115deg,rgba(14,165,233,0.15),rgba(14,165,233,0) 60%),radial-gradient(circle at 70% 20%,rgba(14,165,233,0.12),rgba(14,165,233,0) 55%);} 
      `}</style>
      <AnimatePresence>
        {/* Fond décoratif sous la barre */}
        <div key="bg-floor" aria-hidden="true" className="input-bg-floor">
          <div className="input-bg-noise" />
        </div>
  <motion.div
          ref={inputBarRef}
          className="relative flex flex-col items-center w-full max-w-full mx-auto rounded-2xl px-2 py-2 sm:max-w-4xl sm:px-4 sm:py-3 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.08)] border border-[var(--border)] container-shell"
          initial={{ y: 38, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          whileFocus={{ boxShadow: "0 0 0 4px #6366f1" }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          style={{
            boxShadow: "0 4px 18px -4px rgba(0,0,0,0.45),0 2px 8px rgba(0,0,0,0.35)",
            background: "var(--bg-alt)",
            borderRadius: 20,
          }}
        >
          {/* Barre de progression supprimée selon la demande */}
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
              className={`w-full min-h-[44px] max-h-[120px] resize-none rounded-xl px-4 pr-16 py-3 text-base shadow-none textarea-base placeholder-dim focus:ring-0 transition-all duration-150 scrollbar-hide placeholder:italic ${
                micState === "transcribing" ? "text-center font-semibold" : ""
              } sm:text-lg sm:px-5 sm:pr-20 sm:py-4`}
              style={{
                boxSizing: "border-box",
                fontSize: "1.12rem",
                letterSpacing: "0.01em",
                scrollbarWidth: "none",
                fontFamily: "Inter, ui-sans-serif, system-ui",
                outline: "none",
                background: "var(--bg-alt)",
                transition: "all 0.3s cubic-bezier(.4,2,.3,1)",
              }}
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder=""
              animate={{
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            />
            {userInput.trim().length === 0 && micState !== 'recording' && micState !== 'transcribing' && (
              <div className="pointer-events-none absolute left-5 right-16 top-1/2 -translate-y-1/2 text-[0.75rem] sm:text-xs font-medium tracking-wide select-none text-[var(--text-dim)]">
                Écris ton message... (Entrée pour envoyer)
              </div>
            )}
            {/* Boutons micro et envoyer positionnés à droite dans le textarea */}
            {micState !== "recording" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 items-center">
                {userInput.trim().length === 0 && (
                  <motion.button
                    type="button"
                    onClick={handleMicClick}
                    disabled={isLoading}
                    className="fancy-btn mic-ready rounded-full p-3.5 shadow border flex items-center justify-center transition-all duration-150 cursor-pointer accent-outline send-active hover:brightness-110 border-[#6b7280]"
                    data-active={!isLoading}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Démarrer l'enregistrement"
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 36,
                      minHeight: 36,
                      boxShadow: "0 0 0 3px rgba(107,114,128,0.35)",
                    }}
                  >
                    {/* Icône micro style ChatGPT (pleine) taille réduite */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-8 w-8"
                      aria-hidden="true"
                      fill="#fff"
                    >
                      <path d="M12 15a3 3 0 003-3V7a3 3 0 10-6 0v5a3 3 0 003 3z" />
                      <path d="M5 11a1 1 0 012 0 5 5 0 0010 0 1 1 0 012 0 7 7 0 01-6 6.92V20h3a1 1 0 010 2H8a1 1 0 010-2h3v-2.08A7 7 0 015 11z" />
                    </svg>
                  </motion.button>
                )}
                {userInput.trim().length > 0 && (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`fancy-btn font-semibold p-3.5 rounded-full shadow border flex items-center justify-center text-xl transition-all duration-150 cursor-pointer align-middle accent-outline ${userInput.trim().length>0 ? 'send-active' : 'send-disabled'}`}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 36,
                      minHeight: 36,
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
                      key={`amp-${i}`}
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
                  {/* Theme toggle removed here (global toggle available in navigation). If needed, uncomment and use onClick={toggle}. */}
                  {/* Bouton langue */}
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={showLangPanel}
                    onClick={openLangPanel}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md neutral-btn text-[10px] font-medium active:scale-95 transition shadow-sm hover:shadow accent-outline"
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
                    <span className="uppercase tracking-wide leading-none">
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
                    onClick={openTonePanel}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg neutral-btn text-[11px] font-medium active:scale-95 transition shadow-sm hover:shadow accent-outline"
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
                      className="neutral-btn accent-outline rounded-lg p-2 flex items-center justify-center w-9 h-9 transition active:scale-95 hover:shadow ml-2"
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.05 }}
                      aria-label="Supprimer tout l'historique"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[var(--text-dim)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 4h6m-7 4h8m-9 0l1 10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-10" />
                        <path d="M10 11v5M14 11v5" />
                        <path d="M5 8h14" />
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
        key={showLangPanel ? 'overlay-lang' : 'overlay-tone'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] p-2 sm:p-4 bg-black/20"
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
                  className="w-[86%] sm:w-[420px] max-h-[55vh] sm:max-h-[60vh] overflow-hidden rounded-xl sm:rounded-2xl shadow-lg panel-light flex flex-col panel-fade"
                >
                  <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b panel-header text-[var(--text)]">
                    <h2 className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-[var(--acc-strong)]">
                      {showLangPanel ? 'Langue' : 'Ton'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => { setShowLangPanel(false); setShowTonePanel(false); }}
                      className="p-1.5 rounded-full hover:bg-[var(--bg-btn-hover)] text-[var(--text-dim)] transition active:scale-95"
                      aria-label="Fermer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="p-3 sm:p-4 overflow-y-auto list-scroll-smooth">
                    {showLangPanel && (
          <div className="grid grid-cols-4 sm:grid-cols-3 gap-2 sm:gap-3">
            {languagesSafe.map((lang, idx) => (
                          <button
              key={lang._kid}
                            onClick={() => {
                              suppressSendRef.current = true;
                              setTimeout(() => (suppressSendRef.current = false), 350);
                              handleLanguageChange({ target: { value: lang.value } });
                              setShowLangPanel(false);
                            }}
                            className={`group flex flex-col items-center gap-1 px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-md border text-[10px] sm:text-xs font-medium transition active:scale-[0.95] relative panel-item ${lang.value === targetLang ? 'panel-item-active' : ''}`}
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
                        {tonesSafe.map((tone, idx) => (
                          <button
                            key={`tone-${tone.value || idx}`}
                            onClick={() => {
                              suppressSendRef.current = true;
                              setTimeout(() => (suppressSendRef.current = false), 350);
                              handleToneSelection(tone.value);
                              setShowTonePanel(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 rounded-md border text-xs sm:text-sm font-medium transition active:scale-[0.97] panel-item ${tone.value === selectedTone ? 'panel-item-active' : ''}`}
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