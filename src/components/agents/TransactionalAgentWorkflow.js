"use client";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import Image from "next/image";
import LanguageSelector from "./LanguageSelector";
import ToneSelect from "./ToneSelect";
import Toast from "@/components/ui/Toast";
import { usePersistentState } from "@/hooks/usePersistentState";
import Header from "./AgentAudioWorkflow/Header";

export default function TransactionalAgentWorkflow({ agent }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const {
    endpoint,
    placeholder = "Entrez votre texte...",
    sendButtonLabel = "Transformer",
    tones = [],
    colors = {},
    branding = {},
    tagline,
  } = agent;

  // Reuse same color merge logic conceptually as AgentAudioWorkflow
  const baseDark = {
    gradientFrom: "from-blue-950",
    gradientTo: "to-purple-950",
    textColor: "text-white",
    buttonGradientFrom: "from-indigo-500",
    buttonGradientTo: "to-purple-600",
    buttonHoverFrom: "hover:from-indigo-600",
    buttonHoverTo: "hover:to-purple-700",
    border: "border-indigo-500/30",
  };
  const baseLight = {
    gradientFrom: "from-sky-50",
    gradientTo: "to-violet-100",
    textColor: "text-gray-800",
    buttonGradientFrom: "from-sky-500",
    buttonGradientTo: "to-violet-500",
    buttonHoverFrom: "hover:from-sky-600",
    buttonHoverTo: "hover:to-violet-600",
    border: "border-sky-300/50",
  };
  const mergedColors = { ...(isLight ? baseLight : baseDark), ...colors };

  // Header requires these props; keep minimal implementations
  const [messages, setMessages] = useState([]); // no chat history for transactional, stays empty
  const clearHistory = () => setMessages([]);
  const [targetLang, setTargetLang] = usePersistentState("txn_target_lang", "français");
  const handleLanguageChange = (e) => setTargetLang(e.target?.value || targetLang);
  // Langues simplifiées (réduites)
  const languagesRaw = useMemo(() => ([
    { value: "français", label: "FR", flag: "fr" },
    { value: "anglais", label: "EN", flag: "gb" },
    { value: "espagnol", label: "ES", flag: "es" },
    { value: "allemand", label: "DE", flag: "de" },
    { value: "italien", label: "IT", flag: "it" },
    { value: "portugais", label: "PT", flag: "pt" },
    { value: "wolof", label: "WO", flag: "sn" },
  ]), []);
  const languages = useMemo(() => {
    const map = new Map();
    for (const l of languagesRaw) if (!map.has(l.value)) map.set(l.value, l);
    return Array.from(map.values());
  }, [languagesRaw]);
  const languagesSafe = useMemo(() => languages.map((l,i)=>({ ...l, _kid:`lang-${i}-${l.value}` })), [languages]);
  const [showLang, setShowLang] = useState(false);
  const toggleLang = () => setShowLang(v => !v);
  const selectLang = (val) => { setTargetLang(val); setShowLang(false); };

  const [source, setSource] = useState("");
  const [tone, setTone] = usePersistentState("txn_tone", tones[0]?.value || "");
  const [showToast, setShowToast] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 4000;
  const [result, setResult] = useState("");
  const [highlightResult, setHighlightResult] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [autoTriggered, setAutoTriggered] = useState(false);
  const resultPanelRef = useRef(null);
  const resultEndRef = useRef(null);
  const resultScrollAreaRef = useRef(null);
  const sourcePanelRef = useRef(null);

  const canSubmit = source.trim().length > 0 && !loading;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setLoading(true);
    setResult("");
    setError("");
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: source, tone, targetLang }),
      });
      if (!r.ok) throw new Error("Erreur serveur");
      const data = await r.json().catch(() => ({}));
      const text = data.result || data.output || data[0]?.text || JSON.stringify(data, null, 2);
      setResult(text);
      // highlight nouvelle réponse
      setHighlightResult(true);
      setTimeout(() => setHighlightResult(false), 1400);
    } catch (e) {
      setError(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }, [endpoint, source, tone, targetLang, canSubmit]);

  // Stable ref for handleSubmit to avoid effect dependency churn
  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => { handleSubmitRef.current = handleSubmit; }, [handleSubmit]);

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setShowToast("Résultat copié");
    setTimeout(() => setCopied(false), 1200);
  };

  const handleSourceKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-submit when language changes (stable deps) using refs to avoid dependency array churn warnings
  const firstLangChange = useRef(true);
  const sourceRef = useRef("");
  const loadingRef = useRef(false);
  const resultRef = useRef("");
  useEffect(() => { sourceRef.current = source; }, [source]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { resultRef.current = result; }, [result]);
  useEffect(() => {
    if (firstLangChange.current) { firstLangChange.current = false; return; }
    const trimmed = sourceRef.current.trim();
    if (!trimmed) {
      if (resultRef.current) setResult("");
      return;
    }
    if (!loadingRef.current) {
      setAutoTriggered(true);
      handleSubmitRef.current();
      const to = setTimeout(() => setAutoTriggered(false), 1200);
      return () => clearTimeout(to);
    }
  // only reacts to targetLang change intentionally
  }, [targetLang]);

  // Auto-submit when tone changes (same pattern que la langue)
  const firstToneChange = useRef(true);
  useEffect(() => {
    if (firstToneChange.current) { firstToneChange.current = false; return; }
    const trimmed = sourceRef.current.trim();
    if (!trimmed) {
      if (resultRef.current) setResult("");
      return;
    }
    if (!loadingRef.current) {
      setAutoTriggered(true);
      handleSubmitRef.current();
      const to = setTimeout(() => setAutoTriggered(false), 1200);
      return () => clearTimeout(to);
    }
  }, [tone]);

  // Met à jour le compteur de caractères
  useEffect(() => { setCharCount(source.length); }, [source]);

  // Auto scroll inside the result panel to the bottom when new result appears (more robust)
  useEffect(() => {
    if (!loading && result) {
      const raf = requestAnimationFrame(() => {
        const area = resultScrollAreaRef.current;
        if (area) {
          if (resultEndRef.current?.scrollIntoView) {
            try { resultEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); } catch { area.scrollTop = area.scrollHeight; }
          } else {
            area.scrollTop = area.scrollHeight;
          }
          const need = area.scrollHeight > area.clientHeight + 4 && area.scrollTop + area.clientHeight < area.scrollHeight - 4;
          setShowBottomFade(need);
        }
        if (resultPanelRef.current) {
          const rect = resultPanelRef.current.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > window.innerHeight) {
            resultPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
      return () => cancelAnimationFrame(raf);
    } else if (!result) {
      setShowBottomFade(false);
    }
  }, [result, loading]);

  // Met à jour l'état du fade lors du scroll manuel
  useEffect(() => {
    const el = resultScrollAreaRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
      const canScroll = el.scrollHeight > el.clientHeight + 4;
      setShowBottomFade(canScroll && !atBottom);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [result]);

  return (
    <main className={`min-h-screen font-sans transition-colors ${isLight ? 'text-gray-800 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(167,139,250,0.25),transparent_55%),linear-gradient(to_bottom_right,#f8fafc,#ffffff,#f5f3ff)]' : 'text-white bg-gradient-to-br from-blue-950 via-blue-900 to-purple-950'}`}>
      <Header
        branding={branding}
        botImage={branding?.botImage || `/${agent.image}`}
        tagline={tagline}
        targetLang={targetLang}
        handleLanguageChange={handleLanguageChange}
        colors={mergedColors}
        messages={messages}
        clearHistory={clearHistory}
        fixed={false}
      />
  {/* Espace sous le header fixe */}
  {/* Container avec plus d'espace sous le header fixe */}
  <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 md:pt-10 flex flex-col gap-8 transition-all">
  {/* Barre des tons remplacée par un select à côté du sélecteur de langue */}

        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* Source */}
          <div ref={sourcePanelRef} className={`relative flex flex-col rounded-xl border backdrop-blur-sm ${isLight ? 'bg-white/70 border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'} p-4 min-h-[420px]`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium uppercase tracking-wide opacity-70">Source</h2>
              <div className="flex gap-2">
                <button
                  disabled={!source}
                  onClick={() => setSource("")}
                  className="text-xs px-2 py-1 rounded border border-gray-300/70 dark:border-white/15 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M5 6l1 14c.1 1.1.9 2 2 2h8c1.1 0 1.9-.9 2-2l1-14" /></svg>
                  Effacer
                </button>
              </div>
            </div>
            <textarea
              className={`flex-1 w-full resize-none rounded-md border bg-transparent p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 ${isLight ? 'border-gray-300 focus:ring-indigo-300' : 'border-white/15 focus:ring-fuchsia-500/40'}`}
              placeholder={placeholder}
              value={source}
              onChange={(e) => setSource(e.target.value.slice(0, maxChars))}
              onKeyDown={handleSourceKeyDown}
            />
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 select-none">
              <span className="hidden sm:inline">Entrée pour envoyer • Shift+Entrée pour nouvelle ligne</span>
              <span className="sm:hidden">Entrée = envoyer</span>
              <span className={`ml-auto mr-2 tabular-nums ${charCount > maxChars*0.9 ? 'text-red-500 dark:text-red-400' : ''}`}>{charCount}/{maxChars}</span>
              {autoTriggered && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-400/40 animate-pulse" title="Envoi automatique après changement de langue">Auto</span>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                aria-label={sendButtonLabel || 'Transformer'}
                title={isLight ? 'Envoyer (Entrée)' : ''}
                className={`h-10 rounded-md text-sm font-medium transition flex items-center gap-2 px-4
                  ${isLight
                    ? (canSubmit
                        ? 'border border-gray-300/70 bg-white/80 text-gray-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.97]'
                        : 'border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed')
                    : (canSubmit
                        ? `bg-gradient-to-r ${colors.buttonGradientFrom || 'from-indigo-500'} ${colors.buttonGradientTo || 'to-violet-600'} text-white hover:opacity-90 active:scale-[0.97]`
                        : 'bg-white/10 text-gray-400 cursor-not-allowed')} 
                `}
              >
                {loading && <span className={`inline-block w-4 h-4 border-2 ${isLight ? 'border-gray-400 border-t-gray-700' : 'border-white/40 border-t-white'} animate-spin rounded-full`} />}
                {!loading && !isLight && canSubmit && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 opacity-90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4Z" /></svg>
                )}
                {sendButtonLabel || 'Transformer'}
              </button>
            </div>
          </div>

          {/* Résultat */}
          <div ref={resultPanelRef} className={`relative flex flex-col rounded-xl border backdrop-blur-sm ${isLight ? 'bg-white/70 border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'} p-4 min-h-[420px]`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h2 className="text-sm font-medium uppercase tracking-wide opacity-70">Résultat</h2>
              <div className="flex flex-wrap items-center gap-2">
                <LanguageSelector languages={languages} value={targetLang} onChange={val=>setTargetLang(val)} isLight={isLight} />
                <ToneSelect tones={tones} value={tone} onChange={setTone} isLight={isLight} />
                <button
                  onClick={copyResult}
                  disabled={!result}
                  className="text-xs px-2 py-1 rounded border border-gray-300/70 dark:border-white/15 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40"
                >
                  {copied ? 'Copié' : 'Copier'}
                </button>
                {result && (
                  <button
                    type="button"
                    onClick={() => setResult("")}
                    title="Vider le résultat"
                    aria-label="Vider le résultat"
                    className="flex items-center gap-1 h-7 px-2 rounded-md border text-[10px] font-medium transition
                      border-gray-300/70 dark:border-white/15
                      bg-white/70 dark:bg-white/10
                      text-gray-700 dark:text-gray-200
                      hover:bg-gray-100 dark:hover:bg-white/15 hover:text-gray-900 dark:hover:text-white
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-transparent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M5 6l1 14c.1 1.1.9 2 2 2h8c1.1 0 1.9-.9 2-2l1-14" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {showLang && (
              <div className="absolute top-14 right-4 z-20 w-48 max-h-72 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/15 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-2 flex flex-col gap-1 text-gray-800 dark:text-gray-100">
                {languagesSafe.map(lang => {
                  const selected = lang.value === targetLang;
                  return (
                    <button
                      key={lang._kid}
                      onClick={() => selectLang(lang.value)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition border text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${selected ? 'bg-gradient-to-r from-indigo-500/25 to-violet-500/25 text-indigo-700 dark:text-indigo-300 border-indigo-400/40 shadow-sm' : 'border-transparent'}`}
                      role="option"
                      aria-selected={selected}
                    >
                      <Image src={`https://flagcdn.com/${lang.flag}.svg`} alt={lang.label} width={18} height={18} className="rounded object-cover ring-1 ring-black/5 dark:ring-white/10" unoptimized />
                      <span className="truncate">{lang.label}</span>
                      {selected && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-auto text-indigo-600 dark:text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="relative flex-1 flex flex-col">
              {loading && (
                <div className="absolute inset-0 flex flex-col gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-3 rounded bg-gray-300/60 dark:bg-white/10 animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
                  ))}
                </div>
              )}
              <div
                ref={resultScrollAreaRef}
                className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-300/40 dark:scrollbar-thumb-indigo-500/40 max-h-[56vh] md:max-h-none overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {!loading && error && <div className="text-sm text-red-500">{error}</div>}
                {!loading && !error && result && (
                  <div className={highlightResult ? 'animate-[pulse_1.3s_ease-in-out] rounded-lg ring-1 ring-indigo-300/40 dark:ring-indigo-500/30 p-2 transition' : ''}>
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-normal">{result}</pre>
                    <div ref={resultEndRef} />
                  </div>
                )}
                {!loading && !error && !result && (
                  <p className="text-sm opacity-60 italic">Le résultat apparaîtra ici après traitement…</p>
                )}
              </div>
              {showBottomFade && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/90 dark:from-blue-950/90 to-transparent md:hidden" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {loading ? 'Traitement en cours…' : result ? 'Résultat mis à jour.' : error ? 'Erreur lors du traitement.' : ''}
      </div>
  {showToast && <Toast message={showToast} onDone={()=>setShowToast(null)} />}
      {/* Bouton flotant pour remonter à la source */}
      {result && (
        <button
          type="button"
          onClick={() => {
            const root = typeof document !== 'undefined' ? (document.scrollingElement || document.documentElement || document.body) : null;
            try {
              if (root?.scrollTo) root.scrollTo({ top: 0, behavior: 'smooth' });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch {
              if (root) root.scrollTop = 0;
              window.scrollTo(0,0);
            }
          }}
          aria-label="Revenir à la source"
          title="Revenir à la source"
          className={`fixed bottom-5 right-5 z-40 shadow-lg rounded-full p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70
            ${isLight
              ? 'bg-white/90 hover:bg-white text-indigo-700 border border-indigo-200'
              : 'bg-indigo-600/80 hover:bg-indigo-600 text-white border border-white/10 backdrop-blur'}
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </button>
      )}
    </main>
  );
}
