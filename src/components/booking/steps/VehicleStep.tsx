'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Info, Check, ArrowRight, ChevronLeft, MapPin } from 'lucide-react';
import Image from 'next/image';
import { usePricing } from '@/context/PricingContext';
import VehicleCategoryFilter from '@/components/booking/VehicleCategoryFilter';

interface VehicleStepProps {
    data: any;
    updateData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function VehicleStep({ data, updateData, onNext, onBack }: VehicleStepProps) {
    const { vehicles, calculatePrice } = usePricing();
    
    const isMultiRoute = data.legs && data.legs.length > 1;
    const [useSameVehicle, setUseSameVehicle] = useState(data.sameVehicleForAllLegs ?? true);
    const [activeLegIndex, setActiveLegIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = Array.from(new Set(vehicles.map(v => v.category).filter(Boolean))) as string[];

    useEffect(() => {
        // If they had a top-level selectedVehicle, apply it to legs if we are in 'same vehicle' mode
        if (useSameVehicle && data.selectedVehicle && data.legs) {
            const newLegs = [...data.legs].map(leg => ({ ...leg, vehicleId: data.selectedVehicle }));
            updateData({ legs: newLegs });
        }
    }, [useSameVehicle, data.selectedVehicle]);

    const handleSelectSame = (vId: string) => {
        updateData({ selectedVehicle: vId });
        if (data.legs) {
            const newLegs = [...data.legs].map(leg => ({ ...leg, vehicleId: vId }));
            updateData({ legs: newLegs });
        }
    };

    const handleSelectPerLeg = (vId: string, legIndex: number) => {
        const newLegs = [...(data.legs || [])];
        newLegs[legIndex].vehicleId = vId;
        updateData({ legs: newLegs, selectedVehicle: null }); // Clear top-level to avoid confusion
    };

    const isNextDisabled = () => {
        if (useSameVehicle) {
            return !data.selectedVehicle;
        } else {
            return data.legs.some((leg: any) => !leg.vehicleId);
        }
    };

    const renderVehicleList = (legIndex?: number) => {
        const currentRouteId = legIndex !== undefined && data.legs ? data.legs[legIndex].routeId : data.routeId;
        const currentSelectedId = legIndex !== undefined && data.legs ? data.legs[legIndex].vehicleId : data.selectedVehicle;

        const filteredVehicles = selectedCategory === 'All' 
            ? vehicles 
            : vehicles.filter(v => v.category === selectedCategory);

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVehicles.map((vehicle) => {
                    const isSelected = currentSelectedId === vehicle.id;
                    const pricing = currentRouteId && currentRouteId !== 'custom'
                        ? calculatePrice(currentRouteId, vehicle.id)
                        : null;

                    return (
                        <div
                            key={vehicle.id}
                            onClick={() => legIndex !== undefined ? handleSelectPerLeg(vehicle.id, legIndex) : handleSelectSame(vehicle.id)}
                            className={`
                                relative p-1 rounded-[24px] cursor-pointer transition-all duration-300 group ios-glass
                                ${isSelected
                                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-secondary/20 scale-[1.02]'
                                    : 'bg-slate-100/50 dark:bg-slate-800/50 hover:scale-[1.01] hover:bg-slate-200/50'}
                            `}
                        >
                            <div className="bg-white/80 dark:bg-slate-900/50 rounded-[22px] p-5 h-full">
                                <div className="flex gap-5">
                                    <div className="w-24 h-24 relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shrink-0">
                                        {vehicle.image ? (
                                            <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="96px" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Users size={32} strokeWidth={1.25} />
                                            </div>
                                        )}
                                        {vehicle.name.includes('GMC') && (
                                            <div className="absolute top-1 right-1 bg-secondary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                                VIP
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight truncate">
                                                    {vehicle.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-0.5">e.g. {vehicle.id === 'camry' ? 'Toyota Camry' : vehicle.id === 'mercedes' ? 'Mercedes S-Class' : vehicle.id === 'gmc' ? 'GMC Yukon' : vehicle.id === 'kia' ? 'Kia K5' : vehicle.id === 'xpander' ? 'Mitsubishi Xpander' : vehicle.id === 'staria' ? 'Hyundai Staria' : vehicle.id === 'starex' ? 'Hyundai H1' : vehicle.id === 'hiace' ? 'Toyota Hiace' : vehicle.id === 'coaster' ? 'Toyota Coaster' : '50-Seater Bus'} or similar</p>
                                            </div>
                                            {isSelected && <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center shadow-md"><Check size={14} strokeWidth={1.25} /></div>}
                                        </div>

                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                <Users size={12} strokeWidth={1.25} className="text-secondary" />
                                                {vehicle.capacity} PAX
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                <Briefcase size={12} strokeWidth={1.25} className="text-secondary" />
                                                {vehicle.luggage} BAGS
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-end justify-between">
                                            {pricing ? (
                                                <div>
                                                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                                                        {pricing.price} <span className="text-sm font-bold text-slate-400">SAR</span>
                                                    </span>
                                                    {pricing.discountApplied > 0 && (
                                                        <span className="block text-[10px] text-emerald-500 font-bold">-{pricing.discountApplied} SAR Promo applied</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-secondary bg-secondary/10 dark:bg-secondary/20 px-3 py-1 rounded-full uppercase tracking-widest">
                                                    Quote Basis
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Select Fleet</h2>
                    <p className="text-slate-500 mt-2">Choose the perfect ride for your journey.</p>
                </div>
                <button onClick={onBack} className="text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold text-sm">
                    <ChevronLeft size={18} strokeWidth={1.25} />
                    Back
                </button>
            </div>

            <VehicleCategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelect={setSelectedCategory} 
            />


            {isMultiRoute && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={useSameVehicle}
                            onChange={(e) => {
                                setUseSameVehicle(e.target.checked);
                                updateData({ sameVehicleForAllLegs: e.target.checked });
                            }}
                            className="w-5 h-5 rounded text-secondary focus:ring-secondary focus:ring-offset-0 border-slate-300"
                        />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Use the same vehicle for all {data.legs.length} routes
                        </span>
                    </label>
                </div>
            )}

            {!isMultiRoute || useSameVehicle ? (
                renderVehicleList()
            ) : (
                <div className="space-y-6">
                    {/* Route Tabs */}
                    <div className="flex overflow-x-auto pb-2 gap-2 snap-x hide-scrollbar">
                        {data.legs.map((leg: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveLegIndex(index)}
                                className={`
                                    flex-none snap-start px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                                    ${activeLegIndex === index 
                                        ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}
                                `}
                            >
                                Route {index + 1}
                                {leg.vehicleId && <Check size={14} className="inline ml-2 text-white" />}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-medium">
                            <MapPin size={16} className="text-secondary" />
                            {data.legs[activeLegIndex].pickup} <ArrowRight size={14} className="mx-1 opacity-50" /> {data.legs[activeLegIndex].dropoff}
                        </div>
                        {renderVehicleList(activeLegIndex)}
                    </div>
                </div>
            )}

            <div className="pt-6 flex gap-4">
                <button
                    onClick={onBack}
                    className="py-5 px-6 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={isNextDisabled()}
                    className={`
                        flex-1 py-5 font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group
                        ${!isNextDisabled()
                            ? 'bg-slate-900 dark:bg-secondary text-white hover:bg-slate-800 dark:hover:bg-secondary/90'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    Continue to Details
                    <ArrowRight size={20} strokeWidth={1.25} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
