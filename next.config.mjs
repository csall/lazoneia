/** @type {import('next').NextConfig} */
const nextConfig = {
  // Assurez-vous que les images statiques sont correctement servies
  images: {
    unoptimized: true // Désactive l'optimisation d'image pour garantir qu'elles s'affichent correctement
  },
  // Assurez-vous que le chemin de base est correctement défini
  basePath: '',
  // Assurez-vous que les ressources statiques sont correctement servies
  assetPrefix: ''
};

export default nextConfig;
