import type { Metadata } from "next";
import { getSettings } from '@/lib/settings-storage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FAQSection from '@/components/services/FAQSection';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import { Star, Shield, Map, Clock, Users, CheckCircle } from 'lucide-react';
import pricingData from '@/data/pricing.json';

// Master Components
import VehicleHero from '@/components/fleet/vehicle/VehicleHero';
import VehicleOverview from '@/components/fleet/vehicle/VehicleOverview';
import VehicleSpecs from '@/components/fleet/vehicle/VehicleSpecs';
import VehicleFeatures from '@/components/fleet/vehicle/VehicleFeatures';
import VehicleUseCases from '@/components/fleet/vehicle/VehicleUseCases';
import VehicleReviews from '@/components/fleet/vehicle/VehicleReviews';
import VehicleCTA from '@/components/fleet/vehicle/VehicleCTA';

const vehicleData = pricingData.vehicles.find(v => v.id === 'camry');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Business Sedan — Private Umrah Taxi",
    "image": "https://www.alaqsaumrahtransport.com/images/fleet/camry/toyota-camry-jeddah-to-makkah-taxi-front.webp",
    "description": "Private chauffeur-driven Business Sedan for Umrah. Toyota Camry, Kia K5, or Mitsubishi Xpander — the comfortable, modern choice for individuals, couples, and small families travelling between Jeddah, Makkah, and Madinah.",
    "brand": { "@type": "Brand", "name": "Al Aqsa Umrah Transport" },
    "offers": {
        "@type": "Offer",
        "price": "200",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.alaqsaumrahtransport.com/fleet/business-sedan",
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
        }
    },
    "award": "Nusuk Registered Vehicle",
};

export const metadata: Metadata = {
    title: "Business Sedan — Private Chauffeur | Umrah Taxi Saudi Arabia",
    description: "Book a private Business Sedan for your Umrah journey. Toyota Camry, Kia K5, or Mitsubishi Xpander — licensed driver, fixed price, 24/7 service between Jeddah, Makkah, and Madinah.",
    keywords: [
        "Business Sedan Umrah",
        "Toyota Camry Umrah Taxi",
        "Kia K5 Makkah",
        "private sedan Jeddah Airport",
        "Makkah to Madinah sedan",
        "Umrah taxi for couples",
        "small family Umrah transport",
        "Mitsubishi Xpander Makkah",
        "سيارة سيدان خاصة مكة",
        "تاكسي جدة مكة"
    ],
    alternates: { canonical: 'https://www.alaqsaumrahtransport.com/fleet/business-sedan' },
    openGraph: {
        title: "Business Sedan — Private Chauffeur | Umrah Taxi Saudi Arabia",
        description: "Toyota Camry, Kia K5, or Mitsubishi Xpander with a licensed driver. Fixed-price private transfers between Jeddah Airport, Makkah, and Madinah.",
        images: [{ url: '/images/fleet/camry/toyota-camry-jeddah-to-makkah-taxi-front.webp', width: 1200, height: 630, alt: 'Business Sedan Private Umrah Taxi' }]
    }
};

const specs = [
    { label: "Seating Capacity", value: "Up to 7 Passengers", subValue: "Camry/K5 = 4 · Xpander = 7" },
    { label: "Luggage Capacity", value: "2–3 Large Bags", subValue: "Dedicated Boot Space" },
    { label: "Climate Control", value: "Full AC", subValue: "Front & Rear Vents" },
    { label: "Connectivity", value: "USB Charging", subValue: "All Seats" },
    { label: "Driver", value: "Licensed Chauffeur", subValue: "Nusuk Registered" },
    { label: "Fuel", value: "Petrol / Hybrid", subValue: "Clean & Efficient" },
    { label: "Safety", value: "ABS & Airbags", subValue: "Full Safety Suite" },
    { label: "Availability", value: "24 / 7", subValue: "Flight Monitoring" },
];

const features = [
    "Private licensed chauffeur included — no self-drive, no shared seats.",
    "Three example vehicles: Toyota Camry (4 seats), Kia K5 (4 seats), Mitsubishi Xpander (7 seats).",
    "Full air conditioning with individual vents keeping the cabin cool in the Saudi heat.",
    "USB charging ports accessible from all passenger seats.",
    "Fixed transparent pricing — the price you see is the price you pay.",
    "Driver tracks your flight in real-time, so delays never leave you stranded.",
    "Clean, modern interiors maintained to the highest hygiene standards.",
    "Nusuk-registered vehicle with unrestricted access to Makkah hotel zones.",
];

