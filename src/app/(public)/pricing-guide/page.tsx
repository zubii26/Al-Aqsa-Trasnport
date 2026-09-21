// app/(public)/pricing-guide/page.tsx
// SERVER COMPONENT — no "use client". Renders fully in the initial HTML response
// so Googlebot indexes the real content directly (the booking page has had
// client-rendering indexation issues before; this page deliberately avoids that).
//
// All prices below are computed from src/data/pricing.json — the same route data
// the booking engine actually charges from — via src/lib/pricingRanges.ts.
// Nothing here is a hand-typed number. If a fare looks wrong, fix it in
// src/data/pricing.json and this page updates automatically.

import Link from 'next/link';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FAQSection from '@/components/services/FAQSection';
import SchemaInjector from '@/components/SchemaInjector';
import { VEHICLES } from '@/lib/pricing';
import { getVehiclePriceRange, formatPriceRange, getRoutePrice } from '@/lib/pricingRanges';
import { pricingGuideServiceSchema, pricingGuideFAQSchema } from '@/lib/schema/pricing-guide-schema';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export async function generateMetadata() {
    return {
        title: 'Umrah Transport Prices in Saudi Arabia | Al Aqsa Pricing Guide',
        description:
            'Real price ranges for Umrah taxi and private transport across Jeddah, Makkah, Madinah and Taif — by vehicle class and route. See exact live pricing on our booking page.',
        alternates: {
            canonical: 'https://www.alaqsaumrahtransport.com/pricing-guide',
        },
    };
}

// The vehicle classes shown in the comparison table (the most-requested tiers).
// Other classes (Economy Sedan, VIP Sedan, Compact Family MPV, Coach Bus) are
// still fully bookable — see the note below the table.
const TABLE_VEHICLE_IDS = ['camry', 'staria', 'gmc', 'hiace', 'coaster'];

// Key routes shown in the table. Route names must match src/data/pricing.json exactly.
const TABLE_ROUTES = [
    { name: 'Jeddah Airport to Jeddah Hotel', label: 'Jeddah Airport ⇄ Jeddah Hotel', meta: '30 km · 30 min' },
    { name: 'Jeddah Airport to Makkah Hotel', label: 'Jeddah Airport ⇄ Makkah', meta: '100 km · 1 hr 30 min' },
    { name: 'Jeddah Airport to Madinah Hotel', label: 'Jeddah Airport ⇄ Madinah', meta: '400 km · 4 hrs' },
    { name: 'Makkah Hotel to Madinah Hotel', label: 'Makkah ⇄ Madinah', meta: '450 km · 4 hrs 30 min' },
    { name: 'Madinah Airport to Madinah Hotel', label: 'Madinah Airport ⇄ Madinah Hotel', meta: '20 km · 25 min' },
    { name: 'Makkah Hotel to Taif and Return', label: 'Makkah ⇄ Taif (Round Trip)', meta: '180 km · 8-10 hrs' },
    { name: 'Makkah Hotel to Makkah Ziyarat', label: 'Makkah Ziyarat Tour', meta: '3-4 hrs' },
    { name: 'Madinah Hotel to Madinah Ziyarat', label: 'Madinah Ziyarat Tour', meta: '3-4 hrs' },
    { name: 'Makkah Hotel to Makkah Train Station', label: 'Makkah Hotel ⇄ Train Station', meta: '15 km · 20 min' },
];

