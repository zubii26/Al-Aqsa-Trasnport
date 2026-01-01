'use client';

import Link from 'next/link';
import { CheckCircle2, Quote } from 'lucide-react';

export default function WelcomeSection() {

    const parseMarkdown = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
        return parts.map((part, index) => {
            if (part && part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
            }
            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
                return (
                    <Link href={linkMatch[2]} key={index} className="text-amber-600 dark:text-amber-500 font-semibold hover:underline decoration-2 underline-offset-2">
                        {linkMatch[1]}
                    </Link>
                );
            }
            return part;
        });
    };

    const whyChooseUsItems = [
        "**Reliable pilgrim transport** across Saudi Arabia",
        "**Specialized routes for Umrah pilgrims** (Makkah, Madinah, Jeddah)",
        "**Comfortable seating and air‑conditioned vehicles**",
        "**Affordable packages with transparent pricing**",
        "**Spiritual commitment to serving the Guests of Allah**"
    ];

    return (
        <section className="py-20 md:py-24 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest text-sm mb-3 block">
                        Welcome | أهلاً بك
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-playfair leading-tight">
                        Welcome to Al Aqsa Umrah Transport
                        <span className="block text-2xl md:text-4xl mt-3 font-reem-kufi text-amber-600">الأقصى لنقل المعتمرين</span>
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-300 font-light max-w-2xl mx-auto">
                        Your trusted partner in pilgrim travel across Saudi Arabia.
                        <span className="block font-arabic text-lg mt-1 text-slate-500">شريكك الموثوق في رحلات العمرة عبر المملكة العربية السعودية.</span>
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Intro Content */}
                    <div className="space-y-8">
                        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                            {parseMarkdown("We specialize in providing **safe, comfortable, and affordable [Umrah transport services](/services)** for pilgrims traveling to Makkah, Madinah, and beyond.")}
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-6 rounded-r-xl">
                            <p className="text-xl font-medium text-amber-900 dark:text-amber-100 italic mb-2">
                                &quot;Serving the Guests of Allah with comfort and care is our mission.&quot;
                            </p>
                            <p className="text-lg font-arabic text-amber-800 dark:text-amber-200" dir="rtl">
                                "خدمة ضيوف الرحمن راحة وأمانة."
                            </p>
                        </div>

                        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                            {parseMarkdown("Our fleet of [modern buses and vans](/fleet) ensures **stress‑free [Jeddah Airport transfers](/services/jeddah-airport-transfer) and [Makkah to Madinah journeys](/services/makkah-madinah-taxi)**. We provide professional drivers dedicated to hospitality and punctuality. Whether you are traveling solo, with family, or in large groups, Al Aqsa Umrah Transport offers **[customized packages](/booking)** to meet your needs.")}
                        </p>
                    </div>

                    {/* Features & Quote */}
                    <div className="space-y-8">
                        {/* Features Box */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-playfair flex justify-between items-center">
                                Why Choose Us?
                                <span className="font-reem-kufi text-xl text-amber-600">لماذا نحن؟</span>
                            </h3>
                            <ul className="space-y-4">
                                {whyChooseUsItems.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={20} />
                                        <span className="text-slate-700 dark:text-slate-300">{parseMarkdown(item)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Spiritual Quote */}
                        <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                            <Quote className="absolute top-4 right-4 text-white/10" size={80} />
                            <blockquote className="relative z-10 text-lg font-serif leading-relaxed opacity-90 mb-4">
                                “And proclaim to the people the Hajj; they will come to you on foot and on every lean camel; they will come from every distant pass.”
                            </blockquote>
                            <blockquote className="relative z-10 text-xl font-arabic leading-relaxed opacity-90 mb-4 text-right" dir="rtl">
                                "وَأَذِّن فِي النَّاسِ بِالْحَجِّ يَأْتُوكَ رِجَالًا وَعَلَىٰ كُلِّ ضَامِرٍ يَأْتِينَ مِن كُلِّ فَجٍّ عَمِيقٍ"
                            </blockquote>
                            <cite className="block text-amber-400 font-medium not-italic text-sm">– Qur’an (22:27) | سورة الحج</cite>

                            <p className="mt-6 pt-6 border-t border-white/10 text-slate-300 text-sm leading-relaxed">
                                {parseMarkdown("At Al Aqsa Umrah Transport, we believe that every journey to the holy cities should be filled with peace, comfort, and trust. That’s why we are committed to being the **leading Umrah transport company in Saudi Arabia**.")}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
