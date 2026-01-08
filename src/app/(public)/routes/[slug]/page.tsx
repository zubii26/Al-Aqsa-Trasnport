import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import pricingData from '@/data/pricing.json';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { ArrowRight, Clock, MapPin, CheckCircle, Car } from 'lucide-react';
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
            canonical: `https://alaqsaumrahtransport.com/routes/${params.slug}`,
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
                        "@type": "Product",
                        "name": route.name,
                        "description": route.seo?.description,
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
                bgImage="/images/routes/jeddah-airport-hero-professional.png" // Fallback or dynamic based on slug logic
                breadcrumbs={<Breadcrumbs />}
                layout="center"
                ctaText="Book This Route"
                ctaLink={`/booking?route=${route.id}`}
            />

            {/* Route Info Cards */}
            <section className="py-12 bg-slate-50 dark:bg-slate-950 -mt-10 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow border-t-4 border-amber-500 flex items-center gap-4">
                            <Clock className="text-amber-500 w-8 h-8" />
                            <div>
                                <h3 className="font-bold text-sm text-muted-foreground uppercase">Est. Time</h3>
                                <p className="text-lg font-bold">{route.time}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow border-t-4 border-amber-500 flex items-center gap-4">
                            <MapPin className="text-amber-500 w-8 h-8" />
                            <div>
                                <h3 className="font-bold text-sm text-muted-foreground uppercase">Distance</h3>
                                <p className="text-lg font-bold">{route.distance}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow border-t-4 border-amber-500 flex items-center gap-4">
                            <CheckCircle className="text-amber-500 w-8 h-8" />
                            <div>
                                <h3 className="font-bold text-sm text-muted-foreground uppercase">Availability</h3>
                                <p className="text-lg font-bold">24/7 Service</p>
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
                                    <div className="group bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <div className="relative h-48 bg-slate-100 dark:bg-slate-800 p-4">
                                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                                <Car size={12} /> {vehicle.capacity}
                                            </div>
                                            <Image
                                                src={`/images/fleet/${vehicle.id}.png`}
                                                alt={vehicle.name}
                                                fill
                                                className="object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-1">{vehicle.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {vehicle.seo?.description || `Comfortable ${vehicle.capacity} vehicle for your journey.`}
                                            </p>

                                            <ul className="mb-6 space-y-2">
                                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                    <CheckCircle size={14} className="text-green-500" /> Free WiFi
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                    <CheckCircle size={14} className="text-green-500" /> Best Price Guarantee
                                                </li>
                                            </ul>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                                <div>
                                                    <span className="text-xs text-muted-foreground block uppercase">One Way</span>
                                                    <span className="text-xl font-bold text-amber-600">{price} SAR</span>
                                                </div>
                                                <Link
                                                    href={`/booking?route=${route.id}&vehicle=${vehicle.id}`}
                                                    className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
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
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold font-playfair mb-8">Why Book This Route With Us?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Fixed Prices</h3>
                            <p className="text-muted-foreground">No haggling or hidden fees. The price you see is the price you pay.</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Professional Drivers</h3>
                            <p className="text-muted-foreground">Our drivers know the Makkah-Madinah routes perfectly and respect your privacy.</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                            <p className="text-muted-foreground">Change of plans? Flight delayed? Our WhatsApp support is always active.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
