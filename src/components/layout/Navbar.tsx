'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useMenu } from '@/context/MenuContext';
import GlassButton from '@/components/ui/GlassButton';

export default function Navbar() {
    const pathname = usePathname();
    const { isMenuOpen, setIsMenuOpen, toggleMenu } = useMenu();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
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
            children: [
                { href: '/services/makkah-madinah-taxi', label: 'Makkah ⇄ Madinah' },
                { href: '/services/jeddah-airport-transfer', label: 'Jeddah Airport ⇄ Makkah' },
                { href: '/services/madinah-airport-transfer', label: 'Madinah Airport ⇄ Hotel' },
                { href: '/services/intercity-transfer', label: 'Jeddah Airport ⇄ Madinah' },
                { href: '/services/ziyarat-tours', label: 'Ziyarat Tours (City Tours)' },
            ]
        },
        {
            href: '/services',
            label: 'Services',
            children: [
                { href: '/services/airport-transfers', label: 'Airport Transfer (General)' },
                { href: '/services/intercity-transfer', label: 'Intercity Transfer' },
                { href: '/services/hotel-transfers', label: 'Hotel Transfer' },
                { href: '/track-booking', label: 'Track Booking' },
            ]
        },
        {
            href: '/fleet',
            label: 'Fleet',
            children: [
                { href: '/fleet/gmc-yukon-at4', label: 'GMC Yukon XL' },
                { href: '/fleet/hyundai-staria', label: 'Hyundai Staria' },
                { href: '/fleet/hyundai-starex', label: 'Hyundai H1 Starex' },
                { href: '/fleet/toyota-hiace', label: 'Toyota Hiace' },
                { href: '/fleet/toyota-camry', label: 'Toyota Camry' },
            ]
        },
        {
            href: '/about',
            label: 'About Us',
            children: [
                { href: '/about', label: 'Company Profile' },
                { href: '/about/meet-our-drivers', label: 'Meet Our Drivers' },
            ]
        },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact us' },
    ];

    return (
        <nav
            className={`relative lg:sticky lg:top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'glass py-2 lg:py-3'
                : 'bg-white/75 dark:bg-black/40 backdrop-blur-md border-b border-black/5 dark:border-white/10 py-4 lg:py-6 2xl:py-8'
                } ${isMenuOpen ? 'bg-background' : ''}`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative flex items-center">
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${scrolled ? 'w-[60px] h-[60px] lg:w-[80px] lg:h-[80px]' : 'w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]'} group-hover:scale-105`}>
                            <Image
                                src="/logo.png"
                                alt="Al Aqsa Transport"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className={`flex items-center gap-3 transition-all duration-300 ${scrolled ? 'ml-[70px] lg:ml-[90px]' : 'ml-[90px] lg:ml-[120px]'}`}>
                            <div className="flex flex-col items-end">
                                <span className="text-xl lg:text-2xl font-bold text-secondary leading-none">Al Aqsa</span>
                                <span className="text-[0.65rem] lg:text-xs font-bold text-primary dark:text-white tracking-[0.15em] uppercase leading-none mt-1">Transport</span>
                            </div>
                            <div className="w-px h-8 lg:h-10 bg-secondary/80"></div>
                            <div className="flex flex-col items-start">
                                <span className="font-[family-name:var(--font-reem-kufi)] text-lg lg:text-xl font-bold text-secondary leading-none">
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
                                    {link.children && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                                </span>
                            ) : (
                                <Link
                                    href={link.href}
                                    className={`relative text-sm font-medium transition-colors duration-300 hover:text-secondary py-4 flex items-center gap-1 ${pathname === link.href ? 'text-secondary' : (scrolled ? 'text-foreground/80' : 'text-foreground/80 dark:text-white/90')
                                        }`}
                                >
                                    {link.label}
                                    {link.children && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                                    <span className={`absolute bottom-2 left-0 w-full h-0.5 bg-secondary transform origin-left transition-transform duration-300 ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`} />
                                </Link>
                            )}

                            {/* Dropdown Menu */}
                            {link.children && (
                                <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-black/5 dark:border-white/10 overflow-hidden p-2">
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:text-secondary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="hidden xl:flex items-center gap-4">
                    {/* ThemeToggle hidden on desktop as requested */}
                    {/* <ThemeToggle /> */}
                    <GlassButton href="/booking" variant="secondary" size="md" className="font-bold shadow-lg !bg-secondary !text-white !bg-none hover:!bg-primary hover:!text-primary-foreground transition-all duration-300">
                        Book Now
                    </GlassButton>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`xl:hidden p-2 transition-colors relative z-50 ${scrolled ? 'text-foreground hover:text-secondary' : 'text-foreground dark:text-white hover:text-secondary'}`}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 xl:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Mobile Sidebar Drawer */}
            <div
                className={`fixed top-0 right-0 h-[100dvh] w-[85%] max-w-sm bg-background shadow-2xl z-40 transform transition-transform duration-300 xl:hidden border-l border-border flex flex-col ${isMenuOpen ? 'translate-x-0 visible' : 'translate-x-full invisible pointer-events-none'
                    }`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
            >
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-[80px] h-[80px]">
                            <Image
                                src="/logo.png"
                                alt="Al Aqsa Transport"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-xl font-bold text-secondary leading-none">Al Aqsa</span>
                                <span className="text-[0.65rem] font-bold text-foreground dark:text-white tracking-[0.15em] uppercase leading-none mt-1">Transport</span>
                            </div>
                            <div className="w-px h-8 bg-secondary/80"></div>
                            <div className="flex flex-col items-start">
                                <span className="font-[family-name:var(--font-reem-kufi)] text-lg font-bold text-secondary leading-none">
                                    النقل المعتمر الأقصى
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* Close button is handled by the main toggle button which is fixed z-50 */}
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    {links.map((link) => (
                        <div key={link.href} className="flex flex-col">
                            <Link
                                href={link.href}
                                className={`p-4 rounded-xl text-lg font-medium transition-all duration-200 flex items-center justify-between group ${pathname === link.href
                                    ? 'bg-secondary/10 text-secondary'
                                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                                    }`}
                                onClick={() => !link.children && setIsMenuOpen(false)}
                            >
                                <span className="flex items-center gap-2">
                                    {link.label}
                                </span>
                                {pathname === link.href && !link.children && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                )}
                            </Link>

                            {/* Mobile Submenu - Always indent for simplicity */}
                            {link.children && (
                                <div className="pl-4 flex flex-col gap-1 mt-1 border-l-2 border-secondary/10 ml-4">
                                    {link.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className={`p-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-between ${pathname === child.href
                                                ? 'text-secondary bg-secondary/5'
                                                : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-border/50 bg-muted/30 mt-auto">
                    <div className="flex items-center justify-between mb-6 bg-background/50 p-4 rounded-xl border border-border/50">
                        <span className="text-sm font-medium text-foreground/80">Appearance</span>
                        <ThemeToggle />
                    </div>

                    <GlassButton
                        href="/booking"
                        variant="secondary"
                        size="lg"
                        className="w-full justify-center shadow-lg font-bold text-lg !bg-secondary !text-white !bg-none hover:!bg-primary hover:!text-primary-foreground transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Book Now
                    </GlassButton>
                </div>
            </div>
        </nav>
    );
}
