export const pricingGuideServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Umrah Private Transport",
    "name": "Al Aqsa Umrah Transport Pricing",
    "description": "Typical price ranges for licensed Umrah taxi and private transport across Jeddah, Makkah, Madinah and Taif, by vehicle class and route.",
    "provider": {
        "@type": "Organization",
        "name": "Al Aqsa Umrah Transport",
        "url": "https://www.alaqsaumrahtransport.com"
    },
    "areaServed": [
        { "@type": "City", "name": "Jeddah" },
        { "@type": "City", "name": "Makkah" },
        { "@type": "City", "name": "Madinah" },
        { "@type": "City", "name": "Taif" }
    ],
    "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "120",
        "highPrice": "3500",
        "priceCurrency": "SAR",
        "offerCount": "10"
    }
};

export const pricingGuideFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How much does an Umrah taxi cost from Jeddah Airport to Makkah?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "A private taxi from Jeddah Airport to Makkah typically runs from SAR 250 for a Business Sedan up to SAR 900+ for a larger group vehicle, depending on the vehicle class and current demand. The exact fare for your date is confirmed on our booking page before you pay."
            }
        },
        {
            "@type": "Question",
            "name": "Do Umrah transport prices go up during Ramadan or Hajj?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Demand-driven pricing applies during Ramadan and Hajj, published in advance. Outside these peak periods, prices follow our standard published ranges."
            }
        },
        {
            "@type": "Question",
            "name": "Is the price I see always the final price?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The ranges on this page are typical fares, not final quotes. Your exact price — including your date, route, and vehicle choice — is calculated and confirmed on our booking page before any payment, with no hidden fees."
            }
        },
        {
            "@type": "Question",
            "name": "How do I know Al Aqsa is a licensed, legitimate operator?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "All Al Aqsa vehicles are registered under the Nusuk system and licensed by Saudi authorities. See our Safety & Verification page for how to check this yourself before booking."
            }
        }
    ]
};
