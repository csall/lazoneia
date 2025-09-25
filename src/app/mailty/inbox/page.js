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
            <main className="pt-8 px-4 pb-12 max-w-3xl mx-auto font-sans">
                {!connected && (
                    <div className="relative p-8 rounded-2xl border-2 border-violet-400/40 dark:border-fuchsia-500/30 bg-gradient-to-br from-white/80 via-violet-50/80 to-fuchsia-50/80 dark:from-violet-900/60 dark:via-fuchsia-900/40 dark:to-violet-950/60 backdrop-blur-xl flex flex-col items-center gap-6 max-w-xl mx-auto shadow-xl animate-[pulseGlow_2.5s_ease-in-out_infinite] overflow-hidden">
                        <p className="relative z-10 text-base text-center font-semibold text-violet-700 dark:text-fuchsia-100 drop-shadow-sm">Connecte ton compte Google pour consulter et répondre à tes emails.</p>
                        <button
                            onClick={() => signIn("google")}
                            className="relative z-10 h-12 px-7 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:shadow-fuchsia-500/40 transition-all duration-200 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60"
                        >
                            <span className="text-base font-semibold tracking-wide drop-shadow">Se connecter avec Google</span>
                        </button>
                    </div>
                )}
                {connected && (
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="rounded-xl border bg-white/80 dark:bg-white/10 backdrop-blur-md px-4 py-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Rechercher (expéditeur, sujet, label:unread, after:2025/09/01) ..."
                                        className="w-full rounded-lg pl-10 pr-3 py-2 text-sm bg-white/70 dark:bg-white/10 border border-violet-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/50 placeholder-gray-400 dark:placeholder-white/40 shadow-inner"
                                        aria-label="Rechercher dans les emails"
                                    />
                                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-violet-500 dark:text-violet-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>
                                </div>
                                <button
                                    onClick={() => setUnreadOnly(u => !u)}
                                    className={`text-xs h-8 px-3 rounded-md font-medium border transition flex items-center gap-1 ${unreadOnly ? 'bg-violet-600 text-white border-violet-500 shadow' : 'bg-white/60 dark:bg-white/10 border-violet-200 dark:border-white/10 text-violet-700 dark:text-violet-200 hover:bg-white dark:hover:bg-white/15'}`}
                                    aria-pressed={unreadOnly}
                                >
                                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" /> Non lus
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 tracking-wide uppercase">{emails.length} messages</span>
                                <button
                                    onClick={() => fetchEmails(search + (unreadOnly ? (search ? " " : "") + "label:unread" : ""))}
                                    disabled={refreshing}
                                    className="h-8 px-3 rounded-md text-xs font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow hover:brightness-110 disabled:opacity-50"
                                    aria-label="Rafraîchir la liste"
                                >{refreshing ? '...' : 'Rafraîchir'}</button>
                            </div>
                        </div>
                        <div className="rounded-2xl border bg-white/80 dark:bg-white/5 backdrop-blur-xl flex flex-col overflow-hidden shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                            <div className="px-4 py-2 border-b dark:border-white/10 flex items-center justify-between">
                                <h2 className="text-xs font-semibold tracking-wide text-violet-700 dark:text-violet-200 uppercase">Inbox</h2>
                                {loading && <span className="text-[10px] text-violet-500 dark:text-violet-300 animate-pulse">chargement...</span>}
                            </div>
                            <div className="flex-1 overflow-y-auto text-sm divide-y dark:divide-white/5 custom-scroll overscroll-contain scroll-smooth max-h-[calc(100vh-270px)] lg:max-h-none">
                                {loading && (
                                    <div className="p-4 space-y-3 animate-pulse">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex gap-2">
                                                    <div className="h-3 w-10 rounded bg-violet-200/60 dark:bg-violet-500/20" />
                                                    <div className="h-3 flex-1 rounded bg-violet-200/50 dark:bg-violet-500/20" />
                                                </div>
                                                <div className="h-2 w-3/4 rounded bg-violet-200/40 dark:bg-violet-500/10" />
                                            </div>
                                        ))}
                                    </div>)}
                                {!loading && emails.length === 0 && (
                                    <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">
                                        Aucun email.
                                        <div className="mt-2">
                                            <button onClick={() => fetchEmails(search)} className="px-3 py-1.5 text-[11px] rounded-md border border-violet-300 dark:border-violet-500/40 bg-white/70 dark:bg-white/10 hover:bg-violet-50 dark:hover:bg-white/20">Réessayer</button>
                                        </div></div>
                                )}
                                {emails.map(m => {
                                    const isUnread = m.labelIds?.includes('UNREAD');
                                    const date = m.internalDate ? new Date(parseInt(m.internalDate, 10)) : null;
                                    const rel = date ? (function () {
                                        const diff = Date.now() - date.getTime();
                                        const mns = Math.floor(diff / 60000);
                                        if (mns < 60) return mns <= 1 ? '1m' : mns + 'm';
                                        const hrs = Math.floor(mns / 60);
                                        if (hrs < 24) return hrs + 'h';
                                        const days = Math.floor(hrs / 24); if (days < 7) return days + 'j';
                                        return date.toLocaleDateString();
                                    })() : '';
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => router.push(`/mailty/message/${m.id}`)}
                                            className={`group w-full text-left px-4 py-3 flex flex-col gap-1 transition relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:z-10 ${isUnread ? 'font-semibold' : ''}`}
                                            aria-label={`Email de ${m.fromName || m.fromEmail} sujet ${m.subject || 'Sans objet'} ${isUnread ? 'non lu' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold uppercase bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 dark:from-violet-500/25 dark:to-fuchsia-500/25 ${isUnread ? 'ring-2 ring-fuchsia-400/50 dark:ring-fuchsia-500/40' : ''}`}>
                                                    {(m.fromName || m.fromEmail || '?').slice(0, 2)}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`truncate flex-1 text-[13px] ${isUnread ? 'text-violet-900 dark:text-fuchsia-100' : 'text-gray-700 dark:text-gray-100'} group-hover:text-violet-700 dark:group-hover:text-fuchsia-200`}>{m.subject || '(Sans objet)'}</span>
                                                        {isUnread && <span className="px-1.5 py-0.5 rounded-full bg-fuchsia-600 text-white text-[9px] tracking-wide">NEW</span>}
                                                        {rel && <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">{rel}</span>}
                                                    </div>
                                                    <p className="text-[11px] line-clamp-2 text-gray-500 dark:text-fuchsia-200/90 leading-snug">{m.snippet}</p>
                                                </div>
                                            </div>
                                            <span className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-70 transition" />
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="px-4 py-2 border-t dark:border-white/10 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-white/5">
                                <span className="uppercase tracking-wider">{emails.length} items</span>
                            </div>
                        </div>
                    </div>
                )}
                {error && <div className="mt-6 text-sm text-rose-600 dark:text-rose-400" aria-live="assertive">{error}</div>}
            </main>
        </>
    );
}
