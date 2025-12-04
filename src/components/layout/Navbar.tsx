'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { Menu, X } from 'lucide-react';
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
        { href: '/about', label: 'About Us' },
        { href: '/services', label: 'Services' },
        { href: '/fleet', label: 'Fleet' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav
            className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm border-b border-black/5 dark:border-white/10 py-3'
                : 'bg-white/75 dark:bg-black/40 backdrop-blur-md border-b border-black/5 dark:border-white/10 py-5'
                } ${isMenuOpen ? 'bg-background' : ''}`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative flex items-center">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/logo.png"
                                alt="Al Aqsa Transport"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col items-start space-y-1 lg:-space-y-0.5 ml-[90px] lg:ml-[120px]">
                            <span className="text-xl lg:text-2xl font-bold text-secondary leading-none">Al Aqsa</span>
                            <span className="text-sm lg:text-base font-bold text-primary dark:text-white tracking-[0.15em] uppercase leading-none">Transport</span>
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative text-sm font-medium transition-colors duration-300 hover:text-secondary py-1 group ${pathname === link.href ? 'text-secondary' : (scrolled ? 'text-foreground/80' : 'text-foreground/80 dark:text-white/90')
                                }`}
                        >
                            {link.label}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-secondary transform origin-left transition-transform duration-300 ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                }`} />
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <ThemeToggle />
                    <GlassButton href="/booking" variant="secondary" size="md" className="font-bold shadow-lg !bg-secondary !text-white !bg-none hover:!bg-primary hover:!text-primary-foreground transition-all duration-300">
                        Book Now
                    </GlassButton>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`lg:hidden p-2 transition-colors relative z-50 ${scrolled ? 'text-foreground hover:text-secondary' : 'text-foreground dark:text-white hover:text-secondary'}`}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Mobile Sidebar Drawer */}
            <div
                className={`fixed top-0 right-0 h-[100dvh] w-[85%] max-w-sm bg-background shadow-2xl z-40 transform transition-transform duration-300 lg:hidden border-l border-border flex flex-col ${isMenuOpen ? 'translate-x-0 visible' : 'translate-x-full invisible pointer-events-none'
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
                        <div className="flex flex-col items-start space-y-1">
                            <span className="text-xl font-bold text-secondary leading-none">Al Aqsa</span>
                            <span className="text-sm font-bold text-foreground dark:text-white tracking-[0.15em] uppercase leading-none">Transport</span>
                        </div>
                    </Link>
                    {/* Close button is handled by the main toggle button which is fixed z-50 */}
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`p-4 rounded-xl text-lg font-medium transition-all duration-200 flex items-center justify-between group ${pathname === link.href
                                ? 'bg-secondary/10 text-secondary'
                                : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            {link.label}
                            {pathname === link.href && (
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            )}
                        </Link>
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
