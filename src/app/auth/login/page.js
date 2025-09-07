"use client";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginInner() {
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';
  const router = useRouter();
  const [error] = useState("");

  return (
    <div className="w-full max-w-sm space-y-5 p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl">
      <h1 className="text-2xl font-semibold tracking-wide text-center">Connexion</h1>
      {error && <p className="text-sm text-rose-300 text-center">{error}</p>}
      <div className="flex flex-col gap-3">
        {(process.env.NEXT_PUBLIC_SHOW_OAUTH ?? '1') === '1' && (
          <>
            {(process.env.NEXT_PUBLIC_GOOGLE_LOGIN ?? '1') === '1' && (
              <button type="button" onClick={()=>signIn('google',{callbackUrl})} className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 bg-white text-gray-800 text-sm font-medium shadow hover:bg-gray-50 transition">
                <span className="w-5 h-5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#EA4335" d="M12 11.8v2.9h6.9c-.3 1.8-2.1 5.3-6.9 5.3-4.1 0-7.4-3.4-7.4-7.5S7.9 5 12 5c2.3 0 3.8 1 4.7 1.9l2.2-2.1C17.3 3.2 14.9 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.9 0-.7-.1-1.2-.2-1.7H12z"/></svg>
                </span>
                <span>Continuer avec Google</span>
              </button>
            )}
            {process.env.FACEBOOK_CLIENT_ID && (
              <button type="button" onClick={()=>signIn('facebook',{callbackUrl})} className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 bg-[#1877F2] text-white text-sm font-medium shadow hover:brightness-110 transition">
                <span className="w-5 h-5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.4V9.85c0-2.37 1.42-3.68 3.58-3.68 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.9h-2.22V22c4.78-.8 8.44-4.93 8.44-9.93z"/></svg>
                </span>
                <span>Continuer avec Facebook</span>
              </button>
            )}
          </>
        )}
      </div>
      <p className="text-xs text-center text-white/60">Connexion par email désactivée. Utilisez un provider externe.</p>
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
