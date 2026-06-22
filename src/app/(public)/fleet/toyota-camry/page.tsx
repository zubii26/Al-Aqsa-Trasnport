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

const vehicleData = pricingData.vehicles.find(v => v.id === 'camry');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Toyota Camry 2024 Taxi Makkah",
    "image": "https://www.alaqsaumrahtransport.com/images/fleet/camry/toyota-camry-jeddah-to-makkah-taxi-front.webp",
    "description": "Premium Toyota Camry taxi for Umrah. Reliable, comfortable 4-seater sedan for Jeddah Airport to Makkah and Madinah transfers.",
    "brand": { "@type": "Brand", "name": "Toyota" },
    "offers": { 
        "@type": "Offer", 
        "price": "200", 
        "priceCurrency": "SAR", 
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/fleet/toyota-camry"
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
    title: "Toyota Camry Umrah Taxi | Jeddah to Makkah Transfers",
    description: "Book a Toyota Camry for your Umrah journey. Premium 4-seater sedan offering reliable and comfortable transfers between Jeddah Airport, Makkah, and Madinah.",
    keywords: ["Toyota Camry Umrah Taxi", "Jeddah Airport Taxi", "Makkah to Madinah Taxi", "Family Umrah Car", "Private Umrah Transport Saudi Arabia"],
    alternates: { canonical: 'https://www.alaqsaumrahtransport.com/fleet/toyota-camry' },
    openGraph: {
        title: "Toyota Camry Umrah Taxi | Premium Transfers",
        description: "Premium Toyota Camry for your Umrah journey. Comfortable transfers between Jeddah, Makkah, and Madinah.",
        images: [{ url: '/images/fleet/camry/toyota-camry-jeddah-to-makkah-taxi-front.webp', width: 1200, height: 630, alt: 'Toyota Camry Umrah Taxi' }]
    }
};

const galleryImages = [
    { src: '/images/fleet/camry/toyota-camry-jeddah-to-makkah-taxi-front.webp', alt: 'Toyota Camry Front View' },
    { src: '/images/fleet/camry/toyota-camry-makkah-madinah-taxi-premium-interior.webp', alt: 'Premium Interior View' },
    { src: '/images/fleet/camry/toyota-camry-umrah-car-exterior-profile.webp', alt: 'Camry Exterior Profile' },
    { src: '/images/fleet/camry/toyota-camry-umrah-taxi-trunk-luggage-space.webp', alt: 'Spacious Luggage Capacity' },
    { src: '/images/fleet/camry/toyota-camry-jeddah-airport-taxi-legroom.webp', alt: 'Passenger Legroom' },
    { src: '/images/fleet/camry/toyota-camry-private-taxi-dashboard-interior.webp', alt: 'Modern Dashboard' },
    { src: '/images/fleet/camry/toyota-camry-umrah-taxi-passenger-seats.webp', alt: 'Comfortable Passenger Seats' },
    { src: '/images/fleet/camry/toyota-camry-makkah-taxi-rear-design.webp', alt: 'Rear Design' },
    { src: '/images/fleet/camry/toyota-camry-umrah-transport-rear-view.webp', alt: 'Full Rear View' },
    { src: '/images/fleet/camry/toyota-camry-vip-umrah-taxi-front-hood.webp', alt: 'Front Hood Detail' },
    { src: '/images/fleet/camry/toyota-camry-umrah-cab-alloys.webp', alt: 'Alloy Wheels' },
    { src: '/images/fleet/camry/toyota-camry-umrah-transport-side-door.webp', alt: 'Side Door Aesthetics' },
    { src: '/images/fleet/camry/toyota-camry-umrah-taxi-on-road-makkah.webp', alt: 'Camry on the Road' },
    { src: '/images/fleet/camry/toyota-camry-umrah-taxi-side-profile.webp', alt: 'Wide Side Profile' },
    { src: '/images/fleet/camry/toyota-camry-makkah-taxi-steering-wheel.webp', alt: 'Steering Wheel Detail' },
    { src: '/images/fleet/camry/toyota-camry-umrah-taxi-taif-route.webp', alt: 'Taif Route Journey' },
    { src: '/images/fleet/camry/toyota-camry-umrah-transport-top-angle.webp', alt: 'Top Angle View' },
    { src: '/images/fleet/camry/toyota-camry-umrah-taxi-roof-view.webp', alt: 'Roof View' },
];

const specs = [
    { label: "Engine Type", value: "2.5L 4-Cylinder", subValue: "204 Horsepower" },
    { label: "Transmission", value: "8-Speed Automatic", subValue: "Smooth Shifting" },
    { label: "Seating Capacity", value: "4 Passengers", subValue: "Including Driver" },
    { label: "Luggage Capacity", value: "3-4 Bags", subValue: "Spacious Trunk" },
    { label: "Fuel Efficiency", value: "Eco-Friendly", subValue: "Excellent MPG" },
    { label: "Air Conditioning", value: "Dual-Zone Climate", subValue: "Rear A/C Vents" },
    { label: "Entertainment", value: "Apple CarPlay", subValue: "Android Auto & Bluetooth" },
    { label: "Safety Rating", value: "5-Star Standard", subValue: "Advanced Airbags" },
];

