"use client";

import { useState, useEffect } from 'react';

// Fonction utilitaire pour normaliser les chemins d'images
// Compatible avec le prérendu côté serveur et le rendu côté client
// et prend en compte les déploiements Vercel
export function normalizeImagePath(path, basePath = '') {
  if (!path) return '';
  
  // Si le chemin commence déjà par http/https, on le renvoie tel quel
  if (path.startsWith('http')) {
    return path;
  }
  
  // Normalise le chemin en supprimant les doubles slashes
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Ajoute le basePath si nécessaire
  return `${basePath}${normalizedPath}`;
}

// Hook pour les composants client avec détection d'environnement
export function useImagePath() {
  // État pour stocker le basePath de l'application
  const [basePath, setBasePath] = useState('');
  
  useEffect(() => {
    // Détecte si on est en production et sur Vercel
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = typeof window !== 'undefined' && 
                    (window.location.hostname.includes('vercel.app') || 
                     window.location.hostname === 'lazoneia.fr');
    
    // Récupère le basePath de Next.js si disponible
    // Dans la plupart des cas, ce sera vide (''), mais pourrait être configuré
    const nextBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    
    // Utilise le basePath détecté
    setBasePath(nextBasePath);
  }, []);
  
  return {
    getImagePath: (path) => normalizeImagePath(path, basePath)
  };
}

// Version statique pour les imports dans les contextes non-React
export const getStaticImagePath = (path) => normalizeImagePath(path);
