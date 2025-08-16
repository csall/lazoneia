/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les images
  images: {
    unoptimized: true, // Désactive l'optimisation d'image pour garantir qu'elles s'affichent correctement
    domains: ['vercel.app', 'lazoneia.vercel.app', 'lazoneia.com'], // Domaines autorisés
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'lazoneia.com',
      }
    ]
  },
  // Configuration des assets statiques pour Vercel
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '', // Préfixe relatif pour les assets en production
  
  // Configuration générale
  poweredByHeader: false, // Désactive l'en-tête "X-Powered-By"
  reactStrictMode: true, // Bon pour le développement
  
  // Configuration pour le fonctionnement en production sur Vercel
  output: 'standalone', // Optimise le déploiement sur Vercel
  
  // Configuration avancée pour garantir que les chemins statiques sont correctement résolus
  experimental: {
    // Optimisations pour les ressources statiques
    optimizeFonts: true,
    optimizeImages: true,
    
    // Ces options peuvent aider avec les chemins statiques
    serverComponents: true,
    swcMinify: true,
  }
};

export default nextConfig;
