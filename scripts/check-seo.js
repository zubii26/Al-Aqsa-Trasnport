const fs = require('fs');
const path = require('path');

const MAX_TITLE_LENGTH = 60; // 60 + 10 ( | Al Aqsa) = 70 max

let hasError = false;

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir(path.join(process.cwd(), 'src'));

console.log(`Checking SEO titles in ${files.length} files...`);

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check TS/TSX metaTitle or title
    const metaTitleMatches = content.matchAll(/metaTitle:\s*['"`](.*?)['"`]/g);
    for (const match of metaTitleMatches) {
        if (match[1].length > MAX_TITLE_LENGTH) {
            console.error(`❌ Title too long (${match[1].length} chars) in ${path.relative(process.cwd(), file)}`);
            console.error(`   "${match[1]}"`);
            hasError = true;
        }
    }

    const titleMatches = content.matchAll(/title:\s*['"`](.*?)['"`]/g);
    for (const match of titleMatches) {
        if (match[1].length > MAX_TITLE_LENGTH) {
            // Ignore variables like `vehicleData?.seo?.title`
            if (!match[1].includes('$') && !match[1].includes('Route Not Found')) {
                console.error(`❌ Title too long (${match[1].length} chars) in ${path.relative(process.cwd(), file)}`);
                console.error(`   "${match[1]}"`);
                hasError = true;
            }
        }
    }
    
    // Check JSON
    if (file.endsWith('.json')) {
        const jsonTitleMatches = content.matchAll(/"title"\s*:\s*"(.*?)"/g);
        for (const match of jsonTitleMatches) {
            if (match[1].length > MAX_TITLE_LENGTH) {
                console.error(`❌ Title too long (${match[1].length} chars) in ${path.relative(process.cwd(), file)}`);
                console.error(`   "${match[1]}"`);
                hasError = true;
            }
        }
    }
}

if (hasError) {
    console.error('\n🚨 SEO Check Failed! Some titles exceed 60 characters (70 char final rendered limit).');
    process.exit(1);
} else {
    console.log('✅ All titles are within the acceptable length.');
    process.exit(0);
}
