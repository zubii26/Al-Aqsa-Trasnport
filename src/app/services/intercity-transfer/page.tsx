import React from 'react';
import Hero from '@/components/common/Hero';
import FadeIn from '@/components/common/FadeIn';
import BookingFormWrapper from '@/components/home/BookingFormWrapper';
import RouteMap from '@/components/services/RouteMap';
import { Bus, Map, Coffee, Star } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Makkah to Madinah Taxi | Private Intercity Transport - Al Aqsa",
    description: "Comfortable Makkah to Madinah transfer service. Book private GMC Yukon or Hyundai H1 for your journey between the Two Holy Mosques. Scenic route, safe drivers.",
    keywords: ["Makkah to Madinah taxi", "Madinah to Makkah transport", "Haramain transport", "VIP intercity taxi", "Jeddah to Madinah taxi"]
};

export default function IntercityTransferPage() {
    return (
        <main>
            <Hero
                title="Makkah to Madinah Transport"
                subtitle="Travel between the Two Holy Mosques in complete comfort. A spiritual journey deserves a peaceful ride."
                bgImage="/images/intercity-hero.png"
                ctaText="Book Your Ride"
                ctaLink="/booking?service=transfer"
            />

            <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
                        <FadeIn>
                            <div className="prose dark:prose-invert max-w-none">
                                <h2 className="text-3xl font-bold font-playfair mb-6 text-secondary">
                                    The Sacred Journey Between Cities
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                    The journey from Makkah to Madinah (approx. 450km) is a significant part of your Umrah. We provide a **private taxi service** that turns this travel into a time of rest and reflection. Avoid the crowded buses and strict schedules; travel on your own terms.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                    Our drivers are experienced on the Hijrah Road, ensuring a smooth drive with optional stops at **miqats** or rest areas if requested. Choose our **VIP GMC Yukon** for maximum legroom or a **Korean Van** for larger families.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                            <Bus className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Modern Fleet</h4>
                                            <p className="text-sm text-muted-foreground">2024 Models available.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                            <Coffee className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Flexibility</h4>
                                            <p className="text-sm text-muted-foreground">Stop for prayer or rest anytime.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                            <Map className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Scenic Route</h4>
                                            <p className="text-sm text-muted-foreground">Safe journey via Hijrah Highway.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                            <Star className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">VIP Options</h4>
                                            <p className="text-sm text-muted-foreground">Privacy for families & ladies.</p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/booking?service=transfer" className="btn btn-primary">
                                    Book Intercity Taxi
                                </Link>
                            </div>
                        </FadeIn>

                        <div className="relative sticky top-24">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl transform rotate-1 opacity-10 blur-xl" />
                            <div className="relative">
                                <BookingFormWrapper title="Book Makkah-Madinah Taxi" subtitle="Best Rates Guaranteed" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Route Map Section - Premium Graphics */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
                <div className="container">
                    <RouteMap />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white dark:bg-slate-950">
                <div className="container max-w-4xl">
                    <FadeIn>
                        <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-2">How long is the drive from Makkah to Madinah?</h3>
                                <p className="text-muted-foreground">The drive typically takes about 4.5 hours (450 km) via the Hijrah Highway. We can stop at rest areas upon request.</p>
                            </div>
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-2">Can we stop at Miqat?</h3>
                                <p className="text-muted-foreground">Yes, absolutely. If you are travelling from Madinah to Makkah for Umrah, we will stop at Dhul Hulayfah (Abyar Ali) for you to enter Ihram.</p>
                            </div>
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-2">Is the fare fixed?</h3>
                                <p className="text-muted-foreground">Yes, the price we quote is the final price for the vehicle. There are no hidden per-person charges.</p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </main>
    );
}