export default function PricingGuidePage() {
    const tableVehicles = TABLE_VEHICLE_IDS
        .map((id) => VEHICLES.find((v) => v.id === id))
        .filter((v): v is (typeof VEHICLES)[number] => Boolean(v));

    return (
        <main className="bg-white dark:bg-[#060E1E]">
            <SchemaInjector schemas={[pricingGuideServiceSchema, pricingGuideFAQSchema]} />

            <Hero
                title="Umrah Transport Pricing Guide"
                subtitle="Real price ranges for Jeddah, Makkah, Madinah &amp; Taif — by vehicle and route."
                bgImage="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2000&auto=format&fit=crop"
                ctaText="See Your Exact Price"
                ctaLink="/booking"
                secondaryCtaText="Verify Our License"
                secondaryCtaLink="/safety"
                breadcrumbs={<Breadcrumbs />}
                alt="Umrah Transport Pricing Guide — Jeddah, Makkah, Madinah and Taif"
            />

            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                        Umrah and Hajj transport pricing across Saudi Arabia varies a lot between operators, and
                        it&apos;s rarely clear upfront what a fair price actually looks like. This page lists our
                        real, current fare ranges by vehicle class and route — the same figures our booking engine
                        prices from — so you know what to expect before you book.
                    </p>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        Al Aqsa Umrah Transport is Nusuk-registered and licensed to operate across Jeddah, Makkah,
                        Madinah and Taif.{' '}
                        <Link href="/safety" className="text-secondary hover:underline font-medium">
                            See how to verify this yourself →
                        </Link>
                    </p>
                </div>
            </section>

            {/* Why prices vary */}
            <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                        Why Prices Vary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                title: 'Route & Distance',
                                body: 'A short airport transfer costs far less than a 450km intercity run between Makkah and Madinah.',
                            },
                            {
                                title: 'Vehicle Class',
                                body: 'From an economy sedan to a group minibus — capacity and comfort level change the fare.',
                            },
                            {
                                title: 'Season & Demand',
                                body: 'Ramadan and Hajj periods carry higher demand pricing, published in advance — never a surprise at pickup.',
                            },
                            {
                                title: 'Day & Time',
                                body: 'Late-night arrivals, holidays, and one-way vs. round-trip bookings can shift the price slightly.',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                            >
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick-glance ranges by vehicle */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                        Typical Price Range by Vehicle
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {VEHICLES.map((vehicle) => {
                            const range = getVehiclePriceRange(vehicle.id);
                            return (
                                <div
                                    key={vehicle.id}
                                    className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col"
                                >
                                    <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                                        {vehicle.category}
                                    </span>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{vehicle.name}</h3>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                        {vehicle.capacity}
                                    </span>
                                    <div className="mt-auto text-xl font-bold text-secondary">
                                        {range ? `SAR ${formatPriceRange(range)}` : 'See booking page'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
                        These are typical ranges, not quotes — your exact price depends on the date, time, route,
                        and current demand.{' '}
                        <Link href="/booking" className="text-secondary hover:underline font-medium">
                            See it instantly on our booking page →
                        </Link>
                    </p>
                </div>
            </section>

            {/* Route x vehicle table */}
            <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                        Pricing by Route
                    </h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-sm text-left border-collapse min-w-[720px]">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800/60">
                                    <th className="p-4 font-semibold text-slate-900 dark:text-white">Route</th>
                                    {tableVehicles.map((v) => (
                                        <th key={v.id} className="p-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                                            {v.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TABLE_ROUTES.map((route, idx) => (
                                    <tr
                                        key={route.name}
                                        className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-900/50'}
                                    >
                                        <td className="p-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{route.label}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{route.meta}</div>
                                        </td>
                                        {tableVehicles.map((v) => {
                                            const price = getRoutePrice(route.name, v.id);
                                            return (
                                                <td key={v.id} className="p-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                    {price !== null ? `SAR ${price}` : '—'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
                        Economy Sedan, VIP Sedan, Compact Family MPV and Coach Bus options are also available for
                        every route above —{' '}
                        <Link href="/booking" className="text-secondary hover:underline font-medium">
                            see all vehicle classes and confirm your exact fare on the booking page →
                        </Link>
                    </p>
                </div>
            </section>

            {/* Trust callout */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-8 rounded-2xl border border-secondary/30 bg-secondary/5">
                        <ShieldCheck size={40} className="text-secondary flex-shrink-0" strokeWidth={1.5} />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Nusuk-Registered &amp; Licensed
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Every Al Aqsa vehicle is registered under the Nusuk system and licensed to operate in
                                Saudi Arabia. Before you book with any operator, it&apos;s worth knowing how to check this
                                yourself.
                            </p>
                            <Link
                                href="/safety"
                                className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
                            >
                                How to verify a licensed operator <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection
                title="Pricing Frequently Asked Questions"
                items={pricingGuideFAQSchema.mainEntity.map((q) => ({
                    question: q.name,
                    answer: q.acceptedAnswer.text,
                }))}
            />

            {/* Final CTA */}
            <section className="py-16 md:py-20 bg-slate-900 dark:bg-black">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Ready to see your exact price?
                    </h2>
                    <p className="text-slate-300 mb-8">
                        Select your route, date, and vehicle — the exact fare is confirmed before you pay.
                    </p>
                    <Link
                        href="/booking"
                        className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-slate-900 font-bold px-8 py-4 rounded-full transition-colors"
                    >
                        Get Your Exact Price <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
