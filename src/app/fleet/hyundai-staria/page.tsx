import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Briefcase, Users, Wifi, Fuel } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import FleetFeatureImage from '@/components/fleet/FleetFeatureImage';

export const metadata: Metadata = {
    title: "Hyundai Staria Umrah Taxi | Luxury 7-Seater Van Makkah",
    description: "Book Hyundai Staria 2024 for Umrah transport. Premium 7-seater van for Jeddah Airport to Makkah and Madinah. Modern, spacious, and perfect for VIP families.",
    keywords: [
        "Hyundai Staria Umrah Taxi",
        "Hyundai Staria Makkah",
        "Luxury Van Jeddah to Madinah",
        "7 Seater VIP Taxi Makkah",
        "Hyundai Staria Rental Saudi Arabia",
        "Comfortable Umrah Transport",
        "Staria Van for Ziyarat"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/fleet/hyundai-staria',
    }
};

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
];

export default async function HyundaiStariaPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Hyundai%20Staria%20for%20Umrah`;

    // Hyundai Staria ID: 692db09834f15bc89b45a5f9
    const stariaId = '692db09834f15bc89b45a5f9';
    const stariaImage = '/images/fleet/staria.png';

    return (
        <main className="overflow-x-hidden">
            <Hero
                title="Hyundai Staria 2024 | Premium Umrah Transport"
                subtitle="The future of travel in Saudi Arabia. Spacious and luxurious 7-seater van for families visiting Makkah and Madinah."
                bgImage={stariaImage}
                badge="Futuristic Choice"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
            />

            <FleetPricingGrid
                vehicleId={stariaId}
                vehicleImage={stariaImage}
                vehicleType="staria"
                title="Hyundai Staria Rates | Jeddah, Makkah, Madinah"
                subtitle="The perfect balance of modern luxury and group capacity. Ideal for families and small groups."
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <FleetFeatureImage
                                src="/images/fleet/staria-feature.png"
                                alt="Hyundai Staria Exterior"
                                fallbackSrc={stariaImage}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Next-Gen Van
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Experience Luxury: Hyundai Staria in Makkah
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Enjoy panoramic views of the Holy Lands with the Hyundai Staria. Its lounge-style seating makes the journey between Jeddah, Makkah, and Madinah
                                incredibly relaxing for pilgrims seeking a premium travel experience.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-blue-500" size={20} /> 7 Passengers
                                    </div>
                                    <p className="text-sm text-slate-500">Ample legroom for all rows</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-blue-500" size={20} /> 6 Suitcases
                                    </div>
                                    <p className="text-sm text-slate-500">Expansive vertical cargo space</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Wifi className="text-blue-500" size={20} /> USB Chargers
                                    </div>
                                    <p className="text-sm text-slate-500">Available at every seat</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Shield className="text-blue-500" size={20} /> Smart Safety
                                    </div>
                                    <p className="text-sm text-slate-500">Advanced 360 collision detection</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                    Book Hyundai Staria <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Why Families Love The Staria</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Panoramic Views",
                                desc: "Large windows let you enjoy the scenic mountains and desert landscapes between Makkah and Madinah.",
                                icon: Star
                            },
                            {
                                title: "Easy Entry/Exit",
                                desc: "Dual electronic sliding doors and lower floor height make it perfect for elderly pilgrims.",
                                icon: Users
                            },
                            {
                                title: "Futuristic Design",
                                desc: "Arrive at your hotel in style with the most eye-catching van on the Saudi highways.",
                                icon: Shield
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-blue-500 transition-transform hover:-translate-y-1">
                                <item.icon className="w-10 h-10 text-blue-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={stariaFAQs} title="Hyundai Staria - Frequently Asked Questions" />
        </main>
    );
}

