// ============================================================
// FILE: lib/schema/homepage-schema.ts
// Al Aqsa Umrah Transport — Homepage Triple Stack Schema
// ============================================================

// ─────────────────────────────────────────────────────────────
// BLOCK 1 — LocalBusiness + TravelAgency Schema
// ─────────────────────────────────────────────────────────────
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TravelAgency"],
  "@id": "https://www.alaqsaumrahtransport.com/#organization",
  "name": "Al Aqsa Umrah Transport",
  "legalName": "Al Aqsa Umrah Transport",
  "description": "Nusuk-registered Umrah taxi and private transport company based in Makkah, Saudi Arabia. Offering 24/7 airport transfers, Makkah–Madinah intercity rides, Ziyarat tours, and Hajj group transport.",
  "url": "https://www.alaqsaumrahtransport.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.alaqsaumrahtransport.com/images/logo.png",
    "width": 300,
    "height": 100
  },
  "image": "https://www.alaqsaumrahtransport.com/images/fleet.jpg",
  "telephone": "+966 54 870 7332",
  "email": "alaqsaumrahtransport@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Near Masjid al-Haram, Al Haram District",
    "addressLocality": "Makkah",
    "addressRegion": "Mecca Region",
    "postalCode": "24231",
    "addressCountry": "SA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.4225,
    "longitude": 39.8262
  },
  "hasMap": "https://maps.google.com/?q=21.4225,39.8262",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  ],
  "priceRange": "SAR 150 – SAR 600",
  "currenciesAccepted": "SAR",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "areaServed": [
    {
      "@type": "City",
      "name": "Makkah",
      "sameAs": "https://www.wikidata.org/wiki/Q5806"
    },
    {
      "@type": "City",
      "name": "Madinah",
      "sameAs": "https://www.wikidata.org/wiki/Q41621"
    },
    {
      "@type": "City",
      "name": "Jeddah",
      "sameAs": "https://www.wikidata.org/wiki/Q79602"
    },
    {
      "@type": "Country",
      "name": "Saudi Arabia",
      "sameAs": "https://www.wikidata.org/wiki/Q851"
    }
  ],
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 21.4225,
      "longitude": 39.8262
    },
    "geoRadius": "500000"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Umrah Transport Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Jeddah Airport to Makkah Transfer",
          "description": "Private taxi transfer from King Abdulaziz International Airport (KAIA) in Jeddah to your hotel in Makkah. Meet-and-greet service, licensed Nusuk driver, modern vehicles."
        },
        "price": "150",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/services/jeddah-airport-transfer"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Makkah to Madinah Intercity Transfer",
          "description": "Comfortable private transport between Makkah and Madinah covering approximately 430 km. Ideal for Umrah pilgrims visiting both holy cities. Air-conditioned vehicles, experienced drivers."
        },
        "price": "400",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/services/makkah-madinah-transfer"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Makkah Ziyarat Tour",
          "description": "Guided private transport tour of Makkah's sacred and historical sites including Jabal al-Nour, Jabal Thawr, Masjid al-Ji'ranah, and Al-Baqi. Knowledgeable local drivers."
        },
        "price": "250",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/services/makkah-ziyarat-tour"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Hajj Group Transport",
          "description": "Organized group transport solutions for Hajj pilgrims. Fleet of buses and minivans for Arafat, Muzdalifah, and Mina transfers. Nusuk-compliant with experienced Hajj season drivers."
        },
        "price": "600",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/services/hajj-group-transport"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Madinah Airport Transfer",
          "description": "Private transfer from Prince Mohammad Bin Abdulaziz International Airport (MED) to Madinah hotels near Masjid an-Nabawi. Fixed fare, no hidden charges, 24/7 availability."
        },
        "price": "180",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/services/madinah-airport-transfer"
      }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/alaqsaumrahtransport",   // ← replace with real URLs
    "https://www.instagram.com/alaqsaumrahtransport",
    "https://twitter.com/alaqsaumrah",
    "https://wa.me/966548707332"
  ]
};

