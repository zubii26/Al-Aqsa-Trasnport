import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Star, Wifi, Briefcase, Users } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';

export const metadata: Metadata = {
    title: "Toyota Hiace Price Umrah Taxi | 10-15 Seater Bus Makkah",
    description: "Rent Toyota Hiace with driver for Umrah group transport. Best price 10-15 seater bus for Makkah, Madinah, and Jeddah airport transfers. Spacious and reliable.",
    keywords: [
        "Toyota Hiace Umrah Taxi",
        "Hiace Bus Makkah",
        "15 Seater Bus Rental Saudi Arabia",
        "Group Umrah Transport",
        "Cheap Bus for Umrah",
        "Coaster Bus Makkah",
        "Toyota Hiace Price Jeddah"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/fleet/toyota-hiace',
    }
};

const hiaceFAQs = [
    {
        question: "How many bags can fit in a Toyota Hiace?",
        answer: "If occupied by 10 passengers, the Hiace can fit about 10-12 medium suitcases. For full capacity (14 passengers), luggage space is limited, so we recommend a dedicated luggage vehicle or upgrading to a Coaster."
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

export default async function ToyotaHiacePage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Toyota%20Hiace%20for%20Group%20Umrah`;

    return (
        <main className="overflow-x-hidden">
            <Hero
                title="Toyota Hiace 2024 | Reliable Group Transport"
                subtitle="The most trusted vehicle for groups and families. Affordable, spacious, and perfect for your Makkah-Madinah journey."
                bgImage="https://images.unsplash.com/photo-1621993202356-8208759c9ee5?q=80&w=2000&auto=format&fit=crop"
                ctaText="Get Hiace Quote"
                ctaLink={whatsappLink}
                layout="center"
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            {/* Placeholder for Hiace */}
                            <img
                                src="https://images.unsplash.com/photo-1632243313737-160de4f90bf4?q=80&w=1000&auto=format&fit=crop"
                                alt="Toyota Hiace Bus"
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Best for Groups
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Travel Together, Pray Together
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Don't split your group into multiple taxis. The Toyota Hiace keeps your family or group united throughout the journey.
                                Known for its legendary reliability and powerful air conditioning, it conquers the Saudi heat with ease.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-green-500" size={20} /> 10-14 Passengers
                                    </div>
                                    <p className="text-sm text-slate-500">Ideal for 2-3 families</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-green-500" size={20} /> 10+ Bags
                                    </div>
                                    <p className="text-sm text-slate-500">High roof options available</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Shield className="text-green-500" size={20} /> Reliability
                                    </div>
                                    <p className="text-sm text-slate-500">Toyota's trusted engine</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Star className="text-green-500" size={20} /> Affordable
                                    </div>
                                    <p className="text-sm text-slate-500">Lower cost per person</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all">
                                    Book Toyota Hiace <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Ideal For Large Groups</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Extended Families",
                                desc: "Keep grandparents, parents, and kids in one vehicle. No communication gaps.",
                                icon: Users
                            },
                            {
                                title: "Budget Groups",
                                desc: "Sharing the cost of a Hiace is much cheaper than hiring 3 sedans.",
                                icon: Briefcase
                            },
                            {
                                title: "Airport Transfers",
                                desc: "We ensure your entire group arrives at the hotel at the exact same time.",
                                icon: MapPin
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-green-500">
                                <item.icon className="w-10 h-10 text-green-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={hiaceFAQs} title="Toyota Hiace Rental - Frequently Asked Questions" />
        </main>
    );
}
