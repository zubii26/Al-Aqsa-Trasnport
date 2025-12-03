'use client';

import React, { useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import styles from './Hero.module.css';
import GlassButton from '@/components/ui/GlassButton';

interface HeroProps {
    title: string;
    subtitle: string;
    bgImage: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    showBookingForm?: boolean;
    children?: React.ReactNode;
    layout?: 'center' | 'two-column';
    badge?: string;
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
    badge
}) => {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
        hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <section ref={ref} className={styles.hero}>


            <motion.div
                className={styles.bgImage}
                style={{ backgroundImage: `url(${bgImage})`, y, opacity }}
            />
            <div className={styles.overlay} />
            <div className={`${styles.content} ${layout === 'two-column' ? styles.twoColumn : ''}`}>
                <motion.div
                    className={styles.textContent}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {badge && (
                        <motion.div variants={itemVariants}>
                            <span className={styles.badge}>{badge}</span>
                        </motion.div>
                    )}
                    <motion.h1 className={styles.title} variants={itemVariants}>
                        {title}
                    </motion.h1>

                    <motion.p className={styles.subtitle} variants={itemVariants}>
                        {subtitle}
                    </motion.p>

                    <motion.div className={styles.buttons} variants={itemVariants}>
                        {ctaText && ctaLink && (
                            <GlassButton href={ctaLink} variant="secondary" size="lg" className="gap-2 text-white">
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
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
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
