/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les images
  images: {
    unoptimized: true // Désactive l'optimisation d'image pour garantir qu'elles s'affichent correctement
  },
  // Ne pas utiliser assetPrefix ou basePath spécifique pour Vercel
  // car Vercel gère correctement les chemins statiques par défaut
  output: 'standalone', // Optimisation pour les déploiements sur Vercel
  poweredByHeader: false, // Désactive l'en-tête "X-Powered-By"
  reactStrictMode: true, // Bon pour le développement
};

export default nextConfig;
