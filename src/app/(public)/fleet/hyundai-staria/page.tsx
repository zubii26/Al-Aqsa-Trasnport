import type { Metadata } from "next";
import { getSettings } from '@/lib/settings-storage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FAQSection from '@/components/services/FAQSection';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import { Star, Shield, Map, Clock, Users, UserCheck } from 'lucide-react';
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

const vehicleData = pricingData.vehicles.find(v => v.id === 'staria');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Hyundai Staria 2024 Luxury Van Makkah",
    "image": "https://www.alaqsaumrahtransport.com/images/fleet/hyundai-staria/hyundai-staria-front-view.webp",
    "description": "Premium Hyundai Staria VIP 7-Seater Van for Umrah. Reliable, comfortable luxury transport for families from Jeddah Airport to Makkah and Madinah.",
    "brand": { "@type": "Brand", "name": "Hyundai" },
    "offers": { 
        "@type": "Offer", 
        "price": "450", 
        "priceCurrency": "SAR", 
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/fleet/hyundai-staria"
    ,
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
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
    "hasCertification": "Nusuk Registered Vehicle",
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
    title: "Hyundai Staria Rental Saudi Arabia | Family Umrah Taxi",
    description: "Rent Hyundai Staria 2024 in Makkah. Spacious 7-passenger luxury van for Umrah families. Modern comfort for Jeddah to Madinah trips.",
    keywords: ["Hyundai Staria Rental Makkah", "Family Van for Umrah", "Hyundai Staria Jeddah Airport", "7 Seater Taxi Makkah", "Luxury Van Rental Saudi Arabia"],
    alternates: { canonical: 'https://www.alaqsaumrahtransport.com/fleet/hyundai-staria' },
    openGraph: {
        title: "Hyundai Staria Rental Saudi Arabia | Family Umrah Taxi",
        description: "Rent Hyundai Staria 2024 in Makkah. Spacious 7-passenger luxury van for Umrah families.",
        images: [{ url: '/images/fleet/hyundai-staria/hyundai-staria-front-view.webp', width: 1200, height: 630, alt: 'Hyundai Staria Umrah Taxi' }]
    }
};

const galleryImages = [
    { src: '/images/fleet/hyundai-staria/hyundai-staria-front-view.webp', alt: 'Hyundai Staria Front View' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-dashboard-interior-view.webp', alt: 'Premium Interior Dashboard' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-side-profile.webp', alt: 'Staria Exterior Profile' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-rear-trunk-space.webp', alt: 'Spacious Luggage Capacity' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-vip-leather-seat.webp', alt: 'Passenger VIP Seats' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-led-headlight.webp', alt: 'LED Headlight Design' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-spacious-passenger-seating.webp', alt: 'Comfortable Passenger Seats' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-full-rear-view-taxi.webp', alt: 'Rear Design' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-back-door-umrah-taxi.webp', alt: 'Back Door Access' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-taillight-detail.webp', alt: 'Taillight Detail' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-alloy-wheel-design.webp', alt: 'Alloy Wheels' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-open-door-interior-access.webp', alt: 'Wide Door Access' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-highway-drive-makkah-madinah.webp', alt: 'Staria on the Highway' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-side-exterior-view.webp', alt: 'Wide Side Exterior' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-dashboard-angle.webp', alt: 'Dashboard Angle Detail' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-desert-road-trip.webp', alt: 'Desert Road Journey' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-cinematic-night-view.webp', alt: 'Cinematic Night View' },
    { src: '/images/fleet/hyundai-staria/hyundai-staria-roof-view.webp', alt: 'Roof View' },
];

const specs = [
    { label: "Engine & Power", value: "3.5L V6 MPi", subValue: "272 Horsepower" },
    { label: "Transmission", value: "8-Speed Automatic", subValue: "Smooth Transitions" },
    { label: "Seating Capacity", value: "7 Passengers", subValue: "Including Driver" },
    { label: "Luggage Capacity", value: "6 Large Bags", subValue: "Flexible Space" },
    { label: "Fuel Efficiency", value: "High Economy", subValue: "Smart Dynamics" },
    { label: "Air Conditioning", value: "Diffused Air Vents", subValue: "Roof-mounted AC" },
    { label: "Entertainment", value: "Premium Display", subValue: "Bluetooth Audio" },
    { label: "Safety Rating", value: "Smart Sense", subValue: "ADAS Suite Included" },
];

const features = [
    "Expansive panoramic windows for spectacular views.",
    "Lounge-style VIP seating with generous legroom.",
    "Diffused rear air conditioning ensuring comfort for all passengers.",
    "Smart safety system including advanced collision detection.",
    "Dual electronic sliding doors for effortless entry and exit.",
    "Ultra-low floor design, perfect for elderly pilgrims.",
    "Extensive vertical cargo space fitting multiple large suitcases.",
    "USB charging ports available at every seat row.",
    "Futuristic, aerodynamic profile offering a quiet ride.",
    "Nusuk-approved and licensed for all Umrah and Ziyarat routes."
];

