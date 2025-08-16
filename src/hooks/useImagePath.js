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
  
  // Si c'est un SVG qui se trouvait auparavant dans app/
  // (liste des SVG connus qui ont été déplacés)
  const appSvgs = [
    'agents-bot.svg', 'globe.svg', 'glow-bot.svg', 'grid.svg',
    'lingo-bot.svg', 'next.svg', 'pitchy-bot.svg', 'punchy-bot.svg',
    'reply-bot.svg', 'scribo-bot.svg', 'vercel.svg', 'window.svg',
    'file.svg', 'favicon.svg', 'favicon-large.svg'
  ];
  
  if (appSvgs.some(svg => path.endsWith(svg))) {
    // Pour ces SVG spécifiques, on les sert directement depuis la racine
    return `${basePath}/${path.split('/').pop()}`;
  }
  
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
                     window.location.hostname.includes('lazoneia.com') ||
                     window.location.hostname === 'lazoneia.fr');
    
    // Récupère le basePath de Next.js si disponible
    // Dans la plupart des cas, ce sera vide (''), mais pourrait être configuré
    const nextBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    
    // Dans l'environnement de développement, on utilise '/public' comme base
    // En production, on utilise '/public' ou '/' selon le déploiement
    setBasePath(nextBasePath);
    
    // Log pour le debugging sur le déploiement
    if (isProduction) {
      console.log('Environment: Production, BasePath:', nextBasePath);
      console.log('Hostname:', window.location.hostname);
    }
  }, []);
  
  // Fonction qui gère correctement les chemins d'images
  const getImagePath = (path) => {
    // Retire tout slash en début de chaîne pour standardiser
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Pour les chemins absolus déjà complets
    if (cleanPath.startsWith('http')) {
      return cleanPath;
    }
    
    // Pour les chemins relatifs, on s'assure qu'ils pointent vers le dossier public
    return `/${cleanPath}`;
  };
  
  return { getImagePath };
}

// Version statique pour les imports dans les contextes non-React
export const getStaticImagePath = (path) => normalizeImagePath(path);
