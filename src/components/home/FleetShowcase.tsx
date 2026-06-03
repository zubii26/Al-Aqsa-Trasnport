'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, Briefcase, ArrowRight, LayoutGrid } from 'lucide-react';

const FLEET_DATA = [
    {
        id: 'mercedes-s-class',
        name: 'Mercedes-Benz S-Class',
        type: 'VIP Luxury Sedan',
        price: 'From SAR 800',
        capacity: '3 Pax',
        luggage: '3 Bags',
        images: [
            '/images/fleet/mercedes-s-class/mercedes-s-class-three-quarter-front.webp',
            '/images/fleet/mercedes-s-class/mercedes-s-class-2025-dashboared.jpeg',
            '/images/fleet/mercedes-s-class/mercedes-s-class-2025-seats.jpeg',
            '/images/fleet/mercedes-s-class/mercedes-s-class-2025-side-door.jpeg',
            '/images/fleet/mercedes-s-class/mercedes-s-class-rear-hero-view.webp'
        ],
        gradient: 'from-slate-100 to-white',
        url: '/fleet/mercedes-s-class',
        features: ['Premium Leather', 'Massage Seats', 'First Class Experience']
    },
    {
        id: 'gmc-yukon',
        name: 'GMC Yukon XL',
        type: 'VIP SUV',
        price: 'From SAR 500',
        capacity: '7 Pax',
        luggage: '5 Bags',
        images: [
            '/images/fleet/gmc-yukon/gmc-yukon-exterior-vip-umrah-taxi.webp',
            '/images/fleet/gmc-yukon/gmc-yukon-premium-dashboard-interior.webp',
            '/images/fleet/gmc-yukon/gmc-yukon-vip-passenger-seats-umrah.webp',
            '/images/fleet/gmc-yukon/gmc-yukon-side-profile-vip-umrah-taxi.webp',
            '/images/fleet/gmc-yukon/gmc-yukon-luggage-capacity-jeddah-airport.webp'
        ],
        gradient: 'from-amber-50 to-white',
        url: '/fleet/gmc-yukon-at4',
        features: ['VIP Leather Seats', 'Free WiFi', 'Extra Legroom']
    },
    {
        id: 'hyundai-staria',
        name: 'Hyundai Staria',
        type: 'Luxury Van',
        price: 'From SAR 450',
        capacity: '7 Pax',
        luggage: '4 Bags',
        images: [
            '/images/fleet/hyundai-staria/hyundai-staria-full-exterior.webp',
            '/images/fleet/hyundai-staria/hyundai-staria-dashboard-interior-view.webp',
            '/images/fleet/hyundai-staria/hyundai-staria-vip-leather-seat.webp',
            '/images/fleet/hyundai-staria/hyundai-staria-side-exterior-view.webp',
            '/images/fleet/hyundai-staria/hyundai-staria-rear-trunk-space.webp'
        ],
        gradient: 'from-blue-50 to-white',
        url: '/fleet/hyundai-staria',
        features: ['Panoramic Windows', 'Family Friendly', 'Spacious']
    },
    {
        id: 'kia-k5',
        name: 'Kia K5',
        type: 'Modern Sedan',
        price: 'From SAR 250',
        capacity: '4 Pax',
        luggage: '3 Bags',
        images: [
            '/images/fleet/kia-k5-hero.webp',
            '/images/fleet/kia.webp',
            '/images/fleet/kia.webp',
            '/images/fleet/kia-k5-hero.webp',
            '/images/fleet/kia-k5-hero.webp'
        ],
        gradient: 'from-zinc-50 to-white',
        url: '/fleet/kia-k5',
        features: ['Modern Design', 'Fuel Efficient', 'Comfortable']
    },
    {
        id: 'toyota-camry',
        name: 'Toyota Camry',
        type: 'Premium Sedan',
        price: 'From SAR 200',
        capacity: '4 Pax',
        luggage: '2 Bags',
        images: [
            '/images/fleet/camry/toyota-camry-vip-umrah-taxi-front-hood.webp',
            '/images/fleet/camry/toyota-camry-private-taxi-dashboard-interior.webp',
            '/images/fleet/camry/toyota-camry-makkah-madinah-taxi-premium-interior.webp',
            '/images/fleet/camry/toyota-camry-umrah-transport-side-door.webp',
            '/images/fleet/camry/toyota-camry-umrah-transport-rear-view.webp'
        ],
        gradient: 'from-emerald-50 to-white',
        url: '/fleet/toyota-camry',
        features: ['Comfortable Ride', 'Affordable', 'Perfect for Couples']
    },
    {
        id: 'mitsubishi-xpander',
        name: 'Mitsubishi Xpander',
        type: 'Family SUV',
        price: 'From SAR 300',
        capacity: '7 Pax',
        luggage: '4 Bags',
        images: [
            '/images/fleet/mitsubishi-xpander/mitsubishi-xpander-exterior-saudi-arabia.webp',
            '/images/fleet/mitsubishi-xpander/xpander-cabin-view-al-kiswah-cab-comfort.webp',
            '/images/fleet/mitsubishi-xpander/7-seater-car-rental-interior-al-kiswah-saudi.webp',
            '/images/fleet/mitsubishi-xpander/7-seater-cab-service-al-kiswah-xpander.webp',
            '/images/fleet/mitsubishi-xpander/al-kiswah-cab-mitsubishi-xpander-7-seater-saudi-arabia.webp'
        ],
        gradient: 'from-red-50 to-white',
        url: '/fleet/mitsubishi-xpander',
        features: ['7-Seater', 'Affordable Family Trip', 'Spacious']
    },
    {
        id: 'hyundai-h1',
        name: 'Hyundai H1',
        type: 'Family Van',
        price: 'From SAR 350',
        capacity: '7 Pax',
        luggage: '5 Bags',
        images: [
            '/images/fleet/starex-hero-professional.webp',
            '/images/fleet/starex-interior-360.webp',
            '/images/fleet/starex-interior-360.webp',
            '/images/fleet/starex-hero-professional.webp',
            '/images/fleet/starex-hero-professional.webp'
        ],
        gradient: 'from-indigo-50 to-white',
        url: '/fleet/hyundai-h1',
        features: ['Classic Van', 'Reliable', 'Large Trunk']
    },
    {
        id: 'toyota-hiace',
        name: 'Toyota Hiace',
        type: 'Commuter Bus',
        price: 'From SAR 600',
        capacity: '10 Pax',
        luggage: '8 Bags',
        images: [
            '/images/fleet/toyota-hiace/toyota-hiace-2026-lifestyle-cinematic-abha.jpeg',
            '/images/fleet/toyota-hiace/toyota-hiace-2026-interior-dashboard-main.jpeg',
            '/images/fleet/toyota-hiace/toyota-hiace-2026-interior-passenger-seats.jpeg',
            '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-side-profile.jpeg',
            '/images/fleet/toyota-hiace/toyota-hiace-2026-exterior-sliding-door-open.jpeg'
        ],
        gradient: 'from-slate-100 to-white',
        url: '/fleet/toyota-hiace',
        features: ['Group Travel', 'Ample Luggage', 'High Roof']
    },
    {
        id: 'toyota-coaster',
        name: 'Toyota Coaster',
        type: 'Mini Bus',
        price: 'From SAR 800',
        capacity: '22 Pax',
        luggage: '15 Bags',
        images: [
            '/images/fleet/coaster.webp',
            '/images/fleet/coaster.webp',
            '/images/fleet/coaster.webp',
            '/images/fleet/coaster.webp',
            '/images/fleet/coaster.webp'
        ],
        gradient: 'from-orange-50 to-white',
        url: '/fleet/toyota-coaster',
        features: ['Large Group', 'Comfortable Seats', 'Tour Ready']
    },
    {
        id: 'large-bus',
        name: '50-Seater Bus',
        type: 'Coach Bus',
        price: 'From SAR 1500',
        capacity: '50 Pax',
        luggage: '50 Bags',
        images: [
            '/images/fleet/large-bus-hero.webp',
            '/images/fleet/large-bus-hero.webp',
            '/images/fleet/large-bus-hero.webp',
            '/images/fleet/large-bus-hero.webp',
            '/images/fleet/large-bus-hero.webp'
        ],
        gradient: 'from-sky-50 to-white',
        url: '/fleet/50-seater-bus',
        features: ['Mass Transport', 'Air Conditioned', 'Professional Driver']
    }
];

