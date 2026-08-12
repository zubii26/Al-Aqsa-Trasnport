'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';
import { LayoutDashboard, Calendar, Car, DollarSign, Settings, LogOut, MapPin, MessageSquare, FileText, Users, Image as ImageIcon, PenTool, UserCheck, Navigation, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { logout } from '@/lib/auth';
import AdminThemeToggle from './AdminThemeToggle';
import { useAdminAuth, AdminAuthProvider } from '@/components/admin/AdminAuthProvider';

function AdminLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser } = useAdminAuth();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    useEffect(() => {
        // Close sidebar on route change (mobile)
        setIsSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        // Load collapsed state from local storage on mount
        const savedState = localStorage.getItem('adminSidebarCollapsed');
        if (savedState) {
            setIsDesktopCollapsed(savedState === 'true');
        }
    }, []);

    const toggleDesktopSidebar = () => {
        const newState = !isDesktopCollapsed;
        setIsDesktopCollapsed(newState);
        localStorage.setItem('adminSidebarCollapsed', String(newState));
    };

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!user) return null;

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        await logout();
        setUser(null);
        router.push('/admin/login');
    };

    const allLinks = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'manager'] },
        { href: '/admin/bookings', label: 'Bookings', icon: Calendar, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/routes', label: 'Routes', icon: MapPin, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/fleet', label: 'Fleet', icon: Car, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/pricing', label: 'Pricing', icon: DollarSign, roles: ['admin', 'manager'] },
        { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/blog', label: 'Blog', icon: FileText, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/content', label: 'Content', icon: PenTool, roles: ['admin', 'manager', 'operational_manager'] },
        { href: '/admin/marketing', label: 'Marketing', icon: MessageSquare, roles: ['admin', 'manager'] },
        { href: '/admin/users', label: 'Users', icon: Users, roles: ['admin', 'manager'] },
        { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['admin', 'manager'] },
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
            {/* Mobile Header / Hamburger */}
            <div className={styles.mobileHeader}>
                <div className="flex items-center gap-3">
                    <button
                        className={styles.hamburgerBtn}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label="Toggle Menu"
                    >
                        <div className="flex flex-col gap-1.5 w-6">
                            <span className={`block w-full h-0.5 bg-current transition-transform ${isSidebarOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block w-full h-0.5 bg-current transition-opacity ${isSidebarOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-full h-0.5 bg-current transition-transform ${isSidebarOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                    <span className={styles.mobileBrand}>Admin Panel</span>
                </div>

                {/* Mobile User Profile Trigger */}
                {user && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Overlay */}
            <div
                className={`${styles.mobileOverlay} ${isSidebarOpen ? styles.overlayVisible : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''} ${isDesktopCollapsed ? styles.sidebarCollapsed : ''}`}>
                <div className="flex items-center justify-between pt-6 pb-8 px-2 relative flex-shrink-0">
                    {!isDesktopCollapsed && (
                        <div className="flex flex-col items-start gap-1 py-2">
                            <div className="flex flex-col items-start text-left">
                                <span className="text-2xl font-bold text-secondary">Al Aqsa</span>
                                <span className="text-sm font-bold text-[var(--admin-fg)] tracking-[0.15em] uppercase">Transport</span>
                                <span className="text-sm font-bold text-secondary mt-1 font-[family-name:var(--font-reem-kufi)]">الأقصى لنقل المعتمرين</span>
                            </div>
                        </div>
                    )}
                    {isDesktopCollapsed && (
                        <div className="text-2xl font-bold text-secondary py-2 mx-auto">A</div>
                    )}
                    <button 
                        onClick={toggleDesktopSidebar} 
                        className={styles.collapseBtn}
                        aria-label="Toggle Sidebar"
                    >
                        {isDesktopCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
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
                                    title={link.label}
                                >
                                    <Icon size={20} className={isActive ? 'text-[#d4af37]' : ''} style={{ flexShrink: 0 }} />
                                    {!isDesktopCollapsed && <span>{link.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Sidebar footer area empty since profile moved to header */}
            </aside>
            <main className={styles.main}>
                {/* Desktop Global Header */}
                <div className="hidden md:flex justify-end w-full mb-8">
                    <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                        <AdminThemeToggle />
                        
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                        
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{getRoleDisplay(user.role)}</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white font-bold shadow-sm">
                                {user.name.charAt(0)}
                            </div>
                        </div>

                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                        
                        <button
                            onClick={handleLogout}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminAuthProvider>
            <AdminLayoutContent>
                {children}
            </AdminLayoutContent>
        </AdminAuthProvider>
    );
}
