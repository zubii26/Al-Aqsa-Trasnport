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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50 py-2'
                : 'bg-background/20 backdrop-blur-sm py-4'
                } ${isMenuOpen ? 'bg-background' : ''}`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/logo.png"
                            alt="Al Aqsa Transport"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold font-playfair text-secondary leading-none tracking-wide">Al Aqsa</span>
                        <span className={`text-xs font-medium tracking-[0.2em] uppercase ${scrolled ? 'text-foreground' : 'text-foreground/90'}`}>Transport</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative text-sm font-medium transition-colors duration-300 hover:text-secondary py-1 group ${pathname === link.href ? 'text-secondary' : 'text-foreground/80'
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
                    <GlassButton href="/booking" variant="secondary" size="md" className="font-bold shadow-lg hover:shadow-secondary/20">
                        Book Now
                    </GlassButton>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-foreground hover:text-secondary transition-colors"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <Menu size={28} />
                </button>
            </div>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Sidebar Drawer */}
            <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-background shadow-2xl z-50 transform transition-transform duration-300 lg:hidden border-l border-border ${isMenuOpen ? 'translate-x-0 visible' : 'translate-x-full invisible pointer-events-none'
                }`}>
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                        <div className="relative w-10 h-10">
                            <Image
                                src="/logo.png"
                                alt="Al Aqsa Transport"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-playfair font-bold text-lg text-secondary dark:text-white">Al Aqsa</span>
                    </Link>
                    <button
                        className="p-2 text-foreground/60 hover:text-destructive transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col p-6 gap-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`p-3 rounded-lg text-lg font-medium transition-all duration-200 ${pathname === link.href
                                ? 'bg-secondary/10 text-secondary'
                                : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50 bg-background/50">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm text-muted-foreground">Appearance</span>
                        <ThemeToggle />
                    </div>

                    <GlassButton
                        href="/booking"
                        variant="primary"
                        size="lg"
                        className="w-full justify-center shadow-lg font-bold"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Book Now
                    </GlassButton>
                </div>
            </div>
        </nav>
    );
}
