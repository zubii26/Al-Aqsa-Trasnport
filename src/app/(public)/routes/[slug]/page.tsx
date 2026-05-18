import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import pricingData from '@/data/pricing.json';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { ArrowRight, Clock, MapPin, CheckCircle, Car, User } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

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
    const startingPrice = Math.min(...prices);

    return (
        <main className="overflow-x-hidden pb-16">
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
                subtitle={`Reliable transport from ${route.name.split(' to ')[0] || 'Start'} to ${route.name.split(' to ')[1] || 'Destination'}. Best rates guaranteed.`}
                bgImage="/images/routes/jeddah-airport-hero-professional.webp" // Fallback or dynamic based on slug logic
                breadcrumbs={<Breadcrumbs />}
                layout="center"
                ctaText="Book This Route"
                ctaLink={`/booking?route=${route.id}`}
            />

            {/* Route Info Cards */}
            <section className="py-12 bg-slate-50 dark:bg-slate-950 -mt-10 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="glass p-6 rounded-2xl shadow-xl border-t-4 border-amber-500 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Clock className="text-amber-500 w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            <div className="relative z-10">
                                <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Est. Time</h3>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{route.time}</p>
                            </div>
                        </div>
                        <div className="glass p-6 rounded-2xl shadow-xl border-t-4 border-amber-500 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <MapPin className="text-amber-500 w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            <div className="relative z-10">
                                <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Distance</h3>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{route.distance}</p>
                            </div>
                        </div>
                        <div className="glass p-6 rounded-2xl shadow-xl border-t-4 border-amber-500 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <CheckCircle className="text-amber-500 w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            <div className="relative z-10">
                                <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Availability</h3>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">24/7 Service</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Table Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-playfair mb-4">Available Vehicles & Rates</h2>
                        <p className="text-muted-foreground">Choose the vehicle that fits your group size and budget.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pricingData.vehicles.map((vehicle) => {
                            const price = (route.customRates as any)[vehicle.id];
                            if (!price) return null;

                            return (
                                <FadeIn key={vehicle.id} scale>
                                    <div className="group glass border border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                                        <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-6 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay"></div>
                                            <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm border border-white/20 z-10">
                                                <Car size={14} className="text-amber-500" /> {vehicle.capacity}
                                            </div>
                                            <Image
                                                src={`/images/fleet/${vehicle.id}.png`}
                                                alt={vehicle.name}
                                                fill
                                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 relative z-0"
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{vehicle.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">
                                                {vehicle.seo?.description || `Comfortable ${vehicle.capacity} vehicle for your journey.`}
                                            </p>

                                            <ul className="mb-6 space-y-2 mt-auto">
                                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                    <CheckCircle size={16} className="text-amber-500" /> Free WiFi & Water
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                    <CheckCircle size={16} className="text-amber-500" /> Best Price Guarantee
                                                </li>
                                            </ul>

                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <div>
                                                    <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider mb-1">One Way</span>
                                                    <span className="text-2xl font-black text-amber-600">{price} <span className="text-sm font-bold text-slate-500">SAR</span></span>
                                                </div>
                                                <Link
                                                    href={`/booking?route=${route.id}&vehicle=${vehicle.id}`}
                                                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-amber-500/30 flex items-center gap-2"
                                                >
                                                    Book Now <ArrowRight size={16} />
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

            {/* Why Choose Us */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 -z-20"></div>
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
                <div className="absolute -left-40 top-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
                
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-2 block">Our Guarantee</span>
                        <h2 className="text-3xl md:text-4xl font-bold font-playfair text-slate-900 dark:text-white">Why Book This Route With Us?</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <FadeIn delay={0.1}>
                            <div className="glass h-full p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-500 border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
                                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Fixed Prices</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No haggling or hidden fees. The price you see is exactly what you pay for the entire vehicle.</p>
                            </div>
                        </FadeIn>
                        
                        <FadeIn delay={0.2}>
                            <div className="glass h-full p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-500 border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
                                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                    <User className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Professional Drivers</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Our drivers know the Makkah-Madinah routes perfectly, ensuring a safe, smooth, and respectful journey.</p>
                            </div>
                        </FadeIn>
                        
                        <FadeIn delay={0.3}>
                            <div className="glass h-full p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-500 border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
                                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">24/7 Support</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Change of plans? Flight delayed? Our dedicated WhatsApp support team is always active and ready to help.</p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </main>
    );
}
