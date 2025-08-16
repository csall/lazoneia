/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les images
  images: {
    unoptimized: true, // Désactive l'optimisation d'image pour garantir qu'elles s'affichent correctement
    domains: ['vercel.app', 'lazoneia.vercel.app'] // Autorise les images depuis ces domaines
  },
  // Configuration des assets statiques
  // Utiliser les variables d'environnement pour ajuster les chemins en production
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
  // Pas de basePath spécifique
  basePath: '',
  // Ajout de la configuration pour les ressources statiques publiques
  // pour s'assurer qu'elles sont correctement servies en production
  publicRuntimeConfig: {
    staticFolder: process.env.NODE_ENV === 'production' ? '.' : '',
  }
};

export default nextConfig;
