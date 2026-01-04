'use client';

import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ChevronLeft, MapPin, Calendar, Clock, Car, User, Loader2 } from 'lucide-react';
import { usePricing } from '@/context/PricingContext';
import Link from 'next/link';

interface SummaryStepProps {
    data: any;
    onBack: () => void;
}

export default function SummaryStep({ data, onBack }: SummaryStepProps) {
    const { vehicles, calculatePrice } = usePricing();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const vehicle = vehicles.find(v => v.id === data.selectedVehicle);
    const pricing = data.routeId && data.routeId !== 'custom' && data.selectedVehicle
        ? calculatePrice(data.routeId, data.selectedVehicle)
        : null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                date: data.date?.toISOString().split('T')[0],
                time: data.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                vehicle: vehicle?.name || 'Any',
                totalPrice: pricing ? pricing.price * data.vehicleCount : 0
            };

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                alert('Submission failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Booking Requested!</h2>
                <p className="text-slate-500 mt-4 max-w-sm mx-auto">
                    We've received your request. Our team will contact you on WhatsApp shortly to confirm availability.
                </p>
                <div className="mt-10 flex flex-col gap-3">
                    <Link href="/" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
                        Back to Home
                    </Link>
                    <button onClick={() => window.location.reload()} className="text-amber-600 font-bold hover:underline">
                        Book Another Trip
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Review Request</h2>
                    <p className="text-slate-500 mt-2">Please verify your details before submitting.</p>
                </div>
                <button onClick={onBack} className="text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold text-sm">
                    <ChevronLeft size={18} />
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Journey Card */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Journey Details</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <MapPin size={18} className="text-amber-500 shrink-0 mt-1" />
                            <div>
                                <p className="text-xs font-bold text-slate-400">Route</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                    {data.pickup} <br />
                                    <span className="text-amber-500 my-1 block">↓</span>
                                    {data.dropoff}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Calendar size={18} className="text-amber-500" />
                            <div>
                                <p className="text-xs font-bold text-slate-400">Schedule</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {data.date?.toLocaleDateString()} at {data.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicle & Pricing Card */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Vehicle & Price</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <Car size={18} className="text-amber-500" />
                            <div>
                                <p className="text-xs font-bold text-slate-400">Selected Car</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{vehicle?.name || 'Any Available'}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Estimated Total</p>
                                    <p className="text-3xl font-black text-amber-500">
                                        {pricing ? pricing.price * data.vehicleCount : 'Quote Required'}
                                        {pricing && <span className="text-sm ml-1">SAR</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800 text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-widest text-center">
                No Payment Required Now • Pay Driver on Arrival
            </div>

            <div className="pt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        <>
                            Confirm Booking Request
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
