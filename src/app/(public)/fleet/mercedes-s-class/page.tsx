import type { Metadata } from "next";
import { getSettings } from '@/lib/settings-storage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FAQSection from '@/components/services/FAQSection';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import { Star, Shield, Map, Clock, CheckCircle } from 'lucide-react';
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

const vehicleData = pricingData.vehicles.find(v => v.id === 'mercedes');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Mercedes-Benz S-Class VIP Rental Makkah",
    "image": "https://www.alaqsaumrahtransport.com/images/fleet/mercedes-s-class/mercedes-s-class-hero-main.jpeg",
    "description": "Rent luxury Mercedes S-Class in Makkah & Madinah. Ultimate executive transport for VIP pilgrims and airport transfers.",
    "brand": { "@type": "Brand", "name": "Mercedes-Benz" },
    "offers": { 
        "@type": "Offer", 
        "price": "1200", 
        "priceCurrency": "SAR", 
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/fleet/mercedes-s-class"
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
    title: vehicleData?.seo?.title || "Mercedes S-Class VIP Rental Makkah | Luxury Umrah",
    description: vehicleData?.seo?.description || "Book Mercedes-Benz S-Class for VIP Umrah. Ultimate luxury, silent cabin, executive transport from Jeddah Airport to Makkah/Madinah. Premium Umrah transport.",
    keywords: [
        "Mercedes S-Class Makkah",
        "VIP car rental Jeddah",
        "luxury Umrah transport",
        "Jeddah Airport VIP transfer",
        "Makkah to Madinah luxury taxi",
        "Umrah executive travel",
        "Premium Umrah transport service",
        "Mercedes Benz Umrah taxi",
        "Chauffeur service Makkah"
    ],
    alternates: { canonical: 'https://www.alaqsaumrahtransport.com/fleet/mercedes-s-class' },
    openGraph: {
        title: "Mercedes-Benz S-Class | Premium Umrah Transport Service",
        description: "Experience the ultimate VIP transport in Saudi Arabia with our Mercedes-Benz S-Class chauffeur service.",
        images: [{ url: '/images/fleet/mercedes-s-class/mercedes-s-class-hero-main.jpeg', width: 1200, height: 630, alt: 'Mercedes-Benz S-Class VIP Transport' }]
    }
};

const galleryImages = [
    // Top 8 - balanced mix explicitly featuring side and back/trunk images
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-side-door.jpeg', alt: 'Sleek Side Door Profile' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-side-profile-luxury.webp', alt: 'Elegant Side Profile' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-rear-hero-view.webp', alt: 'S-Class Rear Hero View' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-night-back.jpeg', alt: 'Elegant Night Rear View' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-dashboared.jpeg', alt: 'Luxurious VIP Dashboard' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-seats.jpeg', alt: 'Spacious Rear Passenger Seats' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-full-front.jpeg', alt: 'Commanding Full Front Stance' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-sun-roof.jpeg', alt: 'Panoramic Sun Roof View' },
    
    // Remaining newly uploaded images
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-side-door-interior.jpeg', alt: 'Refined Interior Door Panel' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-on-road.jpeg', alt: 'Cruising on the Open Road' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025--shot-Driver-seat-202605050328.jpeg', alt: 'Advanced Driver Cockpit' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-front-grill.jpeg', alt: 'Bold Front Grill Detail' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-front1.jpeg', alt: 'Striking Front View' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-night.jpeg', alt: 'S-Class at Night' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-seat1.jpeg', alt: 'Premium Executive Seat' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-seatt.jpeg', alt: 'Plush Leather Seating' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-sun-roof1.jpeg', alt: 'Sun Roof Interior' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-top-roof.jpeg', alt: 'Aerodynamic Top Roof' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-top.jpeg', alt: 'Aerial View' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025-wheel.jpeg', alt: 'Distinctive Alloy Wheel' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025--shot-Front-elevation-202605050246.jpeg', alt: 'Majestic Front Elevation' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025--shot-LED-taillight-202605050245.jpeg', alt: 'Signature LED Taillight' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-2025--shot-Rear-executive-seat-202605050328.jpeg', alt: 'Ultimate Rear Executive Seat' },
    
    // Remaining original images
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-luxury-front-view-makkah.webp', alt: 'Mercedes S-Class Front View' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-amg-wheels-umrah-taxi.webp', alt: '20-inch AMG Wheels' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-chrome-door-handle.webp', alt: 'Chrome Door Handle Details' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-front-grille-jeddah-airport.webp', alt: 'Iconic Front Grille' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-led-taillights.webp', alt: 'LED Taillights' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-panoramic-sunroof.webp', alt: 'Panoramic Sunroof' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-sunroof-interior-view.webp', alt: 'Sunroof Interior View' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-rear-elevation.webp', alt: 'S-Class Rear Elevation' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-vip-transport-makkah-madinah.webp', alt: 'VIP Transport on Highway' },
    { src: '/images/fleet/mercedes-s-class/mercedes-s-class-three-quarter-front.webp', alt: 'Three Quarter Front Angle' },
];

const specs = [
    { label: "Engine & Power", value: "3.0L V6 Turbocharged", subValue: "Or V8 Options" },
    { label: "Comfort Control", value: "Thermotronic", subValue: "4-Zone Climate" },
    { label: "Luggage Capacity", value: "500L Trunk", subValue: "2-3 Large Bags" },
    { label: "Entertainment", value: "Burmester® 3D", subValue: "Surround Sound" },
    { label: "Seating Capacity", value: "3 Passengers", subValue: "Executive Seating" },
    { label: "Suspension", value: "AIRMATIC Air", subValue: "Adaptive Damping" },
    { label: "Interior", value: "Exclusive Nappa", subValue: "Ambient Lighting" },
    { label: "Safety", value: "Pre-Safe® Tech", subValue: "9 Airbags" },
];

