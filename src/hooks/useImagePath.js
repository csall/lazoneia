"use client";

// Un hook personnalisé pour gérer les chemins d'images
// qui fonctionnent à la fois en développement local et en production sur Vercel
import { useEffect, useState } from 'react';

export function useImagePath() {
  const [basePath, setBasePath] = useState('');
  
  useEffect(() => {
    // Détecte si on est sur Vercel en production
    const isVercel = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
    // Si on est sur Vercel, utilise le NEXT_PUBLIC_VERCEL_URL comme base
    const basePath = isVercel ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '';
    
    setBasePath(basePath);
  }, []);
  
  // Cette fonction prend un chemin d'image et renvoie le chemin complet
  const getImagePath = (path) => {
    // Si le chemin commence déjà par http/https, on le renvoie tel quel
    if (path.startsWith('http')) {
      return path;
    }
    
    // Sinon, on préfixe avec le basePath
    return `${basePath}${path}`;
  };
  
  return { getImagePath };
}
