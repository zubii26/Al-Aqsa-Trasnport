'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, User } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                <Link
                    href="/driver/dashboard"
                    className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive('/driver/dashboard')
                        ? 'text-amber-500'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                >
                    <Home size={24} strokeWidth={isActive('/driver/dashboard') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link
                    href="/driver/earnings"
                    className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive('/driver/earnings')
                        ? 'text-amber-500'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                >
                    <DollarSign size={24} strokeWidth={isActive('/driver/earnings') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Earnings</span>
                </Link>

                <Link
                    href="/driver/profile"
                    className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive('/driver/profile')
                        ? 'text-amber-500'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                >
                    <User size={24} strokeWidth={isActive('/driver/profile') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
}
