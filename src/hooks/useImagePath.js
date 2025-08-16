"use client";

// Fonction utilitaire pour normaliser les chemins d'images
// Compatible avec le prérendu côté serveur et le rendu côté client
export function normalizeImagePath(path) {
  if (!path) return '';
  
  // Si le chemin commence déjà par http/https, on le renvoie tel quel
  if (path.startsWith('http')) {
    return path;
  }
  
  // Normalise le chemin pour qu'il commence toujours par '/'
  return path.startsWith('/') ? path : `/${path}`;
}

// Hook pour les composants client qui a besoin d'être compatible avec le rendu côté serveur
export function useImagePath() {
  return {
    // Fonction simple qui normalise les chemins d'images
    getImagePath: normalizeImagePath
  };
}

// Version statique pour les imports dans les contextes non-React
export const getStaticImagePath = normalizeImagePath;
