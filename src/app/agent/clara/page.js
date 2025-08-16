"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirection de la page Clara vers la page Glow/Charm qui la remplace
export default function ClaraRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/agent/charm');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Redirection en cours...</h1>
        <p>Clara est maintenant connue sous le nom de Charm/Glow</p>
      </div>
    </div>
  );
}
