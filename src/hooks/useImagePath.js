"use client";

// Un hook personnalisé pour gérer les chemins d'images
// qui fonctionnent à la fois en développement local et en production
import { useState, useEffect } from 'react';

export function useImagePath() {
  const [basePath, setBasePath] = useState('');
  
  useEffect(() => {
    // En production (sur Vercel ou ailleurs), on a besoin d'une détection dynamique
    // car le chemin de base peut varier selon le déploiement
    const isProduction = typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      !window.location.hostname.includes('127.0.0.1');
    
    if (isProduction) {
      // En production, nous utilisons le chemin relatif depuis la racine du projet
      setBasePath('');
    } else {
      // En local, on peut utiliser des chemins absolus
      setBasePath('');
    }
  }, []);
  
  // Cette fonction prend un chemin d'image et renvoie le chemin correct selon l'environnement
  const getImagePath = (path) => {
    // Si le chemin commence déjà par http/https, on le renvoie tel quel
    if (path.startsWith('http')) {
      return path;
    }
    
    // Si le chemin ne commence pas par /, on l'ajoute
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // En production, on utilise un chemin relatif pour les ressources statiques
    return `${basePath}${normalizedPath}`;
  };
  
  return { getImagePath };
}

// Export d'une version statique du hook pour les composants qui n'utilisent pas les hooks React
export const getStaticImagePath = (path) => {
  // Si le chemin commence déjà par http/https, on le renvoie tel quel
  if (path.startsWith('http')) {
    return path;
  }
  
  // Si le chemin ne commence pas par /, on l'ajoute
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Retourne toujours le chemin avec le préfixe pour les images statiques
  return normalizedPath;
};
