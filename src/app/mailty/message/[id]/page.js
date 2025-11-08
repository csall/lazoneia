"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import agents from "@/config/agents";
import Header from "@/components/agents/AgentAudioWorkflow/Header";

export default function MailtyMessage() {

    const mailtyConfig = agents.find(a => a.name === "Mailty");
    const { data: session } = useSession();
    const connected = !!session?.accessToken;
    const { id } = useParams();
    const router = useRouter();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // Ajout pour la réponse
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const [actionMsg, setActionMsg] = useState("");

    async function handleScribo() {
        if (!reply.trim()) return;
        setActionMsg("✨ Reformulation en cours...");
        try {
            const res = await fetch('/api/mailty/ai-scribo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: reply })
            });
            if (!res.ok) throw new Error('Erreur API');
            const data = await res.json();
            setReply(data.scribo || reply);
            setActionMsg("✅ Texte reformulé avec succès !");
            setTimeout(() => setActionMsg(""), 3000);
        } catch (err) {
            setActionMsg("❌ Erreur lors de la reformulation. Réessaye.");
            setTimeout(() => setActionMsg(""), 4000);
        }
    }

    async function handleReply() {
        setActionMsg("🤖 Génération de réponse IA...");
        try {
            const res = await fetch('/api/mailty/ai-reply', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ subject: detail?.subject, body: detail?.bodyText || detail?.body }) 
            });
            if (!res.ok) throw new Error('Erreur API');
            const data = await res.json();
            setReply(data.reply || reply);
            setActionMsg("✅ Suggestion insérée !");
            setTimeout(() => setActionMsg(""), 3000);
        } catch (err) {
            setActionMsg("❌ Erreur lors de la suggestion. Réessaye.");
            setTimeout(() => setActionMsg(""), 4000);
        }
    }

    async function handleSend() {
        if (!reply.trim()) return;
        setSending(true);
        setActionMsg("📤 Envoi en cours...");
        try {
            const res = await fetch('/api/mailty/send', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    threadId: detail?.threadId, 
                    to: detail?.fromEmail, 
                    body: reply 
                }) 
            });
            if (res.ok) {
                setReply("");
                setActionMsg("✅ Réponse envoyée avec succès !");
                setTimeout(() => setActionMsg(""), 4000);
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Erreur lors de l\'envoi');
            }
        } catch (err) {
            setActionMsg(`❌ ${err.message || 'Erreur lors de l\'envoi'}`);
            setTimeout(() => setActionMsg(""), 5000);
        } finally {
            setSending(false);
        }
    }

    useEffect(() => {
        if (!connected || !id) return;
        setLoading(true);
        setError("");
        setDetail(null);
        fetch(`/api/mailty/detail?id=${encodeURIComponent(id)}`)
            .then(r => {
                if (!r.ok) {
                    if (r.status === 401) throw new Error("Session expirée. Reconnecte-toi.");
                    if (r.status === 404) throw new Error("Message introuvable.");
                    throw new Error(`Erreur ${r.status}: Impossible de charger le message.`);
                }
                return r.json();
            })
            .then(data => setDetail(data))
            .catch(e => setError(e.message || "Une erreur est survenue"))
            .finally(() => setLoading(false));
    }, [connected, id]);

    return (
        <>
            <Header
                branding={mailtyConfig?.branding}
                tagline={mailtyConfig?.tagline}
                colors={mailtyConfig?.colors}
                messages={[]}
                clearHistory={() => { }}
                fixed={false}
            />
            <main className="pt-8 px-4 pb-12 max-w-2xl mx-auto font-sans">
                {!connected && (
                    <div className="p-8 rounded-2xl border-2 border-violet-400/40 dark:border-fuchsia-500/30 bg-gradient-to-br from-white/80 via-violet-50/80 to-fuchsia-50/80 dark:from-violet-900/60 dark:via-fuchsia-900/40 dark:to-violet-950/60 backdrop-blur-xl flex flex-col items-center gap-6 max-w-xl mx-auto shadow-xl animate-[pulseGlow_2.5s_ease-in-out_infinite] overflow-hidden">
                        <p className="text-base text-center font-semibold text-violet-700 dark:text-fuchsia-100 drop-shadow-sm">Connecte ton compte Google pour consulter et répondre à tes emails.</p>
                    </div>
                )}
                {connected && (
                    <div className="rounded-2xl border bg-white/80 dark:bg-white/5 backdrop-blur-xl flex flex-col overflow-hidden shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                        <div className="px-4 py-2 border-b dark:border-white/10 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => router.push('/mailty/inbox')}
                                    className="inline-flex items-center gap-1 text-violet-600 dark:text-fuchsia-300 text-xs font-medium px-3 py-1 rounded-md border border-violet-300 dark:border-fuchsia-500/40 bg-white/70 dark:bg-white/10 hover:bg-violet-50 dark:hover:bg-fuchsia-900/20 transition shadow-sm"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    Retour à la liste
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleReply();
                                        document.getElementById('reply')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        setTimeout(() => {
                                            document.getElementById('reply')?.focus();
                                        }, 500);
                                    }}
                                    className="inline-flex items-center gap-1 text-violet-700 dark:text-fuchsia-200 text-xs font-medium px-3 py-1 rounded-md border border-violet-200 dark:border-fuchsia-700/40 bg-violet-50 dark:bg-fuchsia-900/20 hover:bg-violet-100 dark:hover:bg-fuchsia-800/40 transition shadow-sm"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m7-7H5" /></svg>
                                    Proposer une réponse
                                </button>
                            </div>
                            {loading && <span className="text-[10px] text-violet-500 dark:text-violet-300 animate-pulse">chargement...</span>}
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scroll overscroll-contain scroll-smooth max-h-[calc(100vh-260px)]">
                            {loading && (
                                <div className="space-y-6 animate-pulse">
                                    <div className="space-y-3">
                                        <div className="h-6 bg-violet-200/40 dark:bg-violet-500/20 rounded w-3/4"></div>
                                        <div className="flex gap-2">
                                            <div className="h-5 bg-violet-200/40 dark:bg-violet-500/20 rounded w-24"></div>
                                            <div className="h-5 bg-violet-200/40 dark:bg-violet-500/20 rounded w-32"></div>
                                            <div className="h-5 bg-violet-200/40 dark:bg-violet-500/20 rounded w-20"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-violet-200/40 dark:bg-violet-500/20 rounded w-full"></div>
                                        <div className="h-4 bg-violet-200/40 dark:bg-violet-500/20 rounded w-full"></div>
                                        <div className="h-4 bg-violet-200/40 dark:bg-violet-500/20 rounded w-5/6"></div>
                                        <div className="h-4 bg-violet-200/40 dark:bg-violet-500/20 rounded w-4/6"></div>
                                    </div>
                                </div>
                            )}
                            {!loading && !detail && (
                                <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-3 items-center justify-center flex-1">
                                    <svg className="w-16 h-16 text-violet-300 dark:text-violet-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="font-medium">Aucun message trouvé</p>
                                </div>
                            )}
                            {detail && (
                                <>
                                    <div className="space-y-3">
                                        <h3 className="text-lg sm:text-xl font-bold leading-snug text-gray-900 dark:text-gray-50 break-words">{detail.subject || '(Sans objet)'}</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/30">
                                                    <svg className="w-4 h-4 text-violet-600 dark:text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span className="text-xs font-semibold text-violet-700 dark:text-violet-200">{detail.fromName || detail.fromEmail}</span>
                                                </div>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">{detail.fromEmail}</span>
                                            </div>
                                            {detail.date && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{detail.date}</span>
                                                </div>
                                            )}
                                        </div>
                                        {detail.to && (
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">À :</span> {detail.to}
                                            </div>
                                        )}
                                    </div>
                                    <div className="rounded-xl border border-violet-200/60 dark:border-violet-500/20 bg-gradient-to-br from-white/90 via-violet-50/30 to-white/90 dark:from-violet-900/30 dark:via-violet-950/40 dark:to-violet-900/30 p-5 sm:p-6 text-sm leading-relaxed shadow-sm max-h-96 overflow-y-auto custom-scroll text-gray-800 dark:text-gray-100">
                                        <div 
                                            className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-a:underline"
                                            dangerouslySetInnerHTML={{ __html: detail.body || detail.snippet || '<p class="text-gray-500 dark:text-gray-400 italic">Aucun contenu</p>' }} 
                                        />
                                    </div>
                                    {/* Champ de réponse */}
                                    <div className="mt-6 sm:mt-8">
                                        <label htmlFor="reply" className="block text-sm font-bold text-violet-800 dark:text-fuchsia-200 mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                            Répondre à ce message
                                        </label>
                                        <div className="flex flex-col gap-3">
                                            <textarea
                                                id="reply"
                                                className="w-full min-h-[120px] rounded-xl border-2 border-violet-300/60 dark:border-fuchsia-700/40 bg-white/90 dark:bg-violet-950/60 p-4 text-sm text-gray-900 dark:text-fuchsia-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-fuchsia-500 focus:border-transparent transition shadow-sm resize-y"
                                                placeholder="Écris ta réponse ici..."
                                                value={reply}
                                                onChange={e => setReply(e.target.value)}
                                            />
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                                <button
                                                    type="button"
                                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 flex items-center justify-center gap-2 ${!reply.trim() ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed' : 'bg-violet-50 dark:bg-fuchsia-900/40 text-violet-700 dark:text-fuchsia-200 border-violet-300 dark:border-fuchsia-700/40 hover:bg-violet-100 dark:hover:bg-fuchsia-800/60 hover:shadow-md'}`}
                                                    onClick={handleScribo}
                                                    disabled={!reply.trim()}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Reformuler
                                                </button>
                                                <button
                                                    type="button"
                                                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-violet-100 dark:bg-fuchsia-800/40 text-violet-700 dark:text-fuchsia-200 text-sm font-semibold border border-violet-300 dark:border-fuchsia-700/40 hover:bg-violet-200 dark:hover:bg-fuchsia-700/60 transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                                                    onClick={handleReply}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                    Suggérer réponse IA
                                                </button>
                                                <button
                                                    type="button"
                                                    className="sm:ml-auto px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    onClick={handleSend}
                                                    disabled={!reply.trim() || sending}
                                                >
                                                    {sending ? (
                                                        <>
                                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Envoi...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                            </svg>
                                                            Envoyer
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            {actionMsg && (
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${actionMsg.includes('Erreur') ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'}`}>
                                                    {actionMsg.includes('Erreur') ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                    {actionMsg}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {error && (
                    <div className="mt-6 p-4 rounded-xl border-2 border-rose-300 dark:border-rose-700/50 bg-rose-50 dark:bg-rose-900/20 flex items-start gap-3" role="alert" aria-live="assertive">
                        <svg className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300 mb-1">Erreur de chargement</h4>
                            <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
