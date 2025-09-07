"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { useTheme } from "@/components/theme/ThemeProvider";
import { usePersistentState } from "@/hooks/usePersistentState";
// Tone & Language selectors retirés sur demande
import Toast from "@/components/ui/Toast";
import Header from "./AgentAudioWorkflow/Header"; // réutilisation du header existant pour cohérence visuelle

/*
  PostotoWorkflow
  Objectifs UI:
  - Connexions réseaux (Instagram, Facebook, LinkedIn) avec statut simulé (localStorage) + placeholders pour futur OAuth.
  - Zone de brief + options (tone, langue cible).
  - Sélection des plateformes à générer (toggle pills).
  - Génération d'un contenu de base via endpoint (agent.endpoint) puis adaptation locale par plateforme (simple transformations placeholder).
  - Preview par onglets + compteur de caractères selon plateforme.
  - Scheduling: date/time + fuseau (simple select) => envoyé avec payload.
  - Hashtag suggester (extraction simple de mots clefs + #) + CTA suggestions.
  - Export / Copier par plateforme.
  Remarque: Connexion réelle OAuth/API non implémentée ici (back-end requis). On expose des points d'extension clairs.
*/

// Limité à Instagram pour itération actuelle (autres plateformes retirées temporairement)
const PLATFORM_META = {
  instagram: { label: "Instagram", max: 2200, color: "from-pink-500 to-fuchsia-600", icon: InstaIcon },
};

// Personae de style rapide (peuvent être enrichies plus tard)
const PERSONAS = [
  { id: "friendly", label: "Chaleureux", prefix: "👋 " },
  { id: "expert", label: "Expert", prefix: "🧠 " },
  { id: "promo", label: "Promo", prefix: "🔥 " },
  { id: "story", label: "Storytelling", prefix: "📖 " },
];

