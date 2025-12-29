import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Briefcase, Users, Wifi, Fuel } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import FleetFeatureImage from '@/components/fleet/FleetFeatureImage';

export const metadata: Metadata = {
    title: "Toyota Camry Umrah Taxi | Makkah to Madinah Price",
    description: "Book Toyota Camry 2024 for Umrah. Reliable 4-seater taxi for Jeddah Airport to Makkah and Madinah transfers. Affordable, private, and comfortable transport.",
    keywords: [
        "Toyota Camry Umrah Taxi",
        "Makkah to Madinah Taxi Price",
        "Jeddah Airport to Makkah Camry",
        "Small Taxi Makkah",
        "Toyota Camry Rental Saudi Arabia",
        "Private Umrah Taxi",
        "Cheap Taxi Jeddah to Madinah"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/fleet/toyota-camry',
    }
};

const camryFAQs = [
    {
        question: "How many passengers fits in Toyota Camry?",
        answer: "The Toyota Camry comfortably seats up to 4 passengers, making it ideal for solo travelers, couples, or small families."
    },
    {
        question: "Is there enough space for luggage in a Camry?",
        answer: "Yes, the Camry has a spacious trunk that can accommodate 2 large suitcases or 3-4 medium ones. If you have more luggage, we recommend our SUV or Van options."
    },
    {
        question: "Do you provide child seats in Camry?",
        answer: "Yes, we can provide child seats upon request for a small additional fee. Please mention this in the booking notes."
    },
];

export default async function ToyotaCamryPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Toyota%20Camry%20for%20Umrah`;

    // Toyota Camry ID: 692db09834f15bc89b45a5f6
    const camryId = '692db09834f15bc89b45a5f6';
    const camryImage = '/images/fleet/camry-hero-professional.png';

    return (
        <main className="overflow-x-hidden">
            <Hero
                title="Toyota Camry 2024 | Reliable Umrah Taxi Makkah"
                subtitle="The gold standard for private transfers. Affordable, comfortable, and efficient travel between Jeddah, Makkah, and Madinah."
                bgImage={camryImage}
                badge="Most Popular"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
            />

            <FleetPricingGrid
                vehicleId={camryId}
                vehicleImage={camryImage}
                vehicleType="camry"
                title="Toyota Camry Transfer Rates | Makkah & Madinah"
                subtitle="Premium service at economy prices. Transparent pricing for all your Makkah and Madinah journeys."
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <FleetFeatureImage
                                src="/images/fleet/camry-feature.png"
                                alt="Toyota Camry Interior"
                                fallbackSrc={camryImage}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                2024 Model
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Reliable Toyota Camry for Umrah Travel
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Our Toyota Camry fleet offers the smoothest ride for your Umrah journey. Ideal for small families or couples traveling from Jeddah Airport
                                to Makkah, ensuring a peaceful and efficient trip to the Holy Cities.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-amber-500" size={20} /> 4 Passengers
                                    </div>
                                    <p className="text-sm text-slate-500">Perfect for couples & small families</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-amber-500" size={20} /> 2-3 Suitcases
                                    </div>
                                    <p className="text-sm text-slate-500">Ample trunk space for pilgrims</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Wifi className="text-amber-500" size={20} /> Modern Tech
                                    </div>
                                    <p className="text-sm text-slate-500">Bluetooth & Charging ports</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Fuel className="text-amber-500" size={20} /> Fuel Efficient
                                    </div>
                                    <p className="text-sm text-slate-500">Eco-friendly & powerful</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-amber-500/20">
                                    Book Toyota Camry <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Perfect For Every Journey</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Airport Transfers",
                                desc: "Swift and comfortable travel from Jeddah Airport to your hotel in Makkah or Madinah.",
                                icon: Star
                            },
                            {
                                title: "Inter-City Travel",
                                desc: "Relaxing 4-hour transfers between Makkah and Madinah with our experienced drivers.",
                                icon: Shield
                            },
                            {
                                title: "Makkah Ziyarat",
                                desc: "Visit the holy sites of Makkah (Jabal al-Nour, Arafat, etc.) at your own pace.",
                                icon: Star
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-amber-500 transition-all hover:-translate-y-1">
                                <item.icon className="w-10 h-10 text-amber-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={camryFAQs} title="Toyota Camry Umrah - Frequently Asked Questions" />
        </main>
    );
}
