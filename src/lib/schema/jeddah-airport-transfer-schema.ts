// ============================================================
// FILE: lib/schema/jeddah-airport-transfer-schema.ts
// Al Aqsa Umrah Transport — Jeddah Airport Transfer Page
// Triple Stack: Service + FAQPage + BreadcrumbList
// ============================================================

// ─────────────────────────────────────────────────────────────
// BLOCK 1 — Service Schema
// ─────────────────────────────────────────────────────────────
export const jeddahAirportServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.alaqsaumrahtransport.com/services/jeddah-airport-transfer#service",
  "name": "Jeddah Airport to Makkah Private Transfer",
  "alternateName": [
    "KAIA to Makkah Taxi",
    "Jeddah Airport Umrah Transfer",
    "King Abdulaziz Airport Makkah Taxi"
  ],
  "description": "Book a private, Nusuk-registered taxi from King Abdulaziz International Airport (KAIA) in Jeddah to your hotel in Makkah. Fixed prices from SAR 150, 24/7 availability, meet-and-greet service, and air-conditioned modern vehicles for Umrah and Hajj pilgrims.",
  "url": "https://www.alaqsaumrahtransport.com/services/jeddah-airport-transfer",
  "serviceType": "Airport Transfer",
  "category": "Pilgrim Transport",
  // aggregateRating removed — unverifiable counts ineligible for rich results
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://www.alaqsaumrahtransport.com/#organization",
    "name": "Al Aqsa Umrah Transport"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Jeddah"
    },
    {
      "@type": "City",
      "name": "Makkah"
    }
  ],
  "serviceOutput": {
    "@type": "Trip",
    "departureLocation": {
      "@type": "Airport",
      "name": "King Abdulaziz International Airport",
      "iataCode": "JED",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Jeddah",
        "addressCountry": "SA"
      }
    },
    "arrivalLocation": {
      "@type": "City",
      "name": "Makkah",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Makkah",
        "addressCountry": "SA"
      }
    }
  },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "150",
    "highPrice": "450",
    "priceCurrency": "SAR",
    "offerCount": "4",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-01-01",
    "seller": {
      "@type": "LocalBusiness",
      "name": "Al Aqsa Umrah Transport"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Economy Sedan (1–3 passengers)",
        "price": "150",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "SUV / 4x4 (1–5 passengers)",
        "price": "220",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Minivan (1–8 passengers)",
        "price": "320",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Minibus (9–14 passengers)",
        "price": "450",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock"
      }
    ]
  },
  "termsOfService": "https://www.alaqsaumrahtransport.com/terms",
  "hoursAvailable": {
    "@type": "OpeningHoursSpecification",
    "opens": "00:00",
    "closes": "23:59",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday", "Sunday"
    ]
  },
  // review removed — self-serving reviews ineligible for Google rich results
};

// ─────────────────────────────────────────────────────────────
// BLOCK 2 — FAQPage Schema (Jeddah Airport Transfer specific)
// ─────────────────────────────────────────────────────────────
export const jeddahAirportFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can you take a taxi directly to your hotel in Makkah?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our private taxis transport you directly from the Jeddah airport arrivals hall to the front lobby of your Makkah hotel. We navigate the local Makkah roads to ensure a seamless door-to-door experience, minimizing physical strain."
      }
    },
    {
      "@type": "Question",
      "name": "Are taxis available at KAIA late at night?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our private airport pickups operate on a strict 24/7 availability schedule. Whether your flight lands at 2:00 PM or 3:00 AM, your assigned driver will be actively monitoring your flight status and waiting in the arrivals area."
      }
    },
    {
      "@type": "Question",
      "name": "How much luggage can a standard taxi hold?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A standard sedan holds up to 3 passengers and 2 to 3 medium-sized bags. If your group carries large hard-shell suitcases, you must upgrade to an SUV or a van to ensure all luggage fits safely."
      }
    },
    {
      "@type": "Question",
      "name": "Do you need Saudi Riyals to pay for the taxi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You do not strictly need Saudi Riyals if you book with us, as drivers accept major credit cards and Apple Pay via mobile terminals. However, we recommend withdrawing a small amount of cash (SAR 100–200) from airport ATMs for tipping."
      }
    },
    {
      "@type": "Question",
      "name": "Can you book a return trip or onward travel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can easily arrange your complete itinerary with our team, including your onward Makkah to Madinah taxi once your Umrah rituals are complete. Booking your entire transport itinerary with a single operator simplifies communication."
      }
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// BLOCK 3 — BreadcrumbList Schema
// ─────────────────────────────────────────────────────────────
export const jeddahAirportBreadcrumbSchema = {
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
      "name": "Jeddah Airport to Makkah Transfer",
      "item": "https://www.alaqsaumrahtransport.com/services/jeddah-airport-transfer"
    }
  ]
};