const useCases = [
    {
        title: "Family Jeddah Airport Pickups",
        description: "A seamless transition from the airport for families or groups. Ample space for 7 passengers and heavy luggage without feeling cramped.",
        icon: Map
    },
    {
        title: "Comfortable Intercity Travel",
        description: "The 4-5 hour journey between Makkah and Madinah feels like a breeze in this lounge-like environment with panoramic views.",
        icon: Clock
    },
    {
        title: "VIP Ziyarat Tours",
        description: "Experience the historical sites with unmatched visibility through the expansive windows, while enjoying supreme air-conditioned comfort.",
        icon: Shield
    }
];

const stariaReviews = [
    {
        name: "Usman A.",
        rating: 5,
        text: "The Staria looks like a spaceship and rides incredibly smoothly. Our family of 6 had so much room, and the driver was exceptional during our Makkah-Madinah trip.",
        location: "UK"
    },
    {
        name: "Hassan T.",
        rating: 5,
        text: "Perfect for our group! We had a lot of luggage arriving at Jeddah airport, and the Staria fit everything effortlessly. The seats are very comfortable.",
        location: "Egypt"
    },
    {
        name: "Aisha M.",
        rating: 5,
        text: "My elderly parents found it very easy to get in and out because of the sliding doors and low floor. Highly recommend for families traveling with seniors.",
        location: "South Africa"
    }
];

const stariaFAQs = [
    {
        question: "Is the Hyundai Staria comfortable for long distances?",
        answer: "Yes, the Staria is designed as a 'Spaceship' for the road. It offers expansive windows, ample legroom, and modern suspension, making the 4-5 hour Makkah-Madinah journey very pleasant."
    },
    {
        question: "How much luggage fits in the Staria?",
        answer: "The Staria excels in cargo space. It can easily accommodate 6-7 large suitcases along with 6-7 passengers, making it superior to standard sedans."
    },
    {
        question: "What is the difference between Staria and H1?",
        answer: "The Staria is the modern successor to the H1. It features better safety tech, more comfortable seating, and a more spacious futuristic interior."
    },
    {
        question: "Does the vehicle have air conditioning for the back rows?",
        answer: "Yes, the Hyundai Staria features diffused roof-mounted air conditioning vents that ensure cool, comfortable air reaches every row of passengers."
    },
    {
        question: "Can it accommodate a wheelchair?",
        answer: "Yes, the Staria's low floor height and wide sliding doors make it relatively easy to store a folded wheelchair in the luggage area."
    }
];

export default async function HyundaiStariaPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Hyundai%20Staria%20for%20Umrah`;
    
    const stariaId = '692db09834f15bc89b45a5f9';

    return (
        <main className="overflow-x-hidden bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <VehicleHero
                title="Hyundai Staria VIP Transport"
                subtitle="The future of travel in Saudi Arabia. Spacious and luxurious 7-seater van for families visiting Makkah and Madinah."
                bgImage="/images/fleet/hyundai-staria/hyundai-staria-highway-drive-makkah-madinah.webp"
                badge="Futuristic Choice"
                whatsappLink={whatsappLink}
                quickSpecs={["7 Passengers", "6-7 Bags", "Panoramic Views", "Smart Safety"]}
                breadcrumbs={<Breadcrumbs />}
            />

            <VehicleOverview
                title="Next-Generation Comfort for Umrah Families"
                description="Enjoy panoramic views of the Holy Lands with the Hyundai Staria. Its lounge-style seating and cutting-edge safety features make the journey between Jeddah, Makkah, and Madinah incredibly relaxing for pilgrims seeking a premium group travel experience. It combines exceptional cargo space with unparalleled aesthetic appeal."
                modelYear="2024"
                passengers={7}
                luggage="6-7 Bags"
                tech="Premium Display"
                fuel="High Economy"
                bookLink={whatsappLink}
                mainImage="/images/fleet/hyundai-staria/hyundai-staria-dashboard-interior-view.webp"
                fallbackImage="/images/fleet/staria.webp"
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
                    vehicleId={stariaId}
                    vehicleImage="/images/fleet/hyundai-staria/hyundai-staria-front-view.webp"
                    vehicleType="staria"
                    title="Hyundai Staria Rates | Jeddah, Makkah, Madinah"
                    subtitle="The perfect balance of modern luxury and group capacity. Ideal for families and small groups."
                />
            </div>

            <VehicleReviews reviews={stariaReviews} />

            <FAQSection items={stariaFAQs} title="Hyundai Staria - Frequently Asked Questions" />

            <VehicleCTA 
                whatsappLink={whatsappLink}
                phoneNumber={phoneNumber}
            />
        </main>
    );
}


