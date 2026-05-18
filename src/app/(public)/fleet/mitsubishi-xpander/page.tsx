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

const vehicleData = pricingData.vehicles.find(v => v.id === 'xpander');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Mitsubishi Xpander 7-Seater Rental Makkah",
    "image": "https://www.alaqsaumrahtransport.com/images/fleet/mitsubishi-xpander/mitsubishi-xpander-exterior-saudi-arabia.jpeg",
    "description": "Rent a Mitsubishi Xpander 7-seater in Makkah & Madinah for affordable, comfortable family Umrah transport.",
    "brand": { "@type": "Brand", "name": "Mitsubishi" },
    "offers": { 
        "@type": "Offer", 
        "price": "400", 
        "priceCurrency": "SAR", 
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/fleet/mitsubishi-xpander"
    },
    "hasCertification": "Nusuk Registered Vehicle"
};

export const metadata: Metadata = {
    title: vehicleData?.seo?.title || "Mitsubishi Xpander 7-Seater Rental Makkah | Family Van",
    description: vehicleData?.seo?.description || "Rent Mitsubishi Xpander 7-seater for family Umrah trips. Spacious interior, smooth suspension, ideal for Makkah to Madinah transport.",
    keywords: [
        "Mitsubishi Xpander Makkah",
        "7 seater family car",
        "affordable umrah van",
        "Jeddah Airport family transport",
        "Makkah to Madinah 7 seater",
        "family Umrah travel",
        "spacious Umrah car",
        "Mitsubishi van rental Jeddah",
        "ميتسوبيشي اكسباندر توصيل",
        "توصيل عائلات مكة",
        "سيارة عائلية 7 راكب للعمرة",
        "Jeddah to Makkah family taxi",
        "Umrah group of 6 transport",
        "Mitsubishi Xpander rental KSA"
    ],
    alternates: { canonical: 'https://www.alaqsaumrahtransport.com/fleet/mitsubishi-xpander' },
    openGraph: {
        title: "Mitsubishi Xpander | 7-Seater Family Transport",
        description: "Comfortable, spacious, and affordable 7-seater family transport across Saudi Arabia with our Mitsubishi Xpander fleet.",
        images: [{ url: '/images/fleet/mitsubishi-xpander/mitsubishi-xpander-exterior-saudi-arabia.jpeg', width: 1200, height: 630, alt: 'Mitsubishi Xpander 7-Seater' }]
    }
};

const galleryImages = [
    { src: '/images/fleet/mitsubishi-xpander/mitsubishi-xpander-exterior-saudi-arabia.jpeg', alt: 'Mitsubishi Xpander Exterior' },
    { src: '/images/fleet/mitsubishi-xpander/al-kiswah-cab-mitsubishi-xpander-7-seater-saudi-arabia.jpeg', alt: '7-Seater Umrah Transport' },
    { src: '/images/fleet/mitsubishi-xpander/7-seater-cab-service-al-kiswah-xpander.jpeg', alt: 'Family Van Service' },
    { src: '/images/fleet/mitsubishi-xpander/7-seater-car-rental-interior-al-kiswah-saudi.jpeg', alt: 'Spacious Cabin Interior' },
    { src: '/images/fleet/mitsubishi-xpander/mitsubishi-xpander-7-seater-interior-legroom.jpeg', alt: 'Excellent Legroom' },
    { src: '/images/fleet/mitsubishi-xpander/xpander-cabin-view-al-kiswah-cab-comfort.jpeg', alt: 'Comfortable Seating' },
];

const specs = [
    { label: "Engine & Power", value: "1.5L MIVEC", subValue: "DOHC 16-Valve" },
    { label: "Seating Capacity", value: "7 Seats", subValue: "3 Rows" },
    { label: "Luggage Capacity", value: "Flexible Cargo", subValue: "3-4 Large Bags" },
    { label: "Comfort Control", value: "Manual AC", subValue: "Rear Climate Vents" },
    { label: "Suspension", value: "Comfort-Tuned", subValue: "MacPherson Strut" },
    { label: "Safety", value: "ABS & ASC", subValue: "Dual Airbags" },
    { label: "Interior", value: "Premium Fabric", subValue: "Ergonomic Seats" },
    { label: "Entertainment", value: "7-inch SDA", subValue: "Smartphone Link" },
];

const features = [
    "Flexible seating layout accommodating up to 7 passengers comfortably.",
    "Dedicated rear AC vents ensuring cooling for 2nd and 3rd-row passengers.",
    "Multiple power outlets and USB ports to keep family devices charged.",
    "Exceptional legroom and headroom in all three rows.",
    "Smooth, comfort-tuned suspension system perfect for long family journeys.",
    "Advanced noise insulation for a quieter highway ride to Madinah.",
    "Active Stability Control and Anti-lock Braking System for safety.",
    "Foldable 3rd-row seats to massively expand luggage space when needed."
];

