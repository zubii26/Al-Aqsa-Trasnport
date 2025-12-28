'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './FleetGallery.module.css';

const FLEET_IMAGES = [
    { src: '/images/fleet/gmc-yukon-hero-professional.png', alt: 'GMC Yukon VIP Transport', name: 'GMC Yukon 2025', badge: 'VIP Choice', capacity: '7 Pax' },
    { src: '/images/fleet/staria-hero-professional.png', alt: 'Hyundai Staria Luxury Van', name: 'Hyundai Staria', badge: 'Family Favorite', capacity: '7 Pax' },
    { src: '/images/fleet/camry-hero-professional.png', alt: 'Toyota Camry Sedan', name: 'Toyota Camry', badge: 'Best Value', capacity: '4 Pax' },
    { src: '/images/fleet/hiace-hero-professional.png', alt: 'Toyota Hiace Family Bus', name: 'Toyota Hiace', badge: 'Large Groups', capacity: '10 Pax' },
    { src: '/images/fleet/starex-hero-professional.png', alt: 'Hyundai H1 Starex', name: 'Hyundai H1', badge: 'Comfort', capacity: '7 Pax' },
];

export default function FleetGallery() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [userInteracted, setUserInteracted] = React.useState(false);

    // Auto-scroll logic
    React.useEffect(() => {
        if (userInteracted) return;

        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                // Check if we reached the end
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' }); // Loop back or just stop
                } else {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                }
            }
        }, 3000); // 3 seconds interval

        return () => clearInterval(interval);
    }, [userInteracted]);

    const handleInteraction = () => {
        if (!userInteracted) {
            setUserInteracted(true);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        handleInteraction();
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = direction === 'left' ? -400 : 400;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Tripled list for pseudo-infinite feel
    const displayImages = [...FLEET_IMAGES, ...FLEET_IMAGES, ...FLEET_IMAGES];

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-amber-900/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>

            <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
                <div>
                    <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-[0.2em] text-xs">
                        Curated For You
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 font-playfair">
                        A Vehicle for <span className="text-amber-600 dark:text-amber-500">Every Journey</span>
                    </h2>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300 shadow-sm"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300 shadow-sm"
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="relative w-full overflow-hidden">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-12 px-4 md:px-8 cursor-grab active:cursor-grabbing select-none"
                    style={{
                        scrollSnapType: 'x mandatory',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                    onMouseDown={(e) => {
                        handleInteraction();
                        const slider = scrollContainerRef.current;
                        if (!slider) return;
                        let isDown = true;
                        let startX = e.pageX - slider.offsetLeft;
                        let scrollLeft = slider.scrollLeft;

                        const onMouseLeave = () => {
                            isDown = false;
                            slider.classList.remove('active');
                        };

                        const onMouseUp = () => {
                            isDown = false;
                            slider.classList.remove('active');
                            window.removeEventListener('mouseup', onMouseUp);
                            window.removeEventListener('mousemove', onMouseMove);
                        };

                        const onMouseMove = (e: MouseEvent) => {
                            if (!isDown) return;
                            e.preventDefault();
                            const x = e.pageX - slider.offsetLeft;
                            const walk = (x - startX) * 2;
                            slider.scrollLeft = scrollLeft - walk;
                        };

                        window.addEventListener('mouseup', onMouseUp);
                        window.addEventListener('mousemove', onMouseMove);
                    }}
                    onTouchStart={handleInteraction}
                >
                    {displayImages.map((img, idx) => (
                        <div
                            key={`${img.name}-${idx}`}
                            className="relative w-[300px] h-[225px] md:w-[450px] md:h-[340px] rounded-2xl overflow-hidden group shrink-0 border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 scroll-snap-align-start"
                        >
                            {/* Badge */}
                            <div className="absolute top-4 left-4 z-20">
                                <span className="px-4 py-1.5 bg-amber-500 shadow-lg text-white text-xs font-bold uppercase tracking-wider rounded-md">
                                    {img.badge}
                                </span>
                            </div>

                            {/* Image */}
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 300px, 450px"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                draggable={false}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                            {/* Content Slide-Up */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-white font-bold text-2xl font-playfair mb-2">{img.name}</h3>
                                        <div className="flex items-center gap-3 text-slate-300 text-sm">
                                            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">Book Now</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                            <span className="text-amber-400 font-semibold">{img.capacity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <style jsx>{`
                    .overflow-x-auto::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </div>
        </section>
    );
}
