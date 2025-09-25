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

    useEffect(() => {
        if (!connected || !id) return;
        setLoading(true);
        setError("");
        setDetail(null);
        fetch(`/api/mailty/detail?id=${encodeURIComponent(id)}`)
            .then(r => r.ok ? r.json() : Promise.reject("Erreur détail"))
            .then(data => setDetail(data))
            .catch(e => setError(e.message || e))
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
                        <div className="px-4 py-2 border-b dark:border-white/10 flex items-center justify-between">
                            <button
                                onClick={() => router.push('/mailty/inbox')}
                                className="inline-flex items-center gap-1 text-violet-600 dark:text-fuchsia-300 text-xs font-medium px-3 py-1 rounded-md border border-violet-300 dark:border-fuchsia-500/40 bg-white/70 dark:bg-white/10 hover:bg-violet-50 dark:hover:bg-fuchsia-900/20 transition shadow-sm"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                Retour à la liste
                            </button>
                            {loading && <span className="text-[10px] text-violet-500 dark:text-violet-300 animate-pulse">chargement...</span>}
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scroll overscroll-contain scroll-smooth max-h-[calc(100vh-260px)]">
                            {!loading && !detail && (
                                <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-3 items-center justify-center flex-1">
                                    Aucun message trouvé.
                                </div>
                            )}
                            {detail && (
                                <>

                                    <div className="space-y-2">
                                        <h3 className="text-base sm:text-lg font-semibold leading-snug text-gray-800 dark:text-gray-100 break-words">{detail.subject || '(Sans objet)'}</h3>
                                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                            <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/30 font-medium">{detail.fromName || detail.fromEmail}</span>
                                            <span className="text-gray-500 dark:text-gray-400">{detail.fromEmail}</span>
                                            <span className="px-1.5 py-0.5 rounded bg-gray-200/60 dark:bg-white/10 text-gray-700 dark:text-gray-300">thread {detail.threadId?.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-violet-200 dark:border-violet-500/20 bg-white/70 dark:bg-violet-900/40 p-4 text-[13px] leading-relaxed shadow-inner max-h-72 overflow-y-auto custom-scroll sm:max-h-80 text-gray-800 dark:text-fuchsia-100">
                                        <div dangerouslySetInnerHTML={{ __html: detail.body || detail.snippet || '' }} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {error && <div className="mt-6 text-sm text-rose-600 dark:text-rose-400" aria-live="assertive">{error}</div>}
            </main>
        </>
    );
}
