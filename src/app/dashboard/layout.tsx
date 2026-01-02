
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CalendarDays, User, LogOut, Menu, X } from 'lucide-react';
import Image from 'next/image';

import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import InstallPrompt from '@/components/driver/InstallPrompt'; // Reusing existing prompt or create new if needed specialized

export default function CustomerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Bookings', href: '/dashboard/bookings', icon: CalendarDays },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
    ];

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-16 lg:pb-0">
            {/* Mobile Header - Simplified for App Look */}
            <div className="lg:hidden bg-slate-900 px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Al Aqsa"
                        width={28}
                        height={28}
                        className="w-7 h-7"
                    />
                    <span className="text-white font-semibold text-lg">Al Aqsa</span>
                </div>
                {/* Optional: Add Notification Bell or Chat Icon here */}
            </div>

            <div className="flex h-screen overflow-hidden">
                {/* Desktop Sidebar (Hidden on Mobile) */}
                <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-slate-900 border-r border-slate-800">
                    <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950">
                        <Image
                            src="/logo.png"
                            alt="Al Aqsa"
                            width={32}
                            height={32}
                            className="w-8 h-8 mr-3"
                        />
                        <span className="text-white font-bold text-xl">Al Aqsa</span>
                    </div>

                    <nav className="flex flex-1 flex-col px-4 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-amber-600 text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}

                        <div className="pt-8 mt-auto">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                            >
                                <LogOut size={20} />
                                Sign out
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <main className="flex-1 lg:pl-64 flex flex-col h-full overflow-hidden">
                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
                        <div className="mx-auto max-w-5xl">
                            {children}
                        </div>
                        {/* Install Prompt for Mobile */}
                        <div className="lg:hidden mt-6">
                            <InstallPrompt appName="Install Client App" description="Book faster & track trips" />
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
}