const useCases = [
    {
        title: "Family Umrah Trips",
        description: "Keep your entire family of up to 6 or 7 passengers together in one vehicle. No need to split up into multiple taxis from the airport.",
        icon: Users
    },
    {
        title: "Makkah ↔ Madinah Routes",
        description: "The 4.5-hour highway drive is made relaxing with ample legroom, flexible seating, and dedicated rear climate control.",
        icon: MapPin
    },
    {
        title: "City Ziyarat Tours",
        description: "Easily navigate through Makkah and Madinah with excellent visibility and easy entry/exit for all family members.",
        icon: Zap
    }
];

const xpanderReviews = [
    {
        name: "Tariq M.",
        rating: 5,
        text: "We traveled as a family of 6 from Jeddah Airport to our hotel in Makkah. The Xpander fit all of us and our bags perfectly. Very smooth ride.",
        location: "Malaysia"
    },
    {
        name: "Omar K.",
        rating: 5,
        text: "The dedicated AC vents in the back were a lifesaver for the kids. Great driver, very clean car, highly recommend for families.",
        location: "UK"
    },
    {
        name: "Siti N.",
        rating: 5,
        text: "Very affordable for a 7-seater. We used it for our Ziyarat in Madinah. It was easy to get in and out at each stop.",
        location: "Indonesia"
    }
];

const xpanderFAQs = [
    {
        question: "How many passengers can fit in the Mitsubishi Xpander?",
        answer: "The Mitsubishi Xpander is a 7-seater vehicle. It is perfect for medium-sized families (up to 6 passengers plus the driver) traveling together."
    },
    {
        question: "Is the Xpander comfortable for long trips like Makkah to Madinah?",
        answer: "Yes, the Xpander features a very spacious cabin, flexible seating, and a smooth suspension system designed to handle long-distance family road trips comfortably."
    },
    {
        question: "How much luggage can the Xpander carry?",
        answer: "When configured for 5-6 passengers with the 3rd row folded, the rear cargo area can comfortably hold 3 to 4 large suitcases."
    },
];

export default async function MitsubishiXpanderPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Mitsubishi%20Xpander%20for%20Family`;
    
    const xpanderId = 'xpander';

    return (
        <main className="overflow-x-hidden bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <VehicleHero
                title="Mitsubishi Xpander | 7-Seater Family Transport"
                subtitle="The ultimate family vehicle for your spiritual journey. Enjoy exceptional spaciousness, a smooth ride, and peace of mind."
                bgImage="/images/fleet/mitsubishi-xpander/mitsubishi-xpander-exterior-saudi-arabia.jpeg"
                badge="Family Choice"
                whatsappLink={whatsappLink}
                quickSpecs={["7 Passengers", "3-4 Suitcases", "Rear AC Vents", "Comfort Ride"]}
                breadcrumbs={<Breadcrumbs />}
            />

            <VehicleOverview
                title="Designed for Family Harmony"
                description="The Mitsubishi Xpander is built from the ground up for families. It provides an exceptionally quiet, spacious, and highly configurable interior, ensuring everyone from toddlers to grandparents travels in comfort across the Holy Cities."
                modelYear="Latest"
                passengers={7}
                luggage="3-4 Large Bags"
                tech="7-inch Display & USB"
                fuel="1.5L Efficient"
                bookLink={whatsappLink}
                mainImage="/images/fleet/mitsubishi-xpander/al-kiswah-cab-mitsubishi-xpander-7-seater-saudi-arabia.jpeg"
                fallbackImage="/images/fleet/mitsubishi-xpander/mitsubishi-xpander-exterior-saudi-arabia.jpeg"
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
                    vehicleId={xpanderId}
                    vehicleImage="/images/fleet/mitsubishi-xpander/mitsubishi-xpander-exterior-saudi-arabia.jpeg"
                    vehicleType="xpander"
                    title="Transparent Family Pricing"
                    subtitle="Affordable, family-friendly transportation with fixed rates for all major Umrah routes."
                />
            </div>

            <VehicleReviews reviews={xpanderReviews} />

            <FAQSection items={xpanderFAQs} title="Mitsubishi Xpander Rental - Frequently Asked Questions" />

            <VehicleCTA 
                whatsappLink={whatsappLink}
                phoneNumber={phoneNumber}
            />
        </main>
    );
}
