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
            <main className="pt-6 px-3 sm:px-4 lg:px-6 pb-6 max-w-[1400px] mx-auto font-sans">
                {!connected && (
                    <div className="p-8 rounded-2xl border-2 border-blue-300 dark:border-blue-600/40 bg-gradient-to-br from-white via-blue-50/60 to-blue-100/40 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-slate-950/90 backdrop-blur-xl flex flex-col items-center gap-6 max-w-2xl mx-auto shadow-xl overflow-hidden">
                        <p className="text-base text-center font-semibold text-blue-900 dark:text-blue-200 drop-shadow-sm">Connecte ton compte Google pour consulter et répondre à tes emails.</p>
                    </div>
                )}
                {connected && (
                    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-sm h-[calc(100vh-180px)]">
                        {/* Barre d'actions en haut style Gmail */}
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => router.push('/mailty/inbox')}
                                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                                title="Retour"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            
                            <div className="h-6 w-px bg-gray-300 dark:bg-slate-600"></div>
                            
                            <button className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition" title="Archiver">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </button>
                            
                            <button className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition" title="Signaler comme spam">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </button>
                            
                            <button className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition" title="Supprimer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            
                            <div className="h-6 w-px bg-gray-300 dark:bg-slate-600"></div>
                            
                            <button className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition" title="Marquer comme non lu">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </button>
                            
                            <button className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition" title="Reporter">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            <div className="ml-auto flex items-center gap-2">
                                {loading && <span className="text-xs text-blue-600 dark:text-blue-400 animate-pulse font-medium">chargement...</span>}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
                            {loading && (
                                <div className="space-y-6 animate-pulse">
                                    <div className="space-y-3">
                                        <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                                        <div className="flex gap-2">
                                            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                                            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
                                            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6"></div>
                                    </div>
                                </div>
                            )}
                            {!loading && !detail && (
                                <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-3 items-center justify-center flex-1">
                                    <svg className="w-16 h-16 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="font-medium">Aucun message trouvé</p>
                                </div>
                            )}
                            {detail && (
                                <>
                                    {/* En-tête du message style Gmail */}
                                    <div className="space-y-4 pb-4">
                                        <h3 className="text-xl font-normal text-gray-900 dark:text-white">{detail.subject || '(Sans objet)'}</h3>
                                        
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold uppercase bg-blue-500 text-white flex-shrink-0">
                                                {(detail.fromName || detail.fromEmail || '?').slice(0, 2)}
                                            </div>
                                            
                                            {/* Infos expéditeur */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{detail.fromName || detail.fromEmail}</span>
                                                            {detail.date && (
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">{detail.date}</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            <span>à moi</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Actions rapides */}
                                                    <div className="flex items-center gap-1">
                                                        <button 
                                                            onClick={() => {
                                                                handleReply();
                                                                setTimeout(() => document.getElementById('reply')?.focus(), 100);
                                                            }}
                                                            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                                                            title="Répondre"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                            </svg>
                                                        </button>
                                                        <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition" title="Plus d'options">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Corps du message */}
                                    <div className="py-6 text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                                        <div 
                                            className="prose prose-sm dark:prose-invert max-w-none prose-p:my-3 prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white"
                                            dangerouslySetInnerHTML={{ __html: detail.body || detail.snippet || '<p class="text-gray-500 dark:text-gray-400 italic">Aucun contenu</p>' }} 
                                        />
                                    </div>
                                    
                                    {/* Boutons de réponse style Gmail */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                                        <button
                                            onClick={() => {
                                                document.getElementById('reply-section')?.scrollIntoView({ behavior: 'smooth' });
                                                setTimeout(() => document.getElementById('reply')?.focus(), 300);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                            Répondre
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition font-medium">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            Transférer
                                        </button>
                                    </div>
                                    {/* Zone de réponse compacte style Gmail */}
                                    <div id="reply-section" className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                                        <div className="flex flex-col gap-3 bg-gray-50 dark:bg-slate-800/30 rounded-lg p-4">
                                            <textarea
                                                id="reply"
                                                className="w-full min-h-[100px] rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition resize-none"
                                                placeholder="Cliquez ici pour répondre..."
                                                value={reply}
                                                onChange={e => setReply(e.target.value)}
                                            />
                                            
                                            {reply.trim() && (
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className={`px-3 py-1.5 text-xs rounded-md font-medium transition ${!reply.trim() ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
                                                            onClick={handleScribo}
                                                            disabled={!reply.trim()}
                                                            title="Reformuler avec l'IA"
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Reformuler
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="px-3 py-1.5 text-xs rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                                                            onClick={handleReply}
                                                            title="Suggérer une réponse avec l'IA"
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                                </svg>
                                                                IA
                                                            </span>
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                                                </div>
                                            )}
                                            
                                            {actionMsg && (
                                                <div className={`text-xs font-medium px-3 py-2 rounded-md ${actionMsg.includes('❌') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
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
                    <div className="mt-6 p-5 rounded-xl border-2 border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 flex items-start gap-3" role="alert" aria-live="assertive">
                        <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                            <h4 className="text-base font-bold text-red-900 dark:text-red-300 mb-1">Erreur de chargement</h4>
                            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
