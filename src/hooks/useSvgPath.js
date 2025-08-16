"use client";

import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour gérer les chemins des SVG
 * qui ont été déplacés vers la racine du dossier app
 */
export default function useSvgPath(filename) {
  const [path, setPath] = useState('');
  
  useEffect(() => {
    if (!filename) return;
    
    // Si nous sommes en production, les SVG sont servis depuis le dossier static
    // Si nous sommes en développement, ils sont servis depuis src/app
    if (process.env.NODE_ENV === 'production') {
      setPath(`/${filename}`);
    } else {
      setPath(`/${filename}`);
    }
  }, [filename]);
  
  return path;
}
