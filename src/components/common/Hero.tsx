'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import styles from './Hero.module.css';
import GlassButton from '@/components/ui/GlassButton';
import FadeIn from '@/components/common/FadeIn';
import { trackConversion } from '@/lib/analytics';

interface HeroProps {
    title: string;
    subtitle: string | React.ReactNode;
    bgImage: string;
    bgImages?: string[]; // Optional array for horizontal slider
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    showBookingForm?: boolean;
    children?: React.ReactNode;
    layout?: 'center' | 'left' | 'two-column';
    badge?: string;
    backgroundChildren?: React.ReactNode;
    breadcrumbs?: React.ReactNode;
    alt?: string;
    bgImagePosition?: string;
}

const Hero: React.FC<HeroProps> = ({
    title,
    subtitle,
    bgImage,
    bgImages,
    ctaText,
    ctaLink,
    secondaryCtaText,
    secondaryCtaLink,
    children,
    layout = 'center',
    badge,
    backgroundChildren,
    breadcrumbs,
    alt,
    bgImagePosition
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start start", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    const pathname = usePathname();
    const isHome = pathname === '/' || pathname === '/ar';
    const heightClass = isHome ? 'h-screen' : styles.heroMedium;

    // Background Slider Logic
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (bgImages && bgImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % bgImages.length);
            }, 6000); // 6 seconds per slide
            return () => clearInterval(interval);
        }
    }, [bgImages]);

    return (
        <section ref={ref} className={`${styles.hero} ${heightClass} relative overflow-hidden`}>
            {/* Background Layer - Added will-change-transform for hardware acceleration to prevent lag */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 will-change-transform bg-black">
                {bgImages && bgImages.length > 0 ? (
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentIndex}
                            initial={{ x: '100%', opacity: 0.8 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0.8 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className={`${styles.bgImage} absolute inset-0`}
                        >
                            <Image
                                src={bgImages[currentIndex]}
                                alt={alt || `Umrah Transport Fleet ${currentIndex + 1}`}
                                fill
                                priority={currentIndex === 0}
                                fetchPriority={currentIndex === 0 ? "high" : "auto"}
                                quality={100}
                                className={`object-cover scale-110 ${bgImagePosition || 'object-center'}`}
                                sizes="100vw"
                            />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className={styles.bgImage}>
                        <Image
                            src={bgImage}
                            alt={alt || "Umrah Transport Saudi Arabia Hero"}
                            fill
                            priority
                            fetchPriority="high"
                            quality={100}
                            className={`object-cover ${bgImagePosition || 'object-center'}`}
                            sizes="100vw"
                        />
                    </div>
                )}
            </motion.div>

            <div className={styles.overlay} />

            {/* Custom Background Elements */}
            {backgroundChildren && (
                <div className={`${styles.backgroundLayer} absolute inset-0 z-[1] pointer-events-none will-change-transform`}>
                    {backgroundChildren}
                </div>
            )}

            <motion.div style={{ y: textY, opacity }} className={`${styles.content} ${layout === 'two-column' ? styles.twoColumn : ''} ${layout === 'left' ? styles.leftAlign : ''} relative z-10 will-change-transform`}>
                <div className={styles.textContent}>
                    {breadcrumbs && (
                        <FadeIn animate triggerOnMount delay={0.1} direction="down" className="mb-4">
                            {breadcrumbs}
                        </FadeIn>
                    )}

                    {badge && (
                        <FadeIn animate triggerOnMount delay={0.15} direction="up">
                            <span className={styles.badge}>{badge}</span>
                        </FadeIn>
                    )}
                    {/* Main Title */}
                    <FadeIn animate triggerOnMount delay={0.2} direction="up">
                        <h1 className={`${styles.title} text-secondary font-sans tracking-tight`} dangerouslySetInnerHTML={{ __html: title }} />
                    </FadeIn>

                    <FadeIn animate triggerOnMount delay={0.4} direction="up">
                        <div className={styles.subtitle}>
                            {subtitle}
                        </div>
                    </FadeIn>

                    <FadeIn animate triggerOnMount delay={0.5} direction="up">
                        <div className={styles.buttons}>
                            {ctaText && ctaLink && (
                                <GlassButton
                                    href={ctaLink}
                                    variant="secondary"
                                    size="lg"
                                    className="gap-2 text-white"
                                    onClick={() => trackConversion('whatsapp', `hero_${title.substring(0, 10)}`)}
                                >
                                    {ctaText}
                                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                </GlassButton>
                            )}

                            {secondaryCtaText && secondaryCtaLink && (
                                <GlassButton href={secondaryCtaLink} variant="outline" size="lg" className="text-white">
                                    {secondaryCtaText}
                                </GlassButton>
                            )}
                        </div>
                    </FadeIn>
                </div>

                {children && (
                    <FadeIn animate triggerOnMount
                        delay={0.6}
                        direction="up"
                        className={styles.childrenContainer}
                    >
                        <div className={styles.childrenWrapper}>
                            {children}
                        </div>
                    </FadeIn>
                )}
            </motion.div>

            <div className={styles.scrollIndicator}>
                <ChevronDown size={32} />
            </div>
        </section>
    );
};

export default Hero;
