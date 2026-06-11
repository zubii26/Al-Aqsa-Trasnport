// ============================================================
// FILE: lib/schema/ziyarat-tours-schema.ts
// Al Aqsa Umrah Transport — Ziyarat Tours Schema
// ============================================================

export const ziyaratTouristTripSchema = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "name": "Makkah and Madinah Ziyarat Tour",
  "description": "Private guided tour of historical Islamic sites in Makkah and Madinah including Cave Hira and Masjid Quba.",
  "provider": {
    "@type": "Organization",
    "@id": "https://www.alaqsaumrahtransport.com/#organization",
    "name": "Al Aqsa Umrah Transport",
    "url": "https://www.alaqsaumrahtransport.com"
  },
  "itinerary": [
    {
      "@type": "City",
      "name": "Makkah",
      "description": "Visit Jabal Al-Nour, Jabal Thawr, and Arafat. زيارة جبل النور وغار ثور."
    },
    {
      "@type": "City",
      "name": "Madinah",
      "description": "Visit Masjid Quba, Mount Uhud, and Qiblatayn. زيارة مسجد قباء وجبل أحد."
    }
  ],
  "offers": {
    "@type": "Offer",
    "price": "300",
    "priceCurrency": "SAR",
    "availability": "https://schema.org/InStock",
    "url": "https://www.alaqsaumrahtransport.com/services/ziyarat-tours"
  }
};

export const ziyaratFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long is a typical Ziyarat tour?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A standard Ziyarat tour in either Makkah or Madinah takes about 2 to 3 hours. However, we offer extended tours if you wish to visit more distant sites like Badr or Taif."
      }
    },
    {
      "@type": "Question",
      "name": "Do the drivers speak English?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our Ziyarat drivers are selected for their language skills and knowledge of the historical sites. They can guide you to the best parking spots and explain the significance of the locations."
      }
    },
    {
      "@type": "Question",
      "name": "Can we customize the places we visit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. It is a private tour. You can choose which sites to visit and how long to stay at each. We are here to serve your schedule."
      }
    }
  ]
};

export const ziyaratBreadcrumbSchema = {
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
      "name": "Ziyarat Tours",
      "item": "https://www.alaqsaumrahtransport.com/services/ziyarat-tours"
    }
  ]
};
