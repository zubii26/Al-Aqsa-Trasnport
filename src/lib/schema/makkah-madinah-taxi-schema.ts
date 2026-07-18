// ============================================================
// FILE: lib/schema/makkah-madinah-taxi-schema.ts
// Al Aqsa Umrah Transport — Makkah to Madinah Taxi Schema
// ============================================================

export const makkahMadinahServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Makkah to Madinah Taxi Service",
  "alternateName": "تاكسي مكة المدينة",
  "provider": {
    "@type": "Organization",
    "@id": "https://www.alaqsaumrahtransport.com/#organization",
    "name": "Al Aqsa Umrah Transport",
    "url": "https://www.alaqsaumrahtransport.com"
  },
  "serviceType": "Intercity Transfer",
  // aggregateRating removed — unverifiable counts ineligible for rich results
  "areaServed": [
    {
      "@type": "City",
      "name": "Makkah"
    },
    {
      "@type": "City",
      "name": "Madinah"
    }
  ],
  "description": "Premium private transport between Makkah and Madinah in GMC Yukon or Staria.",
  "offers": {
    "@type": "Offer",
    "price": "400",
    "priceCurrency": "SAR",
    "availability": "https://schema.org/InStock",
    "url": "https://www.alaqsaumrahtransport.com/services/makkah-madinah-taxi"
  }
};

export const makkahMadinahFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long is the journey from Makkah to Madinah?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The distance is approximately 450 km. By private taxi (GMC/Staria), the journey typically takes 4.5 to 5 hours. We can stop at the Miqat (Bir Ali) for 15-30 minutes if you wish to assume Ihram before entering Makkah."
      }
    },
    {
      "@type": "Question",
      "name": "What is the price of a taxi from Makkah to Madinah?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our prices are fixed and transparent. A private sedan starts from SAR 400, while a luxury GMC Yukon or Hyundai Staria starts from SAR 600-700. Prices may vary slightly during peak seasons like Ramadan or Hajj."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer transport from Jeddah Airport to Makkah?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we specialize in Jeddah Airport transfers. Our driver will meet you at the arrival hall and take you directly to your hotel or the Haram."
      }
    },
    {
      "@type": "Question",
      "name": "Is it better than the Haramain Train?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "While the train is fast, a private taxi offers door-to-door convenience. You don't need to arrange transport to the train station, handle luggage transfers, or strictly adhere to a schedule. We pick you up from your hotel lobby and drop you at your next hotel."
      }
    },
    {
      "@type": "Question",
      "name": "Can we stop for Ziyarat on the way?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Unlike buses or trains, a private taxi allows for flexibility. We can stop at historical sites like Badr or key Ziyarat spots within Madinah upon arrival (additional charges may apply depending on time)."
      }
    }
  ]
};

export const makkahMadinahBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.alaqsaumrahtransport.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://www.alaqsaumrahtransport.com/services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Makkah to Madinah Taxi",
      "item": "https://www.alaqsaumrahtransport.com/services/makkah-madinah-taxi"
    }
  ]
};
