"use client";

import Image from "next/image";
import { useImagePath } from "@/hooks/useImagePath";

// Composant qui optimise le chargement des images avec une gestion robuste des chemins
// et des optimisations pour mobile
export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw",
  priority = false,
  quality = 90,
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
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={`${className} transition-opacity duration-300`}
      style={{
        maxWidth: "100%",
        height: "auto",
        objectFit: props.objectFit || "contain"
      }}
      loading={priority ? "eager" : "lazy"}
      // Gestion avancée des erreurs et fallbacks
      onError={(e) => {
        console.warn(`Image loading error for ${imageSrc}`);
        
        // Essayons différentes stratégies pour récupérer l'image
        const tryAlternativePaths = () => {
          const paths = [
            // Chemin original sans slash
            imageSrc.startsWith('/') ? imageSrc.substring(1) : imageSrc,
            // Chemin avec slash
            imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`,
            // Essai avec URL absolue si on est sur Vercel
            `https://www.lazoneia.com/${imageSrc.replace(/^\/+/, '')}`
          ];
          
          // On essaie le premier chemin alternatif
          if (paths.length > 0) {
            console.log(`Trying alternative path: ${paths[0]}`);
            e.currentTarget.src = paths[0];
          }
        };
        
        tryAlternativePaths();
      }}
      {...props}
    />
  );
}
