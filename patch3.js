const fs = require('fs');
const filePath = 'src/app/(public)/booking/page.tsx';
let code = fs.readFileSync(filePath, 'utf-8');

// Find the start of the Date/Time grid
const startIndex = code.indexOf('<div className="grid md:grid-cols-2 gap-8 mb-8">');
const endIndexStr = '<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Contact Information</h3>';
const endIndex = code.indexOf(endIndexStr);

if (startIndex === -1 || endIndex === -1) {
    console.log("Error finding bounds", startIndex, endIndex);
} else {
    // We want to delete from startIndex up to the div containing Contact Information
    // But we need to keep the "Contact Information" h3.
    // The div containing it is <div className="mb-6">\n<h3...
    const replacement = '<div className="mb-6">\n                    ' + endIndexStr;
    const actualEndIndex = code.lastIndexOf('<div className="mb-6">', endIndex);
    
    code = code.substring(0, startIndex) + code.substring(actualEndIndex);
    fs.writeFileSync(filePath, code, 'utf-8');
    console.log("Phase 3 Patch complete");
}
