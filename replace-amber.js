const fs = require('fs');
const path = require('path');

const dir = './src';

function walk(directory) {
    let results = [];
    const list = fs.readdirSync(directory);
    list.forEach(function (file) {
        file = directory + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(dir);

let totalReplaced = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    content = content.replace(/text-amber-[5678]00/g, 'text-secondary');
    content = content.replace(/text-amber-200/g, 'text-secondary'); // dark mode texts
    content = content.replace(/bg-amber-500/g, 'bg-secondary');
    content = content.replace(/hover:bg-amber-600/g, 'hover:bg-secondary/90');
    content = content.replace(/bg-amber-[678]00/g, 'bg-secondary');
    content = content.replace(/bg-amber-50/g, 'bg-secondary/10');
    content = content.replace(/bg-amber-100/g, 'bg-secondary/20');
    content = content.replace(/bg-amber-900\/20/g, 'bg-secondary/20');
    content = content.replace(/bg-amber-900\/30/g, 'bg-secondary/30');
    content = content.replace(/border-amber-500/g, 'border-secondary');
    content = content.replace(/border-amber-100/g, 'border-secondary/20');
    content = content.replace(/border-amber-800\/30/g, 'border-secondary/30');
    content = content.replace(/border-amber-800/g, 'border-secondary');
    content = content.replace(/shadow-amber-500\/20/g, 'shadow-secondary/20');
    content = content.replace(/shadow-amber-400\/20/g, 'shadow-secondary/20');
    content = content.replace(/shadow-amber-400\/30/g, 'shadow-secondary/30');
    content = content.replace(/ring-amber-500/g, 'ring-secondary');
    content = content.replace(/ring-amber-400/g, 'ring-secondary');

    if (content !== original) {
        fs.writeFileSync(file, content);
        totalReplaced++;
        console.log(`Replaced in ${file}`);
    }
});

console.log(`Total files modified: ${totalReplaced}`);
