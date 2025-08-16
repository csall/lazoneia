/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les images
  images: {
    unoptimized: true // Désactive l'optimisation d'image pour garantir qu'elles s'affichent correctement
  },
  // Ne pas utiliser assetPrefix ou basePath spécifique pour Vercel
  // car Vercel gère correctement les chemins statiques par défaut
  poweredByHeader: false, // Désactive l'en-tête "X-Powered-By"
  reactStrictMode: true, // Bon pour le développement
  // Nous désactivons temporairement le prérendu statique pour les pages avec des hooks clients
  // qui ne sont pas compatibles avec le rendu côté serveur
  experimental: {
    // Cette option permet d'éviter les erreurs de prérendu pour les pages utilisant des hooks clients
    appDir: true,
  }
};

export default nextConfig;
