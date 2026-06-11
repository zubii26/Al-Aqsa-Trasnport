// ============================================================
// FILE: lib/schema/hajj-schema.ts
// Al Aqsa Umrah Transport — Hajj Transport Schema
// ============================================================

export const hajjServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Hajj Transport Services 2026",
    "alternateName": "خدمات نقل الحجاج",
    "provider": {
        "@type": "Organization",
        "@id": "https://www.alaqsaumrahtransport.com/#organization",
        "name": "Al Aqsa Umrah Transport",
        "url": "https://www.alaqsaumrahtransport.com"
    },
    "serviceType": "Religious Tourism Transport",
    "areaServed": [
        { "@type": "City", "name": "Makkah" },
        { "@type": "City", "name": "Mina" },
        { "@type": "City", "name": "Arafat" },
        { "@type": "City", "name": "Muzdalifah" },
        { "@type": "City", "name": "Jeddah" }
    ],
    "description": "Comprehensive Hajj transport services including airport transfers, Mashaer movements (Mina, Arafat, Muzdalifah), and intercity travel.",
    "offers": {
        "@type": "Offer",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/services/hajj-transport" // URL prepared for future page
    }
};

export const hajjFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Do you provide transport within the Mashaer (Mina, Arafat, Muzdalifah)?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we offer specialized vehicle permits and experienced drivers to navigate the Mashaer during the core days of Hajj."
            }
        },
        {
            "@type": "Question",
            "name": "When should we book our Hajj transport?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "We strongly recommend booking at least 1-2 months in advance, as vehicles with Hajj permits are strictly limited."
            }
        },
        {
            "@type": "Question",
            "name": "Can you handle group transportation for Hajj?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we provide large 50-seater buses, Toyota Coasters, and Hiace vans equipped to handle families and large pilgrim groups."
            }
        }
    ]
};
