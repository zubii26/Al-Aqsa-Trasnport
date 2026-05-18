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

const vehicleData = pricingData.vehicles.find(v => v.id === 'coaster');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Toyota Coaster Group Rental",
    "image": "https://www.alaqsaumrahtransport.com/images/fleet/coaster.png",
    "description": "Rent a Toyota Coaster in Makkah & Madinah for comfortable and spacious group Umrah transport.",
    "brand": { "@type": "Brand", "name": "Toyota" },
    "offers": { 
        "@type": "Offer", 
        "price": "650", 
        "priceCurrency": "SAR", 
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/fleet/toyota-coaster"
    },
    "hasCertification": "Nusuk Registered Vehicle"
};

export const metadata: Metadata = {
    title: vehicleData?.seo?.title || "Toyota Coaster Rental Makkah | 22-30 Seater Bus",
    description: vehicleData?.seo?.description || "Rent a Toyota Coaster for large Umrah groups. Seats 22-30 passengers with dedicated AC vents, wide windows, and large luggage capacity.",
    keywords: [
        "Toyota Coaster Makkah",
        "22 seater bus Jeddah",
        "30 seater bus Umrah",
        "group Umrah transport",
        "Ziyarat tours bus",
        "Toyota minibus rental Makkah",
        "Jeddah Airport group transfer",
        "Makkah to Madinah bus",
        "Umrah package bus",
        "تويوتا كوستر للعمرة",
        "باص 30 راكب مكة",
        "توصيل مجموعات مطار جدة",
        "large family Umrah transport",
        "group travel Saudi Arabia"
    ],
    alternates: { canonical: 'https://www.alaqsaumrahtransport.com/fleet/toyota-coaster' },
    openGraph: {
        title: "Toyota Coaster | 22-30 Seater Group Transport",
        description: "Reliable, comfortable, and spacious group travel across Saudi Arabia with our Toyota Coaster fleet.",
        images: [{ url: '/images/fleet/coaster.png', width: 1200, height: 630, alt: 'Toyota Coaster 30 Seater Bus' }]
    }
};

const galleryImages = [
    { src: '/images/fleet/coaster.png', alt: 'Toyota Coaster Exterior' },
    // If more coaster images are obtained, they can be added here. Currently relying on the main asset.
];

const specs = [
    { label: "Engine & Power", value: "4.2L Diesel", subValue: "High Durability" },
    { label: "Seating Capacity", value: "22-30 Seats", subValue: "Group Configurations" },
    { label: "Luggage Capacity", value: "Large Compartment", subValue: "Dedicated Storage" },
    { label: "Comfort Control", value: "Heavy-Duty AC", subValue: "Individual Vents" },
    { label: "Suspension", value: "Double Wishbone", subValue: "Leaf Spring Rear" },
    { label: "Safety", value: "ABS", subValue: "Seatbelts for All" },
    { label: "Entertainment", value: "PA System", subValue: "Microphone for Guide" },
    { label: "Doors", value: "Auto Folding", subValue: "Passenger Door" },
];

const features = [
    "Versatile seating configurations accommodating 22 to 30 passengers.",
    "Powerful central AC system with individual roof vents for every seat.",
    "Built-in PA System with microphone, perfect for tour guides reciting Talbiyah.",
    "Wide panoramic windows providing excellent visibility for Ziyarat sightseeing.",
    "Heavy-duty suspension engineered for smooth rides with maximum payload.",
    "Automatic folding passenger door for easy and quick group boarding.",
    "Dedicated large group luggage compartments for all passenger belongings.",
    "Legendary Toyota reliability ensuring peace of mind across long highway stretches."
];

const useCases = [
    {
        title: "Tour Agencies & Groups",
        description: "Keep large congregations united. Perfect for Umrah operators moving 20-30 pilgrims together without splitting groups.",
        icon: Users
    },
    {
        title: "City Ziyarat Tours",
        description: "Wide windows and an onboard PA system make the Coaster ideal for guided tours of Islamic historical sites.",
        icon: Zap
    },
    {
        title: "Makkah ↔ Madinah Routes",
        description: "High-backed comfortable seats ensure the group can rest during the long intercity drive between the Holy Cities.",
        icon: MapPin
    }
];

const coasterReviews = [
    {
        name: "Usman Ali",
        rating: 5,
        text: "We booked the Coaster for our extended family of 24. The driver was excellent, the AC was very cold, and the PA system helped us recite together.",
        location: "Pakistan"
    },
    {
        name: "Hassan M. (Tour Operator)",
        rating: 5,
        text: "As an agency, we rely entirely on Al Aqsa's Coasters. They are always on time at Jeddah Airport and the buses are in pristine condition.",
        location: "UK"
    },
    {
        name: "Nour F.",
        rating: 4,
        text: "Very spacious and clean. The luggage capacity was surprising; it easily fit all 30 of our suitcases. Great service overall.",
        location: "Egypt"
    }
];

const coasterFAQs = [
    {
        question: "How many passengers can the Toyota Coaster accommodate?",
        answer: "The Toyota Coaster offers versatile seating configurations, comfortably accommodating between 22 to 30 passengers, making it the premier choice for large Umrah groups."
    },
    {
        question: "Does the Coaster have adequate air conditioning for all passengers?",
        answer: "Yes, the Coaster is equipped with a powerful central AC system and individual AC vents above all seats to ensure every passenger stays cool during the journey."
    },
    {
        question: "Is there enough room for group luggage?",
        answer: "Absolutely. It features large, dedicated luggage compartments designed specifically to hold the suitcases and belongings of large traveling groups."
    },
];

export default async function ToyotaCoasterPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Toyota%20Coaster%20for%20Group`;
    
    const coasterId = 'coaster';

    return (
        <main className="overflow-x-hidden bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <VehicleHero
                title="Toyota Coaster | 22-30 Seater Group Transport"
                subtitle="The benchmark for reliable group travel. Keep your entire congregation together with wide windows, individual AC vents, and comfortable long-route seating."
                bgImage="/images/fleet/coaster.png"
                badge="Group Choice"
                whatsappLink={whatsappLink}
                quickSpecs={["22-30 Passengers", "Group Luggage", "Individual AC", "PA System"]}
                breadcrumbs={<Breadcrumbs />}
            />

            <VehicleOverview
                title="Engineered for Group Comfort"
                description="The Toyota Coaster is designed specifically for large groups, ensuring that every pilgrim travels together safely and comfortably without feeling cramped. It simplifies logistics for tour operators and extended families."
                modelYear="Latest"
                passengers={30}
                luggage="Large Group Storage"
                tech="PA System & Audio"
                fuel="4.2L Diesel"
                bookLink={whatsappLink}
                mainImage="/images/fleet/coaster.png"
                fallbackImage="/images/fleet/coaster.png"
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
                    vehicleId={coasterId}
                    vehicleImage="/images/fleet/coaster.png"
                    vehicleType="coaster"
                    title="Transparent Group Pricing"
                    subtitle="Cost-effective, reliable minibus transportation with fixed rates for group transfers."
                />
            </div>

            <VehicleReviews reviews={coasterReviews} />

            <FAQSection items={coasterFAQs} title="Toyota Coaster Rental - Frequently Asked Questions" />

            <VehicleCTA 
                whatsappLink={whatsappLink}
                phoneNumber={phoneNumber}
            />
        </main>
    );
}
