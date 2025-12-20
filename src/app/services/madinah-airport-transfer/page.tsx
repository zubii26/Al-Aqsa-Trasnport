import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, Plane, Clock, Hotel, MapPin } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';

export const metadata: Metadata = {
    title: "Madinah Airport Taxi to Hotel | Prince Mohammad Bin Abdulaziz Airport Transfer",
    description: "Reliable taxi from Madinah Airport (MED) to Masjid Nabawi hotels. 24/7 airport pickup, meet & greet service, and fixed prices. Book your Madinah arrival transfer now.",
    keywords: [
        "Madinah Airport Taxi",
        "Madinah Airport to Masjid Nabawi",
        "Prince Mohammad Bin Abdulaziz Airport",
        "MED Airport Transfer",
        "Madinah Airport to Makkah Taxi",
        "Madinah Hotel Transfer",
        "Umrah Taxi Madinah"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/services/madinah-airport-transfer',
    }
};

const madinahAirportFAQs = [
    {
        question: "How far is Madinah Airport from Masjid Nabawi?",
        answer: "The airport is approximately 20-25 minutes (20 km) away from the central area (Markazia) where Masjid Nabawi and most hotels are located."
    },
    {
        question: "Will the driver wait if my flight is delayed?",
        answer: "Yes, we track all flights. Our driver will wait for you at the arrival hall, regardless of delays, at no extra cost."
    },
    {
        question: "Can I book a taxi from Madinah Airport directly to Makkah?",
        answer: "Yes, we offer direct transfers from Madinah Airport (MED) to Makkah hotels. The journey takes about 4.5 hours via the Hijrah Highway."
    },
];

export default async function MadinahAirportPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20need%20pickup%20from%20Madinah%20Airport`;

    return (
        <main className="overflow-x-hidden">
            <Hero
                title="Madinah Airport (MED) Transfers"
                subtitle="Start your visit to the Prophet's City with peace of mind. Reliable meet & greet service from Prince Mohammad Bin Abdulaziz Airport."
                bgImage="https://images.unsplash.com/photo-1570966455246-d8412aa6d25f?q=80&w=2000&auto=format&fit=crop"
                ctaText="Book Airport Pickup"
                ctaLink={whatsappLink}
                layout="center"
            />

            {/* Service Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Seamless Arrival in Madinah
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                Arriving for Umrah or Ziyarat should be stress-free. Avoid the hassle of haggling with local taxis.
                                Our professional drivers greet you at the arrival terminal with a name sign and assist with your luggage to your comfortable private vehicle.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full h-fit text-amber-500">
                                        <Plane size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1 text-slate-800 dark:text-white">Flight Tracking</h4>
                                        <p className="text-sm text-slate-500">We monitor your flight status to ensure we are there when you land.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full h-fit text-amber-500">
                                        <Hotel size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1 text-slate-800 dark:text-white">Hotel Drop-off</h4>
                                        <p className="text-sm text-slate-500">Direct transfer to your hotel lobby in the Markazia District (near Masjid Nabawi).</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full h-fit text-amber-500">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1 text-slate-800 dark:text-white">24/7 Availability</h4>
                                        <p className="text-sm text-slate-500">Late night or early morning flight? We are always available.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all">
                                    Book Transfer Now <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>

                        {/* Map / Route Visual Placeholder */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
                            <h3 className="text-xl font-bold mb-6 text-center">Popular Routes from Madinah Airport</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-amber-500" size={20} />
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">To Masjid Nabawi</p>
                                            <p className="text-xs text-slate-500">Central Hotels</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800 dark:text-white">25 Mins</p>
                                        <p className="text-xs text-slate-500">20 km</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-green-500" size={20} />
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">To Makkah Hotel</p>
                                            <p className="text-xs text-slate-500">Direct Transfer</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800 dark:text-white">4.5 Hours</p>
                                        <p className="text-xs text-slate-500">450 km</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-blue-500" size={20} />
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">To Masjid Quba</p>
                                            <p className="text-xs text-slate-500">Ziyarat Start</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800 dark:text-white">30 Mins</p>
                                        <p className="text-xs text-slate-500">25 km</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-xs text-slate-400 mt-6">
                                *Travel times may vary based on traffic conditions
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={madinahAirportFAQs} title="Madinah Airport Transfers - FAQ" />
        </main>
    );
}
