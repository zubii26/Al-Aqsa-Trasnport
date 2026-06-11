// ============================================================
// FILE: lib/schema/fleet-schema.ts
// Al Aqsa Umrah Transport — Fleet Page Schema
// ============================================================

export const fleetCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Umrah Taxi Fleet 2025",
  "description": "Explore our premium Umrah taxi fleet. Book a luxury GMC Yukon XL, family Hyundai Staria, or Toyota Hiace for your journey in Saudi Arabia.",
  "url": "https://www.alaqsaumrahtransport.com/fleet",
  "publisher": {
    "@type": "Organization",
    "@id": "https://www.alaqsaumrahtransport.com/#organization"
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "GMC Yukon XL / AT4",
          "description": "Luxury SUV for VIP families up to 7 passengers.",
          "image": {
            "@type": "ImageObject",
            "url": "https://www.alaqsaumrahtransport.com/images/fleet/gmc-yukon/gmc-yukon-exterior-vip-umrah-taxi.webp",
            "caption": "GMC Yukon XL / AT4 VIP Transport"
          },
          "url": "https://www.alaqsaumrahtransport.com/fleet/gmc-yukon-at4"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": "Hyundai Staria",
          "description": "Premium 7 to 9-seater minivan, perfect for medium groups.",
          "image": {
            "@type": "ImageObject",
            "url": "https://www.alaqsaumrahtransport.com/images/fleet/hyundai-staria/hyundai-staria-exterior-umrah-taxi.webp",
            "caption": "Hyundai Staria Premium Minivan"
          },
          "url": "https://www.alaqsaumrahtransport.com/fleet/hyundai-staria"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Product",
          "name": "Mercedes S-Class",
          "description": "The ultimate VIP sedan for executive Umrah travelers.",
          "image": {
            "@type": "ImageObject",
            "url": "https://www.alaqsaumrahtransport.com/images/fleet/mercedes-s-class/mercedes-s-class-luxury-front-view-makkah.webp",
            "caption": "Mercedes S-Class VIP Sedan"
          },
          "url": "https://www.alaqsaumrahtransport.com/fleet/mercedes-s-class"
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Product",
          "name": "Toyota Hiace",
          "description": "Spacious 10 to 14-seater van, ideal for large families.",
          "image": {
            "@type": "ImageObject",
            "url": "https://www.alaqsaumrahtransport.com/images/fleet/toyota-hiace/toyota-hiace-exterior-makkah.webp",
            "caption": "Toyota Hiace Family Van"
          },
          "url": "https://www.alaqsaumrahtransport.com/fleet/toyota-hiace"
        }
      }
    ]
  }
};

export const fleetBreadcrumbSchema = {
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
      "name": "Fleet",
      "item": "https://www.alaqsaumrahtransport.com/fleet"
    }
  ]
};
