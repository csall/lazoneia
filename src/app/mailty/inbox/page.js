"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import agents from "@/config/agents";
import Header from "@/components/agents/AgentAudioWorkflow/Header";

export default function MailtyInbox() {
    const mailtyConfig = agents.find(a => a.name === "Mailty");
    const { data: session } = useSession();
    const connected = !!session?.accessToken;
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchEmails = useCallback(async (q) => {
        if (!connected) return;
        setLoading(true);
        setRefreshing(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (q && q.trim()) params.set('q', q.trim());
            const url = `/api/mailty/list${params.toString() ? `?${params.toString()}` : ""}`;
            const r = await fetch(url);
            if (!r.ok) throw new Error("Erreur chargement emails");
            const data = await r.json();
            setEmails(data.messages || []);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); setRefreshing(false); }
    }, [connected]);

    useEffect(() => { if (connected) fetchEmails(""); }, [connected, fetchEmails]);

    useEffect(() => {
        if (!connected) return;
        const timeout = setTimeout(() => {
            fetchEmails(search + (unreadOnly ? (search ? " " : "") + "label:unread" : ""));
        }, 420);
        return () => clearTimeout(timeout);
    }, [search, unreadOnly, connected, fetchEmails]);

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
            <main className="pt-6 px-3 sm:px-4 lg:px-6 pb-6 max-w-[1600px] mx-auto font-sans">
                {!connected && (
                    <div className="relative p-8 rounded-2xl border-2 border-blue-300 dark:border-blue-600/40 bg-gradient-to-br from-white via-blue-50/60 to-blue-100/40 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-slate-950/90 backdrop-blur-xl flex flex-col items-center gap-6 max-w-2xl mx-auto shadow-xl overflow-hidden">
                        <p className="relative z-10 text-base text-center font-semibold text-blue-900 dark:text-blue-200 drop-shadow-sm">Connecte ton compte Google pour consulter et répondre à tes emails.</p>
                        <button
                            onClick={() => signIn("google")}
                            className="relative z-10 h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white font-bold shadow-lg hover:scale-105 hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                        >
                            <span className="text-base font-semibold tracking-wide drop-shadow">Se connecter avec Google</span>
                        </button>
                    </div>
                )}
                {connected && (
                    <div className="flex gap-4">
                        {/* Sidebar compacte style Gmail */}
                        <div className="hidden lg:flex flex-col gap-3 w-52 flex-shrink-0">
                            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Nouveau
                            </button>
                            <div className="flex flex-col gap-1">
                                <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <span>Boîte de réception</span>
                                </button>
                                <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <span>Suivis</span>
                                </button>
                                <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Reportés</span>
                                </button>
                                <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>Envoyés</span>
                                </button>
                                <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>Brouillons</span>
                                </button>
                            </div>
                        </div>

                        {/* Zone principale */}
                        <div className="flex-1 flex flex-col gap-3">
                            {/* Barre de recherche compacte */}
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2 shadow-sm">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                    <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Rechercher dans la boîte de réception"
                                    className="flex-1 bg-transparent border-0 text-sm text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setUnreadOnly(u => !u)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${unreadOnly ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                    >
                                        Non lus
                                    </button>
                                    <button
                                        onClick={() => fetchEmails(search + (unreadOnly ? (search ? " " : "") + "label:unread" : ""))}
                                        disabled={refreshing}
                                        className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
                                        title="Actualiser"
                                    >
                                        <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Liste des emails style Gmail */}
                            <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-sm h-[calc(100vh-220px)]">
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex items-center justify-between flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{emails.length} conversations</span>
                                    </div>
                                    {loading && <span className="text-xs text-blue-600 dark:text-blue-400 animate-pulse font-medium">chargement...</span>}
                                </div>
                            <div className="flex-1 overflow-y-auto text-sm divide-y divide-gray-200 dark:divide-slate-700 custom-scrollbar"
                            >
                                {loading && (
                                    <div className="p-5 space-y-4 animate-pulse">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex gap-3">
                                                    <div className="h-4 w-12 rounded bg-gray-200 dark:bg-slate-700" />
                                                    <div className="h-4 flex-1 rounded bg-gray-200 dark:bg-slate-700" />
                                                </div>
                                                <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
                                            </div>
                                        ))}
                                    </div>)}
                                {!loading && emails.length === 0 && (
                                    <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                        Aucun email.
                                        <div className="mt-4">
                                            <button onClick={() => fetchEmails(search)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm font-medium">Réessayer</button>
                                        </div></div>
                                )}
                                {emails.map(m => {
                                    const isUnread = m.labelIds?.includes('UNREAD');
                                    const date = m.internalDate ? new Date(parseInt(m.internalDate, 10)) : null;
                                    const rel = date ? (function () {
                                        const diff = Date.now() - date.getTime();
                                        const mns = Math.floor(diff / 60000);
                                        if (mns < 60) return mns <= 1 ? 'maintenant' : mns + ' min';
                                        const hrs = Math.floor(mns / 60);
                                        if (hrs < 24) return hrs + 'h';
                                        const days = Math.floor(hrs / 24); 
                                        if (days < 7) return days + 'j';
                                        if (days < 365) return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                                        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                                    })() : '';
                                    return (
                                        <div
                                            key={m.id}
                                            className={`group w-full px-3 py-2.5 flex items-center gap-3 transition relative border-l-4 ${isUnread ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-900/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/30'} cursor-pointer`}
                                            onClick={() => router.push(`/mailty/message/${m.id}`)}
                                        >
                                            {/* Actions à gauche (visibles au hover) */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                <button 
                                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                    title="Sélectionner"
                                                >
                                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                    title="Suivre"
                                                >
                                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Expéditeur */}
                                            <div className={`w-36 truncate text-sm flex-shrink-0 ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'font-normal text-gray-700 dark:text-gray-300'}`}>
                                                {m.fromName || m.fromEmail?.split('@')[0] || 'Inconnu'}
                                            </div>

                                            {/* Sujet et aperçu */}
                                            <div className="flex-1 min-w-0 flex items-baseline gap-2">
                                                <span className={`text-sm truncate ${isUnread ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {m.subject || '(Sans objet)'}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
                                                    - {m.snippet}
                                                </span>
                                            </div>

                                            {/* Date */}
                                            <div className="text-xs text-gray-600 dark:text-gray-400 tabular-nums whitespace-nowrap flex-shrink-0 w-16 text-right">
                                                {rel}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="px-5 py-3 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 flex-shrink-0">
                                <span className="font-medium">{emails.length} messages</span>
                            </div>
                        </div>
                        </div>
                    </div>
                )}
                {error && <div className="mt-6 p-4 rounded-xl border-2 border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 text-sm text-red-800 dark:text-red-400 font-medium" role="alert" aria-live="assertive">{error}</div>}
            </main>
        </>
    );
}
