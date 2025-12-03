import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollAnimation(options = {}) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-10%",
        ...options
    });

    return { ref, isInView };
}

export const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
    }
};

export const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};
