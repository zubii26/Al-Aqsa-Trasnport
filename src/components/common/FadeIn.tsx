'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    scale?: boolean;
}

export default function FadeIn({ children, delay = 0, className = '', direction = 'up', scale = false }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: "-10%" }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    const getDirectionStyles = () => {
        switch (direction) {
            case 'up': return 'translate-y-10';
            case 'down': return '-translate-y-10';
            case 'left': return 'translate-x-10';
            case 'right': return '-translate-x-10';
            default: return '';
        }
    };

    const initialScale = scale ? 'scale-95' : 'scale-100';

    return (
        <div ref={ref} className={className}>
            <div
                className={cn(
                    "transition-all duration-1000 ease-out",
                    isVisible ? "opacity-100 translate-x-0 translate-y-0 scale-100" : `opacity-0 ${getDirectionStyles()} ${initialScale}`
                )}
                style={{ transitionDelay: `${delay}s` }}
            >
                {children}
            </div>
        </div>
    );
}
