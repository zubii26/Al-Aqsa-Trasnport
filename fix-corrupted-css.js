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
  if (filePath.endsWith('.css')) {
    let original = fs.readFileSync(filePath, 'utf8');
    
    // Remove the corrupted font-family declarations entirely
    let modified = original.replace(/.*font-family:\s*var\(--\).*;/g, '');
    
    if (original !== modified) {
      fs.writeFileSync(filePath, modified);
      console.log('Fixed CSS corruption:', filePath);
      count++;
    }
  }
});

console.log(`Fixed CSS in ${count} files.`);
