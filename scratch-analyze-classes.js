const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const classRegex = /className=["']([^"']+)["']/g;
const classesCount = {};

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (/\.(tsx|jsx)$/.test(file)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            let match;
            while ((match = classRegex.exec(content)) !== null) {
                const classes = match[1].split(/\s+/);
                classes.forEach(c => {
                    classesCount[c] = (classesCount[c] || 0) + 1;
                });
            }
        }
    }
}

walk(srcDir);

const filterPrefixes = ['text-', 'font-', 'leading-', 'tracking-', 'rounded-', 'shadow-', 'max-w-', 'blur-', 'duration-', 'ease-', 'gap-', 'p-', 'm-'];

const typography = {};
const other = {};

for (const [cls, count] of Object.entries(classesCount)) {
    if (cls.startsWith('text-') || cls.startsWith('font-') || cls.startsWith('leading-') || cls.startsWith('tracking-')) {
        typography[cls] = count;
    } else if (cls.startsWith('rounded-') || cls.startsWith('shadow-') || cls.startsWith('blur-') || cls.startsWith('duration-') || cls.startsWith('ease-') || cls.startsWith('border-') || cls.startsWith('max-w-')) {
        other[cls] = count;
    }
}

console.log('--- Typography ---');
Object.entries(typography).sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([c, cnt]) => console.log(`${c}: ${cnt}`));
console.log('--- Other classes ---');
Object.entries(other).sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([c, cnt]) => console.log(`${c}: ${cnt}`));
