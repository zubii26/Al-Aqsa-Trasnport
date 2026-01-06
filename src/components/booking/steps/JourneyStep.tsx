'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, PlaneLanding, PlaneTakeoff, Building2, Navigation, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import MapAutocomplete from '../MapAutocomplete';
import { usePricing } from '@/context/PricingContext';
import { splitRouteName } from '@/lib/utils/route-utils'; // Need to create or check if exists

interface JourneyStepProps {
    data: any;
    updateData: (data: any) => void;
    onNext: () => void;
}

export default function JourneyStep({ data, updateData, onNext }: JourneyStepProps) {
    const { routes } = usePricing();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNext = () => {
        const newErrors: Record<string, string> = {};
        if (!data.pickup) newErrors.pickup = 'Pickup location is required';
        if (!data.dropoff) newErrors.dropoff = 'Dropoff location is required';
        if (!data.date) newErrors.date = 'Please select a date';
        if (!data.time) newErrors.time = 'Please select a time';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onNext();
    };

    // Attempt to match a predefined route for better pricing/UX
    useEffect(() => {
        if (!data.pickup || !data.dropoff) return;

        const matched = routes.find(r => {
            const [p, d] = r.name.toLowerCase().split(/\u2192|\u2194| to /);
            const pMatch = data.pickup.toLowerCase().includes(p?.trim()) || p?.trim().includes(data.pickup.toLowerCase());
            const dMatch = data.dropoff.toLowerCase().includes(d?.trim()) || d?.trim().includes(data.dropoff.toLowerCase());
            return pMatch && dMatch;
        });

        if (matched && matched.id !== data.routeId) {
            updateData({ routeId: matched.id });
        } else if (!matched && data.routeId !== 'custom') {
            updateData({ routeId: 'custom' });
        }
    }, [data.pickup, data.dropoff, routes]);

    return (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Plan Your Trip</h2>
                <p className="text-slate-500 mt-2">Where and when would you like to travel?</p>
            </div>

            {/* Service Type Selector */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { id: 'Intercity', icon: Building2, label: 'Intercity' },
                    { id: 'Airport', icon: PlaneLanding, label: 'Airport' },
                    { id: 'Ziarat', icon: Navigation, label: 'Ziarat' }
                ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => updateData({ serviceType: type.id })}
                        className={`
                            flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all
                            ${data.serviceType === type.id
                                ? 'border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-500/10'
                                : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}
                        `}
                    >
                        <type.icon size={24} className="mb-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">{type.label}</span>
                    </button>
                ))}
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MapAutocomplete
                    label="Pickup Location"
                    placeholder="Hotel, Airport, or Landmark..."
                    value={data.pickup}
                    onChange={(val) => updateData({ pickup: val })}
                    error={errors.pickup}
                />
                <MapAutocomplete
                    label="Dropoff Destination"
                    placeholder="Where are you heading?"
                    value={data.dropoff}
                    onChange={(val) => updateData({ dropoff: val })}
                    error={errors.dropoff}
                />
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Travel Date</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 z-10">
                            <Calendar size={20} />
                        </div>
                        <input
                            type="date"
                            value={data.date ? data.date.toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                if (!e.target.value) {
                                    updateData({ date: null });
                                    return;
                                }
                                const newDate = new Date(e.target.value);
                                updateData({ date: newDate });
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            className={`
                                w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 
                                border-2 border-slate-100 dark:border-slate-800 
                                rounded-2xl outline-none transition-all
                                focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10
                                text-slate-900 dark:text-white
                                ${errors.date ? 'border-red-500' : ''}
                                [color-scheme:light] dark:[color-scheme:dark]
                            `}
                        />
                    </div>
                    {errors.date && <span className="text-xs text-red-500 font-medium ml-1">{errors.date}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pickup Time</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 z-10">
                            <Clock size={20} />
                        </div>
                        <input
                            type="time"
                            value={data.time ? data.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                            onChange={(e) => {
                                if (!e.target.value) {
                                    updateData({ time: null });
                                    return;
                                }
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const newTime = new Date();
                                newTime.setHours(hours);
                                newTime.setMinutes(minutes);
                                updateData({ time: newTime });
                            }}
                            className={`
                                w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 
                                border-2 border-slate-100 dark:border-slate-800 
                                rounded-2xl outline-none transition-all
                                focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10
                                text-slate-900 dark:text-white
                                ${errors.time ? 'border-red-500' : ''}
                                [color-scheme:light] dark:[color-scheme:dark]
                            `}
                        />
                    </div>
                    {errors.time && <span className="text-xs text-red-500 font-medium ml-1">{errors.time}</span>}
                </div>
            </div>

            <div className="pt-6">
                <button
                    onClick={handleNext}
                    className="w-full py-5 bg-slate-900 dark:bg-amber-500 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 dark:hover:bg-amber-600 transition-all flex items-center justify-center gap-2 group"
                >
                    Choose Your Vehicle
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
