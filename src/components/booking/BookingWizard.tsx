'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ShieldCheck, Headphones, CreditCard } from 'lucide-react';
import { usePricing } from '@/context/PricingContext';
import JourneyStep from './steps/JourneyStep';
import VehicleStep from './steps/VehicleStep';
import DetailsStep from './steps/DetailsStep';

const STEPS = [
    { id: 1, title: 'Journey', description: 'Route & Date' },
    { id: 2, title: 'Vehicle', description: 'Choose Fleet' },
    { id: 3, title: 'Details', description: 'Confirm & Book' }
];

export default function BookingWizard() {
    const { routes, vehicles, isLoading, calculatePrice } = usePricing();
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        serviceType: 'Intercity',
        routeId: '',
        pickup: '',
        dropoff: '',
        date: null as Date | null,
        time: null as Date | null,
        selectedVehicle: null as string | null,
        vehicleCount: 1,
        passengers: 1,
        luggage: 0,
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    const updateData = (data: Partial<typeof bookingData>) => {
        setBookingData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
            {/* Minimalist Progress Header */}
            <div className="flex justify-between items-center mb-12">
                {STEPS.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2 group flex-1">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500
                            ${currentStep >= step.id
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/10'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}
                        `}>
                            {currentStep > step.id ? '✓' : step.id}
                        </div>
                        <div className="hidden md:block text-center">
                            <span className={`text-[10px] uppercase font-black tracking-widest ${currentStep >= step.id ? 'text-amber-600' : 'text-slate-400'}`}>
                                Step 0{step.id}
                            </span>
                            <h3 className={`text-xs font-bold ${currentStep >= step.id ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                {step.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />

                <div className="p-6 md:p-12 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            {currentStep === 1 && <JourneyStep data={bookingData} updateData={updateData} onNext={handleNext} />}
                            {currentStep === 2 && <VehicleStep data={bookingData} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
                            {currentStep === 3 && <DetailsStep data={bookingData} updateData={updateData} onBack={handleBack} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Trust Footer */}
                <div className="bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 py-4 px-12 flex justify-center md:justify-between items-center gap-8">
                    <div className="hidden md:flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Safe & Secure
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <Headphones size={14} className="text-amber-500" />
                        24/7 Support
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <CreditCard size={14} className="text-blue-500" />
                        Pay on Arrival
                    </div>
                </div>
            </div>

            {/* Google Maps Script */}
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&libraries=places`}
                strategy="afterInteractive"
            />
        </div>
    );
}
