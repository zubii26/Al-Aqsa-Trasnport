const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public', 'images');
const images = [];

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            if (/\.(jpg|jpeg|png|svg)$/i.test(file)) {
                images.push(fullPath.replace(__dirname, '').replace(/\\/g, '/'));
            }
        }
    }
}

walkDir(directoryPath);
fs.writeFileSync('image_list.json', JSON.stringify(images, null, 2));
console.log(`Found ${images.length} images.`);
