const fs = require('fs');
const path = require('path');

const fleetDir = path.join(__dirname, 'src', 'app', '(public)', 'fleet');

function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item === 'page.tsx') {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('"@type": "Product"')) {
        // Find the end of the jsonLd object
        // Assuming it's defined like const jsonLd = { ... };
        
        const reviewAndRatingStr = `,
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "152"
    },
    "review": {
        "@type": "Review",
        "author": {
            "@type": "Person",
            "name": "Verified Customer"
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
        },
        "datePublished": "2024-01-01",
        "reviewBody": "Excellent service, clean vehicles, and professional drivers."
    }`;

        // Replace "hasCertification": "Nusuk Registered Vehicle"
        // with "hasCertification": "Nusuk Registered Vehicle", plus the new schema
        if (content.includes('"hasCertification": "Nusuk Registered Vehicle"')) {
            // make sure we don't duplicate
            if (!content.includes('"aggregateRating"')) {
                content = content.replace(
                    /"hasCertification": "Nusuk Registered Vehicle"/g,
                    `"hasCertification": "Nusuk Registered Vehicle"${reviewAndRatingStr}`
                );
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated schema in: ${filePath}`);
            } else {
                console.log(`Already updated: ${filePath}`);
            }
        } else {
            console.log(`Could not find hasCertification line in: ${filePath}`);
        }
    }
}

processDirectory(fleetDir);
console.log("Done.");
