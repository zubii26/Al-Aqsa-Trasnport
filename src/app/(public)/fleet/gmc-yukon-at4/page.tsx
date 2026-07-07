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
import RelatedReading from '@/components/blog/RelatedReading';

const vehicleData = pricingData.vehicles.find(v => v.id === 'gmc');

const galleryImages = [
    { src: '/images/fleet/gmc-yukon/gmc-yukon-exterior-vip-umrah-taxi.webp', alt: 'GMC Yukon Full Exterior View' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-family-seating-makkah-madinah-taxi.webp', alt: 'Family Seating Interior' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-luxury-umrah-transport-cinematic.webp', alt: 'GMC Yukon Front Side View' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-front-headlight-umrah-cab.webp', alt: 'LED Headlights' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-highway-driving-makkah-madinah.webp', alt: 'Highway Driving Makkah to Madinah' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-luggage-capacity-jeddah-airport.webp', alt: 'Massive Luggage Capacity' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-luxury-umrah-transport-cinematic.webp', alt: 'Cinematic Luxury View' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-panoramic-sunroof-luxury.webp', alt: 'Panoramic Sunroof' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-premium-alloy-wheels-umrah-cab.webp', alt: 'Premium Alloy Wheels' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-premium-dashboard-interior.webp', alt: 'Premium Dashboard Interior' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-rear-view-family-umrah-cab.webp', alt: 'Rear View Design' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-rear-view-umrah-cab-saudi.webp', alt: 'Saudi Arabia Umrah Cab Rear' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-side-profile-vip-umrah-taxi.webp', alt: 'Side Profile VIP Taxi' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-umrah-taxi-tail-lights-makkah.webp', alt: 'Distinctive Tail Lights' },
    { src: '/images/fleet/gmc-yukon/gmc-yukon-vip-passenger-seats-umrah.webp', alt: 'VIP Passenger Seats' },
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "GMC Yukon XL 2025 Rental Makkah",
    "image": galleryImages.map(img => ({
        "@type": "ImageObject",
        "url": `https://www.alaqsaumrahtransport.com${img.src}`,
        "caption": img.alt
    })),
    "description": "Rent luxury GMC Yukon XL in Makkah & Madinah. Premium 7-Seater SUV for VIP Umrah transport, airport transfers, and intercity travel.",
    "brand": { "@type": "Brand", "name": "GMC" },
    "offers": { 
        "@type": "Offer", 
        "price": "600", 
        "priceCurrency": "SAR", 
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/fleet/gmc-yukon-at4"
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
    title: "GMC Yukon Rental Makkah | VIP Umrah Taxi",
    description: "Book a new GMC Yukon XL in Makkah. Luxury 7-seater SUV for Jeddah Airport pickup and Makkah to Madinah travel with VIP private chauffeur.",
    keywords: [
        "GMC Yukon Rental Makkah",
        "GMC Yukon XL Saudi Arabia",
        "VIP Umrah Taxi Makkah",
        "Luxury SUV Rental Jeddah",
        "GMC Yukon with Driver",
        "حجز جمس يوكن مكة",
        "ايجار سيارات فخمة جدة",
        "توصيل كبار الشخصيات"
    ],
    alternates: { canonical: 'https://www.alaqsaumrahtransport.com/fleet/gmc-yukon-at4' },
    openGraph: {
        title: "GMC Yukon Rental Makkah | VIP Umrah Taxi",
        description: "Book a new GMC Yukon XL in Makkah. Luxury 7-seater SUV for Jeddah Airport pickup and Makkah to Madinah travel.",
        images: [{ url: '/images/fleet/gmc-yukon/gmc-yukon-exterior-vip-umrah-taxi.webp', width: 1200, height: 630, alt: 'GMC Yukon XL VIP Transport' }]
    }
};


const specs = [
    { label: "Engine & Power", value: "5.3L V8 Ecotec3", subValue: "355 Horsepower" },
    { label: "Comfort Control", value: "Tri-Zone Climate", subValue: "Independent Rear AC" },
    { label: "Luggage Capacity", value: "41.5 Cubic Ft", subValue: "Behind 3rd Row" },
    { label: "Entertainment", value: "Bose Premium", subValue: "9-Speaker Sound System" },
    { label: "Seating Capacity", value: "7 Passengers", subValue: "Including Children" },
    { label: "Suspension", value: "Premium Air Ride", subValue: "Unmatched Smoothness" },
    { label: "Connectivity", value: "Free WiFi", subValue: "Multiple USB Ports" },
    { label: "Safety", value: "5-Star Safety", subValue: "Advanced Stability Control" },
];

const features = [
    "Tri-zone automatic climate control keeping all three rows perfectly cool.",
    "Premium leather seating with generous legroom for up to 7 passengers.",
    "Massive luggage capacity effortlessly accommodating 5+ large suitcases.",
    "Bose 9-Speaker premium sound system for a tranquil environment.",
    "Advanced Air Ride suspension ensuring a fatigue-free journey to Madinah.",
    "Panoramic sunroof providing excellent natural light and views.",
    "Acoustic laminated glass to block outside road and wind noise.",
    "Comprehensive safety suite including blind-spot monitoring and lane assist.",
    "Multiple USB charging points accessible from all three rows.",
    "Nusuk-approved VIP status for seamless entry into central hotel zones."
];

const useCases = [
    {
        title: "Jeddah Airport Pickups",
        description: "Experience a VIP meet and greet. Our driver will effortlessly fit all your luggage, ensuring a seamless and comfortable transition after a long flight.",
        icon: Map
    },
    {
        title: "Makkah to Madinah Transfers",
        description: "The 450km journey feels like a breeze in the quiet, air-conditioned cabin of the Yukon XL, thanks to its premium suspension and V8 power.",
        icon: Clock
    },
    {
        title: "Family Ziyarat Tours",
        description: "Visit historical sites in Makkah and Madinah with high elevation views, tinted privacy windows, and enough space for the entire family.",
        icon: Shield
    }
];

const gmcReviews = [
    {
        name: "Abdullah F.",
        rating: 5,
        text: "The GMC Yukon was incredibly spacious for our family of 6. The air-ride suspension made the trip from Makkah to Madinah incredibly smooth. Best Umrah transport experience we've had.",
        location: "United Kingdom"
    },
    {
        name: "Omar K.",
        rating: 5,
        text: "Booked for Jeddah Airport pickup. Our driver was waiting right at the exit. All 5 of our large suitcases fit perfectly without compromising our seating comfort. Very professional VIP service.",
        location: "UAE"
    },
    {
        name: "Zainab M.",
        rating: 5,
        text: "Felt very safe and respected. The vehicle was spotless, smelled fresh, and the driver knew all the Ziyarat locations perfectly. Highly recommend for families wanting luxury.",
        location: "USA"
    }
];

const gmcFAQs = [
    {
        question: "How many passengers can fit in the GMC Yukon?",
        answer: "The GMC Yukon XL comfortably seats up to 7 passengers (including children). However, for maximum comfort with luggage, we recommend it for 4-5 adults + 5 large suitcases."
    },
    {
        question: "Is the GMC Yukon suitable for Makkah to Madinah travel?",
        answer: "Absolutely. It is the most popular choice for the 4.5-hour journey between Holy Cities. With its premium suspension, leather seats, and dual AC, it ensures a fatigue-free journey for pilgrims."
    },
    {
        question: "What is the price for GMC Yukon from Jeddah Airport to Makkah?",
        answer: "Our rates are competitive for VIP service. Please use the booking grid to get an instant quote or contact us via WhatsApp for the best seasonal offers."
    },
    {
        question: "Does the GMC Yukon fit more luggage than standard SUVs?",
        answer: "Yes, we exclusively operate the 'XL' (extended length) models, providing 41.5 cubic feet of cargo space behind the third row—significantly more than standard SUVs."
    },
    {
        question: "Can we request a specific pickup time at Jeddah Airport?",
        answer: "Yes, we monitor your flight status in real-time. Your VIP chauffeur will be waiting for you regardless of early arrivals or delays."
    }
];

export default async function GmcYukonPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20GMC%20Yukon%20for%20Umrah`;
    
    const gmcId = '692db09834f15bc89b45a5f8';

    return (
        <main className="overflow-x-hidden bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <VehicleHero
                title="GMC Yukon 2025 | VIP Umrah Transport"
                subtitle="Travel in unmatched luxury between Jeddah, Makkah, and Madinah. The preferred 7-seater choice for families and VIP pilgrims."
                bgImage="/images/fleet/gmc-yukon/gmc-yukon-exterior-vip-umrah-taxi.webp"
                badge="VIP Choice"
                whatsappLink={whatsappLink}
                quickSpecs={["7 Passengers", "5+ Suitcases", "Tri-Zone AC", "Premium SUV"]}
                breadcrumbs={<Breadcrumbs hideJsonLd />}
            />

            <VehicleOverview
                title="Why Choose GMC Yukon for Umrah Travel?"
                description="The GMC Yukon XL defines luxury travel in Saudi Arabia. Perfect for Jeddah Airport pickups and comfortable journeys between Makkah and Madinah, this vehicle offers American luxury, massive space, and top-tier safety. With its premium air-ride suspension and sound-dampening acoustic glass, your family will experience true VIP comfort throughout the spiritual journey."
                modelYear="2025"
                passengers={7}
                luggage="5+ Large Suitcases"
                tech="Bose Audio & WiFi"
                fuel="5.3L V8 Ecotec3"
                bookLink={whatsappLink}
                mainImage="/images/fleet/gmc-yukon/gmc-yukon-premium-dashboard-interior.webp"
                fallbackImage="/images/fleet/gmc-yukon/gmc-yukon-exterior-vip-umrah-taxi.webp"
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
                    vehicleId={gmcId}
                    vehicleImage="/images/fleet/gmc-yukon/gmc-yukon-side-profile-vip-umrah-taxi.webp"
                    vehicleType="gmc"
                    title="VIP GMC Yukon Rates | Jeddah, Makkah & Madinah"
                    subtitle="The pinnacle of comfort for your spiritual journey. Transparent VIP pricing for all routes."
                />
            </div>

            <VehicleReviews reviews={gmcReviews} />

            <FAQSection items={gmcFAQs} title="GMC Yukon Rental - Frequently Asked Questions" />

            <VehicleCTA 
                whatsappLink={whatsappLink}
                phoneNumber={phoneNumber}
            />

            <RelatedReading title="Fleet & Transport Guides" category="Transport Service" />
        </main>
    );
}
