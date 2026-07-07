'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useScroll, useSpring, motion, AnimatePresence } from "framer-motion";

import { 
    Menu, X, ChevronDown, ChevronRight, 
    Car, Plane, MapPin, Building,
    Calendar, Compass, Navigation, Bus, Search, Users, Shield, TrainFront
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useMobileMenu } from '@/context/MobileMenuContext';
import GlassButton from '@/components/ui/GlassButton';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#D4AF37] z-[9999]"
    />
  );
}

export default function Navbar() {
    const pathname = usePathname();
    // Force rebuild
    const { isMenuOpen, setIsMenuOpen, toggleMenu } = useMobileMenu();
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    // Auto-close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname, setIsMenuOpen]);

    const links = [
        { href: '/', label: 'Home' },
        {
            href: '/routes',
            label: 'Routes',
            megaMenu: {
                main: [
                    { href: '/services/makkah-madinah-taxi', label: 'Makkah ⇄ Madinah', description: 'Direct express transport between the two holy cities', icon: Navigation },
                    { href: '/services/jeddah-airport-transfer', label: 'Jeddah Airport ⇄ Makkah', description: 'Comfortable arrivals from King Abdulaziz Airport', icon: Plane },
                    { href: '/services/madinah-airport-transfer', label: 'Madinah Airport ⇄ Hotel', description: 'Quick and easy transfers directly to your hotel', icon: Plane },
                    { href: '/services/train-station-transfer', label: 'Train Station ⇄ Hotel', description: 'Transfers to and from Haramain HSR stations', icon: TrainFront },
                ],
                sidebar: {
                    title: 'More Options',
                    items: [
                        { href: '/services/intercity-transfer', label: 'Intercity Transfers', icon: Car },
                        { href: '/routes/makkah-to-taif-taxi', label: 'Makkah ⇄ Taif', icon: MapPin },
                        { href: '/services/ziyarat-tours', label: 'Ziyarat Tours', icon: Compass },
                    ]
                }
            }
        },
        {
            href: '/services',
            label: 'Services',
            megaMenu: {
                main: [
                    { href: '/services/ramadan-transport', label: 'Ramadan 2026 Transport', description: 'Dedicated VIP services for the holy month', icon: Calendar },
                    { href: '/services/airport-transfers', label: 'Airport Transfers', description: 'Meet & greet services at all major terminals', icon: Plane },
                    { href: '/services/hotel-transfers', label: 'Hotel Transfers', description: 'Door-to-door convenience for your stay', icon: Building },
                ],
                sidebar: {
                    title: 'Resources',
                    items: [
                        { href: '/services/intercity-transfer', label: 'City to City', icon: MapPin },
                        { href: '/track-booking', label: 'Track Booking', icon: Search },
                    ]
                }
            }
        },
        {
            href: '/fleet',
            label: 'Fleet',
            megaMenu: {
                main: [
                    { href: '/fleet/mercedes-s-class', label: 'VIP Sedan', description: 'The pinnacle of luxury and VIP comfort', icon: Shield },
                    { href: '/fleet/gmc-yukon-at4', label: 'Luxury SUV', description: 'Premium 7-seater for family travel', icon: Users },
                    { href: '/fleet/hyundai-staria', label: 'Premium Family MPV', description: 'Futuristic and spacious group van', icon: Car },
                    { href: '/fleet/kia-k5', label: 'Economy Sedan', description: 'Modern and highly efficient sedan', icon: Car },
                ],
                sidebar: {
                    title: 'Standard & Large',
                    items: [
                        { href: '/fleet/toyota-camry', label: 'Business Sedan', icon: Car },
                        { href: '/fleet/mitsubishi-xpander', label: 'Compact Family MPV', icon: Car },
                        { href: '/fleet/hyundai-starex', label: 'Economy Family MPV', icon: Car },
                        { href: '/fleet/toyota-hiace', label: 'Executive Van', icon: Bus },
                        { href: '/fleet/toyota-coaster', label: 'Group Minibus', icon: Bus },
                        { href: '/fleet/large-bus-50-seater', label: 'Coach Bus', icon: Bus },
                    ]
                }
            }
        },
        { href: '/about', label: 'About Us' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact us' },
    ];

    return (
        <>
        <ScrollProgressBar />
        <nav
            className={`relative lg:sticky lg:top-0 left-0 right-0 z-50 transition-all duration-500 ${mounted && scrolled
                ? 'glass py-2 lg:py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]'
                : 'bg-white/50 dark:bg-black/20 backdrop-blur-xl border-b border-white/20 dark:border-white/10 py-4 lg:py-6 2xl:py-8 shadow-sm'
                } ${isMenuOpen ? 'bg-background' : ''}`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative flex items-center">
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${scrolled ? 'w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] lg:w-[80px] lg:h-[80px]' : 'w-[55px] h-[55px] sm:w-[80px] sm:h-[80px] lg:w-[100px] lg:h-[100px]'} group-hover:scale-105`}>
                            <Image
                                src="/logo.png"
                                alt="Al Aqsa Transport"
                                fill
                                className="object-contain"
                                priority
                                sizes="(max-width: 640px) 55px, (max-width: 1024px) 80px, 100px"
                            />
                        </div>
                        <div className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${scrolled ? 'ml-[55px] sm:ml-[70px] lg:ml-[90px]' : 'ml-[65px] sm:ml-[90px] lg:ml-[120px]'}`}>
                            <div className="flex flex-col items-end">
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary leading-none">Al Aqsa</span>
                                <span className="text-[0.55rem] sm:text-[0.65rem] lg:text-xs font-bold text-primary dark:text-white tracking-[0.15em] uppercase leading-none mt-1">Transport</span>
                            </div>
                            <div className="w-px h-6 sm:h-8 lg:h-10 bg-secondary/80"></div>
                            <div className="flex flex-col items-start">
                                <span className="font-[family-name:var(--font-reem-kufi)] text-base sm:text-lg lg:text-xl font-bold text-secondary leading-none">
                                    النقل المعتمر الأقصى
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden xl:flex items-center gap-8">
                    {links.map((link) => (
                        <div key={link.href} className="relative group">
                            {link.href === '#' ? (
                                <span
                                    className={`relative text-sm font-medium transition-colors duration-300 hover:text-secondary py-4 flex items-center gap-1 cursor-default ${scrolled ? 'text-foreground/80' : 'text-foreground/80 dark:text-white/90'}`}
                                >
                                    {link.label}
                                    {link.megaMenu && <ChevronDown strokeWidth={1.25} size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                                </span>
                            ) : (
                                <Link
                                    href={link.href}
                                    className={`relative text-sm transition-all duration-300 hover:text-secondary py-4 flex items-center gap-1  tracking-wide ${mounted && pathname === link.href ? 'text-secondary font-bold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : ((mounted && scrolled) ? 'text-foreground/80 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-foreground/90 dark:text-white/90 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]')
                                        }`}
                                >
                                    {link.label}
                                    {link.megaMenu && <ChevronDown strokeWidth={1.25} size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                                    <span className={`absolute bottom-2 left-0 w-full h-0.5 bg-secondary transform origin-left transition-transform duration-300 ${mounted && pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`} />
                                </Link>
                            )}

                            {/* Mega Menu Dropdown (Wrangle Style) */}
                            {link.megaMenu && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-3 group-hover:translate-y-0 w-[580px]">
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 flex overflow-hidden">
                                        
                                        {/* Main Column */}
                                        <div className="w-[340px] p-3 flex flex-col gap-1 bg-white dark:bg-slate-900">
                                            {link.megaMenu.main.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="group/item flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 p-2.5 rounded-lg shrink-0 mt-0.5 transition-colors group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/40">
                                                        <item.icon size={20} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-[13px] text-slate-500 dark:text-slate-400 leading-snug">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Sidebar Column */}
                                        <div className="w-[240px] bg-slate-50 dark:bg-slate-900/50 p-5 border-l border-slate-100 dark:border-slate-800">
                                            {link.megaMenu.sidebar.title && (
                                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                                                    <div className="w-3 h-[1px] bg-slate-300 dark:bg-slate-700"></div>
                                                    {link.megaMenu.sidebar.title}
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                {link.megaMenu.sidebar.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="group/sub flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                                                    >
                                                        <item.icon size={16} className="text-slate-400 dark:text-slate-500 group-hover/sub:text-slate-700 dark:group-hover/sub:text-slate-300 transition-colors" />
                                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover/sub:text-slate-900 dark:group-hover/sub:text-white transition-colors">
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>


                <div className="hidden xl:flex items-center gap-4">
                    {/* ThemeToggle hidden on desktop as requested */}
                    {/* <ThemeToggle /> */}

                    <Link
                        href="/booking"
                        className="btn-primary"
                    >
                        Book Now
                    </Link>
                </div>

                {/* Mobile Menu Button - Enhanced Touch Target (48x48) */}
                <button
                    className={`xl:hidden w-12 h-12 flex items-center justify-center transition-colors relative z-50 ${scrolled ? 'text-foreground hover:text-secondary' : 'text-foreground dark:text-white hover:text-secondary'}`}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu strokeWidth={1.5} size={28} />}
                </button>
            </div>
        </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.2 } }}
                        className="fixed inset-0 z-[100] flex flex-col ios-glass bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl xl:hidden"
                    >
                        {/* Header of the drawer */}
                        <div className="shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-slate-200/50 dark:border-slate-800/50">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="flex items-center gap-3"
                            >
                                <Link href="/" onClick={() => setIsMenuOpen(false)} className="relative w-[50px] h-[50px]">
                                    <Image
                                        src="/logo.png"
                                        alt="Al Aqsa Transport"
                                        fill
                                        className="object-contain"
                                        sizes="50px"
                                    />
                                </Link>
                                <div className="flex flex-col items-start">
                                    <span className="text-xl font-bold text-secondary leading-none">Al Aqsa</span>
                                    <span className="text-[0.65rem] font-bold text-foreground dark:text-white tracking-[0.15em] uppercase leading-none mt-1">Transport</span>
                                </div>
                            </motion.div>
                            
                            {/* Close button - Enhanced Touch Target */}
                            <button
                                className="w-12 h-12 flex items-center justify-center transition-colors text-foreground dark:text-white hover:text-secondary z-[101]"
                                onClick={toggleMenu}
                                aria-label="Close menu"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        {/* Main Links Area (Scrollable) */}
                        <div className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-8">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={{
                                    visible: {
                                        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
                                    },
                                    exit: {
                                        transition: { staggerChildren: 0.05, staggerDirection: -1 }
                                    }
                                }}
                                className="flex flex-col gap-6"
                            >
                                {links.map((link) => (
                                    <motion.div 
                                        key={link.href} 
                                        variants={{
                                            hidden: { opacity: 0, y: 30 },
                                            visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                                            exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
                                        }}
                                        className="flex flex-col"
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setTimeout(() => setIsMenuOpen(false), 150)}
                                            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground dark:text-white flex items-center justify-between group"
                                        >
                                            <span>{link.label}</span>
                                            {mounted && pathname === link.href && (
                                                <motion.span layoutId="activeDot" className="w-2.5 h-2.5 rounded-full bg-secondary" />
                                            )}
                                        </Link>

                                        {link.megaMenu && (
                                            <div className="mt-4 flex flex-col gap-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                                                {[...link.megaMenu.main, ...link.megaMenu.sidebar.items].map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setTimeout(() => setIsMenuOpen(false), 150)}
                                                        className="text-lg font-medium text-foreground/70 dark:text-slate-400 hover:text-secondary dark:hover:text-secondary transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Bottom Actions (Fixed at bottom) */}
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 300, damping: 28 }}
                            className="shrink-0 p-6 sm:p-8 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <span className="text-sm font-bold text-foreground dark:text-white uppercase tracking-wider">Appearance</span>
                                    <ThemeToggle />
                                </div>
                                <GlassButton
                                    href="/booking"
                                    variant="secondary"
                                    size="lg"
                                    className="w-full justify-center shadow-lg font-bold text-xl !bg-gradient-to-r !from-[#D4AF37] !to-[#B49126] !text-[#0A1F44] !border-none transition-transform duration-300 hover:scale-[1.02]"
                                    onClick={() => setTimeout(() => setIsMenuOpen(false), 150)}
                                >
                                    Book Now
                                </GlassButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
