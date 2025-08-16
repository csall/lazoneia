"use client";

// Un hook simplifié pour gérer les chemins d'images qui fonctionne sur Vercel
// Le problème du 404 pour les images est résolu en s'assurant que
// tous les chemins sont correctement formatés et que Next.js/Vercel
// peut les servir correctement
import { useMemo } from 'react';

export function useImagePath() {
  // Cette fonction prend un chemin d'image et s'assure qu'il est correctement formaté
  const getImagePath = useMemo(() => (path) => {
    // Si le chemin commence déjà par http/https, on le renvoie tel quel
    if (path && path.startsWith('http')) {
      return path;
    }
    
    // Normalise le chemin pour qu'il commence toujours par '/'
    // Sur Vercel, cela garantit que les chemins sont résolus à partir de la racine
    const normalizedPath = path?.startsWith('/') ? path : `/${path}`;
    
    return normalizedPath;
  }, []);
  
  return { getImagePath };
}

// Export d'une version statique du hook pour les composants qui n'utilisent pas les hooks React
export const getStaticImagePath = (path) => {
  // Si le chemin commence déjà par http/https, on le renvoie tel quel
  if (path && path.startsWith('http')) {
    return path;
  }
  
  // Normalise le chemin pour qu'il commence toujours par '/'
  const normalizedPath = path?.startsWith('/') ? path : `/${path}`;
  
  return normalizedPath;
};
