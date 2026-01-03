'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Zap, Wallet, User } from 'lucide-react';

export default function AgencyBottomNav() {
    const pathname = usePathname();

    // Hide on auth pages
    if (pathname?.includes('/login') || pathname?.includes('/register')) {
        return null;
    }

    const navItems = [
        { name: 'Home', href: '/agency/dashboard', icon: LayoutDashboard },
        { name: 'Book', href: '/agency/bookings', icon: Zap },
        { name: 'Earnings', href: '/agency/invoices', icon: Wallet },
        { name: 'Profile', href: '/agency/profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
