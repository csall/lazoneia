/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les images
  images: {
    unoptimized: false,
    domains: [
      'vercel.app',
      'lazoneia.vercel.app',
      'lazoneia.com',
      'www.lazoneia.com',
      'lh3.googleusercontent.com'
    ],
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '*.lazoneia.com' },
      { protocol: 'https', hostname: 'lazoneia.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
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
  webpack(config, { dev }) {
    // Configuration spécifique pour les SVG
    // On gère deux cas:
    // 1. Les SVG importés en tant que composants React via SVGR
    // 2. Les SVG utilisés comme assets statiques
    
    // D'abord, on supprime la règle existante qui pourrait s'appliquer aux SVG
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test?.test?.('.svg')
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }
    
    // Règle pour traiter les SVG comme des composants React
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { not: [/\.(css|scss|sass)$/] },
      use: ['@svgr/webpack']
    });
    
    // Règle spéciale pour les SVG dans le dossier app - traités comme assets statiques
    config.module.rules.push({
      test: /\/app\/.*\.svg$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[name][ext]',
        publicPath: '/'
      }
    });

  // (Les diagnostics CSS ont été retirés; build standard rétabli)
    
  return config;
  },
  
  // Configuration avancée pour garantir que les chemins statiques sont correctement résolus
  experimental: {
    // Options expérimentales plus récentes pour Next.js 15+
    // Les options sont simplifiées pour éviter les erreurs
  }
};

export default nextConfig;