export default function FleetShowcase() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [activeImageIndexes, setActiveImageIndexes] = useState<{ [key: string]: number }>({
        'gmc-yukon': 0,
        'hyundai-staria': 0,
        'toyota-camry': 0,
        'toyota-hiace': 0,
    });

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = FLEET_DATA.length - 1;
            if (nextIndex >= FLEET_DATA.length) nextIndex = 0;
            return nextIndex;
        });
    };

    useEffect(() => {
        if (isHovered) return; // Pause auto-slide on hover

        const timer = setInterval(() => {
            paginate(1);
        }, 6000);
        return () => clearInterval(timer);
    }, [currentIndex, isHovered]);

    const currentVehicle = FLEET_DATA[currentIndex];
    const activeImageIndex = activeImageIndexes[currentVehicle.id] || 0;

    return (
        <section className="py-20 md:py-32 bg-[#F8F9FA] relative overflow-hidden text-slate-900 border-b border-slate-200">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.02] pointer-events-none mix-blend-multiply" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
                <div className="text-center mb-16 md:mb-24">
                    <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4 flex items-center justify-center gap-2">
                        <LayoutGrid size={16} strokeWidth={1.25} /> Premium Fleet Gallery
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold  mb-6 text-slate-900 tracking-tight">
                        Travel in <span className="text-[#D4AF37]">Comfort & Style</span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Explore every detail of our top-tier vehicles designed to provide the ultimate comfort and safety for your spiritual journey.
                    </p>
                </div>

                <div 
                    className="relative w-full mx-auto"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* The Main Slider Container */}
                    <div className="relative h-[850px] sm:h-[800px] lg:h-[600px] w-full rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 group">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.3 },
                                    scale: { duration: 0.4 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);
                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1);
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1);
                                    }
                                }}
                                className="absolute inset-0 w-full h-full flex flex-col lg:flex-row"
                            >
                                {/* Background gradient inside the slide */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${currentVehicle.gradient} opacity-90 z-0`} />
                                
                                {/* Left Content: Text & Details */}
                                <div className="relative z-10 w-full lg:w-5/12 h-[45%] lg:h-full p-8 sm:p-10 lg:p-16 flex flex-col justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl">
                                    <div className="space-y-6 md:space-y-8 flex-1 flex flex-col justify-center">
                                        <div>
                                            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-[#D4AF37] font-semibold text-xs md:text-sm mb-4 tracking-wide shadow-sm">
                                                {currentVehicle.type}
                                            </div>
                                            <h3 className="text-4xl sm:text-5xl lg:text-6xl  font-bold text-slate-900 leading-tight">
                                                {currentVehicle.name}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex items-center gap-6 sm:gap-8 py-2">
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <div className="ios-icon-box p-2.5">
                                                    <Users className="text-[#D4AF37] w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.25} />
                                                </div>
                                                <span className="text-lg font-medium dark:text-slate-200">{currentVehicle.capacity}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <div className="ios-icon-box p-2.5">
                                                    <Briefcase className="text-[#D4AF37] w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.25} />
                                                </div>
                                                <span className="text-lg font-medium dark:text-slate-200">{currentVehicle.luggage}</span>
                                            </div>
                                        </div>

                                        <ul className="space-y-3 mb-6">
                                            {currentVehicle.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-4 text-base text-slate-600 font-medium">
                                                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 shadow-sm" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-slate-200/60 w-full mt-auto">
                                            <div>
                                                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest font-semibold mb-1">Starting Price</p>
                                                <p className="text-3xl sm:text-4xl font-bold text-slate-900">{currentVehicle.price}</p>
                                            </div>
                                            <Link href="/booking" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.4)] hover:-translate-y-1 bg-gradient-to-r from-[#D4AF37] to-[#B49126] text-[#0A1F44] border-none group relative overflow-hidden shrink-0 min-w-[140px] sm:min-w-[160px]">
                                                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap text-sm sm:text-base">
                                                    Book Now <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                                                </span>
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Content: Images */}
                                <div className="relative z-10 w-full lg:w-7/12 h-[55%] lg:h-full p-4 sm:p-6 lg:p-10 flex flex-col justify-between">
                                    {/* Main Image Viewport with Clickable Overlay */}
                                    <div 
                                        onClick={() => router.push('/booking')}
                                        className="relative w-full flex-1 rounded-[28px] overflow-hidden mb-6 group/image cursor-pointer shadow-lg ios-glass ios-glare ios-glare-card group"
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={`${currentVehicle.id}-img-${activeImageIndex}`}
                                                initial={{ opacity: 0, scale: 1.05 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                className="absolute inset-0"
                                            >
                                                <Image
                                                    src={currentVehicle.images[activeImageIndex]}
                                                    alt={`${currentVehicle.name} View ${activeImageIndex + 1}`}
                                                    fill
                                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                                    quality={90}
                                                    loading="lazy"
                                                    className="object-cover object-center w-full h-full transition-transform duration-700 group-hover/image:scale-105"
                                                />
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Hover Overlay indicating clickability */}
                                        <div className="absolute inset-0 bg-slate-900/0 group-hover/image:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover/image:opacity-100 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-900 dark:text-white px-6 py-3 rounded-full font-semibold shadow-xl flex items-center gap-2 border border-white/30 dark:border-white/10">
                                                Proceed to Booking <ArrowRight size={18} className="text-[#D4AF37]" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thumbnails Row */}
                                    <div className="flex items-center justify-start lg:justify-center gap-3 sm:gap-4 overflow-x-auto pb-2 custom-scrollbar shrink-0 w-full">
                                        {currentVehicle.images.map((imgSrc, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveImageIndexes(prev => ({ ...prev, [currentVehicle.id]: idx }));
                                                }}
                                                className={`relative w-20 h-14 sm:w-24 sm:h-16 lg:w-32 lg:h-20 rounded-xl overflow-hidden shrink-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-4 bg-white ${
                                                    activeImageIndex === idx 
                                                        ? 'ring-2 ring-[#D4AF37] scale-105 shadow-lg z-10 opacity-100' 
                                                        : 'opacity-60 hover:opacity-100 hover:scale-105 shadow-sm'
                                                }`}
                                            >
                                                <Image
                                                    src={imgSrc}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    fill
                                                    sizes="128px"
                                                    quality={75}
                                                    loading="lazy"
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons (Floating outside or inside edge) */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-white/80 backdrop-blur hover:bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                            onClick={() => paginate(-1)}
                            aria-label="Previous Vehicle"
                        >
                            <ChevronLeft size={28} className="mr-0.5" strokeWidth={1.5} />
                        </button>
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-white/80 backdrop-blur hover:bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                            onClick={() => paginate(1)}
                            aria-label="Next Vehicle"
                        >
                            <ChevronRight size={28} className="ml-0.5" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
                
                {/* Main Slide Indicators */}
                <div className="flex justify-center gap-3 mt-12">
                    {FLEET_DATA.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                            }}
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-4 ${
                                idx === currentIndex ? 'bg-[#D4AF37] w-12 sm:w-16 shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-slate-300 hover:bg-slate-400 w-3 sm:w-4'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
