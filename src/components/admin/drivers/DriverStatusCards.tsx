'use client';

import { Users, UserCheck, UserX, AlertTriangle, Battery } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

interface DriverStatusCardsProps {
    drivers: any[];
    onlineCount: number;
}

export default function DriverStatusCards({ drivers, onlineCount }: DriverStatusCardsProps) {
    const total = drivers.length;
    const active = drivers.filter(d => d.isActive).length;
    const inactive = total - active;
    const online = onlineCount;

    // Example logic for alerts (e.g. license expiring soon) - could be real data later
    const alerts = drivers.filter(d => {
        if (!d.documents) return false;
        // Check expiry logic here
        return false;
    }).length;

    const cards = [
        {
            title: 'Total Drivers',
            value: total,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            title: 'Active / Online',
            value: `${active} / ${online}`,
            icon: Battery,
            color: 'text-green-500',
            bg: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            title: 'Inactive',
            value: inactive,
            icon: UserX,
            color: 'text-slate-500',
            bg: 'bg-slate-100 dark:bg-slate-800'
        },
        {
            title: 'Compliance Alerts',
            value: alerts,
            icon: AlertTriangle,
            color: 'text-amber-500',
            bg: 'bg-amber-100 dark:bg-amber-900/20'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, i) => (
                <div key={i} className={`${styles.glassCard} p-4 flex items-center justify-between`}>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">{card.title}</p>
                        <h3 className="text-2xl font-bold">{card.value}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${card.bg}`}>
                        <card.icon size={24} className={card.color} />
                    </div>
                </div>
            ))}
        </div>
    );
}
