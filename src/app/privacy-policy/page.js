"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function PrivacyPolicyPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const hCls = isLight ? "text-fuchsia-700" : "text-fuchsia-200";
  const pCls = isLight ? "text-gray-600" : "text-white/70";
  return (
    <main className={`min-h-screen font-sans relative overflow-hidden ${isLight ? "text-gray-800 bg-[radial-gradient(circle_at_20%_15%,rgba(244,114,182,0.18),transparent_60%),radial-gradient(circle_at_80%_75%,rgba(167,139,250,0.18),transparent_60%),linear-gradient(to_bottom_right,#fdf2f8,#faf5ff,#f5f3ff)]" : "text-white bg-gradient-to-br from-fuchsia-950 via-purple-950 to-indigo-950"}`}>
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10/5 bg-white/40 dark:bg-black/25 px-4 py-3 flex items-center gap-4">
        <Link href="/" className="group inline-flex items-center gap-2 text-xs font-semibold px-3 h-9 rounded-full border border-fuchsia-400/40 bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 transition">
          <span className="inline-block w-4 h-4">←</span> Accueil
        </Link>
        <span className="text-[11px] uppercase tracking-wider opacity-60">Politique de Confidentialité</span>
      </header>
      <div className="mx-auto w-full max-w-4xl px-5 py-12 md:py-20 flex flex-col gap-12">
        <section className="space-y-6">
          <h1 className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-500`}>Politique de Confidentialité</h1>
          <p className={`${pCls} text-lg leading-relaxed`}>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}<br/>Cette politique explique comment nous collectons, utilisons et protégeons vos données lorsque vous utilisez La Zone IA.</p>
        </section>
        <Section title="1. Données que nous collectons" hCls={hCls} pCls={pCls}>
          <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
            <li>Données de compte (email, nom) via fournisseurs d&apos;authentification (Google, Facebook, etc.).</li>
            <li>Contenus fournis aux agents (briefs, messages) pour génération éphémère.</li>
            <li>Métadonnées techniques (type de navigateur, zone horaire, événements basiques).</li>
            <li>Tokens d&apos;accès aux services connectés (ex: Instagram) – stockés de façon sécurisée et minimale.</li>
          </ul>
        </Section>
        <Section title="2. Finalités d'utilisation" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Nous utilisons vos données pour : génération de contenu, personnalisation d&apos;expérience, sécurisation de l&apos;accès, amélioration produit (statistiques agrégées anonymisées).</p>
        </Section>
        <Section title="3. Base légale (RGPD)" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Intérêt légitime (amélioration & sécurité), exécution du service (fourniture des fonctionnalités), consentement explicite (cookies non essentiels / connexions externes).</p>
        </Section>
        <Section title="4. Partage des données" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Nous ne vendons pas vos données. Partage limité à : fournisseurs d&apos;hébergement, API modèles IA, plateformes sociales connectées (uniquement sur action explicite), obligations légales.</p>
        </Section>
        <Section title="5. Cookies & stockage local" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Nous utilisons localStorage pour préférences (thème, brouillons, connexions) et éventuellement des cookies d&apos;authentification sécurisés. Aucun suivi publicitaire tiers.</p>
        </Section>
        <Section title="6. Conservation" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Les contenus générés peuvent être purgés périodiquement. Les journaux techniques sont conservés une durée limitée (≤ 12 mois) puis agrégés/anonymisés.</p>
        </Section>
        <Section title="7. Sécurité" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Mesures mises en place : chiffrement en transit (HTTPS), séparation des secrets, principe du moindre privilège. Aucun système n&apos;est infaillible : signalez toute suspicion.</p>
        </Section>
        <Section title="8. Vos droits" hCls={hCls} pCls={pCls}>
          <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
            <li>Accès, rectification, effacement</li>
            <li>Limitation & opposition</li>
            <li>Portabilité (export JSON sur demande)</li>
            <li>Retrait du consentement (ex: déconnexion Instagram)</li>
          </ul>
        </Section>
        <Section title="9. Services tiers" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Lorsque vous vous connectez à un service tiers (ex: Instagram), leurs propres politiques s&apos;appliquent. Vérifiez-les avant d&apos;autoriser l&apos;accès.</p>
        </Section>
        <Section title="10. Mineurs" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Le service n&apos;est pas destiné aux moins de 16 ans. Nous supprimons toute donnée détectée comme provenant d&apos;un mineur sans autorisation parentale.</p>
        </Section>
        <Section title="11. Mises à jour" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Toute modification majeure sera notifiée sur cette page (date de révision mise à jour). Version antérieure disponible sur demande.</p>
        </Section>
        <Section title="12. Contact" hCls={hCls} pCls={pCls}>
          <p className={pCls}>Pour toute question ou exercice de droits : <a href="mailto:contact@lazoneia" className="underline decoration-dotted">contact@lazoneia</a>.</p>
        </Section>
        <div className="text-[11px] opacity-60">Document fourni à titre informatif – compléter par un avis juridique avant mise en production.</div>
      </div>
    </main>
  );
}

function Section({ title, children, hCls, pCls }) {
  return (
    <section className="space-y-3">
      <h2 className={`text-xl font-semibold ${hCls}`}>{title}</h2>
      <div className={`prose prose-sm max-w-none dark:prose-invert ${pCls}`}>
        {children}
      </div>
    </section>
  );
}
