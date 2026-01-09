'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Calendar, Shield, DollarSign, Briefcase, MapPin, TrendingUp, CheckCircle, Clock, Building2 } from 'lucide-react';
import adminStyles from '../../admin.module.css';

interface BookingSummary {
    id: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    status: string;
    price?: number;
}

interface UserStats {
    totalEarnings: number;
    completedTrips: number;
    totalTrips: number;
    rating: number;
}

interface UserDetails {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function UserDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [user, setUser] = useState<UserDetails | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [activeAssignments, setActiveAssignments] = useState<BookingSummary[]>([]);
    const [history, setHistory] = useState<BookingSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchUserDetails();
        }
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            // If user is a driver, we use the detailed stats endpoint
            // If strictly a user, we might need a basic endpoint, but let's try stats first
            // which usually returns basic user info even if no driver stats.
            // Actually, our API assumes 'user' is returned. 
            // If the user is NOT a driver, the stats might be empty, which is fine.

            const res = await fetch(`/api/admin/users/${id}/stats`);
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);

            } else {
                // Fallback for non-drivers if stats endpoint fails strictly? 
                // Currently our API returns 404 if user not found, 200 with user info.
                console.error('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!user) {
        return <div className="p-8 text-center text-red-500">User not found</div>;
    }


    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className={adminStyles.title}>User Details</h1>
                    <p className="text-muted-foreground">View and manage user information</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className={adminStyles.glassCard + " p-6"}>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                        <User size={48} className="text-amber-500" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            {user.name}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-2">
                                <Mail size={16} /> {user.email}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={16} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2 capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                                <Shield size={14} /> {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
