"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import agents from "@/config/agents";
import Header from "@/components/agents/AgentAudioWorkflow/Header";

export default function MailtyDraft() {
    const mailtyConfig = agents.find(a => a.name === "Mailty");
    const { data: session } = useSession();
    const connected = !!session?.accessToken;
    const { id } = useParams();
    const router = useRouter();
    
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [saving, setSaving] = useState(false);
    const [actionMsg, setActionMsg] = useState("");

    useEffect(() => {
        if (!connected || !id) return;
        setLoading(true);
        setError("");
        
        fetch(`/api/mailty/drafts?id=${id}`)
            .then(r => {
                if (!r.ok) throw new Error("Erreur chargement brouillon");
                return r.json();
            })
            .then(data => {
                setDraft(data);
                setTo(data.to || "");
                setSubject(data.subject || "");
                setBody(data.body || "");
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [connected, id]);

    const handleSend = async () => {
        if (!to.trim() || !subject.trim()) {
            setActionMsg("❌ Le destinataire et le sujet sont requis");
            return;
        }
        setSending(true);
        setActionMsg("📤 Envoi en cours...");
        
        try {
            const r = await fetch('/api/mailty/send-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draftId: id })
            });
            
            if (!r.ok) throw new Error("Erreur d'envoi");
            
            setActionMsg("✅ Email envoyé avec succès !");
            setTimeout(() => {
                router.push('/mailty/inbox');
            }, 2000);
        } catch (e) {
            setActionMsg("❌ " + e.message);
        } finally {
            setSending(false);
        }
    };

    const handleUpdate = async () => {
        if (!to.trim() || !subject.trim()) {
            setActionMsg("❌ Le destinataire et le sujet sont requis");
            return;
        }
        setSaving(true);
        setActionMsg("💾 Sauvegarde en cours...");
        
        try {
            const r = await fetch('/api/mailty/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    draftId: id,
                    to: to.trim(),
                    subject: subject.trim(),
                    body: body.trim(),
                    threadId: draft?.threadId
                })
            });
            
            if (!r.ok) throw new Error("Erreur de sauvegarde");
            
            setActionMsg("✅ Brouillon sauvegardé !");
            setTimeout(() => setActionMsg(""), 3000);
        } catch (e) {
            setActionMsg("❌ " + e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Voulez-vous vraiment supprimer ce brouillon ?")) return;
        
        try {
            const r = await fetch(`/api/mailty/drafts?id=${id}`, {
                method: 'DELETE'
            });
            
            if (!r.ok) throw new Error("Erreur de suppression");
            
            setActionMsg("✅ Brouillon supprimé !");
            setTimeout(() => {
                router.push('/mailty/inbox');
            }, 1500);
        } catch (e) {
            setActionMsg("❌ " + e.message);
        }
    };

    return (
        <>
            <Header
                branding={mailtyConfig?.branding}
                tagline={mailtyConfig?.tagline}
                colors={mailtyConfig?.colors}
                messages={[]}
                clearHistory={() => {}}
                fixed={false}
            />
            <main className="pt-6 px-3 sm:px-4 lg:px-6 pb-6 max-w-[1600px] mx-auto font-sans">
                {/* Barre d'actions */}
                <div className="mb-4 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                        title="Retour"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Brouillon</h1>
                </div>

                {loading && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-8 shadow-sm">
                        <div className="flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400">
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="font-medium">Chargement...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/50 rounded-xl p-5 text-red-800 dark:text-red-400">
                        {error}
                    </div>
                )}

                {!loading && !error && draft && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-6 space-y-5">
                            {/* Destinataire */}
                            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-slate-700 pb-3">
                                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm min-w-[80px]">À :</span>
                                <input
                                    type="email"
                                    value={to}
                                    onChange={e => setTo(e.target.value)}
                                    className="flex-1 bg-transparent text-gray-900 dark:text-white text-base focus:outline-none"
                                    placeholder="destinataire@exemple.com"
                                />
                            </div>

                            {/* Sujet */}
                            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-slate-700 pb-3">
                                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm min-w-[80px]">Objet :</span>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    className="flex-1 bg-transparent text-gray-900 dark:text-white text-base focus:outline-none"
                                    placeholder="Objet de l'email"
                                />
                            </div>

                            {/* Corps du message */}
                            <div className="pt-2">
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    className="w-full min-h-[400px] bg-transparent text-gray-900 dark:text-white text-base focus:outline-none resize-none"
                                    placeholder="Écrivez votre message..."
                                />
                            </div>

                            {/* Barre d'actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleUpdate}
                                        disabled={saving || sending}
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                                    >
                                        {saving ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sauvegarde...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                                </svg>
                                                Sauvegarder
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={saving || sending}
                                        className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Supprimer
                                    </button>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={!to.trim() || !subject.trim() || sending || saving}
                                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                            {actionMsg && (
                                <div className={`text-sm font-medium px-4 py-3 rounded-lg ${actionMsg.includes('❌') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                                    {actionMsg}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
