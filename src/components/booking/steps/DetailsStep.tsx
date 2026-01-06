'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare, ChevronLeft, ArrowRight, ShieldCheck, MapPin, Calendar, Car, Loader2, CheckCircle } from 'lucide-react';
import { usePricing } from '@/context/PricingContext';
import Link from 'next/link';

interface DetailsStepProps {
    data: any;
    updateData: (data: any) => void;
    onBack: () => void;
}

export default function DetailsStep({ data, updateData, onBack }: DetailsStepProps) {
    const { vehicles, calculatePrice } = usePricing();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Calculate Pricing for Summary
    const vehicle = vehicles.find(v => v.id === data.selectedVehicle);
    const pricing = data.routeId && data.routeId !== 'custom' && data.selectedVehicle
        ? calculatePrice(data.routeId, data.selectedVehicle)
        : null;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!data.name.trim()) newErrors.name = 'Full name is required';
        if (!data.email.trim() || !data.email.includes('@')) newErrors.email = 'Valid email is required';
        if (!data.phone.trim()) newErrors.phone = 'WhatsApp number is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

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
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Final Details</h2>
                    <p className="text-slate-500 mt-2">Enter your info to secure your booking.</p>
                </div>
                <button onClick={onBack} className="text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold text-sm">
                    <ChevronLeft size={18} />
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Form */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={data.name}
                                onChange={(e) => updateData({ name: e.target.value })}
                                className={`
                                    w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 
                                    border-2 border-slate-100 dark:border-slate-800 
                                    rounded-2xl outline-none transition-all
                                    focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10
                                    text-slate-900 dark:text-white
                                    ${errors.name ? 'border-red-500' : ''}
                                `}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={data.email}
                                onChange={(e) => updateData({ email: e.target.value })}
                                className={`
                                    w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 
                                    border-2 border-slate-100 dark:border-slate-800 
                                    rounded-2xl outline-none transition-all
                                    focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10
                                    text-slate-900 dark:text-white
                                    ${errors.email ? 'border-red-500' : ''}
                                `}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">WhatsApp / Phone</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                                <Phone size={20} />
                            </div>
                            <input
                                type="tel"
                                placeholder="+966 5..."
                                value={data.phone}
                                onChange={(e) => updateData({ phone: e.target.value })}
                                className={`
                                    w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 
                                    border-2 border-slate-100 dark:border-slate-800 
                                    rounded-2xl outline-none transition-all
                                    focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10
                                    text-slate-900 dark:text-white
                                    ${errors.phone ? 'border-red-500' : ''}
                                `}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Additional Notes (Optional)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-5 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                                <MessageSquare size={20} />
                            </div>
                            <textarea
                                placeholder="Luggage details, flight number, etc."
                                value={data.notes}
                                onChange={(e) => updateData({ notes: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 text-slate-900 dark:text-white min-h-[58px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary Card */}
                <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 h-full">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Booking Summary</h3>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Route</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-1">
                                        {data.pickup} <br />
                                        <span className="text-amber-500">↓</span> <br />
                                        {data.dropoff}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 flex items-center justify-center shrink-0">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Schedule</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                                        {data.date?.toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {data.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 flex items-center justify-center shrink-0">
                                    <Car size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Vehicle</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{vehicle?.name || 'Any Available'}</p>
                                    <p className="text-xs text-slate-500">{data.vehicleCount} Vehicle(s)</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-auto">
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
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 flex items-start gap-3">
                <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-emerald-800 dark:text-emerald-500 font-medium leading-relaxed">
                    Safe & Secure. No payment required now. You will pay the driver directly upon arrival.
                </p>
            </div>

            <div className="pt-2">
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
