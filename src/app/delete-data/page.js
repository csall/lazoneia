"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function DeleteDataPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // Placeholder: ici un appel POST /api/delete-request pourrait être ajouté.
    setSent(true);
  };

  return (
    <main className={`min-h-screen font-sans ${isLight ? "text-gray-800 bg-[radial-gradient(circle_at_20%_15%,rgba(244,114,182,0.18),transparent_60%),radial-gradient(circle_at_80%_75%,rgba(167,139,250,0.18),transparent_60%),linear-gradient(to_bottom_right,#fdf2f8,#faf5ff,#f5f3ff)]" : "text-white bg-gradient-to-br from-fuchsia-950 via-purple-950 to-indigo-950"}`}>
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10/5 bg-white/40 dark:bg-black/25 px-4 py-3 flex items-center gap-4">
        <Link href="/" className="group inline-flex items-center gap-2 text-xs font-semibold px-3 h-9 rounded-full border border-fuchsia-400/40 bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 transition">
          <span className="inline-block w-4 h-4">←</span> Accueil
        </Link>
        <span className="text-[11px] uppercase tracking-wider opacity-60">Suppression des données</span>
      </header>
      <div className="mx-auto w-full max-w-4xl px-5 py-12 md:py-20 flex flex-col gap-12">
        <section className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-500">Suppression de vos données</h1>
          <p className={`text-lg leading-relaxed ${isLight?"text-gray-600":"text-white/70"}`}>Cette page explique comment demander l&apos;effacement ou la récupération des données personnelles liées à votre utilisation de La Zone IA.</p>
        </section>
        <Section title="1. Portée" isLight={isLight}>
          <p>La suppression couvre les éléments suivants lorsque présents dans nos systèmes: informations de compte (email, nom), historiques d&apos;interaction conservés côté serveur, tokens d&apos;API externes (ex: Instagram), journaux techniques associés à votre identifiant.</p>
        </Section>
        <Section title="2. Données non immédiatement effaçables" isLight={isLight}>
          <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
            <li>Journaux de sécurité conservés temporairement (max 12 mois) pour prévention fraude.</li>
            <li>Sauvegardes chiffrées: purge automatique lors du cycle de rotation.</li>
            <li>Données agrégées anonymisées (non ré-identifiables) non supprimées.</li>
          </ul>
        </Section>
        <Section title="3. Procédure de demande" isLight={isLight}>
          <ol className="list-decimal pl-6 space-y-2 text-sm leading-relaxed">
            <li>Soumettre une demande via le formulaire ci-dessous ou par email: <a href="mailto:contact@lazoneia" className="underline decoration-dotted">contact@lazoneia</a>.</li>
            <li>Vérification de propriété du compte (email de confirmation).</li>
            <li>Traitement sous 30 jours ouvrés maximum (généralement &lt; 7 jours).</li>
            <li>Envoi d&apos;une confirmation d&apos;effacement lorsque terminé.</li>
          </ol>
        </Section>
        <Section title="4. Révocation accès services tiers" isLight={isLight}>
          <p>Pour Instagram ou autres plateformes, vous pouvez révoquer immédiatement l&apos;autorisation dans leurs paramètres. Nous révoquerons et supprimerons aussi nos tokens stockés lors du traitement.</p>
        </Section>
        <Section title="5. Export avant suppression" isLight={isLight}>
          <p>Vous pouvez demander un export JSON de vos données avant effacement définitif. Indiquez-le dans votre message.</p>
        </Section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Formulaire de demande</h2>
          <p className={`text-sm ${isLight?"text-gray-600":"text-white/60"}`}>Cette action n&apos;exécute pas encore la suppression automatique (endpoint à implémenter). Elle vous montre le flux attendu.</p>
          <form onSubmit={submit} className="flex flex-col gap-4 max-w-lg">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Email du compte</label>
              <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className={`h-11 rounded-md px-3 text-sm border bg-transparent focus:outline-none focus:ring-2 ${isLight?"border-gray-300 focus:ring-fuchsia-300":"border-white/15 focus:ring-fuchsia-500/40"}`} placeholder="vous@exemple.com" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Message</label>
              <textarea required value={message} onChange={(e)=>setMessage(e.target.value)} className={`min-h-[140px] rounded-md px-3 py-2 text-sm border bg-transparent resize-none focus:outline-none focus:ring-2 ${isLight?"border-gray-300 focus:ring-fuchsia-300":"border-white/15 focus:ring-fuchsia-500/40"}`} placeholder="Expliquez votre demande (suppression totale / export + suppression)..." />
            </div>
            <button type="submit" disabled={sent} className={`h-11 px-6 rounded-md text-sm font-semibold transition border ${sent?"cursor-not-allowed opacity-60":isLight?"bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white border-fuchsia-400 shadow hover:shadow-md":"bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white border-fuchsia-400/40 hover:opacity-90"}`}>{sent?"Demande simulée envoyée":"Envoyer la demande"}</button>
            {sent && <p className="text-xs text-emerald-500">Demande enregistrée (simulation). Vous recevrez un email de confirmation.</p>}
          </form>
        </section>
        <Section title="6. Contact direct" isLight={isLight}>
          <p>Si le formulaire ne fonctionne pas, envoyez un email à <a href="mailto:contact@lazoneia" className="underline decoration-dotted">contact@lazoneia</a> avec l&apos;objet: <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[11px]">Demande suppression</code>.</p>
        </Section>
        <div className="text-[11px] opacity-60">Document informatif – valider juridiquement avant production.</div>
      </div>
    </main>
  );
}

function Section({ title, children, isLight }) {
  return (
    <section className="space-y-3">
      <h2 className={`text-xl font-semibold ${isLight?"text-fuchsia-700":"text-fuchsia-200"}`}>{title}</h2>
      <div className={`prose prose-sm max-w-none ${isLight?"text-gray-600":"text-white/70"} dark:prose-invert`}>{children}</div>
    </section>
  );
}