// ─────────────────────────────────────────────────────────────
// BLOCK 2 — FAQPage Schema (Homepage)
// ─────────────────────────────────────────────────────────────
export const homepageFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much is a taxi from Jeddah Airport to Makkah?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A private taxi from King Abdulaziz International Airport (KAIA) in Jeddah to Makkah with Al Aqsa Umrah Transport starts at SAR 150 for a standard sedan. The fare covers the full journey of approximately 80–90 km, with no hidden charges or toll surcharges. Larger vehicles such as SUVs and minivans are available for families or groups at slightly higher rates. All prices are fixed and confirmed at the time of booking, so you will never face surge pricing or unexpected costs on arrival."
      }
    },
    {
      "@type": "Question",
      "name": "Is Al Aqsa Umrah Transport Nusuk registered?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Al Aqsa Umrah Transport is officially registered on the Nusuk platform, Saudi Arabia's government-authorized pilgrim services portal operated by the Ministry of Hajj and Umrah. This registration confirms that our drivers, vehicles, and operations meet the official safety and service standards required to transport Umrah and Hajj pilgrims. You can verify our registration directly on the Nusuk app or website. Booking with a Nusuk-registered provider protects you against unlicensed operators and guarantees a compliant, insured journey."
      }
    },
    {
      "@type": "Question",
      "name": "How long does the Jeddah to Makkah journey take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The drive from Jeddah Airport (KAIA) to central Makkah typically takes 60 to 90 minutes under normal traffic conditions. The distance is approximately 80–90 km via the Haramain Expressway. During Ramadan, Hajj season, and peak Umrah periods — particularly on weekends — traffic near the Makkah entrance checkpoints can extend journey times to 2–3 hours. We recommend scheduling your transfer with buffer time during these peak periods. Our drivers monitor live traffic and use the most efficient routes to minimize delays."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer 24/7 service during Ramadan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Al Aqsa Umrah Transport operates 24 hours a day, 7 days a week, including throughout the entire month of Ramadan. Ramadan is one of the busiest periods for Umrah pilgrims, and we maintain full fleet availability during Suhoor, Iftar, and Tarawih prayer times. We strongly advise booking your Ramadan transfers in advance — ideally 2–4 weeks before travel — as demand is exceptionally high and vehicles fill up quickly during the last ten nights of Ramadan."
      }
    },
    {
      "@type": "Question",
      "name": "How do I book an Umrah taxi in advance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can book an Umrah taxi with Al Aqsa Umrah Transport through three easy methods: (1) Use our online booking form at alaqsaumrahtransport.com/book — enter your pickup location, destination, travel date, and number of passengers to get an instant quote; (2) Contact us directly via WhatsApp for fast, real-time booking assistance; or (3) Call our 24/7 reservation line. We recommend booking at least 48 hours in advance for standard transfers, and 2–4 weeks ahead during Ramadan or Hajj season to secure your preferred vehicle type."
      }
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// BLOCK 3 — Organization Schema with Social sameAs
// ─────────────────────────────────────────────────────────────
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.alaqsaumrahtransport.com/#organization",
  "name": "Al Aqsa Umrah Transport",
  "url": "https://www.alaqsaumrahtransport.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.alaqsaumrahtransport.com/images/logo.png",
    "width": 300,
    "height": 100
  },
  "description": "Nusuk-registered Umrah and Hajj transport company serving pilgrims across Makkah, Madinah, and Jeddah, Saudi Arabia.",
  "foundingDate": "2018",                    // ← replace with real founding year
  "foundingLocation": {
    "@type": "Place",
    "name": "Makkah, Saudi Arabia"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Near Masjid al-Haram, Al Haram District",
    "addressLocality": "Makkah",
    "addressRegion": "Mecca Region",
    "postalCode": "24231",
    "addressCountry": "SA"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+966 54 870 7332",
      "contactType": "customer service",
      "contactOption": "TollFree",
      "availableLanguage": ["Arabic", "English", "Urdu"],
      "areaServed": "SA",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "opens": "00:00",
        "closes": "23:59",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday",
          "Thursday", "Friday", "Saturday", "Sunday"
        ]
      }
    },
    {
      "@type": "ContactPoint",
      "telephone": "+966 54 870 7332",
      "contactType": "reservations",
      "availableLanguage": ["Arabic", "English", "Urdu"]
    }
  ],
  "sameAs": [
    // ─── Replace ALL placeholder URLs with your real profile URLs ───
    "https://www.facebook.com/alaqsaumrahtransport",
    "https://www.instagram.com/alaqsaumrahtransport",
    "https://twitter.com/alaqsaumrah",
    "https://www.youtube.com/@alaqsaumrahtransport",
    "https://www.linkedin.com/company/al-aqsa-umrah-transport",
    "https://wa.me/966548707332",
    "https://www.tiktok.com/@alaqsaumrahtransport"
    // ─── Add Nusuk profile URL if publicly linkable ───────────────
    // "https://www.nusuk.sa/providers/al-aqsa-umrah-transport"
  ]
};
