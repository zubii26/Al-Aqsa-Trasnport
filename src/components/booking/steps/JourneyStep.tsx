'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, PlaneLanding, PlaneTakeoff, Building2, Navigation, ArrowRight, Plus, Trash2, TrainFront } from 'lucide-react';
import { motion } from 'framer-motion';

import MapAutocomplete from '../MapAutocomplete';
import { usePricing } from '@/context/PricingContext';
import { getRouteOrigin, getRouteDestination } from '@/lib/utils/route-utils';

interface JourneyStepProps {
    data: any;
    updateData: (data: any) => void;
    onNext: () => void;
}

export default function JourneyStep({ data, updateData, onNext }: JourneyStepProps) {
    const { routes } = usePricing();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize legs if empty
    useEffect(() => {
        if (!data.legs || data.legs.length === 0) {
            updateData({
                legs: [{
                    pickup: data.pickup || '',
                    dropoff: data.dropoff || '',
                    date: data.date || null,
                    time: data.time || null,
                    routeId: data.routeId || '',
                    vehicleId: '',
                    price: 0
                }]
            });
        }
    }, []);

    const handleNext = () => {
        const newErrors: Record<string, string> = {};
        
        if (!data.legs || data.legs.length === 0) return;

        data.legs.forEach((leg: any, index: number) => {
            if (!leg.pickup) newErrors[`pickup_${index}`] = 'Pickup location is required';
            if (!leg.dropoff) newErrors[`dropoff_${index}`] = 'Dropoff location is required';
            if (!leg.date) newErrors[`date_${index}`] = 'Please select a date';
            if (!leg.time) newErrors[`time_${index}`] = 'Please select a time';
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Sync first leg with top-level data for backward compatibility
        if (data.legs.length > 0) {
            updateData({
                pickup: data.legs[0].pickup,
                dropoff: data.legs[data.legs.length - 1].dropoff,
                date: data.legs[0].date,
                time: data.legs[0].time,
                routeId: data.legs[0].routeId,
            });
        }

        onNext();
    };

    const updateLeg = (index: number, updates: any) => {
        const newLegs = [...(data.legs || [])];
        newLegs[index] = { ...newLegs[index], ...updates };
        
        // Match routeId automatically when locations change
        if (updates.pickup !== undefined || updates.dropoff !== undefined) {
            const p = newLegs[index].pickup || '';
            const d = newLegs[index].dropoff || '';
            
            if (p && d) {
                const matched = routes.find(r => {
                    const origin = getRouteOrigin(r).toLowerCase();
                    const dest = getRouteDestination(r).toLowerCase();
                    if (!origin || !dest) return false;

                    const pMatch = p.toLowerCase().includes(origin) || origin.includes(p.toLowerCase());
                    const dMatch = d.toLowerCase().includes(dest) || dest.includes(d.toLowerCase());
                    return pMatch && dMatch;
                });

                newLegs[index].routeId = matched ? matched.id : 'custom';
            }
        }
        
        updateData({ legs: newLegs });
        
        // Clear errors for updated fields
        const newErrors = { ...errors };
        if (updates.pickup !== undefined) delete newErrors[`pickup_${index}`];
        if (updates.dropoff !== undefined) delete newErrors[`dropoff_${index}`];
        if (updates.date !== undefined) delete newErrors[`date_${index}`];
        if (updates.time !== undefined) delete newErrors[`time_${index}`];
        setErrors(newErrors);
    };

    const addLeg = () => {
        const newLegs = [...(data.legs || [])];
        newLegs.push({
            pickup: newLegs.length > 0 ? newLegs[newLegs.length - 1].dropoff : '',
            dropoff: '',
            date: null,
            time: null,
            routeId: '',
            vehicleId: '',
            price: 0
        });
        updateData({ legs: newLegs });
    };

    const removeLeg = (index: number) => {
        const newLegs = [...(data.legs || [])];
        newLegs.splice(index, 1);
        updateData({ legs: newLegs });
    };

    const currentLegs = data.legs || [];

    return (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Plan Your Trip</h2>
                <p className="text-slate-500 mt-2">Where and when would you like to travel?</p>
            </div>

            {/* Service Type Selector */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { id: 'Intercity', icon: Building2, label: 'Intercity' },
                    { id: 'Airport', icon: PlaneLanding, label: 'Airport' },
                    { id: 'Train', icon: TrainFront, label: 'Train' },
                    { id: 'Ziarat', icon: Navigation, label: 'Ziarat' }
                ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => updateData({ serviceType: type.id })}
                        className={`
                            flex flex-col items-center justify-center p-4 rounded-[20px] border transition-all ios-glass
                            ${data.serviceType === type.id
                                ? 'border-secondary bg-secondary/10 text-secondary dark:bg-secondary/10'
                                : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}
                        `}
                    >
                        <type.icon size={24} strokeWidth={1.25} className="mb-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">{type.label}</span>
                    </button>
                ))}
            </div>

            {/* Legs Container */}
            <div className="space-y-6">
                {currentLegs.map((leg: any, index: number) => (
                    <div key={index} className="relative p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <MapPin size={16} className="text-secondary" />
                                Route {index + 1}
                            </h3>
                            {index > 0 && (
                                <button 
                                    onClick={() => removeLeg(index)}
                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                            )}
                        </div>

                        {/* Locations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <MapAutocomplete
                                label="Pickup Location"
                                placeholder="Hotel, Airport, or Landmark..."
                                value={leg.pickup}
                                onChange={(val) => updateLeg(index, { pickup: val })}
                                error={errors[`pickup_${index}`]}
                            />
                            <MapAutocomplete
                                label="Dropoff Destination"
                                placeholder="Where are you heading?"
                                value={leg.dropoff}
                                onChange={(val) => updateLeg(index, { dropoff: val })}
                                error={errors[`dropoff_${index}`]}
                            />
                        </div>

                        {/* Schedule */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Travel Date</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary z-10">
                                        <Calendar size={20} strokeWidth={1.25} />
                                    </div>
                                    <input
                                        type="date"
                                        value={leg.date ? leg.date.toISOString().split('T')[0] : ''}
                                        onChange={(e) => {
                                            if (!e.target.value) {
                                                updateLeg(index, { date: null });
                                                return;
                                            }
                                            const newDate = new Date(e.target.value);
                                            updateLeg(index, { date: newDate });
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`
                                            w-full pl-12 pr-4 py-4 bg-white/70 dark:bg-slate-900/50 
                                            border border-slate-200 dark:border-slate-700 ios-glass
                                            rounded-[20px] outline-none transition-all
                                            focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10
                                            text-slate-900 dark:text-white
                                            ${errors[`date_${index}`] ? 'border-red-500' : ''}
                                            [color-scheme:light] dark:[color-scheme:dark]
                                        `}
                                    />
                                </div>
                                {errors[`date_${index}`] && <span className="text-xs text-red-500 font-medium ml-1">{errors[`date_${index}`]}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pickup Time</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary z-10">
                                        <Clock size={20} strokeWidth={1.25} />
                                    </div>
                                    <input
                                        type="time"
                                        value={leg.time ? leg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                                        onChange={(e) => {
                                            if (!e.target.value) {
                                                updateLeg(index, { time: null });
                                                return;
                                            }
                                            const [hours, minutes] = e.target.value.split(':').map(Number);
                                            const newTime = new Date();
                                            newTime.setHours(hours);
                                            newTime.setMinutes(minutes);
                                            updateLeg(index, { time: newTime });
                                        }}
                                        className={`
                                            w-full pl-12 pr-4 py-4 bg-white/70 dark:bg-slate-900/50 
                                            border border-slate-200 dark:border-slate-700 ios-glass
                                            rounded-[20px] outline-none transition-all
                                            focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10
                                            text-slate-900 dark:text-white
                                            ${errors[`time_${index}`] ? 'border-red-500' : ''}
                                            [color-scheme:light] dark:[color-scheme:dark]
                                        `}
                                    />
                                </div>
                                {errors[`time_${index}`] && <span className="text-xs text-red-500 font-medium ml-1">{errors[`time_${index}`]}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-2">
                <button
                    onClick={addLeg}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-secondary hover:text-secondary transition-colors font-bold text-sm"
                >
                    <Plus size={18} /> Add Another Route
                </button>
            </div>

            <div className="pt-6">
                <button
                    onClick={handleNext}
                    className="w-full py-5 bg-slate-900 dark:bg-secondary text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 dark:hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 group"
                >
                    Choose Your Vehicle
                    <ArrowRight size={20} strokeWidth={1.25} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
