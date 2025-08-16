/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les images
  images: {
    unoptimized: false, // Nous utilisons l'optimisation d'image de Next.js
    domains: ['vercel.app', 'lazoneia.vercel.app', 'lazoneia.com', 'www.lazoneia.com'], // Domaines autorisés
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.lazoneia.com',
      },
      {
        protocol: 'https',
        hostname: 'lazoneia.com',
      }
    ]
  },
  // Configuration des assets statiques pour Vercel
  // assetPrefix doit commencer par / ou être une URL absolue
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  
  // Configuration générale
  poweredByHeader: false, // Désactive l'en-tête "X-Powered-By"
  reactStrictMode: true, // Bon pour le développement
  
  // Configuration pour le fonctionnement en production sur Vercel
  output: 'standalone', // Optimise le déploiement sur Vercel
  
  // Garantit que les SVGs sont traités correctement
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  
  // Configuration avancée pour garantir que les chemins statiques sont correctement résolus
  experimental: {
    // Options expérimentales plus récentes pour Next.js 15+
    // Les options sont simplifiées pour éviter les erreurs
  }
};

export default nextConfig;
