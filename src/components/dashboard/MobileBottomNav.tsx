'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, User, MessageSquare } from 'lucide-react';

export default function MobileBottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarDays },
        // { name: 'Support', href: '/dashboard/chat', icon: MessageSquare }, // Future chat link
        { name: 'Profile', href: '/dashboard/profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
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