const useCases = [
    {
        title: "Jeddah Airport Arrivals",
        description: "Meet & greet service at the arrival gate. Your driver waits with a name board — no hunting for taxis after a long flight.",
        icon: Map
    },
    {
        title: "Couples & Individuals",
        description: "Travelling light? The Business Sedan is the most cost-effective private option for solo pilgrims and couples making Umrah.",
        icon: Users
    },
    {
        title: "Intercity Transfers",
        description: "A comfortable, air-conditioned sedan for the Makkah–Madinah highway. Modern suspension absorbs the road and lets you rest.",
        icon: Clock
    }
];

const reviews = [
    {
        name: "Ayesha R.",
        rating: 5,
        text: "The Toyota Camry was spotless and the driver was waiting right at arrivals. Comfortable ride from Jeddah to Makkah, stress-free experience.",
        location: "Canada"
    },
    {
        name: "Tariq H.",
        rating: 5,
        text: "Booked the Kia K5 for two of us. Perfect size, very clean, and the driver knew exactly which hotel zone we needed. Highly recommended.",
        location: "UK"
    },
    {
        name: "Fatima S.",
        rating: 5,
        text: "Used the Xpander for our family of 6. Spacious and the AC was ice cold throughout the Makkah to Madinah journey. Will book again.",
        location: "Malaysia"
    }
];

const faqs = [
    {
        question: "Which vehicles are in the Business Sedan category?",
        answer: "Our Business Sedan fleet includes the Toyota Camry (4 passengers), Kia K5 (4 passengers), and Mitsubishi Xpander (up to 7 passengers). The specific vehicle assigned depends on availability and your passenger count — all are maintained to the same high standard."
    },
    {
        question: "Is a driver included?",
        answer: "Yes, always. Al Aqsa Umrah Transport is a private chauffeur service. Every booking includes a licensed, Nusuk-registered driver. You never drive yourself."
    },
    {
        question: "How many suitcases can a Business Sedan fit?",
        answer: "The Toyota Camry and Kia K5 comfortably fit 2–3 large suitcases. The Mitsubishi Xpander has a larger boot and can accommodate 3–5 bags depending on size. If you have more luggage, consider our Executive Van."
    },
    {
        question: "What is the price from Jeddah Airport to Makkah?",
        answer: "Rates are listed in the pricing grid below. All prices are fixed — no meters, no surge pricing. The rate shown is the rate you pay."
    },
    {
        question: "Can I request a specific car model?",
        answer: "You can state a preference when booking via WhatsApp. We will do our best to honour it, but category availability takes priority. All vehicles in this category offer the same standard of service."
    }
];

export default async function BusinessSedanPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20a%20Business%20Sedan%20for%20Umrah`;

    const camryId = vehicleData?.id || 'camry';

    return (
        <main className="overflow-x-hidden bg-slate-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <VehicleHero
                title="Business Sedan"
                subtitle="Example Vehicles: Toyota Camry · Kia K5 · Mitsubishi Xpander. The smart choice for individuals, couples, and small families. Comfortable, modern, and always on time."
                bgImage="/images/fleet/camry/toyota-camry-jeddah-to-makkah-taxi-front.webp"
                badge="Smart Choice"
                whatsappLink={whatsappLink}
                quickSpecs={["Up to 7 Passengers", "2–3 Bags", "Licensed Driver", "Fixed Price"]}
                breadcrumbs={<Breadcrumbs hideJsonLd />}
            />

            <VehicleOverview
                title="Why Choose a Business Sedan for Umrah?"
                description="The Business Sedan is the perfect balance of comfort, practicality, and value. With three example vehicles — Toyota Camry, Kia K5, and Mitsubishi Xpander — this category covers individuals, couples, and families of up to 7. Every ride includes a licensed Nusuk-registered chauffeur, fixed transparent pricing, and 24/7 availability across Jeddah, Makkah, and Madinah."
                modelYear="2024–2025"
                passengers={7}
                luggage="2–3 Large Bags"
                tech="USB · Full AC"
                fuel="Petrol / Hybrid"
                bookLink={whatsappLink}
                mainImage="/images/fleet/camry/toyota-camry-jeddah-to-makkah-taxi-front.webp"
                fallbackImage="/images/fleet/camry.webp"
            />

            <VehicleSpecs specs={specs} />

            <VehicleFeatures features={features} />

            <VehicleUseCases cases={useCases} />

            <div className="py-16 bg-white dark:bg-slate-900">
                <FleetPricingGrid
                    vehicleId={camryId}
                    vehicleImage="/images/fleet/camry/toyota-camry-jeddah-to-makkah-taxi-front.webp"
                    vehicleType="camry"
                    title="Business Sedan Rates | Jeddah, Makkah & Madinah"
                    subtitle="Fixed, transparent pricing for every route. No hidden fees."
                />
            </div>

            <VehicleReviews reviews={reviews} />

            <FAQSection items={faqs} title="Business Sedan — Frequently Asked Questions" />

            <VehicleCTA
                whatsappLink={whatsappLink}
                phoneNumber={phoneNumber}
            />
        </main>
    );
}
