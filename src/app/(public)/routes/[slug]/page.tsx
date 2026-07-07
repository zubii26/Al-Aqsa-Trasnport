import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import pricingData from '@/data/pricing.json';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { ArrowRight, Clock, MapPin, CheckCircle, Car, User, Navigation, Info } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';
import CustomerGallery from '@/components/home/CustomerGallery';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

// Generate static params for all routes in pricing.json
export async function generateStaticParams() {
    return pricingData.routes
        .filter((r) => r.slug)
        .map((route) => ({
            slug: route.slug,
        }));
}

type Props = {
    params: { slug: string };
};

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const route = pricingData.routes.find((r) => r.slug === params.slug);

    if (!route || !route.seo) {
        return {
            title: 'Route Not Found | Al Aqsa Transport',
        };
    }

    return {
        title: route.seo.title,
        description: route.seo.description,
        keywords: route.seo.keywords,
        alternates: {
            canonical: `https://www.alaqsaumrahtransport.com/routes/${params.slug}`,
        },
        openGraph: {
            title: route.seo.title,
            description: route.seo.description,
        }
    };
}

export default function RouteDetail({ params }: Props) {
    const route = pricingData.routes.find((r) => r.slug === params.slug);

    if (!route) {
        notFound();
    }

    // Get cheapest price for "Starting From"
    const prices = Object.values(route.customRates);
    const startingPrice = Math.min(...prices as number[]);

    const [origin, destination] = route.name.split(' to ');

    return (
        <main className="overflow-x-hidden pb-32 lg:pb-16 bg-slate-50 dark:bg-slate-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "serviceType": "Taxi Service",
                        "name": route.name,
                        "description": route.seo?.description,
                        "provider": {
                            "@type": "Organization",
                            "name": "Al Aqsa Umrah Transport"
                        },
                        "offers": {
                            "@type": "AggregateOffer",
                            "lowPrice": startingPrice,
                            "priceCurrency": "SAR",
                            "offerCount": prices.length
                        }
                    })
                }}
            />

            <Hero
                title={route.name}
                subtitle={`Premium VIP transport from ${origin || 'Start'} to ${destination || 'Destination'}. Clean cars, professional drivers, best rates.`}
                bgImage="/images/routes/jeddah-airport-hero-professional.webp"
                breadcrumbs={<Breadcrumbs />}
                layout="center"
            />

            {/* Visual Route Info Section */}
            <section className="py-12 -mt-16 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/40 dark:border-slate-800 max-w-5xl mx-auto">
                        
                        {/* Animated Route Visualizer */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3 shadow-inner">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white">{origin || "Pickup"}</h3>
                                <p className="text-sm text-slate-500">Starting Point</p>
                            </div>

                            <div className="flex-1 w-full md:w-auto flex items-center justify-center relative py-8 md:py-0">
                                <div className="absolute w-full border-t-2 border-dashed border-amber-300 dark:border-amber-700 top-1/2 -translate-y-1/2"></div>
                                <div className="w-10 h-10 bg-[#D4AF37] text-white rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-amber-500/30 animate-pulse">
                                    <Car size={20} />
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end text-center md:text-right flex-1">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 shadow-inner">
                                    <Navigation size={24} />
                                </div>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white">{destination || "Dropoff"}</h3>
                                <p className="text-sm text-slate-500">Destination</p>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                                <Clock className="text-secondary w-8 h-8 shrink-0" />
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Travel Time</h4>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{route.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                                <Navigation className="text-secondary w-8 h-8 shrink-0" />
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Distance</h4>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{route.distance}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                                <CheckCircle className="text-secondary w-8 h-8 shrink-0" />
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Availability</h4>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">24/7 Service</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Overview (SEO Rich Content) */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">About This Journey</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                        Experience a seamless and comfortable journey from <strong>{origin}</strong> to <strong>{destination}</strong>. 
                        Our private taxi service ensures you travel in premium, air-conditioned vehicles with professional drivers who know the routes perfectly. 
                        Whether you are traveling for Umrah, business, or leisure, we guarantee punctuality, safety, and transparent pricing with zero hidden fees.
                        Enjoy complimentary Wi-Fi and water on board.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200">✨ Meet & Greet Included</span>
                        <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200">❄️ Full AC Vehicles</span>
                        <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200">🧳 Luggage Assistance</span>
                    </div>
                </div>
            </section>

            {/* Pricing Table Section */}
            <section className="py-20 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Select Your Ride</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Available Vehicles & Rates</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Transparent pricing. No hidden fees. Choose the vehicle that perfectly fits your family size and luggage requirements.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pricingData.vehicles.map((vehicle) => {
                            const price = (route.customRates as any)[vehicle.id];
                            if (!price) return null;

                            return (
                                <FadeIn key={vehicle.id} scale>
                                    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.2)] transition-all duration-500 flex flex-col h-full relative">
                                        
                                        {/* Best Value Badge for GMC/Hiace */}
                                        {(vehicle.id === 'gmc' || vehicle.id === 'hiace') && (
                                            <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-red-500/30">
                                                Popular Choice
                                            </div>
                                        )}

                                        <div className="relative h-60 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900/50 p-6 flex items-center justify-center">
                                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm border border-slate-200 dark:border-slate-700 z-10 text-slate-800 dark:text-slate-200">
                                                <User size={16} className="text-[#D4AF37]" /> {vehicle.capacity}
                                            </div>
                                            <Image
                                                src={`/images/fleet/${vehicle.id}.webp`}
                                                alt={vehicle.name}
                                                fill
                                                className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl"
                                            />
                                        </div>
                                        
                                        <div className="p-8 flex flex-col flex-grow bg-white dark:bg-slate-900">
                                            <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{vehicle.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                                                {vehicle.seo?.description || `Comfortable ${vehicle.capacity} vehicle for your journey.`}
                                            </p>

                                            <div className="grid grid-cols-2 gap-y-3 mb-8 mt-auto">
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    <CheckCircle size={16} className="text-[#D4AF37]" /> Air Conditioned
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    <CheckCircle size={16} className="text-[#D4AF37]" /> Private Vehicle
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    <CheckCircle size={16} className="text-[#D4AF37]" /> Free WiFi
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    <CheckCircle size={16} className="text-[#D4AF37]" /> GPS Tracked
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                                <div>
                                                    <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-1">Total Price</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-3xl font-black text-slate-900 dark:text-white">{price}</span>
                                                        <span className="text-sm font-bold text-slate-500">SAR</span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/booking?route=${route.id}&vehicle=${vehicle.id}`}
                                                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] hover:text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md flex items-center gap-2 group/btn"
                                                >
                                                    Select <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <Info className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 opacity-80" />
                        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                        <p className="text-slate-500">Everything you need to know about this specific route.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-left font-bold text-slate-800 dark:text-slate-200">Does the price include all tolls and taxes?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                Yes, the price shown is the final total price per vehicle (not per person). It includes all road tolls, parking fees, fuel, and driver allowances. There are absolutely no hidden charges.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-left font-bold text-slate-800 dark:text-slate-200">Will the driver wait if my flight is delayed?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                Yes! We monitor all incoming flights. If your flight is delayed, we adjust the pickup time automatically at no extra cost. Your driver will be waiting for you when you land.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-left font-bold text-slate-800 dark:text-slate-200">Can we stop at the Miqat?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                Absolutely. If you are traveling from Madinah to Makkah, or Taif to Makkah, stopping at the designated Miqat for Ihram is included in the service at no additional cost. Just let your driver know.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-left font-bold text-slate-800 dark:text-slate-200">How do I find my driver at the airport?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                Our driver will wait at the arrivals hall holding a signboard with your name on it. We will also share the driver's WhatsApp number and car details with you 24 hours before your trip.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* Social Proof */}
            <CustomerGallery />

            {/* Sticky Mobile Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 lg:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Starting From</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{startingPrice} <span className="text-xs font-bold">SAR</span></p>
                </div>
                <Link 
                    href={`/booking?route=${route.id}`}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#B49126] text-[#0A1F44] px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-amber-500/30 flex items-center gap-2"
                >
                    Book Now <ArrowRight size={18} />
                </Link>
            </div>
        </main>
    );
}
