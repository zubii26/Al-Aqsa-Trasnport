const fs = require('fs');
try {
    const content = fs.readFileSync('lint_full.json', 'utf8');
    const report = JSON.parse(content);
    report.forEach(file => {
        file.messages.forEach(msg => {
            if (msg.line === 64 && msg.column === 40) {
                console.log(`FOUND_FILE: ${file.filePath}`);
            }
        });
    });
} catch (e) {
    console.error(e);
}
