import type { Metadata } from "next";
import SchemaInjector from '@/components/SchemaInjector';
import { jeddahAirportServiceSchema, jeddahAirportFAQSchema, jeddahAirportBreadcrumbSchema } from '@/lib/schema/jeddah-airport-transfer-schema';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import dynamic from 'next/dynamic';
const Features = dynamic(() => import('@/components/home/Features'));
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import QuickAnswerBox from '@/components/services/QuickAnswerBox';
import RelatedReading from '@/components/blog/RelatedReading';

import { getSettings } from '@/lib/settings-storage';

export const metadata: Metadata = {
    title: "Jeddah Airport to Makkah Taxi: Complete 2026 Guide",
    description: "Planning your Umrah? Discover distance, drive times, and 2026 taxi costs from Jeddah Airport (KAIA) to Makkah. Secure your 24/7 private transfer today.",
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/services/jeddah-airport-transfer',
    },
    openGraph: {
        title: "Jeddah Airport to Makkah Taxi: Complete 2026 Guide",
        description: "Planning your Umrah? Discover distance, drive times, and 2026 taxi costs from Jeddah Airport (KAIA) to Makkah. Secure your 24/7 private transfer today.",
        images: [{ url: '/images/routes/jeddah-airport-hero-professional.webp', width: 1200, height: 630, alt: 'Jeddah Airport VIP Transfer' }]
    }
};

const jeddahAirportFAQs = [
    {
        question: "Can you take a taxi directly to your hotel in Makkah?",
        answer: "Yes, our private taxis transport you directly from the Jeddah airport arrivals hall to the front lobby of your Makkah hotel. We navigate the local Makkah roads to ensure a seamless door-to-door experience, minimizing physical strain."
    },
    {
        question: "Are taxis available at KAIA late at night?",
        answer: "Yes, our private airport pickups operate on a strict 24/7 availability schedule. Whether your flight lands at 2:00 PM or 3:00 AM, your assigned driver will be actively monitoring your flight status and waiting in the arrivals area."
    },
    {
        question: "How much luggage can a standard taxi hold?",
        answer: "A standard sedan holds up to 3 passengers and 2 to 3 medium-sized bags. If your group carries large hard-shell suitcases, you must upgrade to an SUV or a van to ensure all luggage fits safely."
    },
    {
        question: "Do you need Saudi Riyals to pay for the taxi?",
        answer: "You do not strictly need Saudi Riyals if you book with us, as drivers accept major credit cards and Apple Pay via mobile terminals. However, we recommend withdrawing a small amount of cash (SAR 100–200) from airport ATMs for tipping."
    },
    {
        question: "Can you book a return trip or onward travel?",
        answer: <span>Yes, you can easily arrange your complete itinerary with our team, including your onward <Link href="/services/makkah-madinah-taxi" className="text-secondary hover:underline">Makkah to Madinah taxi</Link> once your Umrah rituals are complete. Booking your entire transport itinerary with a single operator simplifies communication.</span>
    }
];

