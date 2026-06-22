import type { Metadata } from "next";
import { getSettings } from '@/lib/settings-storage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FAQSection from '@/components/services/FAQSection';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import { Shield, Map, Clock, Users, Briefcase } from 'lucide-react';
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

const vehicleData = pricingData.vehicles.find(v => v.id === 'hiace');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": vehicleData?.seo?.title || "Toyota Hiace 12-Seater Bus Rental",
    "image": "https://www.alaqsaumrahtransport.com/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-open-road.jpeg",
    "description": vehicleData?.seo?.description || "Rent Toyota Hiace bus in Makkah. Reliable 12-seater transport for Umrah groups and large families.",
    "brand": { "@type": "Brand", "name": "Toyota" },
    "offers": { "@type": "Offer", "price": "350", "priceCurrency": "SAR", "availability": "https://schema.org/InStock" ,
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "SA",
            "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
            "description": "Due to the nature of pre-booked private transport services, returns or refunds are not permitted once the service has commenced or been completed. Please refer to our cancellation policy for pre-service modifications."
        },
        "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "SAR" },
            "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" }
            },
            "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "SA" }
        }},
    "award": "Nusuk Registered Vehicle",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "152"
    },
    "review": {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Verified Customer" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5", "worstRating": "1" },
        "datePublished": "2024-01-01",
        "reviewBody": "Excellent service, clean vehicles, and professional drivers."
    }
};

