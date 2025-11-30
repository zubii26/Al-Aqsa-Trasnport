'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';
import { LayoutDashboard, Calendar, Car, DollarSign, Settings, LogOut, MapPin, Home, MessageSquare, FileText, Users } from 'lucide-react';
import { logout } from '@/lib/auth';
import AdminThemeToggle from './AdminThemeToggle';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER';
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (pathname === '/admin/login') {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();

                if (data.authenticated) {
                    setUser(data.user);
                } else {
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    // If on login page, render full screen without sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-500">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        await logout();
        router.push('/admin/login');
    };

    const allLinks = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER'] },
        { href: '/admin/bookings', label: 'Bookings', icon: Calendar, roles: ['ADMIN', 'MANAGER'] },
        { href: '/admin/routes', label: 'Routes', icon: MapPin, roles: ['ADMIN', 'MANAGER'] }, // Manager can view
        { href: '/admin/fleet', label: 'Fleet', icon: Car, roles: ['ADMIN', 'MANAGER'] }, // Manager can view
        { href: '/admin/pricing', label: 'Pricing', icon: DollarSign, roles: ['ADMIN'] },
        { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare, roles: ['ADMIN', 'MANAGER'] },
        { href: '/admin/blog', label: 'Blog', icon: FileText, roles: ['ADMIN', 'MANAGER'] },
        { href: '/admin/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
        { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['ADMIN'] },
    ];

    const visibleLinks = allLinks.filter(link => link.roles.includes(user.role));

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>A</div>
                    <span className={styles.logoText}>Al Aqsa Admin</span>
                </div>

                <nav className={styles.nav}>
                    <div className={styles.navSection}>
                        <div className={styles.navLabel}>Main Menu</div>
                        {visibleLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                                >
                                    <Icon size={20} className={isActive ? 'text-[#d4af37]' : ''} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className={styles.userProfile}>
                    <div className={styles.userAvatar}>
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userRole}>{user.role === 'ADMIN' ? 'Boss Admin' : 'Manager'}</div>
                    </div>
                    <AdminThemeToggle />
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
