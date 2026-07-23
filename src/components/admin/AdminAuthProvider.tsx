'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'operational_manager';
}

interface AdminAuthContextType {
    user: AdminUser | null;
    loading: boolean;
    setUser: (user: AdminUser | null) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
    user: null,
    loading: true,
    setUser: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            if (pathname === '/admin/login') {
                if (isMounted) setLoading(false);
                return;
            }

            // Only fetch if we don't have a user yet
            if (!user) {
                try {
                    const res = await fetch('/api/auth/me');
                    const data = await res.json();

                    if (data.authenticated && isMounted) {
                        setUser(data.user);
                    } else if (!data.authenticated && isMounted) {
                        router.push('/admin/login');
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    if (isMounted) router.push('/admin/login');
                }
            }
            if (isMounted) setLoading(false);
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [pathname, router, user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 gap-4">
                <div className="w-12 h-12 border-4 border-secondary/30 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="text-slate-500 font-medium animate-pulse">Verifying Session...</div>
            </div>
        );
    }

    return (
        <AdminAuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AdminAuthContext.Provider>
    );
}
