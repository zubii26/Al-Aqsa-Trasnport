import React from 'react';
import { Shield, Sparkles, UserCheck, CheckCircle, Clock } from 'lucide-react';
import Hero from '@/components/common/Hero';

export const metadata = {
    title: "Safety Standards | Al Aqsa Umrah Transport",
    description: "Your safety is our priority. Learn about our vehicle sanitation protocols, driver background checks, and commitment to safe Umrah transport.",
    openGraph: {
        title: "Safety Standards | Al Aqsa Umrah Transport",
        description: "Verified drivers, sanitized vehicles, and 24/7 support. Travel with peace of mind.",
    }
};

export default function SafetyPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <Hero
                title="Your Safety, Our Sacred Duty"
                subtitle="Comprehensive safety protocols for your peace of mind during Umrah"
                bgImage="/images/safety-hero.jpg" // Ensure you have a relevant image or use a placeholder
            />

            {/* Intro Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest text-sm mb-3 block">Safety First</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                        Traveling with Confidence
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        At Al Aqsa Umrah Transport, we understand that your journey is not just a trip, but an act of worship.
                        We implement rigorous safety standards so you can focus entirely on your spiritual experience, knowing you are in safe hands.
                    </p>
                </div>
            </section>

            {/* Core Safety Pillars */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Sanitation */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                <Sparkles size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Vehicle Sanitation</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Deep cleaning before every trip</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Sanitized seats and high-touch points</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Fresh air ventilation filters</span>
                                </li>
                            </ul>
                        </div>

                        {/* Drivers */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                                <UserCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Trusted Drivers</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Comprehensive background checks</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Licensed and experienced professionals</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Multilingual support (Arabic, English, Urdu)</span>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                                <Clock size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Reliable Support</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>24/7 Customer Service</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>GPS Tracking for all trips</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Flight delay monitoring</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* Trust Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": "Umrah Transport Safety Standards",
                        "provider": {
                            "@type": "Organization",
                            "name": "Al Aqsa Umrah Transport"
                        },
                        "serviceType": "Safe Transport",
                        "description": "Comprehensive safety protocols including vehicle sanitation and driver background checks for Umrah pilgrims."
                    })
                }}
            />
        </main>
    );
}