const features = [
    "Dual-zone automatic climate control for tailored comfort.",
    "Premium quality seating with excellent lumbar support for long trips.",
    "Multiple USB charging ports for passenger devices.",
    "Advanced Anti-lock Braking System (ABS) and Electronic Brakeforce Distribution (EBD).",
    "Child-safe rear door locks for family travel security.",
    "Refined suspension system ensuring a smooth Makkah to Madinah ride.",
    "Exceptionally quiet cabin with sound-dampening acoustic glass.",
    "High-visibility LED headlights for safe night travel.",
    "Spacious rear legroom suitable for tall passengers.",
    "Nusuk-approved and licensed for all Umrah and Ziyarat routes."
];

const useCases = [
    {
        title: "Jeddah Airport Pickups",
        description: "Experience a seamless transition from the airport to your hotel in Makkah. The Camry offers the perfect quiet environment to begin your spiritual journey after a long flight.",
        icon: Map
    },
    {
        title: "Makkah to Madinah Transfers",
        description: "A highly reliable and fuel-efficient choice for the 4-hour highway journey between the Holy Cities. Enjoy the smooth suspension and powerful AC.",
        icon: Clock
    },
    {
        title: "Family Umrah Trips",
        description: "Ideal for small families of up to 4 people. With advanced safety features and child-lock capabilities, you can travel with complete peace of mind.",
        icon: Shield
    }
];

const camryReviews = [
    {
        name: "Syed H.",
        rating: 5,
        text: "Booked the Camry for our transfer from Jeddah to Makkah. It was spotless, the AC was ice cold, and the driver was extremely polite. Highly recommended for couples.",
        location: "Pakistan"
    },
    {
        name: "Ali R.",
        rating: 5,
        text: "Very comfortable ride. We used it for our daily Ziyarat tours in Madinah. The car is quiet, smooth, and perfect for getting around the city efficiently.",
        location: "Qatar"
    },
    {
        name: "Fatima A.",
        rating: 4,
        text: "Excellent service. The trunk space was just enough for our 2 large bags. The driver helped us with our luggage and provided water for the journey.",
        location: "Malaysia"
    }
];

const camryFAQs = [
    {
        question: "Is the Toyota Camry allowed inside Makkah central areas?",
        answer: "Yes, our Toyota Camry taxis are fully licensed and Nusuk-registered, allowing them access to Makkah's central hotel zones, subject to seasonal traffic regulations."
    },
    {
        question: "How many passengers and bags can travel comfortably?",
        answer: "The Camry comfortably seats 4 passengers. The trunk is spacious enough for 2 large suitcases or 3-4 medium bags. For larger families, we recommend our GMC Yukon or Hyundai Staria."
    },
    {
        question: "Is luggage included in the listed price?",
        answer: "Yes, standard luggage that fits in the vehicle's trunk is included in your booking price. There are no hidden fees for luggage."
    },
    {
        question: "Do you provide child seats?",
        answer: "Yes, we prioritize safety. Child seats can be provided upon request. Please mention this requirement when you contact us on WhatsApp so we can prepare it in advance."
    },
    {
        question: "Are your drivers experienced with Umrah routes?",
        answer: "Absolutely. Our drivers are highly experienced professionals who are intimately familiar with the routes between Jeddah Airport, Makkah, Madinah, and local Ziyarat sites."
    }
];

export default async function ToyotaCamryPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Toyota%20Camry%20for%20Umrah`;
    
    const camryId = '692db09834f15bc89b45a5f6';

    return (
        <main className="overflow-x-hidden bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <VehicleHero
                title="Toyota Camry Umrah Taxi"
                subtitle="Premium 4-Seater Sedan for Umrah Families. Experience a quiet, smooth, and spiritually uplifting journey across Saudi Arabia."
                bgImage="/images/fleet/camry/toyota-camry-jeddah-to-makkah-taxi-front.webp"
                badge="Most Popular Sedan"
                whatsappLink={whatsappLink}
                quickSpecs={["4 Passengers", "3-4 Bags", "Dual-Zone AC", "Premium Comfort"]}
                breadcrumbs={<Breadcrumbs />}
            />

            <VehicleOverview
                title="The Gold Standard for Private Umrah Transport"
                description="The Toyota Camry is our most requested vehicle for solo pilgrims, couples, and small families. Combining exceptional reliability, a whisper-quiet cabin, and a remarkably smooth suspension, it ensures that your journey from Jeddah Airport to Makkah or Madinah is as peaceful as your destination. Perfect for Ziyarat tours with unparalleled safety features."
                modelYear="2024"
                passengers={4}
                luggage="3-4 Medium Bags"
                tech="Bluetooth & USB"
                fuel="Highly Efficient"
                bookLink={whatsappLink}
                mainImage="/images/fleet/camry/toyota-camry-makkah-madinah-taxi-premium-interior.webp"
                fallbackImage="/images/fleet/camry-hero-professional.webp"
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
                    vehicleId={camryId}
                    vehicleImage="/images/fleet/camry/toyota-camry-umrah-car-exterior-profile.webp"
                    vehicleType="camry"
                    title="Transparent Pricing"
                    subtitle="Competitive rates for premium service. Prices vary based on season and availability."
                />
            </div>

            <VehicleReviews reviews={camryReviews} />

            <FAQSection items={camryFAQs} title="Frequently Asked Questions" />

            <VehicleCTA 
                whatsappLink={whatsappLink}
                phoneNumber={phoneNumber}
            />
        </main>
    );
}
