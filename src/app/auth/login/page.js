"use client";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginInner() {
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';
  const router = useRouter();
  const [error] = useState("");
  // Utiliser uniquement des variables NEXT_PUBLIC pour éviter divergences SSR/Client
  const showOAuth = (process.env.NEXT_PUBLIC_SHOW_OAUTH ?? '1') === '1';
  const showGoogle = (process.env.NEXT_PUBLIC_GOOGLE_LOGIN ?? '1') === '1';
  const showFacebook = (process.env.NEXT_PUBLIC_FACEBOOK_LOGIN ?? '1') === '1';
  const showInstagram = (process.env.NEXT_PUBLIC_INSTAGRAM_LOGIN ?? '0') === '1';

  return (
    <div className="w-full max-w-sm space-y-6 p-8 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-transparent shadow-2xl relative neon-border">
      <h1 className="text-3xl font-bold tracking-wide text-center text-white drop-shadow-neon animate-glow">Connexion</h1>
      {error && <p className="text-sm text-rose-300 text-center">{error}</p>}
      <div className="flex flex-col gap-4">
        {showOAuth && (
          <>
            {showGoogle && (
              <button type="button" onClick={() => signIn('google', { callbackUrl })} className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 bg-white text-gray-800 text-sm font-semibold shadow hover:shadow-neon hover:ring-2 hover:ring-cyan-400 transition-all duration-200">
                <span className="w-5 h-5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#EA4335" d="M12 11.8v2.9h6.9c-.3 1.8-2.1 5.3-6.9 5.3-4.1 0-7.4-3.4-7.4-7.5S7.9 5 12 5c2.3 0 3.8 1 4.7 1.9l2.2-2.1C17.3 3.2 14.9 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.9 0-.7-.1-1.2-.2-1.7H12z" /></svg>
                </span>
                <span>Continuer avec Google</span>
              </button>
            )}
            {showFacebook && (
              <button type="button" onClick={() => signIn('facebook', { callbackUrl })} className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 bg-[#1877F2] text-white text-sm font-semibold shadow hover:shadow-neon hover:ring-2 hover:ring-blue-400 transition-all duration-200">
                <span className="w-5 h-5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.4V9.85c0-2.37 1.42-3.68 3.58-3.68 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.9h-2.22V22c4.78-.8 8.44-4.93 8.44-9.93z" /></svg>
                </span>
                <span>Continuer avec Facebook</span>
              </button>
            )}
            {showInstagram && (
              <button type="button" onClick={() => signIn('instagram', { callbackUrl })} className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-sm font-semibold shadow hover:shadow-neon hover:ring-2 hover:ring-pink-400 transition-all duration-200">
                <span className="w-5 h-5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5.25-.88a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76Z" /></svg>
                </span>
                <span>Continuer avec Instagram</span>
              </button>
            )}
          </>
        )}
      </div>
      {/* Border néon animé */}
      <style jsx>{`
        .neon-border:before {
          content: '';
          position: absolute;
          inset: -3px;
          z-index: 0;
          border-radius: 1.25rem;
          padding: 2px;
          background: linear-gradient(120deg, #06b6d4, #a21caf, #f472b6, #06b6d4 90%);
          background-size: 200% 200%;
          animation: borderMove 4s linear infinite;
          filter: blur(2px) brightness(1.2);
        }
        @keyframes borderMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .neon-border > * { position: relative; z-index: 1; }
        .drop-shadow-neon { text-shadow: 0 0 8px #a21caf, 0 0 16px #06b6d4; }
        .animate-glow { animation: glowTitle 2.5s ease-in-out infinite; }
        @keyframes glowTitle {
          0%,100% { text-shadow: 0 0 8px #a21caf, 0 0 16px #06b6d4; }
          50% { text-shadow: 0 0 16px #f472b6, 0 0 32px #06b6d4; }
        }
        .shadow-neon { box-shadow: 0 0 12px #06b6d4, 0 0 24px #a21caf; }
      `}</style>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="w-full max-w-sm p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 animate-pulse space-y-5">
      <div className="h-6 bg-white/20 rounded w-1/2 mx-auto" />
      <div className="h-10 bg-white/10 rounded" />
      <div className="h-10 bg-white/10 rounded" />
      <div className="h-10 bg-white/10 rounded" />
      <div className="h-10 bg-white/10 rounded" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-fuchsia-800 via-purple-900 to-indigo-900 text-white">
      <Suspense fallback={<LoginFallback />}>
        <LoginInner />
      </Suspense>
    </div>
  );
}
