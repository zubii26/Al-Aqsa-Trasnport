const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const colorRegexes = [
    /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g,
    /rgb\([^)]+\)/g,
    /rgba\([^)]+\)/g,
    /hsl\([^)]+\)/g,
    /hsla\([^)]+\)/g,
    /\b(text|bg|border|ring|fill|stroke)-(gray|red|yellow|green|blue|indigo|purple|pink|orange|teal|cyan)-[1-9]00\b/g
];

const colorCounts = {};
let totalHardcodedColors = 0;

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (/\.(tsx|ts|jsx|js|css)$/.test(file)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            for (const regex of colorRegexes) {
                const matches = content.match(regex);
                if (matches) {
                    for (const match of matches) {
                        const m = match.toLowerCase();
                        colorCounts[m] = (colorCounts[m] || 0) + 1;
                        totalHardcodedColors++;
                    }
                }
            }
        }
    }
}

walk(srcDir);

const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]).slice(0, 20);
console.log(`Total hardcoded colors: ${totalHardcodedColors}`);
console.log('Top 20 most frequent literals:');
sortedColors.forEach(([color, count]) => {
    console.log(`${color}: ${count}`);
});
