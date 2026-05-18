/**
 * WebP Conversion Script — Al Aqsa Umrah Transport
 * Converts all PNG/JPG/JPEG images to optimized WebP format using sharp.
 * Preserves directory structure. Generates a mapping report.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'public', 'images');
const REPORT = [];

// ── Compression profiles ──────────────────────────────────────────
function getProfile(relPath) {
  const lower = relPath.toLowerCase();

  // Logos / UI / icons → lossless
  if (lower.includes('logo') || lower.includes('icon') || lower.includes('favicon')) {
    return { quality: 100, lossless: true, label: 'lossless-ui' };
  }
  // Hero / banner images → high quality lossy, resize to 1600px wide
  if (lower.includes('hero') || lower.includes('banner')) {
    return { quality: 70, lossless: false, label: 'hero', maxWidth: 1600 };
  }
  // Blog images → mid quality
  if (lower.includes('blog')) {
    return { quality: 65, lossless: false, label: 'blog', maxWidth: 1200 };
  }
  // Team / driver photos → portrait quality
  if (lower.includes('team') || lower.includes('driver')) {
    return { quality: 70, lossless: false, label: 'team', maxWidth: 800 };
  }
  // Fleet gallery images → high quality
  if (lower.includes('fleet')) {
    return { quality: 65, lossless: false, label: 'fleet-gallery', maxWidth: 1200 };
  }
  // Routes / services
  if (lower.includes('route') || lower.includes('service')) {
    return { quality: 65, lossless: false, label: 'service', maxWidth: 1200 };
  }
  // Default fallback
  return { quality: 65, lossless: false, label: 'default', maxWidth: 1200 };
}

// ── Walk directory ────────────────────────────────────────────────
function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// ── Convert one image ─────────────────────────────────────────────
async function convert(filePath) {
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const profile = getProfile(relPath);

  // Build output path: same directory, .webp extension
  const parsed = path.parse(filePath);
  const outPath = path.join(parsed.dir, parsed.name + '.webp');

  try {
    const originalSize = fs.statSync(filePath).size;
    let pipeline = sharp(filePath);

    // Resize if maxWidth is specified (maintain aspect ratio)
    if (profile.maxWidth) {
      const meta = await sharp(filePath).metadata();
      if (meta.width && meta.width > profile.maxWidth) {
        pipeline = pipeline.resize({ width: profile.maxWidth, withoutEnlargement: true });
      }
    }

    // Convert to WebP
    if (profile.lossless) {
      pipeline = pipeline.webp({ lossless: true });
    } else {
      pipeline = pipeline.webp({ quality: profile.quality, effort: 4 });
    }

    await pipeline.toFile(outPath);
    const newSize = fs.statSync(outPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    REPORT.push({
      original: '/images/' + relPath,
      webp: '/images/' + relPath.replace(/\.(jpe?g|png)$/i, '.webp'),
      originalKB: (originalSize / 1024).toFixed(1),
      webpKB: (newSize / 1024).toFixed(1),
      savings: savings + '%',
      profile: profile.label,
    });

    console.log(`  ✓ ${relPath}  →  ${savings}% smaller  (${profile.label})`);
  } catch (err) {
    console.error(`  ✗ FAILED: ${relPath}  —  ${err.message}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  const files = walkDir(ROOT);
  console.log(`\n🖼️  Found ${files.length} images to convert.\n`);

  // Process in batches of 8 for stability
  const BATCH = 8;
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    await Promise.all(batch.map(convert));
  }

  // Write report
  const totalOriginal = REPORT.reduce((s, r) => s + parseFloat(r.originalKB), 0);
  const totalWebp = REPORT.reduce((s, r) => s + parseFloat(r.webpKB), 0);
  const overallSavings = ((1 - totalWebp / totalOriginal) * 100).toFixed(1);

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 CONVERSION SUMMARY`);
  console.log(`   Images converted:   ${REPORT.length}`);
  console.log(`   Original total:     ${(totalOriginal / 1024).toFixed(1)} MB`);
  console.log(`   WebP total:         ${(totalWebp / 1024).toFixed(1)} MB`);
  console.log(`   Overall savings:    ${overallSavings}%`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  fs.writeFileSync('webp-conversion-report.json', JSON.stringify(REPORT, null, 2));
  console.log('📄 Full report saved to webp-conversion-report.json\n');
}

main().catch(console.error);
