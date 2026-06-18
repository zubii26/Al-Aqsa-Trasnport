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
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "184"
  },
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
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": "Mohammed A."   // ← replace with real verified review data
    },
    "reviewBody": "Excellent service, driver was waiting at arrivals with our name sign. Vehicle was clean and comfortable, and we arrived at our Makkah hotel safely."
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",      // ← replace with your real rating
    "reviewCount": "284",      // ← replace with your real review count
    "bestRating": "5",
    "worstRating": "1"
  }
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
      "name": "How do I find my driver at Jeddah Airport (KAIA)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "After clearing customs and collecting your luggage, your Al Aqsa Umrah Transport driver will be waiting in the arrivals hall holding a sign with your name on it. You will receive the driver's name, phone number, and vehicle registration details via WhatsApp and SMS at least one hour before your flight lands. If you experience any difficulty locating your driver, our 24/7 operations team is reachable by phone and WhatsApp to assist you immediately. No need to search for a taxi or negotiate — your transfer is fully pre-arranged."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if my flight to Jeddah is delayed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We monitor all incoming flights in real time using live flight tracking tools. If your flight to Jeddah Airport is delayed, your driver automatically adjusts their arrival time to match your updated landing. There is no extra charge for delays up to 3 hours. For longer delays or cancellations, simply contact our WhatsApp support line and we will reschedule your transfer at no penalty. We understand that flight disruptions are beyond your control, and we never charge cancellation or rebooking fees for flight-related delays."
      }
    },
    {
      "@type": "Question",
      "name": "Can non-Muslim passengers travel in your vehicles to Makkah?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Only Muslims are permitted to enter the holy city of Makkah, as per Saudi Arabian law and Nusuk regulations. Al Aqsa Umrah Transport complies fully with this requirement. Passengers booking a Jeddah Airport to Makkah transfer should be aware that Saudi authorities conduct checks at the entry checkpoint to Makkah. Non-Muslim travelers can book our Jeddah Airport to Jeddah City Hotel service or alternative destinations within the Jeddah and Madinah area, which have no religious entry restrictions."
      }
    },
    {
      "@type": "Question",
      "name": "What is included in the Jeddah Airport to Makkah transfer price?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our fixed transfer price includes door-to-door service from the arrivals hall at King Abdulaziz International Airport (KAIA) to your hotel or accommodation in Makkah. The price covers the driver's meet-and-greet service, fuel, vehicle air conditioning, all toll fees, and up to 2 standard checked bags per passenger. Child seats are available on request at no extra cost. There are no hidden surcharges for late-night, early-morning, or Ramadan-period transfers — the quoted price is final. Optional extras such as additional stops are available and quoted transparently before booking."
      }
    },
    {
      "@type": "Question",
      "name": "How far in advance should I book my Jeddah Airport to Makkah taxi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For standard travel periods, we recommend booking your Jeddah Airport to Makkah transfer at least 48–72 hours before your flight arrives, though same-day bookings are often possible. During Ramadan — especially the last ten nights — and the Hajj season (Dhul Hijjah), vehicle availability becomes extremely tight and we recommend booking 3–6 weeks in advance to guarantee your preferred vehicle type. Early booking also locks in the current price, which may increase during peak pilgrim seasons due to high demand across all licensed transport providers."
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
