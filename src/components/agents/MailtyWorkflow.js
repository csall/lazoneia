"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import Header from "./AgentAudioWorkflow/Header";
import agents from "@/config/agents";

export default function MailtyWorkflow(){
  // Récupère la config Mailty dynamiquement
  const mailtyConfig = agents.find(a => a.name === "Mailty");
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { data: session, status } = useSession();
  const connected = !!session?.accessToken;
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [draft, setDraft] = useState("");
  const [aiReply, setAiReply] = useState("");
  const draftRef = useRef(null);
  const aiReplyBlockRef = useRef(null);
  // Scroll to AI reply when it appears
  useEffect(() => {
    if (aiReply && aiReplyBlockRef.current) {
      aiReplyBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [aiReply]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAutoTriggered, setAiAutoTriggered] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const debounceRef = useRef(null);
  const [tone, setTone] = useState('neutre');
  const toneOptions = [
    { value: 'neutre', label: 'Neutre' },
    { value: 'professionnel', label: 'Professionnel' },
    { value: 'amical', label: 'Amical' },
    { value: 'concis', label: 'Concis' },
    { value: 'enthousiaste', label: 'Enthousiaste' },
    { value: 'persuasif', label: 'Persuasif' }
  ];

  const fetchEmails = useCallback(async(q)=>{
    if(!connected) return;
    if(!initialLoaded) setLoading(true);
    setRefreshing(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if(q && q.trim()) params.set('q', q.trim());
      const url = `/api/mailty/list${params.toString()?`?${params.toString()}`:""}`;
      const r = await fetch(url);
      if(!r.ok) throw new Error("Erreur chargement emails");
      const data = await r.json();
      setEmails(data.messages||[]);
      if(!initialLoaded) setInitialLoaded(true);
    } catch(e){ setError(e.message); }
    finally { setLoading(false); }
    setRefreshing(false);
  },[connected, initialLoaded]);

  const fetchDetail = useCallback(async(id)=>{
    setSelected(id); setDetail(null); setAiReply(""); setDraft("");
    try {
      const r = await fetch(`/api/mailty/detail?id=${encodeURIComponent(id)}`);
      if(!r.ok) throw new Error("Erreur détail");
      const data = await r.json();
      setDetail(data);
    } catch(e){ setError(e.message); }
  },[]);

  // Retour liste sur mobile
  const backToList = useCallback(()=>{
    setSelected(null); setDetail(null); setAiReply("");
  },[]);

  const generateReply = useCallback(async(auto=false)=>{
    if(!detail || aiLoading) return;
    setAiLoading(true);
    if(!auto) setAiReply("...");
    try {
      // Unifie le payload comme l'agent reply: 'message', 'tone'
      const message = `Objet: ${detail.subject || '(Sans objet)'}\n\n${detail.snippet||detail.body||''}`.slice(0,6000);
      const r = await fetch("/api/mailty/ai-reply",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message, subject:detail.subject, body:detail.snippet||detail.body||"", tone})});
      const data = await r.json();
      setAiReply(data.reply||"(pas de réponse)");
      if(!draft.trim()) {
        // Auto place dans brouillon si vide pour accélérer flux
        setDraft(data.reply||"");
      }
    } catch { setAiReply("(erreur)"); }
    finally { setAiLoading(false); }
  },[detail, tone, aiLoading, draft]);

  // Auto régénération sur changement de ton (comme agent reply) après première génération manuelle
  const firstToneChangeRef = useRef(true);
  const aiReplyRef = useRef("");
  const detailRef = useRef(null);
  const generateReplyRef = useRef(generateReply);
  useEffect(()=>{ aiReplyRef.current = aiReply; },[aiReply]);
  useEffect(()=>{ detailRef.current = detail; },[detail]);
  useEffect(()=>{ generateReplyRef.current = generateReply; },[generateReply]);
  useEffect(()=>{
    if(!detailRef.current) return;
    if(firstToneChangeRef.current){ firstToneChangeRef.current = false; return; }
    if(aiReplyRef.current){
      setAiAutoTriggered(true);
      generateReplyRef.current(true);
      const to = setTimeout(()=> setAiAutoTriggered(false), 1200);
      return ()=> clearTimeout(to);
    }
  },[tone]);

  const sendEmail = useCallback(async()=>{
    if(!draft.trim()) return;
    setSending(true);
    try {
      const r = await fetch("/api/mailty/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({threadId:detail?.threadId,to:detail?.fromEmail,subject:`Re: ${detail?.subject}`,body:draft})});
      if(!r.ok) throw new Error("Envoi échoué");
      setDraft(""); setAiReply("");
    } catch(e){ setError(e.message); }
    finally { setSending(false); }
  },[draft, detail]);

  // initial load
  useEffect(()=>{ if(connected) fetchEmails(""); },[connected, fetchEmails]);

  // debounce search
  useEffect(()=>{
    if(!connected) return;
    if(debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(()=>{
      fetchEmails(search + (unreadOnly? (search?" ":"") + "label:unread" : ""));
    }, 420);
    return ()=> debounceRef.current && clearTimeout(debounceRef.current);
  },[search, unreadOnly, connected, fetchEmails]);

  return (
    <>
      <Header
        branding={mailtyConfig?.branding}
        tagline={mailtyConfig?.tagline}
        colors={mailtyConfig?.colors}
        messages={[]}
        clearHistory={()=>{}}
        fixed={false}
      />
      <main className="pt-8 px-4 pb-12 max-w-7xl mx-auto font-sans">
        <h1 className="sr-only">Mailty Gmail Assistant</h1>
        {/* Global keyboard hints / accessibility helper */}
        <div className="sr-only" aria-live="polite">Utilise Tab pour naviguer, Entrée pour ouvrir un email, Échap pour revenir à la liste sur mobile.</div>
      {!connected && (
        <div className="p-6 rounded-xl border bg-white/70 dark:bg-white/5 backdrop-blur-md flex flex-col gap-4 max-w-xl">
          <p className="text-sm text-gray-700 dark:text-gray-200">Connecte ton compte Google pour consulter et répondre à tes emails.</p>
          <button onClick={()=>signIn("google")} className="h-11 px-5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium shadow hover:brightness-110 transition">Se connecter avec Google</button>
        </div>
      )}
      {connected && (
        <div className="flex flex-col gap-4 mt-2">
          {/* Toolbar */}
          <div className="rounded-xl border bg-white/80 dark:bg-white/10 backdrop-blur-md px-4 py-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <input
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  placeholder="Rechercher (expéditeur, sujet, label:unread, after:2025/09/01) ..."
                  className="w-full rounded-lg pl-10 pr-3 py-2 text-sm bg-white/70 dark:bg-white/10 border border-violet-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/50 placeholder-gray-400 dark:placeholder-white/40 shadow-inner"
                  aria-label="Rechercher dans les emails"
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-violet-500 dark:text-violet-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <button
                onClick={()=> setUnreadOnly(u=>!u)}
                className={`text-xs h-8 px-3 rounded-md font-medium border transition flex items-center gap-1 ${unreadOnly? 'bg-violet-600 text-white border-violet-500 shadow':'bg-white/60 dark:bg-white/10 border-violet-200 dark:border-white/10 text-violet-700 dark:text-violet-200 hover:bg-white dark:hover:bg-white/15'}`}
                aria-pressed={unreadOnly}
              >
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"/> Non lus
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 tracking-wide uppercase">{emails.length} messages</span>
              <button
                onClick={()=>fetchEmails(search + (unreadOnly? (search?" ":"") + "label:unread" : ""))}
                disabled={refreshing}
                className="h-8 px-3 rounded-md text-xs font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow hover:brightness-110 disabled:opacity-50"
                aria-label="Rafraîchir la liste"
              >{refreshing? '...' : 'Rafraîchir'}</button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 touch-pan-y">
            {/* LIST */}
            <div className={`rounded-2xl border bg-white/80 dark:bg-white/5 backdrop-blur-xl flex flex-col overflow-hidden shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] ${detail? 'hidden lg:flex' : 'flex'}`}> 
              <div className="px-4 py-2 border-b dark:border-white/10 flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-wide text-violet-700 dark:text-violet-200 uppercase">Inbox</h2>
                {loading && <span className="text-[10px] text-violet-500 dark:text-violet-300 animate-pulse">chargement...</span>}
              </div>
              <div className="flex-1 overflow-y-auto text-sm divide-y dark:divide-white/5 custom-scroll overscroll-contain scroll-smooth max-h-[calc(100vh-270px)] lg:max-h-none">
                {loading && !initialLoaded && (
                  <div className="p-4 space-y-3 animate-pulse">
                    {Array.from({length:6}).map((_,i)=>(
                      <div key={i} className="space-y-2">
                        <div className="flex gap-2">
                          <div className="h-3 w-10 rounded bg-violet-200/60 dark:bg-violet-500/20"/>
                          <div className="h-3 flex-1 rounded bg-violet-200/50 dark:bg-violet-500/20"/>
                        </div>
                        <div className="h-2 w-3/4 rounded bg-violet-200/40 dark:bg-violet-500/10"/>
                      </div>
                    ))}
                  </div>) }
                {!loading && emails.length===0 && (
                  <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">
                    Aucun email.
                    <div className="mt-2">
                      <button onClick={()=>fetchEmails(search)} className="px-3 py-1.5 text-[11px] rounded-md border border-violet-300 dark:border-violet-500/40 bg-white/70 dark:bg-white/10 hover:bg-violet-50 dark:hover:bg-white/20">Réessayer</button>
                  </div></div>
                )}
                {emails.map(m=> {
                  const isUnread = m.labelIds?.includes('UNREAD');
                  const date = m.internalDate ? new Date(parseInt(m.internalDate,10)) : null;
                  const rel = date ? (()=>{
                    const diff = Date.now()-date.getTime();
                    const mns = Math.floor(diff/60000);
                    if(mns<60) return mns<=1? '1m' : mns+'m';
                    const hrs = Math.floor(mns/60);
                    if(hrs<24) return hrs+'h';
                    const days = Math.floor(hrs/24); if(days<7) return days+'j';
                    return date.toLocaleDateString();
                  })() : '';
                  return (
                  <button
                    key={m.id}
                    onClick={()=>fetchDetail(m.id)}
                    className={`group w-full text-left px-4 py-3 flex flex-col gap-1 transition relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:z-10 ${selected===m.id? 'bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 dark:from-violet-500/20 dark:to-fuchsia-500/25' : 'hover:bg-violet-500/10 dark:hover:bg-violet-500/15'} ${isUnread? 'font-semibold' : ''}`}
                    aria-current={selected===m.id}
                    aria-label={`Email de ${m.fromName||m.fromEmail} sujet ${m.subject||'Sans objet'} ${isUnread? 'non lu':''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold uppercase bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 dark:from-violet-500/25 dark:to-fuchsia-500/25 ${isUnread? 'ring-2 ring-fuchsia-400/50 dark:ring-fuchsia-500/40' : ''}`}>
                        {(m.fromName||m.fromEmail||'?').slice(0,2)}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`truncate flex-1 text-[13px] ${isUnread? 'text-violet-900 dark:text-fuchsia-100' : 'text-gray-700 dark:text-gray-100'} group-hover:text-violet-700 dark:group-hover:text-fuchsia-200`}>{m.subject||'(Sans objet)'}</span>
                          {isUnread && <span className="px-1.5 py-0.5 rounded-full bg-fuchsia-600 text-white text-[9px] tracking-wide">NEW</span>}
                          {rel && <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">{rel}</span>}
                        </div>
                        <p className="text-[11px] line-clamp-2 text-gray-500 dark:text-fuchsia-200/90 leading-snug">{m.snippet}</p>
                      </div>
                    </div>
                    <span className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-70 transition"/>
                  </button>
                ); })}
              </div>
              <div className="px-4 py-2 border-t dark:border-white/10 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-white/5">
                <span className="uppercase tracking-wider">{emails.length} items</span>
                <button onClick={()=>{setSelected(null); setDetail(null);}} className="text-violet-600 dark:text-violet-300 hover:underline">Clear sélection</button>
              </div>
            </div>
            {/* DETAIL */}
            <div className={`rounded-2xl border bg-white/80 dark:bg-white/5 backdrop-blur-xl flex flex-col overflow-hidden lg:col-span-2 shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] ${detail? 'block' : 'block lg:block'} ${!detail? 'hidden lg:flex' : ''}`}>
              <div className="px-5 py-3 border-b dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-violet-50/60 to-fuchsia-50/40 dark:from-violet-950/40 dark:to-fuchsia-900/30">
                <div className="flex items-center gap-3">
                  {detail && (
                    <button onClick={backToList} className="lg:hidden inline-flex items-center gap-1 text-violet-600 dark:text-violet-300 text-[11px] font-medium px-2 py-1 rounded-md border border-violet-300 dark:border-violet-500/40 bg-white/70 dark:bg-white/10 active:scale-95" aria-label="Retour à la liste">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      Inbox
                    </button>
                  )}
                  <h2 className="text-xs font-semibold tracking-wide text-violet-700 dark:text-violet-200 uppercase">Détail</h2>
                </div>
                {detail && <div className="flex gap-2">
                  <button onClick={()=>generateReply(false)} disabled={aiLoading} className="text-[11px] px-3 h-8 rounded-md font-medium bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed">{aiLoading? '...': 'Réponse IA'}</button>
                  <button onClick={()=>setDraft("")} disabled={!draft} className="text-[11px] px-3 h-8 rounded-md font-medium border border-violet-300 dark:border-violet-500/40 text-violet-700 dark:text-violet-200 bg-white/70 dark:bg-white/10 hover:bg-violet-50 dark:hover:bg-white/20 disabled:opacity-40">Reset brouillon</button>
                </div>}
              </div>
              {!detail && !loading && (
                <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-3 items-center justify-center flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-500 dark:text-violet-300">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 5h18M3 12h18M3 19h10"/></svg>
                  </div>
                  Sélectionne un email dans la liste.
                </div>
              )}
              {detail && (
                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scroll overscroll-contain scroll-smooth max-h-[calc(100vh-260px)] lg:max-h-none">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold leading-snug text-gray-800 dark:text-gray-100 break-words">{detail.subject || '(Sans objet)'}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/30 font-medium">{detail.fromName || detail.fromEmail}</span>
                      <span className="text-gray-500 dark:text-gray-400">{detail.fromEmail}</span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-200/60 dark:bg-white/10 text-gray-700 dark:text-gray-300">thread {detail.threadId?.slice(0,8)}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-violet-200 dark:border-violet-500/20 bg-white/70 dark:bg-violet-900/40 p-4 text-[13px] leading-relaxed whitespace-pre-wrap shadow-inner max-h-72 overflow-y-auto custom-scroll sm:max-h-80 text-gray-800 dark:text-fuchsia-100">
                    {detail.body || detail.snippet}
                  </div>
                  {aiReply && (
                    <div ref={aiReplyBlockRef} className="rounded-lg border border-fuchsia-300/40 dark:border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-50/80 to-violet-50/70 dark:from-fuchsia-900/20 dark:to-violet-900/10 p-4 text-[12px] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[10px] uppercase tracking-wide font-semibold text-fuchsia-600 dark:text-fuchsia-300">Proposition IA</div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-semibold text-fuchsia-600 dark:text-fuchsia-100">Ton</label>
                          <select
                            value={tone}
                            onChange={e=>setTone(e.target.value)}
                            className="h-7 px-2 rounded-md text-[11px] bg-white/80 dark:bg-violet-900/60 border border-fuchsia-300/50 dark:border-fuchsia-400/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 text-gray-800 dark:text-fuchsia-100"
                          >
                            {toneOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
        <button onClick={()=>generateReply(false)} disabled={aiLoading} className="text-[11px] h-7 px-3 rounded-md font-medium bg-fuchsia-600 text-white hover:bg-fuchsia-500 disabled:opacity-40">{aiLoading? '...' : 'Régénérer'}</button>
        {aiAutoTriggered && <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border border-fuchsia-400/30 animate-pulse">Auto</span>}
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-fuchsia-100">{aiReply}</p>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => {
                          setDraft(aiReply);
                          setTimeout(() => {
                            if (draftRef.current) draftRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 80);
                        }} className="text-[11px] px-2 py-1 rounded-md bg-fuchsia-600 text-white hover:bg-fuchsia-500">Copier → Brouillon</button>
                        <button onClick={()=>setAiReply("")} className="text-[11px] px-2 py-1 rounded-md border border-fuchsia-400/40 text-fuchsia-600 dark:text-fuchsia-300 hover:bg-fuchsia-50/40 dark:hover:bg-fuchsia-500/10">Clear</button>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-gray-600 dark:text-gray-300">Brouillon</label>
                     <textarea
                       ref={draftRef}
                       value={draft}
                       onChange={e=>setDraft(e.target.value)}
                       rows={6}
                       className="w-full rounded-lg border bg-white/70 dark:bg-violet-900/40 border-violet-200 dark:border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-400/50 text-sm p-3 resize-none custom-scroll text-gray-800 dark:text-fuchsia-100 placeholder-gray-400 dark:placeholder-fuchsia-300/80"
                       placeholder="Écris ta réponse..."
                      aria-label="Zone de brouillon"
                     />
                    <div className="flex flex-wrap gap-2">
                      <button onClick={sendEmail} disabled={sending||!draft.trim()} className="h-9 px-5 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium shadow hover:shadow-md disabled:opacity-35 disabled:cursor-not-allowed transition">{sending?"Envoi...":"Envoyer"}</button>
                      <button onClick={()=>setDraft("")} disabled={!draft} className="h-9 px-4 rounded-md text-xs font-medium border border-violet-300 dark:border-violet-500/30 bg-white/60 dark:bg-white/10 hover:bg-violet-50 dark:hover:bg-white/20 disabled:opacity-30">Vider</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="px-5 py-2 border-t dark:border-white/10 text-[10px] flex items-center justify-between bg-white/60 dark:bg-white/5 backdrop-blur">
                <span className="text-gray-500 dark:text-gray-400">{detail? (detail.body?.length || detail.snippet?.length || 0) + ' caractères' : 'Aucun message sélectionné'}</span>
                {detail && <button onClick={()=>generateReply(false)} disabled={aiLoading} className="text-violet-600 dark:text-violet-300 hover:underline text-[11px] disabled:opacity-40">Régénérer IA</button>}
              </div>
              {/* Sticky mobile action bar for sending quickly */}
              {detail && (
                <div className="lg:hidden sticky bottom-3 left-0 right-0 mx-3 mb-2">
                  <div className="rounded-full shadow-lg shadow-violet-500/10 border border-violet-300/50 dark:border-violet-500/30 backdrop-blur-md bg-gradient-to-r from-white/85 to-white/70 dark:from-violet-900/60 dark:to-fuchsia-900/50 flex items-center gap-2 px-3 py-2">
                    <button onClick={sendEmail} disabled={sending||!draft.trim()} className="h-9 px-5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium shadow hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition">{sending? 'Envoi...' : 'Envoyer'}</button>
                    <button onClick={()=>generateReply(false)} disabled={aiLoading} className="h-9 px-4 rounded-full text-[11px] font-medium bg-fuchsia-600/15 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-400/30 hover:bg-fuchsia-600/25 disabled:opacity-40">{aiLoading? '...' : 'IA'}</button>
                    <button onClick={()=>setDraft("")} disabled={!draft} className="h-9 px-3 rounded-full text-[11px] font-medium border border-violet-300 dark:border-violet-500/30 text-violet-700 dark:text-violet-200 hover:bg-violet-50 dark:hover:bg-white/10 disabled:opacity-30">Reset</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {error && <div className="mt-6 text-sm text-rose-600 dark:text-rose-400" aria-live="assertive">{error}</div>}
      </main>
    </>
  );
}