export const metadata: Metadata = {
    title: "Toyota Hiace Bus Rental Makkah | Cheap Group Transport",
    description: "Book Toyota Hiace 12-seater bus for Umrah groups. Affordable transport from Jeddah Airport to Makkah & Madinah. Reliable & spacious.",
    keywords: [
        "Toyota Hiace Rental Makkah",
        "10 Seater Bus Makkah",
        "Cheap Umrah Transport",
        "Group Taxi Jeddah to Makkah",
        "Toyota Hiace Bus Price",
        "تأجير باص هايس",
        "نقل جماعي مكة",
        "باص 10 راكب جدة"
    ],
    alternates: { canonical: 'https://www.alaqsaumrahtransport.com/fleet/toyota-hiace' },
    openGraph: {
        title: "Toyota Hiace Bus Rental Makkah | Cheap Group Transport",
        description: "Book Toyota Hiace 12-seater bus for Umrah groups. Affordable transport from Jeddah Airport to Makkah & Madinah. Reliable & spacious.",
        images: [{ url: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-open-road.jpeg', width: 1200, height: 630, alt: 'Toyota Hiace Bus' }]
    }
};

const galleryImages = [
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-alloy-wheel.jpeg', alt: 'Toyota Hiace Exterior Alloy Wheel' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-front-abha.jpeg', alt: 'Toyota Hiace Exterior Front Abha' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-front-bumper.jpeg', alt: 'Toyota Hiace Exterior Front Bumper' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-front-rear-headlight.jpeg', alt: 'Toyota Hiace Exterior Front Rear Headlight' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-front-view.jpeg', alt: 'Toyota Hiace Exterior Front View' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-full-body-white.jpeg', alt: 'Toyota Hiace Exterior Full Body White' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-full-rear.jpeg', alt: 'Toyota Hiace Exterior Full Rear' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-headlight-detail.jpeg', alt: 'Toyota Hiace Exterior Headlight Detail' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-led-headlight.jpeg', alt: 'Toyota Hiace Exterior Led Headlight' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-rear-view.jpeg', alt: 'Toyota Hiace Exterior Rear View' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-side-profile.jpeg', alt: 'Toyota Hiace Exterior Side Profile' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-sliding-door-open.jpeg', alt: 'Toyota Hiace Exterior Sliding Door Open' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-wheel-detail.jpeg', alt: 'Toyota Hiace Exterior Wheel Detail' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-interior-dashboard-main.jpeg', alt: 'Toyota Hiace Interior Dashboard Main' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-interior-passenger-comfort.jpeg', alt: 'Toyota Hiace Interior Passenger Comfort' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-interior-passenger-dashboard.jpeg', alt: 'Toyota Hiace Interior Passenger Dashboard' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-interior-passenger-seats.jpeg', alt: 'Toyota Hiace Interior Passenger Seats' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-interior-steering-angle.jpeg', alt: 'Toyota Hiace Interior Steering Angle' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-interior-steering-detail.jpeg', alt: 'Toyota Hiace Interior Steering Detail' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-interior-steering-wheel.jpeg', alt: 'Toyota Hiace Interior Steering Wheel' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-aerial-location.jpeg', alt: 'Toyota Hiace Lifestyle Aerial Location' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-cinematic-abha.jpeg', alt: 'Toyota Hiace Lifestyle Cinematic Abha' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-driving-rain.jpeg', alt: 'Toyota Hiace Lifestyle Driving Rain' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-full-desert-road.jpeg', alt: 'Toyota Hiace Lifestyle Full Desert Road' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-night-flash.jpeg', alt: 'Toyota Hiace Lifestyle Night Flash' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-night-grey.jpeg', alt: 'Toyota Hiace Lifestyle Night Grey' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-night-road.jpeg', alt: 'Toyota Hiace Lifestyle Night Road' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-open-road.jpeg', alt: 'Toyota Hiace Lifestyle Open Road' },
    { src: '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-top-wide-view.jpeg', alt: 'Toyota Hiace Lifestyle Top Wide View' }
];

const specs = [
    { label: "Engine & Power", value: "2.8L Turbo Diesel", subValue: "High Torque Motor" },
    { label: "Cooling System", value: "Heavy Duty AC", subValue: "Individual Roof Vents" },
    { label: "Luggage Capacity", value: "Dedicated Rear Space", subValue: "10-12 Medium Bags" },
    { label: "Seating Capacity", value: "10-13 Seats", subValue: "Configurable Layout" },
    { label: "Suspension", value: "Heavy Duty", subValue: "Reliable Ride" },
    { label: "Safety", value: "ABS & Airbags", subValue: "Standard Safety Pack" },
    { label: "Comfort", value: "Spacious Cabin", subValue: "Group Travel" },
    { label: "Durability", value: "Toyota Legend", subValue: "Never Stops" },
];

const features = [
    "Perfect for large families and groups traveling together.",
    "Dedicated rear luggage area capable of holding 10+ bags.",
    "Legendary Toyota reliability ensuring a breakdown-free journey.",
    "Heavy-duty AC system with individual vents for passenger comfort.",
    "High efficiency for long-distance travel across Saudi Arabia.",
    "Spacious cabin offering generous legroom for all passengers.",
    "Standard safety features including ABS and multiple airbags.",
    "Configurable layout to accommodate varying passenger/luggage needs.",
    "Cost-effective solution compared to booking multiple smaller cars.",
    "Nusuk registered vehicle ensuring seamless transport operations."
];

const useCases = [
    {
        title: "Extended Families",
        description: "No need to coordinate between multiple cars. Keep grandparents, parents, and kids together in one comfortable vehicle.",
        icon: Users
    },
    {
        title: "Budget Friendly Group Travel",
        description: "Significant cost savings per person compared to booking multiple smaller vehicles for your Umrah journey.",
        icon: Briefcase
    },
    {
        title: "Reliable City Transfers",
        description: "The vehicle that never stops. Perfect for tight schedules and long distances between Jeddah, Makkah, and Madinah.",
        icon: Shield
    }
];

const hiaceReviews = [
    {
        name: "Usman A.",
        rating: 5,
        text: "We were a group of 10 people with lots of luggage. The Hiace was perfect. The AC was very strong, which is a must in Saudi Arabia.",
        location: "Pakistan"
    },
    {
        name: "Hassan Family",
        rating: 5,
        text: "It was so much easier keeping the whole family together in one van rather than splitting up into two taxis. Driver was very patient.",
        location: "India"
    },
    {
        name: "Mohammed S.",
        rating: 4,
        text: "Very reliable and spacious. We had a comfortable ride from Jeddah airport to our hotel in Makkah.",
        location: "Malaysia"
    }
];

const hiaceFAQs = [
    {
        question: "How many bags can fit in a Toyota Hiace?",
        answer: "If occupied by 10 passengers, the Hiace can fit about 10-12 medium suitcases. For full capacity, luggage space is limited, so we recommend a dedicated luggage vehicle or upgrading to a Coaster."
    },
    {
        question: "Is the Hiace suitable for elderly pilgrims?",
        answer: "The Hiace is reliable, but for elderly pilgrims requiring maximum comfort, we recommend the Hyundai Staria or GMC Yukon due to their softer suspension. However, our Hiace models are modern and well-maintained."
    },
    {
        question: "Do you offer the larger Toyota Coaster bus?",
        answer: "Yes, for groups of 18-30 people, we offer the Toyota Coaster. It provides more luggage space and a smoother ride than the Hiace. Contact us for Coaster pricing."
    },
];

export default async function ToyotaHiacePage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Toyota%20Hiace%20for%20Group%20Umrah`;
    
    // Toyota Hiace ID
    const hiaceId = '692db09834f15bc89b45a5fb';

    return (
        <main className="overflow-x-hidden bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <VehicleHero
                title="Toyota Hiace 2026 | Group Umrah Transport"
                subtitle="The trusted choice for large families and groups traveling between Jeddah, Makkah, and Madinah. Reliable and spacious."
                bgImage="/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-open-road.jpeg"
                badge="Group Choice"
                whatsappLink={whatsappLink}
                quickSpecs={["10-13 Passengers", "10+ Bags", "Heavy Duty AC", "Group Travel"]}
                breadcrumbs={<Breadcrumbs />}
            />

            <VehicleOverview
                title="Why Choose Toyota Hiace for Group Umrah?"
                description="Keep your group united. The Toyota Hiace is perfect for large families and groups traveling from Jeddah Airport to Makkah or Madinah. Known for its legendary reliability and powerful heavy-duty AC, it ensures a comfortable, breakdown-free journey across Saudi Arabia. It's the most cost-effective and practical way to travel together without the hassle of coordinating multiple smaller vehicles."
                modelYear="2026"
                passengers={13}
                luggage="10+ Medium Bags"
                tech="High Torque Engine"
                fuel="2.8L Turbo Diesel"
                bookLink={whatsappLink}
                mainImage="/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-sliding-door-open.jpeg"
                fallbackImage="/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-front-view.jpeg"
            />

            <VehicleGallery 
                title="Explore the Toyota Hiace"
                images={galleryImages} 
            />

            <VehicleSpecs specs={specs} />

            <VehicleFeatures features={features} />

            <VehicleUseCases cases={useCases} />

            <div className="py-16 bg-white dark:bg-slate-900">
                <FleetPricingGrid
                    vehicleId={hiaceId}
                    vehicleImage="/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-front-view.jpeg"
                    vehicleType="hiace"
                    title="Toyota Hiace Rates | Jeddah, Makkah, Madinah"
                    subtitle="Spacious seating for up to 10 passengers. Perfect for large families and groups."
                />
            </div>

            <VehicleReviews reviews={hiaceReviews} />

            <FAQSection items={hiaceFAQs} title="Toyota Hiace Rental - Frequently Asked Questions" />

            <VehicleCTA 
                whatsappLink={whatsappLink}
                phoneNumber={phoneNumber}
            />
        </main>
    );
}
