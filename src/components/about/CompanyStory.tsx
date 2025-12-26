'use client';

import GlassCard from '@/components/ui/GlassCard';
import { Flag, Trophy, Heart, Briefcase } from 'lucide-react';

export default function CompanyStory() {

    const timeline = [
        {
            year: '2015',
            title: 'The Beginning',
            desc: 'Founded with a sincere intention to serve the guests of Allah with honor and dignity.',
            icon: Flag
        },
        {
            year: '2018',
            title: 'Growing Trust',
            desc: 'Expanded our fleet and network, earning the trust of thousands of pilgrims worldwide.',
            icon: Briefcase
        },
        {
            year: '2020',
            title: 'Resilience & Care',
            desc: 'Maintained the highest safety standards during challenging global times, putting health first.',
            icon: Heart
        },
        {
            year: '2024',
            title: 'Excellence in Motion',
            desc: 'Recognized as a premier transport provider, setting new standards for luxury and reliability.',
            icon: Trophy
        }
    ];

    return (
        <section className="py-20 md:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
            {/* Center Line Background */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-200 dark:via-amber-900 to-transparent -translate-x-1/2 hidden md:block" />

            <div className="container mx-auto px-4 relative">
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest text-sm mb-3 block">Our History</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                        Our Sacred Journey
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        From a humble beginning to a leading service provider, our path has always been guided by faith, dedication, and the privilege of serving pilgrims.
                    </p>
                </div>

                <div className="relative">
                    {/* Mobile Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 md:hidden" />

                    <div className="space-y-12 md:space-y-0">
                        {timeline.map((item, index) => (
                            <div key={item.year} className={`relative md:flex items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} group`}>

                                {/* Center Dot */}
                                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-amber-500 rounded-full border-4 border-white dark:border-slate-950 shadow-lg -translate-x-1/2 z-10 group-hover:scale-150 transition-transform duration-300" />

                                {/* Empty space for the other side */}
                                <div className="hidden md:block w-5/12" />

                                {/* Content Card */}
                                <div className="ml-16 md:ml-0 md:w-5/12">
                                    <GlassCard delay={index * 0.2} className="p-8 relative hover:-translate-y-2 transition-transform duration-500 border-l-4 border-l-amber-500">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl text-amber-600 dark:text-amber-400">
                                                <item.icon size={24} />
                                            </div>
                                            <span className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">{item.year}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{item.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </GlassCard>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
