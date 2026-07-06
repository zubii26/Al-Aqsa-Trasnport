'use client';

import React from 'react';
import { ShieldCheck, Clock, Users, Zap, Plane, BadgeDollarSign } from 'lucide-react';

export default function TrustBadges() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="text-secondary shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Licensed Transport</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Approved by Ministry of Hajj</p>
                </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Clock className="text-secondary shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">24/7 Support</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Always here to help you</p>
                </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Users className="text-secondary shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Pro Chauffeurs</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Experienced & professional</p>
                </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Zap className="text-secondary shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instant Confirm</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Guaranteed booking</p>
                </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <Plane className="text-secondary shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Flight Monitoring</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">We track your arrival</p>
                </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <BadgeDollarSign className="text-secondary shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Transparent Price</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">No hidden charges</p>
                </div>
            </div>
        </div>
    );
}
