const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

let foundArabic = [];
let foundPlayfair = [];
let foundReem = [];
let buttons = [];

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (/\.(tsx|jsx|css)$/.test(file)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes('lang="ar"')) foundArabic.push(fullPath);
            if (content.includes('font-playfair')) foundPlayfair.push(fullPath);
            if (content.includes('font-reem')) foundReem.push(fullPath);
            if (file.includes('Button') || content.includes('className="btn"')) buttons.push(fullPath);
        }
    }
}

walk(srcDir);

console.log('lang="ar":', foundArabic);
console.log('font-playfair:', foundPlayfair);
console.log('font-reem:', foundReem);
console.log('buttons:', buttons);