export default async function JeddahAirportTransferPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

    return (
        <main className="overflow-x-hidden">
            <SchemaInjector schemas={[jeddahAirportServiceSchema, jeddahAirportFAQSchema, jeddahAirportBreadcrumbSchema]} />
            
            <Hero
                title="Jeddah Airport to Makkah Taxi — Complete 2026 Guide"
                subtitle="Start your Umrah with peace of mind. Professional drivers, 24/7 availability, and direct transfers to your Makkah hotel."
                bgImage="/images/routes/jeddah-airport-hero-professional.webp"
                ctaText="Book Arrival Transfer"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs hideJsonLd />}
            />

            {/* Quick Answer Block */}
            <section className="py-8 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            title="Quick Answer: KAIA to Makkah Transfer"
                            summary="A direct transfer from Jeddah Airport to Makkah covers a distance of approximately 80 km. The drive time by road is typically 70 to 90 minutes, depending on traffic conditions. A standard sedan taxi costs between SAR 150 and SAR 300. Airport pickups operate on a 24/7 availability schedule to accommodate flights arriving at all hours. Navigating King Abdulaziz International Airport (KAIA) can feel overwhelming after a long flight in Ihram. Securing your transport ahead of time removes the stress of negotiating fares with unverified operators. Knowing your exact vehicle and driver details before landing provides immediate peace of mind. This guide details everything you need to navigate the terminals and choose the best transport option."
                            features={[
                                { label: "Key takeaway", value: "A private taxi from Jeddah to Makkah covers ~80 km in 70–90 minutes, costs SAR 150–300, and is available 24/7." }
                            ]}
                            ctaText="Book Jeddah to Makkah Transfer"
                            ctaLink="/booking"
                        />
                    </div>
                </div>
            </section>

            {/* Main Content Sections */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-4xl prose dark:prose-invert prose-amber lg:prose-lg">
                    
                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-800 dark:text-slate-100">Which terminal at KAIA do Umrah pilgrims arrive at?</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        Umrah pilgrims arrive at one of three operational terminals at KAIA: Terminal 1, the North Terminal, or the seasonal Hajj & Umrah Terminal. Your exact arrival terminal depends entirely on your airline and travel date. Terminal 1 handles nearly all international full-service airlines year-round. This is where most Umrah travelers arrive outside the core Hajj season. The North Terminal primarily serves non-Saudia and low-cost international carriers. While smaller than Terminal 1, it remains fully operational for international arrivals. The seasonal Hajj & Umrah Terminal opens only during Hajj season and peak Umrah periods to manage massive crowd surges. This terminal features tent-style architecture designed to process large pilgrim groups efficiently. Knowing your arrival terminal is critical because meeting points for your driver differ significantly.
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-8 border-l-4 border-secondary pl-4 py-1">
                        Key takeaway: Your arrival will be at Terminal 1 for major airlines, the North Terminal for low-cost carriers, or the seasonal Hajj & Umrah Terminal during peak periods.
                    </p>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-800 dark:text-slate-100">How much does a Jeddah Airport to Makkah taxi cost in 2026?</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        A standard sedan taxi from KAIA to Makkah costs between SAR 150 and SAR 300. The exact price depends on the vehicle type, passenger count, and booking timing. Walk-up fares at airport taxi ranks fluctuate based on demand, especially during Ramadan. Booking a fixed-rate transfer guarantees your price and protects you from surge pricing or hidden luggage fees. 
                    </p>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left border-collapse border border-slate-200 dark:border-slate-700">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800">
                                    <th className="p-4 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">Vehicle Class</th>
                                    <th className="p-4 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">Passenger Capacity</th>
                                    <th className="p-4 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">Luggage Capacity</th>
                                    <th className="p-4 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">Estimated Cost (SAR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Standard Sedan</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Up to 3 passengers</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">2-3 medium bags</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">SAR 150–300</td>
                                </tr>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Family SUV</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Up to 6 passengers</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">4-5 large bags</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">[VERIFY: current SUV price]</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Group Van</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Up to 10 passengers</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">8-10 large bags</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">[VERIFY: current Van price]</td>
                                </tr>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">VIP Luxury</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Up to 3 passengers</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">2-3 medium bags</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">[VERIFY: current VIP price]</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        When traveling with family, selecting the right vehicle is more important than finding the absolute lowest price. Trying to fit four adults into a standard sedan often results in hiring a second vehicle at the airport.
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-8 border-l-4 border-secondary pl-4 py-1">
                        Key takeaway: Expect to pay SAR 150–300 for a standard sedan, but pre-book a vehicle sized correctly for your group to avoid unexpected costs.
                    </p>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-800 dark:text-slate-100">How long is the journey from Jeddah Airport to Makkah?</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        The drive time by road from Jeddah Airport to Makkah is 70 to 90 minutes. This accounts for the standard ~80 km distance along the Haramain Expressway under normal traffic conditions. Actual travel times vary based on operational factors. Traffic congestion is the primary variable. During Ramadan, on Fridays before Jumu'ah prayers, or during Islamic holidays, the highway experiences heavy vehicle volume. In these scenarios, the journey can stretch beyond two hours. Additionally, all vehicles entering Makkah must pass through security checkpoints at the Haram boundary. Verification of permits or volume delays at these checkpoints can add 15 to 30 minutes to your trip.
                    </p>

                    <blockquote className="my-8 p-6 bg-secondary/10 dark:bg-secondary/20 border-l-4 border-secondary rounded-r-lg italic text-slate-700 dark:text-slate-300">
                        "The Al Aqsa Umrah Transport team monitors local traffic patterns constantly. We often utilize alternative routes like the Old Makkah Road when the main expressway stalls. Always factor in an extra 45 minutes of buffer time if your arrival coincides with prayer times or major shifts in pilgrim movement."
                    </blockquote>

                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-8 border-l-4 border-secondary pl-4 py-1">
                        Key takeaway: Plan for a 70 to 90-minute road journey covering ~80 km, but allow extra time during peak seasons and Friday prayer times.
                    </p>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-800 dark:text-slate-100">Private taxi vs. shared shuttle vs. Haramain train — which should you choose?</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        You should choose a private taxi if you want door-to-door convenience, 24/7 availability, and zero waiting time. The Haramain High-Speed Railway has a station inside Terminal 1, connecting directly to Makkah and Madinah. The exact journey time by train from the airport is [VERIFY: current Haramain Jeddah–Makkah journey time]. While fast, it requires you to align with a fixed schedule, manage heavy luggage through stations, and hire a separate taxi from the Makkah station to your hotel. Shared shuttles offer lower prices but operate on rigid schedules and wait to fill all seats before departing. A private taxi eliminates these friction points. Your driver meets you at arrivals, handles your bags, and drives you directly to your hotel.
                    </p>
                    
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left border-collapse border border-slate-200 dark:border-slate-700">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800">
                                    <th className="p-4 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">Transport Method</th>
                                    <th className="p-4 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">Cost Profile</th>
                                    <th className="p-4 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">Door-to-Door?</th>
                                    <th className="p-4 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">Schedule</th>
                                    <th className="p-4 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">Luggage Handling</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Private Taxi</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">SAR 150–300</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Yes</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">24/7 on demand</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Driver assists</td>
                                </tr>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Haramain Train</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">[VERIFY: train ticket price]</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">No</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Fixed timetable</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Self-managed</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Shared Shuttle</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Lowest</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">No</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Waits for passengers</td>
                                    <td className="p-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Self-managed</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-8 border-l-4 border-secondary pl-4 py-1">
                        Key takeaway: A private taxi offers the only true 24/7 door-to-door service, while the train provides speed at the cost of luggage convenience.
                    </p>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-800 dark:text-slate-100">What should you expect when you land at KAIA as an Umrah pilgrim?</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        You should expect a highly structured arrival process focused on immigration clearance, luggage retrieval, and locating your transport. Once you disembark, you proceed to passport control. Biometric scanning is part of the immigration process. Have your passport, visa documentation, and Nusuk app ready. After clearing immigration, you enter the baggage claim hall. During peak Umrah periods, luggage delivery takes longer due to the volume of oversized bags and Zamzam containers.
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        Exit through customs into the main arrivals concourse to find ATMs, telecom kiosks selling SIM cards, and currency exchange counters. If you pre-booked a private transfer, your driver will be waiting in the designated meet-and-greet zone holding a sign with your name. They will assist with your trolley and guide you to the parking structure. Be prepared for a short walk, as security regulations restrict vehicles from parking directly against the terminal curb.
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-8 border-l-4 border-secondary pl-4 py-1">
                        Key takeaway: The arrival process involves immigration biometrics, baggage claim, and a short walk to the designated parking zones where your driver meets you.
                    </p>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-800 dark:text-slate-100">How do you pre-book your Jeddah to Makkah transfer with Al Aqsa?</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        You can <Link href="/booking" className="text-secondary hover:underline">book your airport transfer</Link> directly through our secure platform by providing your flight details, arrival date, and passenger count. Pre-booking eliminates uncertainty upon arrival. First, determine the correct vehicle size for your group. A standard sedan works for solo travelers, while you should reserve a <Link href="/fleet/gmc-yukon-at4" className="text-secondary hover:underline">GMC Yukon XL for families</Link> if you have multiple adults and large suitcases. Next, input your flight number into our booking system. This allows our dispatch team to track your flight in real-time. We automatically adjust your pickup time if your flight is delayed or arrives early.
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        Once confirmed, you receive an itinerary complete with your driver’s name, vehicle license plate, and a direct WhatsApp contact number. Connect to the airport Wi-Fi to message your driver, ensuring a seamless linkup in the arrivals hall. Pay your driver directly in cash or via card upon reaching your destination.
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-8 border-l-4 border-secondary pl-4 py-1">
                        Key takeaway: Pre-booking requires simply selecting your vehicle and providing flight details, giving you a dedicated driver and flight tracking at no extra upfront cost.
                    </p>
                </div>
            </section>

            {/* Fleet & Features Component Integration */}
            <FleetCarouselWrapper />
            <Features />

            {/* FAQ Section */}
            <FAQSection items={jeddahAirportFAQs} title="What are the most frequently asked questions about Jeddah to Makkah transfers?" />

            {/* Final CTA Section */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Are you ready to secure your direct transport to Makkah?</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        You can secure your direct transport today and eliminate the stress of finding a reliable taxi after a long international flight. Arriving for Umrah should be a spiritual and peaceful experience, not one plagued by logistical headaches at the taxi rank. By reserving your vehicle in advance, you guarantee your rate, secure the correct vehicle size for your family, and gain the peace of mind that a professional driver is tracking your flight. Our operational team handles the complexities of Jeddah traffic and Makkah navigation so you can focus entirely on your pilgrimage. Reach out to our dispatch team today.
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-8 border-l-4 border-secondary pl-4 py-1 max-w-2xl mx-auto text-left">
                        Key takeaway: Securing your transfer in advance guarantees your vehicle, locks in your price, and allows you to focus purely on your Umrah experience.
                    </p>
                    <Link href="/booking" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                        Book Your Airport Transfer <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            <RelatedReading title="Jeddah Airport Travel Guides" category="Airport Transfer" />
        </main>
    );
}
