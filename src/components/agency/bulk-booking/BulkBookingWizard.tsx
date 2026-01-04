'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin, Bus, Users, ClipboardCheck, Loader2 } from 'lucide-react';
import JourneyStep from './steps/JourneyStep';
import FleetStep from './steps/FleetStep';
import GroupStep from './steps/GroupStep';
import ConfirmStep from './steps/ConfirmStep';

const STEPS = [
    { id: 1, title: 'Journey', icon: MapPin },
    { id: 2, title: 'Fleet', icon: Bus },
    { id: 3, title: 'Group', icon: Users },
    { id: 4, title: 'Review', icon: ClipboardCheck }
];

export default function BulkBookingWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        routeId: '',
        date: '',
        time: '',
        vehicles: [{ type: '', count: 1 }],
        passengers: 0,
        notes: '',
        passengerList: [] as any[] // For Excel upload
    });

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Minimalist Progress Bar */}
            <div className="flex justify-between items-center mb-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                {STEPS.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2 flex-1 relative">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10
                            ${currentStep >= step.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}
                        `}>
                            <step.icon size={20} />
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'}`}>
                            {step.title}
                        </span>

                        {step.id < 4 && (
                            <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 transition-colors duration-500 ${currentStep > step.id ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-700'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-6 md:p-10 flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 1 && <JourneyStep data={formData} updateData={updateFormData} onNext={nextStep} />}
                            {currentStep === 2 && <FleetStep data={formData} updateData={updateFormData} onNext={nextStep} onBack={prevStep} />}
                            {currentStep === 3 && <GroupStep data={formData} updateData={updateFormData} onNext={nextStep} onBack={prevStep} />}
                            {currentStep === 4 && <ConfirmStep data={formData} onBack={prevStep} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
