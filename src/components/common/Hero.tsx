'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import styles from './Hero.module.css';
import GlassButton from '@/components/ui/GlassButton';
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
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Smooth spring physics for parallax
    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const yRange = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const y = useSpring(yRange, springConfig);
    const opacityRange = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const opacity = useSpring(opacityRange, springConfig);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <section ref={ref} className={styles.hero}>
            {/* Parallax Wrapper - Controls Scroll Movement */}
            <motion.div
                className="absolute inset-0 z-0 will-change-transform"
                style={{ y, opacity }}
            >
                {/* Ken Burns Wrapper - Controls Scale Animation */}
                <div className={styles.bgImage}>
                    <Image
                        src={bgImage}
                        alt={alt || "Umrah Transport Saudi Arabia Hero"}
                        fill
                        priority
                        quality={90}
                        className="object-cover"
                        sizes="100vw"
                    />
                </div>
            </motion.div>

            <div className={styles.overlay} />

            {/* Custom Background Elements (e.g. animated maps) - Rendered above overlay but below content */}
            {backgroundChildren && (
                <div className="absolute inset-0 z-[1] pointer-events-none">
                    {backgroundChildren}
                </div>
            )}

            <div className={`${styles.content} ${layout === 'two-column' ? styles.twoColumn : ''}`}>
                <motion.div
                    className={styles.textContent}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {breadcrumbs && (
                        <motion.div variants={itemVariants} className="mb-4">
                            {breadcrumbs}
                        </motion.div>
                    )}
                    {badge && (
                        <motion.div variants={itemVariants}>
                            <span className={styles.badge}>{badge}</span>
                        </motion.div>
                    )}
                    <motion.h1 className={styles.title} variants={itemVariants}>
                        {title}
                    </motion.h1>

                    <motion.div className={styles.subtitle} variants={itemVariants}>
                        {subtitle}
                    </motion.div>

                    <motion.div className={styles.buttons} variants={itemVariants}>
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
                    </motion.div>
                </motion.div>

                {children && (
                    <motion.div
                        className={styles.childrenContainer}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    >
                        <div className={styles.childrenWrapper}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </div>

            <div className={styles.scrollIndicator}>
                <ChevronDown size={32} />
            </div>
        </section>
    );
};

export default Hero;
