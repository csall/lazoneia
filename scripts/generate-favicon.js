#!/usr/bin/env node
/**
 * Generate favicon.ico (multi-size) from existing SVG favicon.
 * Requires: sharp
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.join(__dirname, '..', 'src', 'app', 'favicon.svg');
const outIco = path.join(__dirname, '..', 'public', 'favicon.ico');

async function run() {
  if (!fs.existsSync(svgPath)) {
    console.error('Missing favicon.svg at', svgPath);
    process.exit(1);
  }
  const svg = fs.readFileSync(svgPath);
  const sizes = [16, 32, 48, 64];
  const pngBuffers = [];
  for (const size of sizes) {
    const buf = await sharp(svg).resize(size, size, { fit: 'contain' }).png().toBuffer();
    pngBuffers.push(buf);
  }
  // sharp can output ico directly by passing sizes buffers sequentially via metadata? We'll compose manually using toIco fallback.
  // Lightweight inline ICO builder (supports uncompressed PNG frames) to avoid extra dependency.
  const ico = buildIco(pngBuffers);
  fs.mkdirSync(path.dirname(outIco), { recursive: true });
  fs.writeFileSync(outIco, ico);
  console.log('Generated', outIco, 'with sizes', sizes.join(','));
}

// Minimal ICO builder for PNG images
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // image type icon
  header.writeUInt16LE(images.length, 4);
  const dirEntries = [];
  let offset = 6 + images.length * 16;
  const dataParts = [];
  images.forEach((img, i) => {
    const png = img;
    const size = Math.round(Math.sqrt(png.length)); // not used for header dim
    // We need actual dimensions; decode with sharp metadata
    // For simplicity assume ordered sizes list we created
    const dim = [16, 32, 48, 64][i];
    const entry = Buffer.alloc(16);
    entry[0] = dim === 256 ? 0 : dim; // width
    entry[1] = dim === 256 ? 0 : dim; // height
    entry[2] = 0; // color count
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel (assuming RGBA)
    entry.writeUInt32LE(png.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    dirEntries.push(entry);
    dataParts.push(png);
    offset += png.length;
  });
  return Buffer.concat([header, ...dirEntries, ...dataParts]);
}

run().catch(e => { console.error(e); process.exit(1); });