export default function PostotoWorkflow({ agent }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const {
    endpoint,
    colors = {},
    branding = {},
    placeholder = "Décrivez votre publication...",
    tagline,
  } = agent || {};

  // Couleurs basiques (reprend logique Transactional)
  const baseDark = {
    gradientFrom: "from-fuchsia-950",
    gradientTo: "to-purple-950",
    textColor: "text-white",
    buttonGradientFrom: "from-fuchsia-500",
    buttonGradientTo: "to-purple-600",
  };
  const baseLight = {
    gradientFrom: "from-fuchsia-50",
    gradientTo: "to-purple-100",
    textColor: "text-gray-800",
    buttonGradientFrom: "from-fuchsia-500",
    buttonGradientTo: "to-purple-500",
  };
  const mergedColors = { ...(isLight ? baseLight : baseDark), ...colors };

  // Brief + parameters
  const [brief, setBrief] = usePersistentState("postoto_brief", "", { ttl: 1000 * 60 * 60 * 8 });
  const [persona, setPersona] = usePersistentState("postoto_persona", PERSONAS[0].id);
  const [targetLang, setTargetLang] = usePersistentState("postoto_lang", "français");
  const [platforms, setPlatforms] = usePersistentState("postoto_platforms", ["instagram"]);
  const [activeTab, setActiveTab] = useState("instagram");
  const [baseResult, setBaseResult] = useState("");
  const [variants, setVariants] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [hashtagPool, setHashtagPool] = useState([]);
  const [ctaSuggestions, setCtaSuggestions] = useState([]);
  const [connecting, setConnecting] = useState(null); // platform key in progress
  const [connections, setConnections] = usePersistentState("postoto_connections", { instagram: false });
  const [drafts, setDrafts] = usePersistentState("postoto_drafts", []);
  const [media, setMedia] = usePersistentState("postoto_media", []); // {id,name,size,type,data}
  const draftNameRef = useRef(null);

  const canGenerate = brief.trim().length > 0 && !loading;
  const personaPrefix = useMemo(() => PERSONAS.find(p => p.id === persona)?.prefix || "", [persona]);

  const togglePlatform = (p) => {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  // Simulate connect (placeholder for OAuth)
  // Connexion réelle Instagram (Basic Display) via endpoints internes
    const connect = async (p) => {
      if (p !== 'instagram') return;
      if (connections.instagram) {
        setConnections(c => ({ ...c, instagram: false }));
        setShowToast('Instagram déconnecté');
        return;
      }
      setConnecting(p);
      try {
        const r = await fetch('/api/instagram/connect');
        if (!r.ok) throw new Error("Impossible d'initier la connexion");
        const data = await r.json();
        if (data.url) {
          window.location.href = data.url; // redirection vers Instagram
          return;
        }
        throw new Error('URL OAuth manquante');
      } catch (e) {
        setShowToast(e.message);
      } finally {
        setConnecting(null);
      }
    };

  const autoExtractHashtags = useCallback((txt) => {
    if (!txt) return;
    const words = txt
      .toLowerCase()
      .replace(/[^a-zà-ü0-9\s]/gi, " ")
      .split(/\s+/)
      .filter((w) => w.length > 4 && w.length < 22)
      .slice(0, 18);
    const base = Array.from(new Set(words)).slice(0, 12).map((w) => `#${normalize(w)}`);
    setHashtagPool(base);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setLoading(true); setError(""); setBaseResult(""); setVariants({});
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: brief, persona, platforms, schedule: scheduleEnabled ? { date: scheduleDate, timezone } : null, media: media.map(m => ({ name: m.name, type: m.type, size: m.size })) }),
      });
      if (!r.ok) throw new Error("Erreur serveur");
      const data = await r.json().catch(() => ({}));
      const text = data.result || data.output || data[0]?.text || JSON.stringify(data, null, 2);
      setBaseResult(text);
      // Build simple variants
      const built = {};
      platforms.forEach((p) => { built[p] = adaptForPlatform(text, p, tone, hashtagPool, { personaPrefix }); });
      setVariants(built);
      if (!platforms.includes(activeTab) && platforms.length) setActiveTab(platforms[0]);
      if (!hashtagPool.length) autoExtractHashtags(text);
      if (!ctaSuggestions.length) buildCtas();
    } catch (e) {
      setError(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }, [brief, persona, platforms, scheduleEnabled, scheduleDate, timezone, endpoint, canGenerate, hashtagPool, ctaSuggestions.length, activeTab, autoExtractHashtags, personaPrefix, media]);

  const normalize = (w) => w.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]/gi, "").slice(0, 24);

  const buildCtas = () => {
    const arr = [
      "Découvre-en plus sur notre site",
      "Abonne-toi pour ne rien manquer",
      "Donne ton avis en commentaire",
      "Partage si ça t'inspire",
      "Enregistre ce post pour plus tard",
      "Contacte-nous en DM",
    ];
    setCtaSuggestions(arr);
  };

  const regenerateVariant = (p) => {
    if (!baseResult) return;
  setVariants((v) => ({ ...v, [p]: adaptForPlatform(baseResult, p, null, hashtagPool, { randomize: true, personaPrefix }) }));
    setShowToast(`Variante ${PLATFORM_META[p].label} régénérée`);
  };

  const copyVariant = (p) => {
    if (!variants[p]) return;
    navigator.clipboard.writeText(variants[p]);
    setShowToast(`${PLATFORM_META[p].label} copié`);
  };

  const saveDraft = () => {
    const name = draftNameRef.current?.value?.trim() || `Brouillon ${new Date().toLocaleString()}`;
  const payload = { id: Date.now(), name, brief, persona, platforms, variants, schedule: scheduleEnabled ? { date: scheduleDate, timezone } : null, media };
    setDrafts((d) => [payload, ...d].slice(0,25));
    setShowToast("Brouillon sauvegardé");
  };
  const loadDraft = (id) => {
    const d = drafts.find(dr => dr.id === id); if (!d) return;
    setBrief(d.brief); setTone(d.tone); if (d.persona) setPersona(d.persona); setTargetLang(d.targetLang); setPlatforms(d.platforms); setVariants(d.variants); if (d.schedule){ setScheduleEnabled(true); setScheduleDate(d.schedule.date); setTimezone(d.schedule.timezone);} else { setScheduleEnabled(false);} if (d.media) setMedia(d.media); setShowToast("Brouillon chargé");
  };
  const deleteDraft = (id) => { setDrafts(ds => ds.filter(d=>d.id!==id)); };

  const publish = () => {
    // Placeholder publication simulation
    const selected = platforms.filter(p=>variants[p]);
    if (!selected.length) { setShowToast("Aucune variante prête"); return; }
    setShowToast(scheduleEnabled ? "Publication programmée" : "Publication simulée");
  };

  // Gestion media locale
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    const remainingSlots = 5 - media.length;
    const slice = files.slice(0, remainingSlots);
    slice.forEach(file => {
      if (file.size > 2 * 1024 * 1024) { setShowToast(`Fichier trop lourd: ${file.name}`); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMedia(m => [...m, { id: Date.now() + Math.random(), name: file.name, size: file.size, type: file.type, data: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ""; // reset
  };
  const removeMedia = (id) => setMedia(m => m.filter(x => x.id !== id));

  // Export JSON
  const getExportPayload = () => ({ brief, persona, platforms, schedule: scheduleEnabled ? { date: scheduleDate, timezone } : null, variants, media: media.map(m => ({ name: m.name, type: m.type, size: m.size, data: m.data })) });
  const copyJson = () => { try { const json = JSON.stringify(getExportPayload(), null, 2); navigator.clipboard.writeText(json); setShowToast("JSON copié"); } catch { setShowToast("Échec copie JSON"); } };
  const downloadJson = () => { try { const blob = new Blob([JSON.stringify(getExportPayload(), null, 2)], { type:"application/json" }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `postoto_export_${Date.now()}.json`; a.click(); setShowToast("Exporté"); } catch { setShowToast("Échec export"); } };

  // Auto adapt when baseResult changes (e.g. new generation) handled inside generate
  useEffect(() => {
    if (!brief && baseResult) setBaseResult("");
  }, [brief, baseResult]);

  // Sélecteur de langue supprimé; garder targetLang interne si besoin futur

  // Assainir plateformes persistées (si anciennes clés restent en storage)
  useEffect(() => {
    setPlatforms(prev => prev.filter(p => PLATFORM_META[p]));
  }, [setPlatforms]);

  useEffect(() => {
    if (!PLATFORM_META[activeTab]) setActiveTab(Object.keys(PLATFORM_META)[0]);
  }, [activeTab]);

  return (
    <main className={`min-h-screen font-sans ${isLight ? "text-gray-800 bg-[radial-gradient(circle_at_20%_15%,rgba(244,114,182,0.25),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(167,139,250,0.25),transparent_55%),linear-gradient(to_bottom_right,#fdf2f8,#faf5ff,#f5f3ff)]" : "text-white bg-gradient-to-br from-fuchsia-950 via-purple-950 to-indigo-950"}`}>
      <Header
        branding={branding}
        botImage={branding?.botImage || `/${agent.image}`}
        tagline={tagline}
        targetLang={targetLang}
        handleLanguageChange={(e) => setTargetLang(e.target?.value)}
        colors={mergedColors}
        messages={[]} // no chat history
        clearHistory={() => {}}
        fixed={false}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-8 flex flex-col gap-10">
        {/* Top layout: Brief + Settings / Connections */}
        <section className="grid gap-8 md:grid-cols-3 items-start">
          <div className={`md:col-span-2 rounded-2xl border backdrop-blur-sm p-5 flex flex-col gap-4 ${isLight ? "bg-white/70 border-gray-200" : "bg-white/5 border-white/10"}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80 flex items-center gap-2">Brief</h2>
              <div className="flex gap-2">
                {/* Sélecteurs ton & langue retirés */}
                  <select value={persona} onChange={(e)=>setPersona(e.target.value)} className={`h-11 rounded-md px-3 text-xs font-medium border focus:outline-none focus:ring-2 ${isLight?"bg-white border-gray-300 focus:ring-fuchsia-300":"bg-white/10 border-white/15 focus:ring-fuchsia-500/40"}`} title="Persona">
                    {PERSONAS.map(p=> <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
              </div>
            </div>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value.slice(0, 6000))}
              placeholder={placeholder}
              className={`min-h-[180px] resize-none rounded-lg border p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 ${isLight ? "border-gray-300 focus:ring-fuchsia-300 bg-white/80" : "border-white/15 focus:ring-fuchsia-500/40 bg-white/5"}`}
            />
              <div className="flex flex-wrap items-center gap-3">
              {platforms.filter(p=>PLATFORM_META[p]).map((k) => {
                const meta = PLATFORM_META[k];
                const active = activeTab === k;
                const Connected = connections[k];
                return (
                  <button key={k} onClick={() => setActiveTab(k)} className={`group relative h-10 px-4 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 border transition ${active ? (isLight ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white border-fuchsia-400" : "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white border-fuchsia-400/40") : (isLight ? "bg-white border-gray-300 text-gray-600 hover:text-gray-900" : "bg-white/5 border-white/10 text-white/60 hover:text-white")}`}>
                    <span className="relative flex items-center gap-1.5">
                      {meta?.icon && meta.icon({ className: "w-4 h-4" })}
                      {meta?.label || k}
                      {Connected && <span className="ml-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(255,255,255,0.35)]" title="Connecté" />}
                    </span>
                  </button>
                );
              })}
              <div className="ml-auto flex items-center gap-3 flex-wrap justify-end">
                <div className="flex items-center gap-2">
                  <input ref={draftNameRef} placeholder="Nom brouillon" className={`h-11 w-40 rounded-md px-3 text-xs border bg-transparent focus:outline-none focus:ring-2 ${isLight?"border-gray-300 focus:ring-fuchsia-300":"border-white/15 focus:ring-fuchsia-500/40"}`} />
                  <button onClick={saveDraft} type="button" className={`h-11 px-4 rounded-lg text-xs font-medium border ${isLight?"bg-white border-gray-300 hover:bg-gray-100":"bg-white/10 border-white/15 hover:bg-white/15"}`}>Sauver</button>
                  {drafts.length>0 && (
                    <div className="relative group">
                      <button type="button" className={`h-11 px-4 rounded-lg text-xs font-medium border ${isLight?"bg-white border-gray-300 hover:bg-gray-100":"bg-white/10 border-white/15 hover:bg-white/15"}`}>Brouillons ({drafts.length})</button>
                      <div className={`absolute z-30 hidden group-hover:flex flex-col max-h-72 overflow-y-auto right-0 top-full mt-1 w-56 rounded-lg border p-2 backdrop-blur-xl ${isLight?"bg-white/90 border-gray-200":"bg-white/10 border-white/15"}`}>
                        {drafts.map(d=> (
                          <div key={d.id} className={`flex items-center gap-2 text-[11px] py-1 border-b last:border-b-0 ${isLight?"border-gray-200":"border-white/10"}`}>
                            <button onClick={()=>loadDraft(d.id)} className="flex-1 text-left truncate hover:underline">{d.name}</button>
                            <button onClick={()=>deleteDraft(d.id)} className="text-red-500 hover:opacity-70" title="Supprimer">✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  disabled={!canGenerate}
                  onClick={handleGenerate}
                  className={`h-11 px-6 rounded-lg text-sm font-medium flex items-center gap-2 transition ${canGenerate ? (isLight ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow hover:shadow-md active:scale-[0.97]" : "bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:opacity-90 active:scale-[0.97]") : "bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed"}`}
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white animate-spin rounded-full" />}
                  Générer
                </button>
                <button onClick={publish} type="button" className={`h-11 px-5 rounded-lg text-sm font-medium border ${isLight?"bg-white border-gray-300 hover:bg-gray-100":"bg-white/10 border-white/15 hover:bg-white/15"}`}>Publier</button>
                <button onClick={copyJson} type="button" className={`h-11 px-4 rounded-lg text-xs font-medium border ${isLight?"bg-white border-gray-300 hover:bg-gray-100":"bg-white/10 border-white/15 hover:bg-white/15"}`}>Copier JSON</button>
                <button onClick={downloadJson} type="button" className={`h-11 px-4 rounded-lg text-xs font-medium border ${isLight?"bg-white border-gray-300 hover:bg-gray-100":"bg-white/10 border-white/15 hover:bg-white/15"}`}>Exporter</button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {scheduleEnabled && (
              <div className="grid sm:grid-cols-3 gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase font-semibold opacity-70">Date & heure</label>
                  <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className={`rounded-md px-2 py-2 text-sm border bg-transparent focus:outline-none focus:ring-2 ${isLight ? "border-gray-300 focus:ring-fuchsia-300" : "border-white/15 focus:ring-fuchsia-500/40"}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase font-semibold opacity-70">Fuseau</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={`rounded-md px-2 py-2 text-sm border bg-transparent focus:outline-none focus:ring-2 ${isLight ? "border-gray-300 focus:ring-fuchsia-300" : "border-white/15 focus:ring-fuchsia-500/40"}`}>
                    {[timezone, "UTC", "Europe/Paris", "America/New_York", "Africa/Dakar", "Asia/Dubai"].filter((v,i,a)=>a.indexOf(v)===i).map(z => <option key={z}>{z}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase font-semibold opacity-70">Actions</label>
                  <button onClick={() => setScheduleEnabled(false)} className={`h-[42px] rounded-md text-xs font-medium border ${isLight ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100" : "border-fuchsia-500/40 bg-fuchsia-500/15 text-fuchsia-200 hover:bg-fuchsia-500/25"}`}>Annuler</button>
                </div>
              </div>
            )}
            {!scheduleEnabled && (
              <button onClick={() => setScheduleEnabled(true)} className={`mt-1 self-start text-xs px-3 py-1.5 rounded-full border ${isLight ? "border-fuchsia-300 text-fuchsia-700 hover:bg-fuchsia-50" : "border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-500/15"}`}>Programmer une publication</button>
            )}

            {/* Media uploader */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide opacity-80">Médias ({media.length}/5)</h4>
                <label className={`cursor-pointer h-8 px-3 rounded-md text-[11px] font-semibold border flex items-center gap-1 ${isLight?"bg-white border-gray-300 hover:bg-gray-100":"bg-white/10 border-white/15 hover:bg-white/15"}`}>
                  <input type="file" multiple accept="image/*,video/*" onChange={handleMediaChange} className="hidden" />Ajouter
                </label>
              </div>
              {media.length === 0 && <p className="text-[11px] opacity-60">Ajoutez jusqu&apos;à 5 images / vidéos (2 Mo max chacun) pour contextualiser.</p>}
              {media.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {media.map(m => (
                    <div key={m.id} className={`relative w-24 h-24 rounded-lg overflow-hidden border group ${isLight?"border-gray-300 bg-white/70":"border-white/10 bg-white/5"}`}>
                      {m.type.startsWith('image') ? <Image src={m.data} alt={m.name} fill sizes="96px" className="object-cover" /> : <video src={m.data} className="object-cover w-full h-full" />}
                      <button onClick={()=>removeMedia(m.id)} className="absolute top-1 right-1 text-[10px] bg-black/60 text-white rounded px-1 opacity-0 group-hover:opacity-100">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Connections */}
          <div className={`rounded-2xl border backdrop-blur-sm p-5 flex flex-col gap-5 ${isLight ? "bg-white/70 border-gray-200" : "bg-white/5 border-white/10"}`}>
            <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80">Connexions</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {PLATFORM_META.instagram.icon({ className: 'w-5 h-5' })}
                  <span className="text-sm font-medium">Instagram</span>
                  {connections.instagram && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">OK</span>}
                </div>
                <button onClick={() => connect('instagram')} disabled={connecting === 'instagram'} className={`h-8 px-3 rounded-md text-[11px] font-semibold border flex items-center gap-1 transition ${connections.instagram ? (isLight ? "bg-white border-gray-300 text-gray-600 hover:bg-gray-100" : "bg-white/10 border-white/15 text-white/70 hover:bg-white/15") : (isLight ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white border-fuchsia-400 shadow hover:shadow-md" : "bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white border-fuchsia-400/40 hover:opacity-90")}`}>{connecting === 'instagram' ? '...' : connections.instagram ? 'Déconnecter' : 'Connecter'}</button>
              </li>
            </ul>
            <p className="text-[11px] leading-relaxed opacity-60">Connexion réelle Instagram via OAuth Basic Display. Configurez les variables d&apos;environnement INSTAGRAM_CLIENT_ID / SECRET / REDIRECT_URI.</p>

            {/* Scheduled drafts overview */}
            {drafts.filter(d=>d.schedule && new Date(d.schedule.date) > Date.now()).length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide opacity-80">Programmés</h4>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-fuchsia-400/40 dark:scrollbar-thumb-fuchsia-500/40">
                  {drafts.filter(d=>d.schedule && new Date(d.schedule.date) > Date.now()).sort((a,b)=> new Date(a.schedule.date) - new Date(b.schedule.date)).slice(0,15).map(d => (
                    <div key={d.id} className={`flex items-center gap-2 p-2 rounded-md border ${isLight?"bg-white/70 border-gray-200":"bg-white/5 border-white/10"}`}>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium truncate">{d.name}</div>
                        <div className="text-[10px] opacity-60 flex flex-wrap gap-1">
                          {d.platforms.map(p=> <span key={p} className="px-1 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-500 text-[9px]">{PLATFORM_META[p]?.label?.slice(0,3)}</span>)}
                          <span>{new Date(d.schedule.date).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={()=>loadDraft(d.id)} className={`h-6 px-2 rounded-md text-[10px] font-semibold border ${isLight?"bg-white border-gray-300":"bg-white/10 border-white/15"}`}>↺</button>
                        <button onClick={()=>deleteDraft(d.id)} className={`h-6 px-2 rounded-md text-[10px] font-semibold border text-red-500 border-red-400/40 bg-red-500/10 hover:bg-red-500/20`}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Variants & Preview */}
  <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
            {platforms
              .filter((p) => PLATFORM_META[p])
              .map((p) => {
                const meta = PLATFORM_META[p];
                if (!meta) return null;
                const active = activeTab === p;
                return (
                  <button
                    key={p}
                    onClick={() => setActiveTab(p)}
                    className={`relative px-4 h-10 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 transition ${active
                      ? (isLight
                        ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow"
                        : "bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white")
                      : (isLight
                        ? "bg-white border border-gray-300 text-gray-600 hover:text-gray-900"
                        : "bg-white/5 border border-white/10 text-white/60 hover:text-white")}`}
                  >
                    {meta?.icon && meta.icon({ className: "w-4 h-4" })}
                    {meta?.label || p}
                    {variants[p] && <span className="ml-1 w-2 h-2 rounded-full bg-emerald-400" />}
                  </button>
                );
              })}
          </div>
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <VariantEditor
                platform={activeTab}
                meta={PLATFORM_META[activeTab]}
                value={variants[activeTab] || ""}
                setValue={(val) => setVariants((v) => ({ ...v, [activeTab]: val }))}
                max={PLATFORM_META[activeTab]?.max}
                loading={loading}
                regenerate={() => regenerateVariant(activeTab)}
                copy={() => copyVariant(activeTab)}
                isLight={isLight}
              />
              <PreviewMock platform={activeTab} content={variants[activeTab] || ""} isLight={isLight} />
            </div>
            <aside className="flex flex-col gap-6">
              <HashtagPanel pool={hashtagPool} setPool={setHashtagPool} apply={(tags) => {
                if (!activeTab) return;
                setVariants((v) => ({ ...v, [activeTab]: (v[activeTab] || "") + "\n\n" + tags.join(" ") }));
              }} isLight={isLight} />
              <CtaPanel ctas={ctaSuggestions} onClick={(cta) => setVariants((v) => ({ ...v, [activeTab]: (v[activeTab] || "") + "\n\n" + cta }))} isLight={isLight} />
            </aside>
          </div>
        </section>
      </div>
      {showToast && <Toast message={showToast} onDone={() => setShowToast(null)} />}
    </main>
  );
}

// Helpers
  function adaptForPlatform(text, platform, _unusedTone, hashtags, { randomize, personaPrefix } = {}) {
  let t = text.trim();
  const baseTags = hashtags && hashtags.length ? hashtags.slice(0, 8).join(" ") : "";
  if (personaPrefix && !t.startsWith(personaPrefix)) t = personaPrefix + t;
  // Instagram formatting
  if (!/\n\n/.test(t)) t = t.replace(/\.\s+/g, ".\n\n");
  t = t + (baseTags ? `\n\n${baseTags}` : "");
  if (randomize) t += "\n" + randomSuffix();
  return t;
}
function randomSuffix() {
  const arr = ["(version A)", "(version B)", "(alt)", "(✨)"]; return arr[Math.floor(Math.random()*arr.length)];
}
  // capitalizeTone supprimé (ton retiré)

// Variant Editor Component
function VariantEditor({ platform, meta, value, setValue, max, loading, regenerate, copy, isLight }) {
  const count = value.length;
  return (
    <div className={`relative rounded-2xl border backdrop-blur-sm p-5 flex flex-col gap-3 ${isLight ? "bg-white/70 border-gray-200" : "bg-white/5 border-white/10"}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-wide opacity-80 flex items-center gap-2">{meta?.label} – Variante</h4>
        <div className="flex items-center gap-2">
          <button onClick={regenerate} disabled={loading || !value} className={`h-8 px-3 rounded-md text-[11px] font-semibold border ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-100" : "bg-white/10 border-white/15 text-white/70 hover:bg-white/15"}`}>↻</button>
          <button onClick={copy} disabled={!value} className={`h-8 px-3 rounded-md text-[11px] font-semibold border ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-100" : "bg-white/10 border-white/15 text-white/70 hover:bg-white/15"}`}>Copier</button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, max))}
        placeholder={loading ? "Génération..." : "Contenu généré apparaîtra ici"}
        className={`min-h-[320px] resize-none rounded-lg border p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 ${isLight ? "border-gray-300 focus:ring-fuchsia-300 bg-white/80" : "border-white/15 focus:ring-fuchsia-500/40 bg-white/5"}`}
      />
      <div className="flex items-center justify-between text-[11px] opacity-70">
        <span>Limite {max.toLocaleString()} caractères</span>
        <span className={`${count > max * 0.9 ? "text-red-500 dark:text-red-400" : ""}`}>{count}/{max}</span>
      </div>
    </div>
  );
}

function HashtagPanel({ pool, setPool, apply, isLight }) {
  const regenerate = () => {
    // simple shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 12);
    setPool(shuffled);
  };
  if (!pool.length) return (
    <div className={`rounded-2xl border backdrop-blur-sm p-4 flex flex-col gap-3 ${isLight ? "bg-white/70 border-gray-200" : "bg-white/5 border-white/10"}`}>
      <h5 className="text-xs font-semibold uppercase tracking-wide opacity-80">Hashtags</h5>
  <p className="text-[11px] opacity-70">Générez d&apos;abord un contenu pour extraction automatique des hashtags.</p>
    </div>
  );
  return (
    <div className={`rounded-2xl border backdrop-blur-sm p-4 flex flex-col gap-3 ${isLight ? "bg-white/70 border-gray-200" : "bg-white/5 border-white/10"}`}>
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-semibold uppercase tracking-wide opacity-80">Hashtags</h5>
        <div className="flex gap-2">
          <button onClick={regenerate} className={`h-7 px-2 rounded-md text-[10px] font-semibold border ${isLight ? "bg-white border-gray-300 text-gray-600 hover:bg-gray-100" : "bg-white/10 border-white/15 text-white/70 hover:bg-white/15"}`}>↻</button>
          <button onClick={() => apply(pool.slice(0,8))} className={`h-7 px-2 rounded-md text-[10px] font-semibold border ${isLight ? "bg-white border-gray-300 text-gray-600 hover:bg-gray-100" : "bg-white/10 border-white/15 text-white/70 hover:bg-white/15"}`}>Appliquer</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pool.map((h) => (
          <span key={h} className={`px-2 py-1 rounded-full text-[10px] font-medium border ${isLight ? "bg-white border-gray-300 text-gray-700" : "bg-white/5 border-white/10 text-white/70"}`}>{h}</span>
        ))}
      </div>
    </div>
  );
}

function CtaPanel({ ctas, onClick, isLight }) {
  if (!ctas.length) return null;
  return (
    <div className={`rounded-2xl border backdrop-blur-sm p-4 flex flex-col gap-3 ${isLight ? "bg-white/70 border-gray-200" : "bg-white/5 border-white/10"}`}>
      <h5 className="text-xs font-semibold uppercase tracking-wide opacity-80">CTA</h5>
      <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-fuchsia-400/40 dark:scrollbar-thumb-fuchsia-500/40">
        {ctas.map((c) => (
          <button key={c} onClick={() => onClick(c)} className={`text-left w-full px-3 py-2 rounded-md text-[11px] leading-snug border transition ${isLight ? "bg-white/80 border-gray-300 text-gray-700 hover:bg-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>{c}</button>
        ))}
      </div>
    </div>
  );
}

function PreviewMock({ platform, content, isLight }) {
  if (!content) return null;
  return (
    <div className={`rounded-2xl border backdrop-blur-sm p-4 flex flex-col gap-3 ${isLight?"bg-white/70 border-gray-200":"bg-white/5 border-white/10"}`}>
      <h5 className="text-xs font-semibold uppercase tracking-wide opacity-80">Prévisualisation Instagram</h5>
      <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500" /> <span className="text-sm font-semibold">brand_account</span></div>
      <p className="text-[12px] leading-relaxed whitespace-pre-wrap font-normal">{content}</p>
      <div className="mt-2 text-[11px] opacity-60">❤️ 128  • 💬 14</div>
    </div>
  );
  if (platform === 'linkedin') {
    return wrap('', <div>
      <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded bg-sky-500" /> <div><div className="text-sm font-semibold">Brand Corp</div><div className="text-[10px] opacity-60">Entreprise • 25 421 abonnés</div></div></div>
      <p>{content}</p>
      <div className="mt-2 flex gap-4 text-[11px] opacity-60"><span>👍 230</span><span>💬 42 commentaires</span><span>↗️ 8 partages</span></div>
    </div>);
  }
  if (platform === 'facebook') {
    return wrap('', <div>
      <div className="flex items-center gap-2 mb-2"><div className="w-9 h-9 rounded-full bg-blue-600" /> <span className="text-sm font-semibold">Ma Page</span></div>
      <p>{content}</p>
      <div className="mt-2 text-[11px] opacity-60">👍 412  • 💬 33  • ↗️ 11</div>
    </div>);
  }
  if (platform === 'x') {
    return wrap('', <div>
      <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-neutral-700" /> <span className="text-sm font-semibold">@brand</span></div>
      <p>{content}</p>
      <div className="mt-2 flex gap-6 text-[11px] opacity-60"><span>❤ 54</span><span>💬 9</span><span>🔁 7</span></div>
    </div>);
  }
  if (platform === 'tiktok') {
    return wrap('', <div>
      <div className="flex items-center gap-2 mb-2"><div className="w-10 h-10 rounded bg-gradient-to-br from-rose-500 to-cyan-500" /> <span className="text-sm font-semibold">brand.tok</span></div>
      <p>{content}</p>
      <div className="mt-2 text-[11px] opacity-60">❤ 2.3K  • 💬 120  • ↗️ 45</div>
    </div>);
  }
  return null;
}

function XIcon({ className }) { return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2h3.3l-7.2 8.23L23 22h-6.5l-5.1-6.9L5.4 22H2.1l7.7-8.8L1 2h6.6l4.6 6.2L18.2 2Zm-2.3 17.9h1.8L8.21 4.1H6.3l9.6 15.8Z"/></svg>; }
function TikTokIcon({ className }) { return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2h3.2c.2 1.5 1.2 2.9 2.6 3.6v3.2c-1.1-.03-2.2-.33-3.2-.86v5.72a6.84 6.84 0 1 1-6.84-6.84c.23 0 .46.01.68.04v3.42a3.42 3.42 0 1 0 3.42 3.42V2Z"/></svg>; }

// Icons
function InstaIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/></svg>
  );
}
function FbIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5 3.66 9.14 8.44 9.93v-7.03H7.9v-2.9h2.4V9.41c0-2.37 1.42-3.68 3.6-3.68 1.04 0 2.13.18 2.13.18v2.35h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.9h-2.22V22c4.78-.79 8.44-4.93 8.44-9.93Z" /></svg>
  );
}
function LiIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.6 4.09 5.5 3 5.5a1.99 1.99 0 1 1 0-3.98c1.09 0 1.98.89 1.98 1.98ZM5 8H1v16h4V8Zm7.5 0h-4V24h4v-7.7c0-2.1.4-4.1 3-4.1 2.5 0 2.5 2.3 2.5 4.2V24h4v-8.9c0-4.4-1-7.1-5.6-7.1-2.3 0-3.8 1.3-4.4 2.4h-.1V8Z"/></svg>
  );
}
