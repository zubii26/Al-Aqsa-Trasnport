'use client';

import { useState } from 'react';
import { Power, CheckCircle2, XCircle, Shirt, Car, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShiftToggleProps {
    isOnline: boolean;
    onToggle: (status: boolean) => void;
}

export default function ShiftToggle({ isOnline, onToggle }: ShiftToggleProps) {
    const [showChecklist, setShowChecklist] = useState(false);
    const [checks, setChecks] = useState({
        uniform: false,
        vehicle: false,
        documents: false
    });
    const [loading, setLoading] = useState(false);

    const handleStartShift = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/driver/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'online' })
            });
            if (res.ok) {
                onToggle(true);
                setShowChecklist(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEndShift = async () => {
        setLoading(true);
        try {
            await fetch('/api/driver/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'offline' })
            });
            onToggle(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const allChecked = checks.uniform && checks.vehicle && checks.documents;

    return (
        <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Current Status</h2>
                        <div className={`flex items-center gap-2 text-sm font-medium ${isOnline ? 'text-green-600' : 'text-slate-500'}`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                            {isOnline ? 'Online & Receiving Jobs' : 'Offline'}
                        </div>
                    </div>

                    <button
                        onClick={() => isOnline ? handleEndShift() : setShowChecklist(true)}
                        disabled={loading}
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isOnline
                                ? 'bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                    >
                        <Power size={24} />
                    </button>
                </div>
            </div>

            {/* Checklist Modal */}
            <AnimatePresence>
                {showChecklist && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Pre-Shift Checklist</h3>
                                <button onClick={() => setShowChecklist(false)} className="p-2 bg-slate-100 rounded-full">
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 cursor-pointer transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                                    <input type="checkbox" className="w-6 h-6 rounded-md text-green-600 accent-green-600"
                                        checked={checks.uniform} onChange={e => setChecks(p => ({ ...p, uniform: e.target.checked }))}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 font-bold text-slate-900">
                                            <Shirt size={18} /> Uniform Ready
                                        </div>
                                        <p className="text-xs text-slate-500">Wearing approved Al Aqsa attire</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 cursor-pointer transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                                    <input type="checkbox" className="w-6 h-6 rounded-md text-green-600 accent-green-600"
                                        checked={checks.vehicle} onChange={e => setChecks(p => ({ ...p, vehicle: e.target.checked }))}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 font-bold text-slate-900">
                                            <Car size={18} /> Vehicle Clean
                                        </div>
                                        <p className="text-xs text-slate-500">Interior and exterior are spotless</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 cursor-pointer transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                                    <input type="checkbox" className="w-6 h-6 rounded-md text-green-600 accent-green-600"
                                        checked={checks.documents} onChange={e => setChecks(p => ({ ...p, documents: e.target.checked }))}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 font-bold text-slate-900">
                                            <AlertCircle size={18} /> Documents Valid
                                        </div>
                                        <p className="text-xs text-slate-500">License and registration are with me</p>
                                    </div>
                                </label>
                            </div>

                            <button
                                onClick={handleStartShift}
                                disabled={!allChecked || loading}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? 'Starting...' : 'Confirm & Start Shift'}
                                {!loading && <CheckCircle2 size={20} />}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
