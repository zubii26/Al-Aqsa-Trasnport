'use client';

import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRef, useState, useEffect } from 'react';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    scale?: boolean;
    animate?: boolean; 
    triggerOnMount?: boolean; 
}

export default function FadeIn({ 
    children, 
    delay = 0, 
    className = '', 
    direction = 'up', 
    scale = false, 
    animate = false, 
    triggerOnMount = false 
}: FadeInProps) {
    if (!animate) {
        return <div className={className}>{children}</div>;
    }

    const getDirectionOffset = () => {
        switch (direction) {
            case 'up': return { y: 40 };
            case 'down': return { y: -40 };
            case 'left': return { x: 40 };
            case 'right': return { x: -40 };
            default: return {};
        }
    };

    const initialOffset = getDirectionOffset();
    const initialScale = scale ? { scale: 0.95 } : {};

    const initial = {
        opacity: 0,
        ...initialOffset,
        ...initialScale
    };

    const animateState = {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1
    };

    if (triggerOnMount) {
        return (
            <motion.div
                className={className}
                initial={initial}
                animate={animateState}
                transition={{
                    duration: 0.8,
                    delay: delay,
                    ease: [0.22, 1, 0.36, 1]
                }}
            >
                {children}
            </motion.div>
        );
    }

    // Scroll animation with stable lock
    const ref = useRef(null);
    const [hasFired, setHasFired] = useState(false);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView && !hasFired) {
            setHasFired(true);
        }
    }, [isInView, hasFired]);

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={initial}
            animate={hasFired || isInView ? animateState : initial}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.22, 1, 0.36, 1]
            }}
        >
            {children}
        </motion.div>
    );
}
