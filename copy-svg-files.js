// Script pour copier les fichiers SVG vers les emplacements corrects
const fs = require('fs');
const path = require('path');

console.log('Début de la copie des fichiers SVG...');

// Chemins des répertoires
const appDir = path.join(__dirname, 'src', 'app');
const nextStaticDir = path.join(__dirname, '.next', 'static');
const nextPublicDir = path.join(__dirname, '.next', 'public');
const publicDir = path.join(__dirname, 'public');

// S'assurer que les répertoires cibles existent
[nextStaticDir, nextPublicDir, publicDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Création du répertoire: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

try {
  // Lire tous les fichiers SVG dans le répertoire src/app
  const files = fs.readdirSync(appDir).filter(file => file.endsWith('.svg'));
  
  console.log(`${files.length} fichiers SVG trouvés dans ${appDir}`);
  
  // Copier chaque fichier SVG vers les destinations
  files.forEach(file => {
    const sourcePath = path.join(appDir, file);
    const staticPath = path.join(nextStaticDir, file);
    const publicPath = path.join(publicDir, file);
    const nextPublicPath = path.join(nextPublicDir, file);
    
    // Copier vers .next/static
    fs.copyFileSync(sourcePath, staticPath);
    console.log(`Copié: ${sourcePath} -> ${staticPath}`);
    
    // Copier vers public
    fs.copyFileSync(sourcePath, publicPath);
    console.log(`Copié: ${sourcePath} -> ${publicPath}`);
    
    // Copier vers .next/public
    fs.copyFileSync(sourcePath, nextPublicPath);
    console.log(`Copié: ${sourcePath} -> ${nextPublicPath}`);
  });
  
  console.log('Copie des fichiers SVG terminée avec succès!');
} catch (error) {
  console.error('Erreur lors de la copie des fichiers SVG:', error);
  process.exit(1);
}
