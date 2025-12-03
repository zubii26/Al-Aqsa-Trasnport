'use client';

import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    hoverEffect?: boolean;
}

export default function GlassCard({
    children,
    className = '',
    delay = 0,
    hoverEffect = true
}: GlassCardProps) {
    const { ref, isInView } = useScrollAnimation();

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        delay: delay,
                        ease: "easeOut"
                    }
                }
            }}
            className={`glass-card p-6 ${hoverEffect ? 'hover:scale-[1.02]' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
}
