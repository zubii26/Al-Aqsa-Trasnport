'use client';

import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    id?: string;
}

export default function AnimatedSection({
    children,
    className = '',
    delay = 0,
    id
}: AnimatedSectionProps) {
    const { ref, isInView } = useScrollAnimation({ margin: "-5%" });

    return (
        <motion.section
            id={id}
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: delay
                    }
                }
            }}
            className={cn("relative", className)}
        >
            {children}
        </motion.section>
    );
}
