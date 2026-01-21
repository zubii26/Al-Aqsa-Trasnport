'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import styles from './Hero.module.css';
import GlassButton from '@/components/ui/GlassButton';
import FadeIn from '@/components/common/FadeIn';
import { trackConversion } from '@/lib/analytics';

interface HeroProps {
    title: string;
    subtitle: string | React.ReactNode;
    bgImage: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    showBookingForm?: boolean;
    children?: React.ReactNode;
    layout?: 'center' | 'two-column';
    badge?: string;
    backgroundChildren?: React.ReactNode;
    breadcrumbs?: React.ReactNode;
    alt?: string;
}

const Hero: React.FC<HeroProps> = ({
    title,
    subtitle,
    bgImage,
    ctaText,
    ctaLink,
    secondaryCtaText,
    secondaryCtaLink,
    children,
    layout = 'center',
    badge,
    backgroundChildren,
    breadcrumbs,
    alt
}) => {
    // Simplified Hero component without heavy animation hooks

    return (
        <section className={styles.hero}>
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className={styles.bgImage}>
                    <Image
                        src={bgImage}
                        alt={alt || "Umrah Transport Saudi Arabia Hero"}
                        fill
                        priority
                        quality={65} // Reduced quality for background optimization (was 85)
                        className="object-cover"
                        sizes="100vw"
                    />
                </div>
            </div>

            <div className={styles.overlay} />

            {/* Custom Background Elements */}
            {backgroundChildren && (
                <div className={`${styles.backgroundLayer} absolute inset-0 z-[1] pointer-events-none`}>
                    {backgroundChildren}
                </div>
            )}

            <div className={`${styles.content} ${layout === 'two-column' ? styles.twoColumn : ''} relative z-10`}>
                <div className={styles.textContent}>
                    {breadcrumbs && (
                        <FadeIn delay={0.1} direction="down" className="mb-4">
                            {breadcrumbs}
                        </FadeIn>
                    )}
                    {badge && (
                        <FadeIn delay={0.2} direction="down">
                            <span className={styles.badge}>{badge}</span>
                        </FadeIn>
                    )}
                    {/* Main Title */}
                    <FadeIn delay={0.3} direction="up">
                        <h1 className={styles.title}>
                            {title}
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.4} direction="up">
                        <div className={styles.subtitle}>
                            {subtitle}
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.5} direction="up">
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
                                    <ArrowRight size={20} />
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
                    <FadeIn
                        delay={0.6}
                        direction="up"
                        className={styles.childrenContainer}
                    >
                        <div className={styles.childrenWrapper}>
                            {children}
                        </div>
                    </FadeIn>
                )}
            </div>

            <div className={styles.scrollIndicator}>
                <ChevronDown size={32} />
            </div>
        </section>
    );
};

export default Hero;
