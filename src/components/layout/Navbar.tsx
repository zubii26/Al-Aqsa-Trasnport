'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
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

    const links = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About Us' },
        { href: '/services', label: 'Services' },
        { href: '/fleet', label: 'Fleet' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${isMenuOpen ? styles.menuOpen : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="Al Aqsa Transport"
                        width={52}
                        height={52}
                        className={styles.logoImage}
                        priority
                    />
                    <div className={styles.logoTextContainer}>
                        <span className={styles.logoTextMain}>Al Aqsa</span>
                        <span className={styles.logoTextSub}>Transport</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className={styles.navLinks}>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.actions}>
                    <ThemeToggle />
                    <GlassButton href="/booking" variant="secondary" size="md">
                        Book Now
                    </GlassButton>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuBtn}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Backdrop */}
            <div
                className={`${styles.backdrop} ${isMenuOpen ? styles.show : ''}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Sidebar Drawer */}
            <div className={`${styles.mobileNav} ${isMenuOpen ? styles.show : ''}`}>
                <div className={styles.mobileNavHeader}>
                    <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
                        <Image
                            src="/logo.png"
                            alt="Al Aqsa Transport"
                            width={40}
                            height={40}
                            className={styles.logoImage}
                        />
                        <span className={styles.logoText} style={{ display: 'block', fontSize: '1.1rem' }}>
                            Al Aqsa Transport
                        </span>
                    </Link>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.mobileLinks}>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.mobileFooter}>
                    <div className={styles.mobileActions}>
                        <ThemeToggle />
                    </div>

                    <Link
                        href="/booking"
                        className="btn btn-secondary w-full text-center justify-center"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </nav>
    );
}
