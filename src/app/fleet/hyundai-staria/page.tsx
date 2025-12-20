import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Star, Wifi, Briefcase, Users } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';

export const metadata: Metadata = {
    title: "Hyundai Staria Umrah Taxi | Comfortable 7-Seater Van Makkah",
    description: "Book Hyundai Staria 2024 for Umrah. Modern, spacious 7-seater van for Makkah to Madinah transfers. Perfect for families, large luggage capacity, and smooth ride.",
    keywords: [
        "Hyundai Staria Umrah Taxi",
        "Staria Van Makkah",
        "7 Seater Taxi Madinah",
        "Family Van for Umrah",
        "Hyundai Staria 2024 Rental",
        "Comfortable Umrah Transport",
        "Private Van Saudi Arabia"
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

// Reusing the MapPin helper component
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

export default async function HyundaiStariaPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Hyundai%20Staria%20for%20Umrah`;

    return (
        <main className="overflow-x-hidden">
            <Hero
                title="Hyundai Staria 2024 | The Future of Family Transport"
                subtitle="Spacious, modern, and incredibly comfortable. The best 7-seater van for family Umrah groups."
                bgImage="https://images.unsplash.com/photo-1646274432126-5d662bb1e74b?q=80&w=2000&auto=format&fit=crop"
                ctaText="Book Staria via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            {/* Placeholder for Staria */}
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/2021_Hyundai_Staria_2.2_CRDi_Premium_%28front%29.jpg/1200px-2021_Hyundai_Staria_2.2_CRDi_Premium_%28front%29.jpg"
                                alt="Hyundai Staria Exterior"
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Best Value
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Redefining Comfort: Hyundai Staria
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Forget cramped taxis. The Hyundai Staria offers a panoramic view of the Holy Lands with its massive windows and lounge-style seating.
                                It is specifically chosen for our fleet to provide families with the most relaxing travel experience possible.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-blue-500" size={20} /> 7-9 Passengers
                                    </div>
                                    <p className="text-sm text-slate-500">Configurable seating for groups</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-blue-500" size={20} /> 6+ Suitcases
                                    </div>
                                    <p className="text-sm text-slate-500">Ample vertical luggage space</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Wifi className="text-blue-500" size={20} /> USB Chargers
                                    </div>
                                    <p className="text-sm text-slate-500">Charging ports for every row</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Shield className="text-blue-500" size={20} /> Smooth Ride
                                    </div>
                                    <p className="text-sm text-slate-500">Modern comfort-tuned suspension</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all">
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
                                desc: "Dual sliding doors make it easy for elderly pilgrims and children to get in and out.",
                                icon: Users
                            },
                            {
                                title: "Budget Friendly Luxury",
                                desc: "Get near-VIP comfort for a price closer to a standard van. The best value for money.",
                                icon: Briefcase
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-blue-500">
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
