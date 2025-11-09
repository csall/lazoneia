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
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [isModalMinimized, setIsModalMinimized] = useState(false);
    const [composeTo, setComposeTo] = useState("");
    const [composeSubject, setComposeSubject] = useState("");
    const [composeBody, setComposeBody] = useState("");
    const [sending, setSending] = useState(false);
    const [composeMsg, setComposeMsg] = useState("");
    const [activeFolder, setActiveFolder] = useState('inbox'); // inbox, starred, snoozed, sent, drafts
    const router = useRouter();

    const fetchEmails = useCallback(async (q, isDraftsFolder = false) => {
        if (!connected) return;
        setLoading(true);
        setRefreshing(true);
        setError("");
        try {
            let url, data;
            
            if (isDraftsFolder) {
                // Utiliser l'API spéciale pour les brouillons
                url = '/api/mailty/list-drafts';
                const r = await fetch(url);
                if (!r.ok) throw new Error("Erreur chargement brouillons");
                data = await r.json();
                setEmails(data.drafts || []);
            } else {
                // Utiliser l'API normale pour les autres dossiers
                const params = new URLSearchParams();
                if (q && q.trim()) params.set('q', q.trim());
                url = `/api/mailty/list${params.toString() ? `?${params.toString()}` : ""}`;
                const r = await fetch(url);
                if (!r.ok) throw new Error("Erreur chargement emails");
                data = await r.json();
                setEmails(data.messages || []);
            }
        } catch (e) { setError(e.message); }
        finally { setLoading(false); setRefreshing(false); }
    }, [connected]);

    useEffect(() => { if (connected) fetchEmails("", false); }, [connected, fetchEmails]);

    useEffect(() => {
        if (!connected) return;
        const timeout = setTimeout(() => {
            let query = search;
            
            // Ajouter les filtres selon le dossier actif
            if (activeFolder === 'starred') {
                query += (query ? ' ' : '') + 'label:starred';
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            } else if (activeFolder === 'sent') {
                query += (query ? ' ' : '') + 'label:sent';
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            } else if (activeFolder === 'drafts') {
                // Pour les brouillons, utiliser l'API spéciale
                fetchEmails('', true);
            } else if (activeFolder === 'inbox') {
                query += (query ? ' ' : '') + 'label:inbox';
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            } else {
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            }
        }, 420);
        return () => clearTimeout(timeout);
    }, [search, unreadOnly, activeFolder, connected, fetchEmails]);

    const handleSendNewEmail = async () => {
        if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
            setComposeMsg("❌ Tous les champs sont requis");
            return;
        }
        setSending(true);
        setComposeMsg("");
        try {
            const r = await fetch('/api/mailty/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: composeTo.trim(),
                    subject: composeSubject.trim(),
                    body: composeBody.trim()
                })
            });
            if (!r.ok) throw new Error("Erreur d'envoi");
            setComposeMsg("✅ Email envoyé avec succès !");
            setTimeout(() => {
                setShowComposeModal(false);
                setComposeTo("");
                setComposeSubject("");
                setComposeBody("");
                setComposeMsg("");
                fetchEmails(search + (unreadOnly ? (search ? " " : "") + "label:unread" : ""));
            }, 2000);
        } catch (e) {
            setComposeMsg("❌ " + e.message);
        } finally {
            setSending(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!composeTo.trim() || !composeSubject.trim()) {
            setComposeMsg("❌ Le destinataire et le sujet sont requis");
            return;
        }
        setSending(true);
        setComposeMsg("💾 Sauvegarde du brouillon...");
        
        try {
            const r = await fetch('/api/mailty/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: composeTo.trim(),
                    subject: composeSubject.trim(),
                    body: composeBody.trim()
                })
            });
            if (!r.ok) throw new Error("Erreur de sauvegarde");
            setComposeMsg("✅ Brouillon sauvegardé !");
            setTimeout(() => {
                setShowComposeModal(false);
                setComposeTo("");
                setComposeSubject("");
                setComposeBody("");
                setComposeMsg("");
                // Rafraîchir si on est dans les brouillons
                if (activeFolder === 'drafts') {
                    fetchEmails('', true);
                }
            }, 2000);
        } catch (e) {
            setComposeMsg("❌ " + e.message);
        } finally {
            setSending(false);
        }
    };

    const handleToggleStar = async (e, messageId, isStarred) => {
        e.stopPropagation();
        try {
            await fetch('/api/mailty/modify-labels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId,
                    addLabelIds: isStarred ? [] : ['STARRED'],
                    removeLabelIds: isStarred ? ['STARRED'] : []
                })
            });
            // Rafraîchir la liste
            let query = search;
            if (activeFolder === 'starred') {
                query += (query ? ' ' : '') + 'label:starred';
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            } else if (activeFolder === 'sent') {
                query += (query ? ' ' : '') + 'label:sent';
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            } else if (activeFolder === 'drafts') {
                fetchEmails('', true);
            } else if (activeFolder === 'inbox') {
                query += (query ? ' ' : '') + 'label:inbox';
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            } else {
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            }
        } catch (e) {
            console.error('Erreur lors du marquage', e);
        }
    };

    const handleToggleRead = async (e, messageId, isUnread) => {
        e.stopPropagation();
        try {
            await fetch('/api/mailty/modify-labels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId,
                    addLabelIds: isUnread ? [] : ['UNREAD'],
                    removeLabelIds: isUnread ? ['UNREAD'] : []
                })
            });
            // Rafraîchir la liste
            let query = search;
            if (activeFolder === 'starred') {
                query += (query ? ' ' : '') + 'label:starred';
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            } else if (activeFolder === 'sent') {
                query += (query ? ' ' : '') + 'label:sent';
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            } else if (activeFolder === 'drafts') {
                fetchEmails('', true);
            } else if (activeFolder === 'inbox') {
                query += (query ? ' ' : '') + 'label:inbox';
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            } else {
                if (unreadOnly) query += (query ? ' ' : '') + 'label:unread';
                fetchEmails(query, false);
            }
        } catch (e) {
            console.error('Erreur lors du marquage', e);
        }
    };

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
                            <button 
                                onClick={() => setShowComposeModal(true)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Nouveau
                            </button>
                            <div className="flex flex-col gap-1">
                                <button 
                                    onClick={() => setActiveFolder('inbox')}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${activeFolder === 'inbox' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <span>Boîte de réception</span>
                                </button>
                                <button 
                                    onClick={() => setActiveFolder('starred')}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${activeFolder === 'starred' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <span>Suivis</span>
                                </button>
                                <button 
                                    onClick={() => setActiveFolder('snoozed')}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${activeFolder === 'snoozed' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Reportés</span>
                                </button>
                                <button 
                                    onClick={() => setActiveFolder('sent')}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${activeFolder === 'sent' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>Envoyés</span>
                                </button>
                                <button 
                                    onClick={() => setActiveFolder('drafts')}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${activeFolder === 'drafts' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>Brouillons</span>
                                </button>
                            </div>
                        </div>

                        {/* Zone principale */}
                        <div className="flex-1 flex flex-col gap-3">
                            {/* Bouton Nouveau pour mobile */}
                            <div className="lg:hidden">
                                <button 
                                    onClick={() => setShowComposeModal(true)}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nouveau message
                                </button>
                            </div>
                            
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
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {activeFolder === 'inbox' && `${emails.length} conversations`}
                                            {activeFolder === 'starred' && `${emails.length} suivis`}
                                            {activeFolder === 'snoozed' && `${emails.length} reportés`}
                                            {activeFolder === 'sent' && `${emails.length} envoyés`}
                                            {activeFolder === 'drafts' && `${emails.length} brouillons`}
                                        </span>
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
                                    const isDraft = m.labelIds?.includes('DRAFT');
                                    return (
                                        <div
                                            key={m.id}
                                            className={`group w-full px-3 py-2.5 flex items-center gap-3 transition relative border-l-4 ${isUnread ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-900/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/30'} cursor-pointer`}
                                            onClick={() => {
                                                // Si c'est un brouillon, aller vers la page de brouillon
                                                if (isDraft) {
                                                    router.push(`/mailty/draft/${m.id}`);
                                                } else {
                                                    router.push(`/mailty/message/${m.id}`);
                                                }
                                            }}
                                        >
                                            {/* Actions à gauche (visibles au hover) */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                <button 
                                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
                                                    onClick={(e) => handleToggleRead(e, m.id, isUnread)}
                                                    title={isUnread ? "Marquer comme lu" : "Marquer comme non lu"}
                                                >
                                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {isUnread ? (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                                                        ) : (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        )}
                                                    </svg>
                                                </button>
                                                <button 
                                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
                                                    onClick={(e) => handleToggleStar(e, m.id, m.labelIds?.includes('STARRED'))}
                                                    title={m.labelIds?.includes('STARRED') ? "Retirer l'étoile" : "Ajouter une étoile"}
                                                >
                                                    <svg className={`w-4 h-4 ${m.labelIds?.includes('STARRED') ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600 dark:text-gray-400'}`} fill={m.labelIds?.includes('STARRED') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Expéditeur */}
                                            <div className={`w-36 truncate text-sm flex-shrink-0 ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'font-normal text-gray-700 dark:text-gray-300'}`}>
                                                {isDraft ? (
                                                    <span className="flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-red-600 dark:text-red-400 font-medium">Brouillon</span>
                                                    </span>
                                                ) : (
                                                    m.fromName || m.fromEmail?.split('@')[0] || 'Inconnu'
                                                )}
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

            {/* Modale de composition style Gmail */}
            {showComposeModal && (
                <div className={`fixed ${isModalMinimized ? 'bottom-4 right-4' : 'bottom-4 right-4'} z-50 ${isModalMinimized ? 'w-60' : 'w-[800px] max-h-[85vh]'} shadow-2xl rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all duration-200 flex flex-col`}>
                    {/* En-tête de la modale */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-t-lg flex-shrink-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {isModalMinimized ? 'Nouveau message' : 'Nouveau message'}
                        </h3>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsModalMinimized(!isModalMinimized)}
                                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                                title={isModalMinimized ? "Agrandir" : "Réduire"}
                            >
                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isModalMinimized ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    )}
                                </svg>
                            </button>
                            <button
                                onClick={() => {
                                    setShowComposeModal(false);
                                    setComposeTo("");
                                    setComposeSubject("");
                                    setComposeBody("");
                                    setComposeMsg("");
                                }}
                                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                                title="Fermer"
                            >
                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Contenu de la modale */}
                    {!isModalMinimized && (
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            {/* Destinataire */}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm min-w-[60px]">À:</span>
                                <input
                                    type="email"
                                    value={composeTo}
                                    onChange={e => setComposeTo(e.target.value)}
                                    placeholder="destinataire@exemple.com"
                                    className="flex-1 bg-transparent border-0 border-b border-gray-300 dark:border-slate-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 placeholder-gray-400 dark:placeholder-gray-500 py-1"
                                />
                            </div>

                            {/* Sujet */}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm min-w-[60px]">Objet:</span>
                                <input
                                    type="text"
                                    value={composeSubject}
                                    onChange={e => setComposeSubject(e.target.value)}
                                    placeholder="Objet de l'email"
                                    className="flex-1 bg-transparent border-0 border-b border-gray-300 dark:border-slate-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 placeholder-gray-400 dark:placeholder-gray-500 py-1"
                                />
                            </div>

                            {/* Zone de texte */}
                            <textarea
                                className="w-full min-h-[300px] rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-4 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition resize-none"
                                placeholder="Écrivez votre message ici..."
                                value={composeBody}
                                onChange={e => setComposeBody(e.target.value)}
                            />

                            {/* Boutons d'action */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        onClick={handleSaveDraft}
                                        disabled={!composeTo.trim() || !composeSubject.trim() || sending}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        Brouillon
                                    </button>
                                </div>
                                
                                <button
                                    type="button"
                                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    onClick={handleSendNewEmail}
                                    disabled={!composeTo.trim() || !composeSubject.trim() || !composeBody.trim() || sending}
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

                            {/* Message de statut */}
                            {composeMsg && (
                                <div className={`text-xs font-medium px-3 py-2 rounded-md ${composeMsg.includes('❌') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                                    {composeMsg}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
