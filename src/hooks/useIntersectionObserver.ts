import { useEffect, useState, useRef } from 'react';

export const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
    const { threshold = 0.1, rootMargin = '0px' } = options;
    const [isIntersecting, setIsIntersecting] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            { threshold, rootMargin }
        );

        const currentElement = elementRef.current;

        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [threshold, rootMargin]);

    return [elementRef, isIntersecting];
};
