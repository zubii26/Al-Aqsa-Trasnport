
import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Wifi, Briefcase, Users, Fuel } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';

export const metadata: Metadata = {
    title: "Toyota Camry Taxi Makkah to Madinah | Private Umrah Taxi",
    description: "Book Toyota Camry for your Umrah journey. Comfortable and affordable private taxi for Makkah to Madinah, Jeddah Airport transfers, and Ziyarat. Ideal for small families.",
    keywords: [
        "Toyota Camry Makkah Taxi",
        "Small Car Umrah Transport",
        "Cheap Taxi Jeddah to Makkah",
        "Private Camry Ride Madinah",
        "Jeddah Airport SEDAN Pickup",
        "Couples Umrah Transport",
        "Toyota Camry 2024 Saudi Arabia"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/fleet/toyota-camry',
    }
};

const camryFAQs = [
    {
        question: "How many passengers can fit in the Toyota Camry?",
        answer: "The Toyota Camry comfortably seats up to 4 passengers. Ideally suited for couples or small families with 2-3 medium suitcases."
    },
    {
        question: "Is the Toyota Camry good for Makkah to Madinah travel?",
        answer: "Yes, the Camry is known for its smooth suspension and quiet cabin, making the 4.5-hour journey between the Holy Cities comfortable and relaxing."
    },
    {
        question: "Does the car have air conditioning?",
        answer: "Yes, all our vehicles including the Toyota Camry come with excellent air conditioning to handle the Saudi weather, ensuring a cool trip."
    },
];

export default async function ToyotaCamryPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Toyota%20Camry%20for%20Umrah`;

    return (
        <main className="overflow-x-hidden">
            <Hero
                title="Toyota Camry | Comfort & Efficiency"
                subtitle="The perfect choice for small families and couples. Experience a smooth, reliable, and private journey."
                bgImage="/images/fleet/camry-hero.jpg"
                ctaText="Book Camry via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            {/* Placeholder image until user provides specific one, using a generic high quality car image or existing if mapped */}
                            <img
                                src="/images/fleet/camry-feature.png"
                                alt="Toyota Camry White"
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Best Value
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Why Choose the Toyota Camry?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                The Toyota Camry is the gold standard for reliable and comfortable sedan travel.
                                Whether you need a quick transfer from Jeddah Airport to Makkah or a smooth ride to Madinah,
                                the Camry offers a premium feel at an affordable price.
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
                                    <p className="text-sm text-slate-500">Ample trunk space for luggage</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Fuel className="text-amber-500" size={20} /> Economic
                                    </div>
                                    <p className="text-sm text-slate-500">Affordable luxury travel</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Shield className="text-amber-500" size={20} /> Safe & Secure
                                    </div>
                                    <p className="text-sm text-slate-500">Top-rated safety features</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all">
                                    Book Toyota Camry Now <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Ideal For</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Couples & Small Families",
                                desc: "Enjoy a private car experience without the cost of a large SUV.",
                                icon: Users
                            },
                            {
                                title: "Airport Transfers",
                                desc: "Quick and efficient pickup from Jeddah or Madinah airport directly to your hotel.",
                                icon: Briefcase
                            },
                            {
                                title: "City-to-City Travel",
                                desc: "Smooth highway driving makes the journey between Haramain easy and comfortable.",
                                icon: MapPin
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-amber-500">
                                <item.icon className="w-10 h-10 text-amber-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={camryFAQs} title="Toyota Camry Rental - Common Questions" />
        </main>
    );
}

// Helper for icon fix (reused from reference)
function MapPin(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}
