/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les images
  images: {
    unoptimized: true, // Désactive l'optimisation d'image pour garantir qu'elles s'affichent correctement
    domains: ['vercel.app', 'lazoneia.vercel.app'], // Ajouter les domaines où vos images sont hébergées
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      }
    ]
  },
  // Ne pas utiliser assetPrefix ou basePath spécifique pour Vercel
  // car Vercel gère correctement les chemins statiques par défaut
  poweredByHeader: false, // Désactive l'en-tête "X-Powered-By"
  reactStrictMode: true, // Bon pour le développement
  // Nous désactivons temporairement le prérendu statique pour les pages avec des hooks clients
  // qui ne sont pas compatibles avec le rendu côté serveur
  experimental: {
    // Next.js 15+ n'a plus besoin de l'option appDir (elle est activée par défaut)
    // Laissons la configuration expérimentale plus propre
  }
};

export default nextConfig;
