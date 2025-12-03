'use client';

import { Shield, Clock, Heart } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import FadeIn from '@/components/common/FadeIn';

export default function Features() {
    return (
        <AnimatedSection className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="container">
                <FadeIn>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-playfair">
                        Why Choose <span className="text-gradient-gold">Al Aqsa Transport?</span>
                    </h2>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <GlassCard delay={0.1} className="text-center group">
                        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-secondary group-hover:scale-110 transition-transform duration-300">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Safe & Reliable</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Licensed drivers and well-maintained vehicles ensuring your safety. The most reliable Umrah transport for your peace of mind.
                        </p>
                    </GlassCard>

                    <GlassCard delay={0.2} className="text-center group">
                        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-secondary group-hover:scale-110 transition-transform duration-300">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">24/7 Umrah Taxi Service</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We value your time. Our 24/7 service tracks your flight to ensure timely pickups for your Jeddah Airport to Makkah transfer.
                        </p>
                    </GlassCard>

                    <GlassCard delay={0.3} className="text-center group">
                        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-secondary group-hover:scale-110 transition-transform duration-300">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Family Umrah Taxi</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Spacious vehicles for the whole family. Dedicated to serving the guests of Allah with the utmost respect, care, and hospitality.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </AnimatedSection>
    );
}
