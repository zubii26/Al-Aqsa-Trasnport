const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

let count = 0;

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let original = fs.readFileSync(filePath, 'utf8');
    let modified = original;

    // Remove Tailwind class
    modified = modified.replace(/font-playfair/g, '');
    
    // Remove CSS variable usages
    modified = modified.replace(/font-family:\s*var\(--font-playfair\)[^;]*;/g, '');

    if (original !== modified) {
      fs.writeFileSync(filePath, modified);
      console.log('Fixed:', filePath);
      count++;
    }
  }
});

console.log(`Removed playfair from ${count} files.`);