const features = [
    "Exclusive Nappa leather seating with optional massage functionality.",
    "Burmester® 3D Surround Sound system for unparalleled acoustic purity.",
    "Active Distance Assist and Pre-Safe® technology for maximum safety.",
    "Thermotronic 4-zone automatic climate control for personalized comfort.",
    "AIRMATIC air suspension absorbing road imperfections seamlessly.",
    "Legendary silent cabin designed to minimize all exterior noise.",
    "Rear executive seating configuration offering supreme legroom.",
    "MBUX tablet interface for complete passenger control.",
    "Panoramic sunroof illuminating the cabin naturally.",
    "Soft-close doors ensuring a serene entry and exit."
];

const useCases = [
    {
        title: "VIP Meet & Greet",
        description: "Arrive at Jeddah Airport and step directly into an oasis of tranquility. Perfect for executives, scholars, and VIP pilgrims requiring utmost privacy.",
        icon: Map
    },
    {
        title: "Makkah ↔ Madinah Travel",
        description: "The 4.5-hour highway drive transforms into a restorative retreat, allowing you to prepare spiritually for your arrival in the Holy Cities.",
        icon: Clock
    },
    {
        title: "Exclusive Ziyarat",
        description: "Visit historical Islamic sites across Makkah and Madinah with a professional, discreet chauffeur in the pinnacle of automotive luxury.",
        icon: Shield
    }
];

const mercedesReviews = [
    {
        name: "Dr. Khalid A.",
        rating: 5,
        text: "The S-Class was immaculate. The silence of the cabin during our trip from Jeddah to Makkah was exactly what we needed to focus on our prayers. Exceptional VIP service.",
        location: "UK"
    },
    {
        name: "Fatimah S.",
        rating: 5,
        text: "My husband and I booked this for our anniversary Umrah. The driver was highly professional, and the car's comfort is unmatched. True 5-star experience.",
        location: "UAE"
    },
    {
        name: "Ahmed R.",
        rating: 5,
        text: "I travel frequently for business, but the level of service provided here was outstanding. The ride to Madinah felt completely effortless.",
        location: "USA"
    }
];

const mercedesFAQs = [
    {
        question: "How many passengers can fit in the Mercedes-Benz S-Class?",
        answer: "The Mercedes-Benz S-Class comfortably seats 3 adult passengers. It is ideal for VIP pilgrims, couples, scholars, and executives seeking the highest level of executive comfort."
    },
    {
        question: "Is the Mercedes S-Class suitable for Makkah to Madinah travel?",
        answer: "Absolutely. With its ultra-luxury interior, AIRMATIC air suspension, and silent cabin, the S-Class ensures an incredibly relaxing, fatigue-free 4.5-hour spiritual journey between the Holy Cities."
    },
    {
        question: "Does the S-Class have enough luggage space?",
        answer: "The trunk can accommodate 2 to 3 large bags. For VIP pilgrims traveling with extensive luggage, we can arrange a supplementary luggage vehicle."
    },
];

export default async function MercedesSClassPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Mercedes%20S-Class%20for%20VIP%20Umrah`;
    
    const mercedesId = 'mercedes';

    return (
        <main className="overflow-x-hidden bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <VehicleHero
                title="Mercedes-Benz S-Class | VIP Umrah Transport"
                subtitle="Step into unparalleled serenity and executive comfort. Experience a spiritual journey defined by safety, reliability, and ultra-luxury."
                bgImage="/images/fleet/mercedes-s-class/mercedes-s-class-2025-on-road.jpeg"
                badge="VIP Luxury Choice"
                whatsappLink={whatsappLink}
                quickSpecs={["3 Passengers", "2-3 Suitcases", "Thermotronic AC", "Executive Luxury"]}
                breadcrumbs={<Breadcrumbs />}
            />

            <VehicleOverview
                title="Uncompromising Luxury & Technology"
                description="The Mercedes-Benz S-Class sets the global standard for VIP transport, ensuring that your Umrah pilgrimage is physically effortless and spiritually focused. The physical demands of Umrah require periods of profound rest, and the S-Class provides an unmatched sanctuary of peace with its legendary silent cabin and AIRMATIC suspension."
                modelYear="Latest"
                passengers={3}
                luggage="3 Large Bags"
                tech="Burmester® 3D Sound"
                fuel="3.0L V6 / V8"
                bookLink={whatsappLink}
                mainImage="/images/fleet/mercedes-s-class/mercedes-s-class-2025-dashboared.jpeg"
                fallbackImage="/images/fleet/mercedes-s-class/mercedes-s-class-2025-full-front.jpeg"
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
                    vehicleId={mercedesId}
                    vehicleImage="/images/fleet/mercedes-s-class/mercedes-s-class-2025-side-door.jpeg"
                    vehicleType="mercedes"
                    title="Mercedes S-Class Rates | Jeddah, Makkah & Madinah"
                    subtitle="Exclusive VIP pricing for the ultimate journey. Unmatched luxury and privacy."
                />
            </div>

            <VehicleReviews reviews={mercedesReviews} />

            <FAQSection items={mercedesFAQs} title="Mercedes S-Class VIP Rental - Frequently Asked Questions" />

            <VehicleCTA 
                whatsappLink={whatsappLink}
                phoneNumber={phoneNumber}
            />
        </main>
    );
}

