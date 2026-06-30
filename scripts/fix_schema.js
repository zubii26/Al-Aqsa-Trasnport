const fs = require('fs');

// We don't have glob installed globally maybe, let's just use pure node fs to find files
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      if (name.endsWith('page.tsx')) {
        files.push(name);
      }
    }
  }
  return files;
}

const files = getFiles('src/app/(public)/fleet');
let count = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf-8');
  let original = content;

  // 1. Add applicableCountry
  content = content.replace(
    /("@type":\s*"MerchantReturnPolicy",\s*)("returnPolicyCategory")/g,
    '$1"applicableCountry": "SA",\n            $2'
  );

  // 2. Change hasCertification to award
  content = content.replace(
    /"hasCertification":\s*"([^"]+)"/g,
    '"award": "$1"'
  );

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf-8');
    count++;
    console.log(`Updated ${f}`);
  }
}

console.log(`Successfully updated ${count} files.`);
