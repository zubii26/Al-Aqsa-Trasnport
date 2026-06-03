'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    scale?: boolean;
    animate?: boolean; // NEW: Toggle animation
}

export default function FadeIn({ children, delay = 0, className = '', direction = 'up', scale = false, animate = false }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    // If animate is false, it's visible immediately
    const [isVisible, setIsVisible] = useState(!animate);

    useEffect(() => {
        if (!animate) return; // Skip observer if we aren't animating

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0, rootMargin: "0px" }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [animate]);

    const getDirectionStyles = () => {
        if (!animate) return ''; // No offset if not animating
        switch (direction) {
            case 'up': return 'translate-y-10';
            case 'down': return '-translate-y-10';
            case 'left': return 'translate-x-10';
            case 'right': return '-translate-x-10';
            default: return '';
        }
    };

    const initialScale = (scale && animate) ? 'scale-95' : 'scale-100';

    return (
        <div ref={ref} className={className}>
            <div
                className={cn(
                    animate ? "transition-all duration-1000 ease-out" : "",
                    isVisible ? "opacity-100 translate-x-0 translate-y-0 scale-100" : `opacity-0 ${getDirectionStyles()} ${initialScale}`
                )}
                style={animate ? { transitionDelay: `${delay}s` } : {}}
            >
                {children}
            </div>
        </div>
    );
}
