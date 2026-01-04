'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, PlusCircle, User, LogOut, Receipt, History, Wallet, Users } from 'lucide-react';

export default function AgencySidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/agency/dashboard', icon: LayoutDashboard },
        { name: 'My Bookings', href: '/agency/bookings', icon: History },
        { name: 'Bulk Booking', href: '/agency/bulk-booking', icon: PlusCircle },
        { name: 'My Wallet', href: '/agency/wallet', icon: Wallet },
        { name: 'Invoices', href: '/agency/invoices', icon: Receipt },
        { name: 'Team', href: '/agency/team', icon: Users },
        { name: 'Profile', href: '/agency/profile', icon: User },
    ];

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-50">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 leading-none">Al Aqsa</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Partner Portal</p>
                    </div>
                </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 float-up'
                                }`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={async () => {
                        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) { }
                        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        window.location.href = '/agency/login';
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
