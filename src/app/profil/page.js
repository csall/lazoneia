import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Profil',
};

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if(!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Accès restreint</h1>
        <p className="text-sm text-white/70 max-w-md">Vous devez être connecté pour accéder à votre profil.</p>
        <Link href="/auth/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 text-white text-sm font-medium shadow hover:opacity-90 transition">Se connecter</Link>
      </div>
    );
  }
  const user = session.user;
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {user.image && (
          <Image src={user.image} alt="avatar" width={96} height={96} className="rounded-2xl w-24 h-24 object-cover border border-white/15" />
        )}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">Mon profil</h1>
          <div className="text-sm text-white/80"><span className="font-medium">Nom:</span> {user.name || '—'}</div>
          <div className="text-sm text-white/80"><span className="font-medium">Email:</span> {user.email}</div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-wide text-white/90">Compte</h2>
          <p className="text-xs text-white/60 leading-relaxed">Informations de base provenant du fournisseur d&apos;authentification. À terme vous pourrez les modifier ici.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-wide text-white/90">Sécurité</h2>
          <p className="text-xs text-white/60 leading-relaxed">Gestion des connexions, sessions actives et révocation (à implémenter plus tard).</p>
        </div>
      </div>
    </div>
  );
}
