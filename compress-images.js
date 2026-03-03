const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'src/assets/images';
const outputDir = 'src/assets/images-compressed';

async function compressImages() {
  try {
    console.log('🔄 Début de la compression des images...\n');

    // Créer le dossier de sortie s'il n'existe pas
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Lire tous les fichiers JPG du dossier
    const files = fs.readdirSync(inputDir)
      .filter(file => /\.(jpg|jpeg)$/i.test(file));

    let totalOriginalSize = 0;
    let totalCompressedSize = 0;

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);

      // Obtenir la taille originale
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;
      totalOriginalSize += originalSize;

      // Compresser l'image
      await sharp(inputPath)
        .jpeg({
          quality: 75,           // Qualité de 75%
          progressive: true,     // JPEG progressif
          mozjpeg: true          // Utiliser mozjpeg pour une meilleure compression
        })
        .toFile(outputPath);

      // Obtenir la taille compressée
      const compressedStats = fs.statSync(outputPath);
      const compressedSize = compressedStats.size;
      totalCompressedSize += compressedSize;

      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      console.log(`📄 ${file}`);
      console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Compressé: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Réduction: ${reduction}%\n`);
    }

    // Statistiques totales
    const totalReduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);
    console.log('📊 STATISTIQUES TOTALES:');
    console.log(`   Total original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Total compressé: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Réduction totale: ${totalReduction}%\n`);

    console.log('✨ Compression terminée! Les images sont dans:', outputDir);

  } catch (error) {
    console.error('❌ Erreur lors de la compression:', error);
    process.exit(1);
  }
}

compressImages();
