'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare, ChevronLeft, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

interface ContactStepProps {
    data: any;
    updateData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function ContactStep({ data, updateData, onNext, onBack }: ContactStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNext = () => {
        const newErrors: Record<string, string> = {};
        if (!data.name.trim()) newErrors.name = 'Full name is required';
        if (!data.email.trim() || !data.email.includes('@')) newErrors.email = 'Valid email is required';
        if (!data.phone.trim()) newErrors.phone = 'WhatsApp number is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onNext();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Personal Info</h2>
                    <p className="text-slate-500 mt-2">Where should we send your confirmation?</p>
                </div>
                <button onClick={onBack} className="text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold text-sm">
                    <ChevronLeft size={18} />
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 flex items-start gap-3">
                <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-emerald-800 dark:text-emerald-500 font-medium leading-relaxed">
                    Your privacy is important. We only use your information to coordinate your transport and will never share it with third parties.
                </p>
            </div>

            <div className="pt-6">
                <button
                    onClick={handleNext}
                    className="w-full py-5 bg-amber-500 text-white font-bold rounded-2xl shadow-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2 group"
                >
                    Review & Confirm
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
