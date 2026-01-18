'use strict';
import React from 'react';
import Image from 'next/image';
import { UserCheck, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function PassengerCare() {
    return (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest text-sm mb-3 block">Dedicated Service</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 font-playfair">
                            Tailored Care for <span className="text-amber-600 dark:text-amber-500">Every Guest</span>
                        </h2>
                        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-6 font-reem-kufi">
                            عناية خاصة لكل ضيف
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            We understand that every pilgrim's needs are unique. Our service is designed to provide specific, dignified support tailored to your personal requirements.
                        </p>
                    </div>
                </FadeIn>

                <div className="space-y-24">
                    {/* Solo Female Travelers */}
                    <FadeIn>
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                            <div className="w-full md:w-1/2 relative">
                                <div className="absolute inset-0 bg-pink-500/10 rounded-3xl transform rotate-3 scale-105" />
                                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/images/blog/solo-sister-travel.jpg"
                                        alt="Safe transport for female travelers"
                                        fill
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="bg-pink-500/20 backdrop-blur-md p-2 rounded-lg">
                                                <UserCheck size={24} className="text-pink-300" />
                                            </div>
                                            <span className="font-bold text-lg">Female Friendly Service</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2">
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-playfair">
                                    Trusted & Secure for <span className="text-pink-600 dark:text-pink-400">Solo Sisters</span>
                                </h3>
                                <h4 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-6 font-reem-kufi">أمان تام للأخوات</h4>
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                                    <span className="bg-pink-50 dark:bg-pink-900/30 text-pink-900 dark:text-pink-300 px-1 font-semibold">Is it safe? Absolutely.</span> We specialize in female-friendly transport where your security is our #1 priority.
                                    Our drivers are rigorously vetted professionals trained to respect your privacy and adhere to Islamic Etiquette (Adab).
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-pink-500 shrink-0 mt-1" />
                                        <span className="text-slate-700 dark:text-slate-300"><strong>24/7 Control Room Tracking</strong> for every second of your journey.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-pink-500 shrink-0 mt-1" />
                                        <span className="text-slate-700 dark:text-slate-300"><strong>Share Live Trip Link</strong> instantly with your family or Mahram.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-pink-500 shrink-0 mt-1" />
                                        <span className="text-slate-700 dark:text-slate-300">Direct coordination via WhatsApp for seamless meetings.</span>
                                    </li>
                                </ul>
                                <div className="mt-8">
                                    <a href="/blog/safe-solo-female-umrah-travel-guide" className="inline-flex items-center text-pink-600 dark:text-pink-400 font-bold hover:underline group">
                                        Read Our Sisters' Safety Guide <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                                    </a>
                                    <div className="mt-3">
                                        <a href="/blog/avoid-taxi-scams-jeddah-makkah-2025" className="text-sm text-slate-500 hover:text-pink-600 transition-colors flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                                            Essential Read: How to Avoid Airport Taxi Scams
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Families */}
                    <FadeIn>
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
                            <div className="w-full md:w-1/2 relative">
                                <div className="absolute inset-0 bg-blue-500/10 rounded-3xl transform -rotate-3 scale-105" />
                                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/images/blog/family-umrah-transport.png"
                                        alt="Spacious family transport for Umrah"
                                        fill
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="bg-blue-500/20 backdrop-blur-md p-2 rounded-lg">
                                                <Users size={24} className="text-blue-300" />
                                            </div>
                                            <span className="font-bold text-lg">Family & Kids First</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2">
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-playfair">
                                    Privacy & Space for <span className="text-blue-600 dark:text-blue-400">Families</span>
                                </h3>
                                <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-6 font-reem-kufi">خصوصية وراحة للعوائل</h4>
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 px-1 font-semibold">Travel Together, Comfortably.</span> We provide spacious GMC Yukons and H1 Vans so your entire family stays together.
                                    We create a calm environment for children and respect your family's private moments during the journey.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-blue-500 shrink-0 mt-1" />
                                        <span className="text-slate-700 dark:text-slate-300"><strong>Spacious Interiors</strong> with room for strollers and extra luggage.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-blue-500 shrink-0 mt-1" />
                                        <span className="text-slate-700 dark:text-slate-300"><strong>Flexible Stops</strong> for prayer, food, or children's needs.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-blue-500 shrink-0 mt-1" />
                                        <span className="text-slate-700 dark:text-slate-300">Baby seats available upon request (Pre-booking required).</span>
                                    </li>
                                </ul>
                                <div className="mt-8">
                                    <a href="/blog/stress-free-family-umrah-tips" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline group">
                                        Read Family Transport Tips <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                                    </a>
                                    <div className="mt-3">
                                        <a href="/blog/gmc-yukon-vs-toyota-hiace-umrah-transport" className="text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                            Guide: GMC Yukon vs Toyota Hiace - Which fits?
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Elderly Parents */}
                    <FadeIn>
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                            <div className="w-full md:w-1/2 relative">
                                <div className="absolute inset-0 bg-amber-500/10 rounded-3xl transform rotate-3 scale-105" />
                                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/images/blog/elderly-care-gmc.jpg"
                                        alt="Assisted transport for elderly pilgrims"
                                        fill
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="bg-amber-500/20 backdrop-blur-md p-2 rounded-lg">
                                                <HeartHandshake size={24} className="text-amber-300" />
                                            </div>
                                            <span className="font-bold text-lg">Gentle Care for Elders</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2">
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-playfair">
                                    Dignity & Patience for <span className="text-amber-600 dark:text-amber-500">Elderly Parents</span>
                                </h3>
                                <h4 className="text-xl font-bold text-amber-600 dark:text-amber-500 mb-6 font-reem-kufi">رعاية ورفق بكبار السن</h4>
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                                    <span className="bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 px-1 font-semibold">Serving them is our Honor.</span> We understand the physical challenges of Umrah.
                                    Our chauffeurs are trained to be extra patient, providing physical assistance at every step to ensure your parents perform their pilgrimage with ease.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-amber-500 shrink-0 mt-1" />
                                        <span className="text-slate-700 dark:text-slate-300"><strong>Door-to-Door Assistance</strong> with boarding and alighting.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-amber-500 shrink-0 mt-1" />
                                        <span className="text-slate-700 dark:text-slate-300"><strong>Closest Hotel Drop-offs</strong> to minimize walking distance.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-amber-500 shrink-0 mt-1" />
                                        <span className="text-slate-700 dark:text-slate-300">Gentle driving style to protect sensitive backs/joints.</span>
                                    </li>
                                </ul>
                                <div className="mt-8">
                                    <a href="/blog/accessible-umrah-elderly-transport" className="inline-flex items-center text-amber-600 dark:text-amber-500 font-bold hover:underline group">
                                        See Elderly Care Tips <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
