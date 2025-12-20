import type { Metadata } from 'next';
import Hero from '@/components/common/Hero';
import dbConnect from '@/lib/mongodb';
import { Driver } from '@/models';
import DriverCard from '@/components/about/DriverCard';
import { Shield, Book, Heart } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// ... metadata ...

import { drivers as staticDrivers } from '@/data/drivers';

async function getDrivers() {
    await dbConnect();
    const drivers = await Driver.find({ isActive: true }).sort({ rating: -1 }).lean();

    if (!drivers || drivers.length === 0) {
        return staticDrivers;
    }

    return JSON.parse(JSON.stringify(drivers)); // Serialize for passing to components
}

export default async function MeetOurDriversPage() {
    const drivers = await getDrivers();
    return (
        <main className="overflow-x-hidden bg-slate-50 dark:bg-black min-h-screen">
            <Hero
                title="Meet Your Trusted Companions"
                subtitle="More than just drivers, we are your guides to a spiritual and safe journey in the Holy Cities."
                bgImage="/images/fleet/gmc-yukon-hero.png" // Reusing high quality image
                ctaText="Book a Ride"
                ctaLink="/booking"
                layout="center"
            />

            {/* Introduction */}
            <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">Professionalism & Adab</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                        Handpicked for Your Safety & Comfort
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        At Al Aqsa Transport, we understand that a driver can make or break your Umrah experience.
                        That is why we don't just hire drivers; we select <strong>ambassadors of hospitality</strong>.
                        Each member of our team is vetted for their driving skills, local knowledge, and respectful demeanor.
                    </p>
                </div>
            </section>

            {/* Drivers Grid */}
            <section className="py-16 md:py-24 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {drivers.map((driver: any, index: number) => (
                            <DriverCard key={driver._id || driver.id} driver={driver} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Pillars */}
            <section className="py-16 bg-slate-900 text-white relative">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Safety First</h3>
                            <p className="text-slate-300">All drivers undergo rigorous background checks and defensive driving training.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                                <Book size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Local Knowledge</h3>
                            <p className="text-slate-300">Experts in Makkah and Madinah routes, ensuring you reach the Haram on time.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Respectful Service</h3>
                            <p className="text-slate-300">Trained in the etiquette (Adab) of serving the guests of Allah.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back Button */}
            <div className="container mx-auto px-4 py-8">
                <Link href="/about" className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors">
                    <ArrowLeft size={18} />
                    Back to About Us
                </Link>
            </div>
        </main>
    );
}
