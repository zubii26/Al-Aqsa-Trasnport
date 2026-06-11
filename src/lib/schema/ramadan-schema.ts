// ============================================================
// FILE: lib/schema/ramadan-schema.ts
// Al Aqsa Umrah Transport — Ramadan Transport Schema
// ============================================================

export const ramadanServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Ramadan Umrah Transport Services",
    "alternateName": "خدمات نقل المعتمرين في رمضان",
    "provider": {
        "@type": "Organization",
        "@id": "https://www.alaqsaumrahtransport.com/#organization",
        "name": "Al Aqsa Umrah Transport",
        "url": "https://www.alaqsaumrahtransport.com"
    },
    "serviceType": "Religious Tourism Transport",
    "areaServed": [
        { "@type": "City", "name": "Makkah" },
        { "@type": "City", "name": "Madinah" },
        { "@type": "City", "name": "Jeddah" }
    ],
    "description": "Specialized transport services for Ramadan 2026, ensuring timely arrival for prayers and Iftar.",
    "offers": {
        "@type": "Offer",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/services/ramadan-transport"
    }
};

export const ramadanFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Is transport available 24/7 during Ramadan?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we operate 24/7. However, during Maghrib and Isha/Tarawih times, traffic in Makkah is very heavy. We recommend booking at least 3 hours in advance."
            }
        },
        {
            "@type": "Question",
            "name": "Do you offer transport for Qiyam-ul-Layl?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. We provide dedicated late-night transfers for Qiyam-ul-Layl prayers to and from the Haram."
            }
        },
        {
            "@type": "Question",
            "name": "Are prices higher during Ramadan?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ramadan is a peak season, and while market rates generally rise, we strive to offer competitive, fixed rates when you book in advance. No last-minute surge pricing if booked ahead."
            }
        },
        {
            "@type": "Question",
            "name": "Can we stop for Iftar during the journey?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our drivers are happy to accommodate a brief stop for Iftar. We recommend planning your trip to arrive before Maghrib to avoid road closures near the Haram."
            }
        }
    ]
};
