/**
 * Update all image references in src/ from .jpg/.jpeg/.png to .webp
 * Only updates paths that start with /images/ (public images).
 * Skips external URLs and non-image references.
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];
const CHANGES = [];

// Build a set of all WebP files that actually exist
const webpFiles = new Set();
function walkForWebp(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkForWebp(full);
    else if (entry.name.endsWith('.webp')) {
      // Store as /images/... path
      const rel = full.replace(path.join(__dirname, 'public'), '').replace(/\\/g, '/');
      webpFiles.add(rel);
    }
  }
}
walkForWebp(path.join(__dirname, 'public', 'images'));

console.log(`Found ${webpFiles.size} WebP files to map against.\n`);

// Walk source files
function walkSrc(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSrc(full);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      processFile(full);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Match image paths like /images/something.jpg, .jpeg, .png
  // Handles both single and double quotes, and backtick templates
  const regex = /(\/images\/[^\s'"`\)]+)\.(jpg|jpeg|png)/gi;

  content = content.replace(regex, (match, basePath, ext) => {
    const webpPath = basePath + '.webp';
    // Only replace if the webp version exists
    if (webpFiles.has(webpPath)) {
      return webpPath;
    }
    // If no webp exists, leave original
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    const relPath = path.relative(__dirname, filePath).replace(/\\/g, '/');
    
    // Count replacements
    const count = (original.match(regex) || []).length;
    CHANGES.push({ file: relPath, replacements: count });
    console.log(`  ✓ ${relPath}  (${count} refs updated)`);
  }
}

console.log('Updating source file references...\n');
walkSrc(SRC_DIR);

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`📊 REFERENCE UPDATE SUMMARY`);
console.log(`   Files modified:  ${CHANGES.length}`);
console.log(`   Total refs:      ${CHANGES.reduce((s, c) => s + c.replacements, 0)}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
