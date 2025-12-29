import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Briefcase, Users, Fuel, MapPin } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import FleetFeatureImage from '@/components/fleet/FleetFeatureImage';

export const metadata: Metadata = {
    title: "Toyota Hiace Umrah Taxi | 10-12 Seater Bus Makkah",
    description: "Book Toyota Hiace for Umrah group transport. Reliable 10-12 seater bus for Makkah, Madinah, And Jeddah Airport transfers. Best commercial vehicle for large families.",
    keywords: [
        "Toyota Hiace Umrah Taxi",
        "Toyota Hiace Makkah to Madinah",
        "10 Seater Bus Jeddah Airport",
        "Group Umrah Transport Makkah",
        "Toyota Hiace Rental Saudi Arabia",
        "Cheap Umrah Bus",
        "Hiace Taxi Madinah"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/fleet/toyota-hiace',
    }
};

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

    // Toyota Hiace ID: 692db09834f15bc89b45a5fb
    const hiaceId = '692db09834f15bc89b45a5fb';
    const hiaceImage = '/images/fleet/hiace-hero-professional.png';

    return (
        <main className="overflow-x-hidden">
            <Hero
                title="Toyota Hiace 2024 | Group Umrah Transport"
                subtitle="The trusted choice for large families and groups traveling between Jeddah, Makkah, and Madinah. Reliable and spacious."
                bgImage={hiaceImage}
                badge="Group Choice"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
            />

            <FleetPricingGrid
                vehicleId={hiaceId}
                vehicleImage={hiaceImage}
                vehicleType="hiace"
                title="Toyota Hiace Rates | Group Transport Makkah"
                subtitle="Unbeatable value per person. Keep your whole group together safely and comfortably."
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <FleetFeatureImage
                                src="/images/fleet/hiace-feature.png"
                                alt="Toyota Hiace Bus"
                                fallbackSrc={hiaceImage}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Capacity Leader
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Why Choose Toyota Hiace for Group Umrah?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Keep your group united. The Toyota Hiace is perfect for families traveling from <Link href="/services/jeddah-airport-transfer" className="text-emerald-600 font-medium hover:underline">Jeddah Airport to Makkah</Link>.
                                Known for its reliability and powerful AC, it ensures a comfortable journey across Saudi Arabia for up to 12 passengers.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-emerald-500" size={20} /> 10 Passengers
                                    </div>
                                    <p className="text-sm text-slate-500">Perfect for 2-3 families</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-emerald-500" size={20} /> 10+ Bags
                                    </div>
                                    <p className="text-sm text-slate-500">Dedicated rear luggage area</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Shield className="text-emerald-500" size={20} /> Extreme Reliability
                                    </div>
                                    <p className="text-sm text-slate-500">Toyota's legendarily durable engine</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Fuel className="text-emerald-500" size={20} /> Fuel Efficient
                                    </div>
                                    <p className="text-sm text-slate-500">High efficiency for long distances</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/20">
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
                    <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Proven for Big Groups</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Extended Families",
                                desc: "No need to coordinate between multiple cars. Keep grandparents and kids together.",
                                icon: Users
                            },
                            {
                                title: "Budget Friendly",
                                desc: "Significant cost savings per person compared to booking multiple smaller vehicles.",
                                icon: Briefcase
                            },
                            {
                                title: "Reliability",
                                desc: "The vehicle that never stops. Perfect for tight schedules and long distances.",
                                icon: Shield
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-emerald-500 transition-all hover:-translate-y-1">
                                <item.icon className="w-10 h-10 text-emerald-500 mb-4" />
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

