import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Briefcase, Users, Wifi, LayoutGrid } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import FleetFeatureImage from '@/components/fleet/FleetFeatureImage';

export const metadata: Metadata = {
    title: "Hyundai Starex Umrah Taxi | Affordable 7-Seater Van Makkah",
    description: "Book Hyundai H1 Starex for Umrah. Spacious 7-passenger family van for Makkah to Madinah transfers, Jeddah Airport pickup, and Ziyarat. Reliable and budget-friendly.",
    keywords: [
        "Hyundai Starex Umrah Taxi",
        "Hyundai H1 Makkah to Madinah",
        "7 Seater Taxi Jeddah Airport",
        "Makkah to Madinah Van Price",
        "Cheap Family Taxi Makkah",
        "Hyundai Starex Rental Saudi Arabia",
        "Private Van for Ziyarat"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/fleet/hyundai-starex',
    }
};

const starexFAQs = [
    {
        question: "How many passengers fits in Hyundai H1 Starex?",
        answer: "The Hyundai H1 Starex is spacious and seats up to 7 passengers comfortably, making it an excellent choice for medium-sized families or groups."
    },
    {
        question: "Is there enough space for luggage?",
        answer: "Yes, the H1 has a generous cargo area that can easily accommodate 5-6 standard suitcases along with the passengers."
    },
    {
        question: "Is this vehicle suitable for long distance travel in Saudi Arabia?",
        answer: "Absolutely. The H1 is built for long journeys, offering good legroom, dual air conditioning, and a stable ride on highways between Jeddah, Makkah, and Madinah."
    },
];

export default async function HyundaiStarexPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Hyundai%20H1%20Starex%20for%20Umrah`;

    // Hyundai Starex ID: 692db09834f15bc89b45a5fa
    const starexId = '692db09834f15bc89b45a5fa';
    const starexImage = '/images/fleet/starex.png';

    return (
        <main className="overflow-x-hidden">
            <Hero
                title="Hyundai H1 Starex | Best Family Van for Umrah"
                subtitle="The practical choice for family travel between Jeddah, Makkah, and Madinah. Reliable, spacious, and perfect for groups."
                bgImage={starexImage}
                badge="Family Favorite"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
            />

            <FleetPricingGrid
                vehicleId={starexId}
                vehicleImage={starexImage}
                vehicleType="starex"
                title="Hyundai Starex Rates | Makkah & Madinah"
                subtitle="High-capacity comfort at an unbeatable price point. Perfect for families performing Umrah together."
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <FleetFeatureImage
                                src="/images/fleet/starex-feature.png"
                                alt="Hyundai H1 Starex Interior"
                                fallbackSrc={starexImage}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Value Choice
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Why Book Hyundai Starex for Makkah Travel?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                The Hyundai H1 (Starex) is the top choice for families performing Umrah. It offers excellent value for trips from Jeddah Airport to Makkah and
                                provides a comfortable ride for Ziyarat tours in the Holy Cities.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-teal-500" size={20} /> 7 Passengers
                                    </div>
                                    <p className="text-sm text-slate-500">Ample room for full families</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-teal-500" size={20} /> 6 Suitcases
                                    </div>
                                    <p className="text-sm text-slate-500">Large rear cargo capacity</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <LayoutGrid className="text-teal-500" size={20} /> High Roof
                                    </div>
                                    <p className="text-sm text-slate-500">Easy movement inside cabin</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Wifi className="text-teal-500" size={20} /> Dual AC
                                    </div>
                                    <p className="text-sm text-slate-500">Dedicated vents for rear seats</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-teal-500/20">
                                    Book Hyundai H1 Now <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Reliability for Every Trip</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Airport Transfers",
                                desc: "The perfect size for a family and all their luggage arriving at Jeddah or Madinah.",
                                icon: Briefcase
                            },
                            {
                                title: "Full Day Ziyarat",
                                desc: "Private, air-conditioned, and flexible for visiting holy sites at your own pace.",
                                icon: Star
                            },
                            {
                                title: "Intercity Highway",
                                desc: "Stable and comfortable for the long highway stretch between Makker and Madinah.",
                                icon: Shield
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-teal-500 transition-all hover:-translate-y-1">
                                <item.icon className="w-10 h-10 text-teal-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={starexFAQs} title="Hyundai H1 Starex - Frequently Asked Questions" />
        </main>
    );
}
