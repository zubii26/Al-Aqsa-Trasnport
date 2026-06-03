'use client';

import { Shield, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
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
                <FadeIn animate={true}>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-10  px-4 md:px-0">
                        Why Choose Al Aqsa for <span className="text-gradient-gold">Umrah Transport?</span>
                    </h2>
                </FadeIn>

                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 divide-y md:divide-y-0 divide-slate-200/50 dark:divide-white/5 bg-white/5 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none trust-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                >
                    <motion.div 
                        className="trust-card text-center group ios-glass rounded-none md:rounded-[32px] shadow-none md:shadow-xl py-10 md:py-8 px-6"
                        variants={{
                            hidden: { opacity: 0, y: 40, rotateX: 12 },
                            visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
                        }}
                    >
                        <div className="mb-6 inline-flex ios-icon-box w-16 h-16 text-amber-500 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-500/10">
                            <Shield size={32} strokeWidth={1.25} />
                        </div>
                        <h3 className="text-xl font-bold mb-1  tracking-tight">Safe & Trusted Pilgrim Transport</h3>
                        <p className="trust-card-arabic text-amber-500 font-bold font-reem-kufi mb-4">نقل آمن وموثوق</p>
                        <p className="text-muted-foreground leading-relaxed px-4 md:px-0">
                            Officially licensed chauffeurs & well-maintained vehicles. The most trusted choice for safe Makkah to Madinah travel.
                        </p>
                    </motion.div>

                    <motion.div 
                        className="trust-card text-center group ios-glass rounded-none md:rounded-[32px] shadow-none md:shadow-xl py-10 md:py-8 px-6"
                        variants={{
                            hidden: { opacity: 0, y: 40, rotateX: 12 },
                            visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
                        }}
                    >
                        <div className="mb-6 inline-flex ios-icon-box w-16 h-16 text-amber-500 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-500/10">
                            <Clock size={32} strokeWidth={1.25} />
                        </div>
                        <h3 className="text-xl font-bold mb-1  tracking-tight">Punctual Airport Transfers</h3>
                        <p className="trust-card-arabic text-amber-500 font-bold font-reem-kufi mb-4">دقة في المواعيد</p>
                        <p className="text-muted-foreground leading-relaxed px-4 md:px-0">
                            We track your flight to ensure timely pickups. Reliable Jeddah & Madinah Airport service available 24/7.
                        </p>
                    </motion.div>

                    <motion.div 
                        className="trust-card text-center group ios-glass rounded-none md:rounded-[32px] shadow-none md:shadow-xl py-10 md:py-8 px-6"
                        variants={{
                            hidden: { opacity: 0, y: 40, rotateX: 12 },
                            visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
                        }}
                    >
                        <div className="mb-6 inline-flex ios-icon-box w-16 h-16 text-amber-500 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-500/10">
                            <Heart size={32} strokeWidth={1.25} />
                        </div>
                        <h3 className="text-xl font-bold mb-1  tracking-tight">VIP Hospitality & Comfort</h3>
                        <p className="trust-card-arabic text-amber-500 font-bold font-reem-kufi mb-4">ضيافة وراحة VIP</p>
                        <p className="text-muted-foreground leading-relaxed px-4 md:px-0">
                            Spacious GMC Yukons & luxury vans for families. We serve the guests of Allah with utmost respect and premium comfort.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
}
