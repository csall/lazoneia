"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirection de la page Max vers la page Reply qui la remplace
export default function MaxRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/agent/reply');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Redirection en cours...</h1>
        <p>Max est maintenant connu sous le nom de Reply</p>
      </div>
    </div>
  );
}
