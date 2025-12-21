'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, CheckCircle } from 'lucide-react';

interface TeamTeaserProps {
    drivers?: any[];
}

export default function TeamTeaser({ drivers }: TeamTeaserProps) {
    // Show first 2 drivers as preview, filtering from props or falling back to empty array
    const previewDrivers = drivers ? drivers.slice(0, 2) : [];

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Text Content */}
                    <div className="lg:w-1/2">
                        <span className="text-amber-500 font-bold uppercase tracking-wider text-sm mb-2 block">Our Ambassadors</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                            Meet the Professionals Behind the Wheel
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            Your safety and peace of mind depend on who is in the driver’s seat.
                            We take pride in our team of <strong>licensed, multilingual, and respectful drivers</strong> who know the Holy Cities inside out.
                        </p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <CheckCircle className="text-green-500" size={20} />
                                <span>Rigorously vetted and background checked</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <CheckCircle className="text-green-500" size={20} />
                                <span>Fluent in Arabic, English, and Urdu</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <CheckCircle className="text-green-500" size={20} />
                                <span>Experts in Makkah & Madinah Ziyarat routes</span>
                            </li>
                        </ul>

                        <Link
                            href="/about/meet-our-drivers"
                            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg"
                        >
                            Meet All Drivers <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Image Preview */}
                    <div className="lg:w-1/2 flex gap-4">
                        {previewDrivers.map((driver, idx) => (
                            <div key={driver._id || driver.id || idx} className={`relative rounded-2xl overflow-hidden shadow-2xl ${idx === 1 ? 'mt-12' : ''}`}>
                                <div className="relative h-80 w-64">
                                    <Image src={driver.photo} alt={driver.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="font-bold text-lg">{driver.name}</div>
                                        <div className="text-xs text-slate-300">{driver.experience} Exp.</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
