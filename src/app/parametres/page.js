import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export const metadata = { title: 'Paramètres' };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if(!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Accès restreint</h1>
        <p className="text-sm text-white/70 max-w-md">Vous devez être connecté pour accéder aux paramètres de votre compte.</p>
        <Link href="/auth/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 text-white text-sm font-medium shadow hover:opacity-90 transition">Se connecter</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">Paramètres</h1>
        <p className="text-sm text-white/65 max-w-2xl">Gérez les préférences de votre compte. Ces sections sont des fondations pour des fonctionnalités futures (mise à jour du profil, préférences de notification, sécurité avancée, etc.).</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <section className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col gap-4">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-white/90">Profil</h2>
            <Link href="/profil" className="text-[11px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition">Ouvrir</Link>
          </header>
          <p className="text-xs text-white/60 leading-relaxed">Accédez à votre profil pour visualiser vos informations principales. Plus tard vous pourrez les modifier directement.</p>
        </section>
        <section className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col gap-4">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-white/90">Sécurité</h2>
            <button disabled className="text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/40 cursor-not-allowed">Bientôt</button>
          </header>
          <p className="text-xs text-white/60 leading-relaxed">Gestion du mot de passe, sessions et connexions sociales. À venir.</p>
        </section>
        <section className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col gap-4">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-white/90">Notifications</h2>
            <button disabled className="text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/40 cursor-not-allowed">Bientôt</button>
          </header>
          <p className="text-xs text-white/60 leading-relaxed">Configuration des emails, alertes importantes et préférences marketing. À venir.</p>
        </section>
        <section className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col gap-4">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-white/90">Préférences</h2>
            <button disabled className="text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/40 cursor-not-allowed">Bientôt</button>
          </header>
          <p className="text-xs text-white/60 leading-relaxed">Personnalisation de l&apos;expérience (langue, thèmes avancés, etc.). À venir.</p>
        </section>
      </div>
    </div>
  );
}
