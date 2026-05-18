const fs = require('fs');
const path = require('path');

const fleetDir = path.join(process.cwd(), 'src/app/(public)/fleet');
const dirs = fs.readdirSync(fleetDir);
const files = dirs
  .map(dir => path.join(fleetDir, dir, 'page.tsx'))
  .filter(f => fs.existsSync(f));

let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Find the offers object inside jsonLd
  // We match from "offers": { up to the closing } before "hasCertification", "aggregateRating" or the end of jsonLd
  const offersRegex = /"offers"\s*:\s*\{\s*"@type"\s*:\s*"Offer"[\s\S]*?(?=\}\s*,\s*"hasCertification"|\}\s*,\s*"aggregateRating"|\}\s*\n?\s*\};)/;
  
  const match = content.match(offersRegex);
  if (match) {
    let offersStr = match[0];
    
    if (!offersStr.includes('hasMerchantReturnPolicy')) {
      const injection = `,
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
            "description": "Due to the nature of pre-booked private transport services, returns or refunds are not permitted once the service has commenced or been completed. Please refer to our cancellation policy for pre-service modifications."
        },
        "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
                "@type": "MonetaryAmount",
                "value": 0,
                "currency": "SAR"
            },
            "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 0,
                    "maxValue": 0,
                    "unitCode": "DAY"
                },
                "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 0,
                    "maxValue": 0,
                    "unitCode": "DAY"
                }
            },
            "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "SA"
            }
        }`;
        
      const newOffersStr = offersStr + injection;
      content = content.replace(offersStr, newOffersStr);
      fs.writeFileSync(file, content, 'utf-8');
      updatedCount++;
      console.log('Updated ' + file);
    } else {
       console.log('Already updated ' + file);
    }
  } else {
    console.log('Could not find offers in ' + file);
  }
}

console.log('Total updated: ' + updatedCount);
