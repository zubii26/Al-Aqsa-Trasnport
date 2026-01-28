'use client';

import { Shield, Clock, Heart } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import FadeIn from '@/components/common/FadeIn';

export default function Features() {
    return (
        <AnimatedSection className="py-12 md:py-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <FadeIn>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 font-playfair px-4 md:px-0">
                        Why Choose Al Aqsa for <span className="text-gradient-gold">Umrah Transport?</span>
                    </h2>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[5px] md:gap-8 bg-white/5 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none dark:divide-white/5">
                    <GlassCard delay={0.1} className="text-center group hover:bg-white/5 border-none md:border border-white/10 dark:border-white/5 rounded-none md:rounded-3xl shadow-none md:shadow-lg py-10 md:py-6">
                        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-secondary group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300 shadow-lg shadow-secondary/5">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-1 font-playfair tracking-tight">Safe & Trusted Pilgrim Transport</h3>
                        <p className="text-amber-500 font-bold font-reem-kufi mb-4">نقل آمن وموثوق</p>
                        <p className="text-muted-foreground leading-relaxed px-4 md:px-0">
                            Officially licensed chauffeurs & well-maintained vehicles. The most trusted choice for safe Makkah to Madinah travel.
                        </p>
                    </GlassCard>

                    <GlassCard delay={0.2} className="text-center group hover:bg-white/5 border-none md:border border-white/10 dark:border-white/5 rounded-none md:rounded-3xl shadow-none md:shadow-lg py-10 md:py-6">
                        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-secondary group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300 shadow-lg shadow-secondary/5">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-1 font-playfair tracking-tight">Punctual Airport Transfers</h3>
                        <p className="text-amber-500 font-bold font-reem-kufi mb-4">دقة في المواعيد</p>
                        <p className="text-muted-foreground leading-relaxed px-4 md:px-0">
                            We track your flight to ensure timely pickups. Reliable Jeddah & Madinah Airport service available 24/7.
                        </p>
                    </GlassCard>

                    <GlassCard delay={0.3} className="text-center group hover:bg-white/5 border-none md:border border-white/10 dark:border-white/5 rounded-none md:rounded-3xl shadow-none md:shadow-lg py-10 md:py-6">
                        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-secondary group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300 shadow-lg shadow-secondary/5">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-1 font-playfair tracking-tight">VIP Hospitality & Comfort</h3>
                        <p className="text-amber-500 font-bold font-reem-kufi mb-4">ضيافة وراحة VIP</p>
                        <p className="text-muted-foreground leading-relaxed px-4 md:px-0">
                            Spacious GMC Yukons & luxury vans for families. We serve the guests of Allah with utmost respect and premium comfort.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </AnimatedSection>
    );
}
