import type { Metadata } from "next";
import { getSettings } from '@/lib/settings-storage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FAQSection from '@/components/services/FAQSection';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import { Users, Briefcase, Star, MapPin, CheckCircle, Zap } from 'lucide-react';
import pricingData from '@/data/pricing.json';

// Master Components
import VehicleHero from '@/components/fleet/vehicle/VehicleHero';
import VehicleOverview from '@/components/fleet/vehicle/VehicleOverview';
import VehicleGallery from '@/components/fleet/vehicle/VehicleGallery';
import VehicleSpecs from '@/components/fleet/vehicle/VehicleSpecs';
import VehicleFeatures from '@/components/fleet/vehicle/VehicleFeatures';
import VehicleUseCases from '@/components/fleet/vehicle/VehicleUseCases';
import VehicleReviews from '@/components/fleet/vehicle/VehicleReviews';
import VehicleCTA from '@/components/fleet/vehicle/VehicleCTA';

const vehicleData = pricingData.vehicles.find(v => v.id === 'kia');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Kia K5 Modern Sedan Rental",
    "image": "https://www.alaqsaumrahtransport.com/images/fleet/kia-k5-hero.webp",
    "description": "Rent a modern Kia K5 in Makkah & Madinah for comfortable and efficient Umrah transport.",
    "brand": { "@type": "Brand", "name": "Kia" },
    "offers": { 
        "@type": "Offer", 
        "price": "300", 
        "priceCurrency": "SAR", 
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/fleet/kia-k5"
    ,
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "SA",
            "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
            "description": "Due to the nature of pre-booked private transport services, returns or refunds are not permitted once the service has commenced or been completed. Please refer to our cancellation policy for pre-service modifications."
        },
        "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
                "@type": "MonetaryAmount",
                "value": 0,
                "currency": "SAR"
            },
            "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 0,
                    "maxValue": 0,
                    "unitCode": "DAY"
                },
                "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 0,
                    "maxValue": 0,
                    "unitCode": "DAY"
                }
            },
            "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "SA"
            }
        }},
    "award": "Nusuk Registered Vehicle",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "152"
    },
    "review": {
        "@type": "Review",
        "author": {
            "@type": "Person",
            "name": "Verified Customer"
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
        },
        "datePublished": "2024-01-01",
        "reviewBody": "Excellent service, clean vehicles, and professional drivers."
    }
};

export const metadata: Metadata = {
    title: vehicleData?.seo?.title || "Kia K5 Sedan Rental Makkah | Modern Transport",
    description: vehicleData?.seo?.description || "Rent Kia K5 sedan for comfortable, efficient Umrah travel. Ideal for small families and couples. Clean, modern design.",
    keywords: [
        "Kia K5 Makkah",
        "modern sedan Jeddah",
        "comfortable umrah taxi",
        "Jeddah Airport transfer",
        "Makkah hotels taxi",
        "Madinah hotels taxi",
        "fuel efficient Umrah transport",
        "small family Umrah travel",
        "couples Umrah transport",
        "كيا K5 توصيل",
        "توصيل فنادق مكة",
        "توصيل مطار جدة كيا",
        "Kia sedan rental Makkah",
        "affordable Umrah taxi",
        "modern Umrah transport"
    ],
    alternates: { canonical: 'https://www.alaqsaumrahtransport.com/fleet/kia-k5' },
    openGraph: {
        title: "Kia K5 Sedan | Comfortable Umrah Transport",
        description: "Experience modern, smooth, and fuel-efficient travel across Saudi Arabia with our Kia K5 fleet, ideal for small families and couples.",
        images: [{ url: '/images/fleet/kia-k5-hero.webp', width: 1200, height: 630, alt: 'Kia K5 Modern Sedan' }]
    }
};

const galleryImages = [
    { src: '/images/fleet/kia-k5-hero.webp', alt: 'Kia K5 Exterior' },
    // If more Kia K5 images are obtained, they can be added here. Currently relying on the main asset.
];

const specs = [
    { label: "Engine & Power", value: "2.5L 4-Cyl", subValue: "Highly Efficient" },
    { label: "Seating Capacity", value: "3-4 Seats", subValue: "Comfortable Sedan" },
    { label: "Luggage Capacity", value: "Generous Trunk", subValue: "2-3 Large Bags" },
    { label: "Comfort Control", value: "Dual-Zone AC", subValue: "Automatic Climate" },
    { label: "Suspension", value: "Multi-link Rear", subValue: "MacPherson Strut" },
    { label: "Safety", value: "Advanced Assist", subValue: "Forward Collision-Avoidance" },
    { label: "Entertainment", value: "Touchscreen", subValue: "Bluetooth & USB" },
    { label: "Interior", value: "Premium Cloth", subValue: "Ergonomic Seats" },
];

