'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

interface JourneyStepProps {
    data: any;
    updateData: (data: any) => void;
    onNext: () => void;
}

export default function JourneyStep({ data, updateData, onNext }: JourneyStepProps) {
    const [routes, setRoutes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/routes')
            .then(res => res.json())
            .then(data => {
                setRoutes(data);
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form onSubmit={handleNext} className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Details</h2>
                <p className="text-slate-500 mt-1">Select the main route and schedule for this group.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                        Select Route
                    </label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <select
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500/50 transition-all appearance-none text-slate-900 dark:text-white"
                            value={data.routeId}
                            onChange={(e) => updateData({ routeId: e.target.value })}
                            required
                        >
                            <option value="">Choose a route...</option>
                            {routes.map((r) => (
                                <option key={r._id} value={r._id}>
                                    {r.origin} → {r.destination} ({r.category})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                            Pickup Date
                        </label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                                type="date"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-white"
                                value={data.date}
                                onChange={(e) => updateData({ date: e.target.value })}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                            Pickup Time
                        </label>
                        <div className="relative group">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                                type="time"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-white"
                                value={data.time}
                                onChange={(e) => updateData({ time: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20"
                >
                    Next: Configure Fleet
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </form>
    );
}
