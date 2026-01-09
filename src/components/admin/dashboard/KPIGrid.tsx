import { motion } from 'framer-motion';
import { Activity, Calendar, Car, MapPin, TrendingUp } from 'lucide-react';

interface KPIGridProps {
    totalRevenue: number;
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    activeFleet: number;
    totalFleet: number;
    routesCount: number;
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

export default function KPIGrid({
    totalRevenue,
    totalBookings,
    confirmedBookings,
    pendingBookings,
    activeFleet,
    totalFleet,
    routesCount
}: KPIGridProps) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {/* Revenue Card */}
            <motion.div variants={item} className="relative group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-[#D4AF37]/30 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointers-events-none group-hover:bg-[#D4AF37]/10 transition-colors" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            <span className="text-lg text-slate-500 font-normal mr-1">SAR</span>
                            {totalRevenue.toLocaleString()}
                        </h3>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[#D4AF37] border border-slate-200 dark:border-slate-700/50">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 w-fit px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    <Activity size={12} />
                    <span>+12.5% vs last month</span>
                </div>
            </motion.div>

            {/* Bookings Card */}
            <motion.div variants={item} className="relative group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointers-events-none group-hover:bg-blue-500/10 transition-colors" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Bookings</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{totalBookings}</h3>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-blue-500 dark:text-blue-400 border border-slate-200 dark:border-slate-700/50">
                        <Calendar size={24} />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>{confirmedBookings} Confirmed</span>
                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
                    <span className="text-amber-600 dark:text-amber-400">{pendingBookings} Pending</span>
                </div>
            </motion.div>

            {/* Fleet Card */}
            <motion.div variants={item} className="relative group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-purple-500/30 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointers-events-none group-hover:bg-purple-500/10 transition-colors" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Fleet</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{activeFleet} <span className="text-lg text-slate-500 font-normal">/ {totalFleet}</span></h3>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-purple-500 dark:text-purple-400 border border-slate-200 dark:border-slate-700/50">
                        <Car size={24} />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 w-fit px-2 py-1 rounded-full border border-purple-200 dark:border-purple-500/20">
                    <Activity size={12} />
                    <span>High Availability</span>
                </div>
            </motion.div>

            {/* Routes Card */}
            <motion.div variants={item} className="relative group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-rose-500/30 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointers-events-none group-hover:bg-rose-500/10 transition-colors" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Routes</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{routesCount}</h3>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-rose-500 dark:text-rose-400 border border-slate-200 dark:border-slate-700/50">
                        <MapPin size={24} />
                    </div>
                </div>
                <div className="text-xs text-slate-500">
                    Covering key locations across KSA
                </div>
            </motion.div>
        </motion.div>
    );
}