const features = [
    "Modern, sleek sedan design that stands out while providing reliable transport.",
    "Dual-Zone Automatic Climate Control to keep the cabin perfectly cooled.",
    "Spacious rear seating ensuring comfort for couples and small families.",
    "Advanced driver assistance systems including lane keeping and collision avoidance.",
    "Highly efficient 2.5L engine perfect for long-distance Saudi highway routes.",
    "Large trunk easily accommodating 2-3 full-sized suitcases.",
    "Smooth and stable suspension making the Makkah to Madinah journey relaxing.",
    "Modern infotainment system with USB ports to keep your devices charged."
];

const useCases = [
    {
        title: "Couples & Individuals",
        description: "A sleek, modern, and private ride for two, offering the perfect blend of comfort and cost-effectiveness.",
        icon: Users
    },
    {
        title: "Jeddah Airport Pickup",
        description: "Efficient and prompt transfers from the terminal directly to your Makkah or Madinah hotel.",
        icon: MapPin
    },
    {
        title: "City Hotel Transfers",
        description: "Navigate Makkah and Madinah city traffic with ease, style, and complete privacy.",
        icon: Zap
    }
];

const kiaReviews = [
    {
        name: "Yousef A.",
        rating: 5,
        text: "My wife and I booked the Kia K5 from Jeddah to our hotel in Makkah. Very clean, quiet ride, and the driver was extremely polite.",
        location: "UAE"
    },
    {
        name: "Fatima R.",
        rating: 5,
        text: "Perfect size for three of us. The AC was strong, the seats were comfortable, and it felt very safe on the highway to Madinah.",
        location: "Oman"
    },
    {
        name: "Ibrahim S.",
        rating: 4,
        text: "A very smooth ride. The trunk easily held our two large suitcases and a couple of carry-on bags. Excellent value for money.",
        location: "Turkey"
    }
];

const kiaFAQs = [
    {
        question: "How many passengers can fit in the Kia K5?",
        answer: "The Kia K5 comfortably seats 3 to 4 passengers, making it an excellent choice for couples or small families traveling for Umrah."
    },
    {
        question: "Is the Kia K5 comfortable for the Makkah to Madinah trip?",
        answer: "Yes, the K5 offers a modern suspension system, comfortable seating, and excellent climate control, ensuring the 4.5-hour intercity journey is smooth and pleasant."
    },
    {
        question: "How much luggage can the Kia K5 hold?",
        answer: "The trunk can easily accommodate 2 to 3 large suitcases along with some smaller carry-on bags."
    },
];

export default async function KiaK5Page() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Kia%20K5%20for%20Umrah`;
    
    const kiaId = 'kia';

    return (
        <main className="overflow-x-hidden bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <VehicleHero
                title="Kia K5 Sedan | Comfortable Umrah Transport"
                subtitle="A perfect blend of modern design, smooth ride quality, and excellent fuel efficiency. Ensuring a reliable and peaceful journey for you and your family."
                bgImage="/images/fleet/kia-k5-hero.webp"
                badge="Modern & Efficient"
                whatsappLink={whatsappLink}
                quickSpecs={["3-4 Passengers", "2-3 Suitcases", "Dual-Zone AC", "Smooth Ride"]}
                breadcrumbs={<Breadcrumbs />}
            />

            <VehicleOverview
                title="Engineered for Comfort & Efficiency"
                description="The Kia K5 redefines the modern sedan experience, offering advanced technology and a spacious interior that makes every spiritual journey across Saudi Arabia completely stress-free. It strikes the perfect balance between affordability and reliability."
                modelYear="Latest"
                passengers={4}
                luggage="2-3 Large Bags"
                tech="Touchscreen & USB"
                fuel="2.5L Efficient"
                bookLink={whatsappLink}
                mainImage="/images/fleet/kia-k5-hero.webp"
                fallbackImage="/images/fleet/kia-k5-hero.webp"
            />

            <VehicleGallery 
                title="Explore the Vehicle"
                images={galleryImages} 
            />

            <VehicleSpecs specs={specs} />

            <VehicleFeatures features={features} />

            <VehicleUseCases cases={useCases} />

            <div className="py-16 bg-white dark:bg-slate-900">
                <FleetPricingGrid
                    vehicleId={kiaId}
                    vehicleImage="/images/fleet/kia.webp"
                    vehicleType="kia"
                    title="Transparent Kia K5 Pricing"
                    subtitle="Affordable, modern transportation with fixed rates for per trip and per route transfers."
                />
            </div>

            <VehicleReviews reviews={kiaReviews} />

            <FAQSection items={kiaFAQs} title="Kia K5 Sedan Rental - Frequently Asked Questions" />

            <VehicleCTA 
                whatsappLink={whatsappLink}
                phoneNumber={phoneNumber}
            />
        </main>
    );
}
