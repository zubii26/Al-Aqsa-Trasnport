export const makkahTaifServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Taxi Service",
    "name": "Makkah to Taif Private Taxi & VIP Transfer",
    "description": "Premium private taxi from Makkah to Taif. Professional chauffeurs, air-conditioned luxury vehicles, and 24/7 door-to-door service.",
    "provider": {
        "@type": "Organization",
        "name": "Al Aqsa Umrah Transport",
        "url": "https://www.alaqsaumrahtransport.com"
    },
    "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": 21.2854,
            "longitude": 40.4271
        },
        "geoRadius": "100000"
    },
    "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "250",
        "priceCurrency": "SAR",
        "offerCount": "5"
    }
};

export const makkahTaifFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How far is Taif from Makkah?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Taif is approximately 85 to 100 kilometers from Makkah, depending on the route taken (Al Hada or Al Sail). The journey offers beautiful scenic mountain views."
            }
        },
        {
            "@type": "Question",
            "name": "How long does the journey take?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The private taxi journey typically takes between 1 hour 15 minutes to 1 hour 45 minutes, depending on traffic and the chosen route."
            }
        },
        {
            "@type": "Question",
            "name": "Can I stop during the trip?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our private taxi service offers complete flexibility. You can stop for photos, refreshments, or prayers at designated rest stops along the way."
            }
        },
        {
            "@type": "Question",
            "name": "Can I book a return journey?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. You can book a one-way trip or a round trip. We can wait for you in Taif while you complete your Ziyarat or tour and bring you back to Makkah."
            }
        }
    ]
};

export const makkahTaifBreadcrumbSchema = {
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
            "name": "Routes",
            "item": "https://www.alaqsaumrahtransport.com/routes"
        },
        {
            "@type": "ListItem",
            "position": 3,
            "name": "Makkah to Taif Taxi",
            "item": "https://www.alaqsaumrahtransport.com/routes/makkah-to-taif-taxi"
        }
    ]
};
