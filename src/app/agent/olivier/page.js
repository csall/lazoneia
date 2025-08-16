"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirection de la page Olivier vers la page Punchy qui la remplace
export default function OlivierRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/agent/punchy');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Redirection en cours...</h1>
        <p>Olivier est maintenant connu sous le nom de Punchy</p>
      </div>
    </div>
  );
}
