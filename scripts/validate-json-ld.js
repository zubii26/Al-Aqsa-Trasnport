// scripts/validate-json-ld.js
const https = require('https');

const URLS_TO_TEST = [
  'https://www.alaqsaumrahtransport.com/',
  'https://www.alaqsaumrahtransport.com/fleet/gmc-yukon-at4',
  'https://www.alaqsaumrahtransport.com/services/makkah-madinah-taxi'
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', (err) => { reject(err); });
  });
}

function extractJsonLd(html) {
  const schemas = [];
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      schemas.push(JSON.parse(match[1]));
    } catch (e) {
      console.error('❌ Failed to parse a JSON-LD block.');
    }
  }
  return schemas;
}

function validateSchema(schema, url, index) {
  let errors = [];
  
  // Handle array of schemas
  if (Array.isArray(schema)) {
    schema.forEach((s, i) => validateSchema(s, url, `${index}.${i}`));
    return;
  }

  const type = schema['@type'];
  
  // 1. Validate Product
  if (type === 'Product' || (Array.isArray(type) && type.includes('Product'))) {
    if (!schema.name) errors.push(`[${type}] Missing 'name'`);
    if (!schema.image) errors.push(`[${type}] Missing 'image'`);
    if (!schema.review && !schema.aggregateRating && !schema.offers) {
      errors.push(`[${type}] Missing 'review', 'aggregateRating', or 'offers'`);
    }
  }

  // 2. Validate LocalBusiness
  if (type === 'LocalBusiness' || type === 'TravelAgency' || (Array.isArray(type) && (type.includes('LocalBusiness') || type.includes('TravelAgency')))) {
    if (!schema.name) errors.push(`[${type}] Missing 'name'`);
    if (!schema.image) errors.push(`[${type}] Missing 'image'`);
  }

  // 3. Recursive check for deeply nested items (like ItemList or OfferCatalog)
  for (const key in schema) {
    if (typeof schema[key] === 'object' && schema[key] !== null) {
      validateSchema(schema[key], url, `${index}->${key}`);
    }
  }

  if (errors.length > 0) {
    console.log(`\n❌ Validation Errors on ${url} (Block ${index}):`);
    errors.forEach(err => console.log(`   - ${err}`));
  }
}

async function runValidation() {
  console.log(`\n🚀 Starting Professional JSON-LD Validation...\n`);
  let totalErrors = 0;

  for (const url of URLS_TO_TEST) {
    console.log(`🔍 Inspecting: ${url}`);
    try {
      const html = await fetchHTML(url);
      const schemas = extractJsonLd(html);
      
      if (schemas.length === 0) {
        console.log(`   ⚠️ No JSON-LD found on this page.\n`);
        continue;
      }

      console.log(`   ✅ Found ${schemas.length} JSON-LD blocks. Validating...`);
      
      const initialErrorCount = totalErrors;
      schemas.forEach((schema, idx) => validateSchema(schema, url, idx));
      
      if (totalErrors === initialErrorCount) {
        console.log(`   ✨ All schemas on this page passed Google's strict requirements!\n`);
      }
    } catch (err) {
      console.error(`   ❌ Failed to fetch ${url}: ${err.message}\n`);
    }
  }

  console.log(`\n🏁 Validation Complete!`);
}

runValidation();
