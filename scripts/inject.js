const fs = require('fs');
let code = fs.readFileSync('scripts/new-post.ts', 'utf8');

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'How much does an Umrah taxi from Jeddah Airport to Makkah cost?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'An Umrah taxi from Jeddah Airport to Makkah costs between SAR 150 to SAR 250 for a standard sedan, while luxury SUVs like the GMC Yukon cost between SAR 400 and SAR 600. Pre-booking guarantees these fixed rates without hidden fees.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Can I book Umrah transport the same day I arrive at Jeddah Airport?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'While same-day booking is occasionally possible, it is never guaranteed and is subject to strict vehicle availability. To ensure you have a dedicated driver waiting, you must pre-book at least 48 hours in advance.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How do I know if an Umrah transport company is Nusuk registered?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': "You can verify if an Umrah transport company is Nusuk registered by checking their official license number on the Saudi Ministry of Hajj and Umrah's Nusuk platform. Registered companies display their credentials transparently."
      }
    },
    {
      '@type': 'Question',
      'name': 'Is it safe to book Umrah transport online in advance?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, it is entirely safe to book Umrah transport online in advance provided you use a Nusuk-registered, verified transport provider like Al Aqsa Umrah Transport, which utilizes secure payment gateways and fixed pricing.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What is the best transport option from Jeddah Airport to Makkah?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'The best transport option from Jeddah Airport to Makkah is a pre-booked private SUV or sedan. It provides door-to-door service directly to your hotel, bypassing the hassle of train transfers and carrying luggage through stations.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How long is the drive from Jeddah Airport to Makkah?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'The drive from Jeddah Airport to Makkah is approximately 85 kilometers and takes 60 to 90 minutes under normal traffic conditions. Travel times may increase slightly during peak Ramadan and Hajj seasons.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What happens if my flight arrives late at Jeddah Airport?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'If your flight arrives late, your pre-booked driver will monitor the flight status and wait for you. We offer complimentary waiting time for flight delays up to 3 hours, ensuring you are not left stranded.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Do you offer Umrah transport from Madinah Airport as well?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, we offer comprehensive Umrah transport from Prince Mohammad bin Abdulaziz International Airport in Madinah directly to your Madinah hotel, as well as private transfers between Makkah and Madinah.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Can I book transport for a large Umrah group?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, you can easily book transport for large Umrah groups. We offer fleets of Hyundai Staria minivans, Toyota Coasters, and 50-seater VIP buses to accommodate groups of any size safely and together.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How do I book Umrah transport during Ramadan?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'To book Umrah transport during Ramadan, you must reserve your vehicle 3 to 6 weeks in advance due to massive global demand. Use our online booking system to lock in your vehicle before availability disappears.'
      }
    }
  ]
};

code = code.replace(/};\s*$/, ",\n    faqSchema: " + JSON.stringify(faqSchema, null, 4) + "\n};");
fs.writeFileSync('scripts/new-post.ts', code);
console.log('FAQ Schema injected into new-post.ts');

let postsTs = fs.readFileSync('src/data/blog-posts.ts', 'utf8');
let newPostCode = fs.readFileSync('scripts/new-post.ts', 'utf8');

// The newPostCode exports `newBlogPost`
// We need to inject it as the first item in the staticBlogPosts array in src/data/blog-posts.ts
let toInject = newPostCode.replace('export const newBlogPost = {', '{');
postsTs = postsTs.replace('export const staticBlogPosts = [', 'export const staticBlogPosts = [\\n    ' + toInject + ',');
fs.writeFileSync('src/data/blog-posts.ts', postsTs);
console.log('Post injected into blog-posts.ts');
