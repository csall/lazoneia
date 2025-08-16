"use client";

import Image from "next/image";
import { useImagePath } from "@/hooks/useImagePath";

// Composant qui optimise le chargement des images avec une gestion robuste des chemins
export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className = "",
  ...props 
}) {
  const { getImagePath } = useImagePath();
  
  // Normalisation du chemin d'image
  const imageSrc = getImagePath(src);
  
  return (
    <Image
      src={imageSrc}
      alt={alt || "Image"}
      width={width || 100}
      height={height || 100}
      priority={priority}
      className={className}
      // Pour le déploiement Vercel, ces options aident à éviter les problèmes 404
      loading={priority ? "eager" : "lazy"}
      // Essayons différentes stratégies de fallback
      onError={(e) => {
        // En cas d'erreur, essayons une URL différente
        if (imageSrc.startsWith('/')) {
          // Si c'est un chemin absolu, essayons avec un chemin relatif
          e.currentTarget.src = imageSrc.substring(1);
        } else {
          // Sinon, ajoutons un slash
          e.currentTarget.src = `/${imageSrc}`;
        }
      }}
      {...props}
    />
  );
}
