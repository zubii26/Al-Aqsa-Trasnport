'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';
import { LayoutDashboard, Calendar, Car, DollarSign, Settings, LogOut, MapPin, MessageSquare, FileText, Users, Image as ImageIcon, PenTool } from 'lucide-react';
import { logout } from '@/lib/auth';
import AdminThemeToggle from './AdminThemeToggle';
import AdminAutoLock from '@/components/admin/AdminAutoLock';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'operational_manager';
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
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/bookings', label: 'Bookings', icon: Calendar, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/routes', label: 'Routes', icon: MapPin, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/fleet', label: 'Fleet', icon: Car, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/pricing', label: 'Pricing', icon: DollarSign, roles: ['admin'] },
        { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/blog', label: 'Blog', icon: FileText, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/content', label: 'Content', icon: PenTool, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/users', label: 'Users', icon: Users, roles: ['admin'] },
        { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
    ];

    const userRole = user.role.toLowerCase();
    const visibleLinks = allLinks.filter(link => link.roles.includes(userRole));

    const getRoleDisplay = (role: string) => {
        switch (role) {
            case 'admin': return 'Boss Admin';
            case 'manager': return 'Manager';
            case 'operational_manager': return 'Operational Manager';
            default: return role;
        }
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <div className="flex flex-col items-start gap-1 py-2">
                        <div className="relative w-[150px] h-[150px]">
                            <Image
                                src="/logo.png"
                                alt="Al Aqsa Admin"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col items-start text-left ml-2">
                            <span className="text-2xl font-bold text-secondary">Al Aqsa</span>
                            <span className="text-sm font-bold text-[var(--admin-fg)] tracking-[0.15em] uppercase">Transport</span>
                        </div>
                    </div>
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
                        <div className={styles.userRole}>{getRoleDisplay(user.role)}</div>
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
            <AdminAutoLock />
        </div>
    );
}
