'use client';

import { motion } from 'framer-motion';
import { Car, Calendar, Activity, TrendingUp, ArrowUpRight, Plus } from 'lucide-react';
import styles from './admin.module.css';
import Link from 'next/link';

interface Booking {
    id: string;
    name: string;
    email: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    status: string;
}

interface Log {
    id: string;
    action: string;
    details: string;
    timestamp: Date;
    user: string;
}

interface DashboardProps {
    totalBookings: number;
    activeFleet: number;
    totalFleet: number;
    pendingBookings: number;
    confirmedBookings: number;
    routesCount: number;
    totalRevenue: number;
    recentBookings: Booking[];
    recentLogs: Log[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function DashboardClient({
    totalBookings,
    activeFleet,
    totalFleet,

    confirmedBookings,
    routesCount,
    totalRevenue,
    recentBookings,
    recentLogs
}: DashboardProps) {



    return (
        <div className="p-6 space-y-8">
            <div className={styles.header}>
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.title}
                    >
                        Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={styles.subtitle}
                    >
                        Overview of your transport business
                    </motion.p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/bookings">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={styles.actionButton}
                        >
                            <Plus size={18} />
                            New Booking
                        </motion.button>
                    </Link>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className={styles.statsGrid}
            >
                {/* Revenue Card */}
                <motion.div variants={item} className={styles.glassCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statLabel}>Total Revenue</div>
                        <div className={`${styles.statIcon} bg-emerald-500/10 text-emerald-400`}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>SAR {totalRevenue.toLocaleString()}</div>
                    <div className={styles.statTrend}>
                        <span className={styles.trendUp}>
                            <ArrowUpRight size={14} className="inline mr-1" />
                            12%
                        </span>
                        <span className="text-muted-foreground">vs last month</span>
                    </div>
                </motion.div>

                {/* Bookings Card */}
                <motion.div variants={item} className={styles.glassCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statLabel}>Total Bookings</div>
                        <div className={`${styles.statIcon} bg-blue-500/10 text-blue-400`}>
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>{totalBookings}</div>
                    <div className={styles.statTrend}>
                        <span className="text-emerald-500 font-medium">
                            {confirmedBookings} confirmed
                        </span>
                    </div>
                </motion.div>

                {/* Fleet Card */}
                <motion.div variants={item} className={styles.glassCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statLabel}>Fleet Status</div>
                        <div className={`${styles.statIcon} bg-purple-500/10 text-purple-400`}>
                            <Car size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>
                        {activeFleet} <span className="text-lg text-muted-foreground">/ {totalFleet}</span>
                    </div>
                    <div className={styles.statTrend}>
                        <span className="text-muted-foreground">
                            {activeFleet === totalFleet ? 'All vehicles active' : `${totalFleet - activeFleet} inactive`}
                        </span>
                    </div>
                </motion.div>

                {/* Routes Card */}
                <motion.div variants={item} className={styles.glassCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statLabel}>Active Routes</div>
                        <div className={`${styles.statIcon} bg-amber-500/10 text-amber-400`}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>{routesCount}</div>
                    <div className={styles.statTrend}>
                        <span className="text-muted-foreground">Available for booking</span>
                    </div>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`${styles.glassCard} lg:col-span-2`}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-foreground font-playfair">
                            Recent Bookings
                        </h2>
                        <Link href="/admin/bookings" className="text-sm text-[#d4af37] hover:text-[#f3e5ab] transition-colors">
                            View All
                        </Link>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Route</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((booking, index) => (
                                    <tr key={booking.id || index}>
                                        <td>
                                            <div className="font-medium text-foreground">{booking.name}</div>
                                            <div className="text-xs text-muted-foreground">{booking.email}</div>
                                        </td>
                                        <td>
                                            <div className="text-sm text-foreground/90">{booking.pickup}</div>
                                            <div className="text-xs text-muted-foreground">to {booking.dropoff}</div>
                                        </td>
                                        <td className="text-sm text-foreground/80">
                                            {new Date(booking.date).toLocaleDateString()}
                                            <div className="text-xs text-muted-foreground">{booking.time}</div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${booking.status === 'confirmed' ? styles.statusConfirmed :
                                                booking.status === 'cancelled' ? styles.statusCancelled :
                                                    styles.statusPending
                                                }`}>
                                                {booking.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentBookings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No bookings found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={styles.glassCard}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-foreground font-playfair">
                            Activity
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {recentLogs.map((log, index) => (
                            <div key={log.id || index} className="flex gap-3 pb-3 border-b border-white/5 last:border-0">
                                <div className={`mt-1 p-1.5 rounded-lg h-fit ${log.action.includes('DELETE') ? 'bg-red-500/10 text-red-400' :
                                    log.action.includes('UPDATE') ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-emerald-500/10 text-emerald-400'
                                    }`}>
                                    <Activity size={14} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-foreground/90">
                                        {log.action.replace(/_/g, ' ')}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {log.details}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground/60 mt-1">
                                        {new Date(log.timestamp).toLocaleTimeString()} • {log.user}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {recentLogs.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No recent activity
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
