'use client';

import { useState, useEffect } from 'react';
import { Bus, Plus, Trash2, ChevronLeft, ArrowRight } from 'lucide-react';

interface FleetStepProps {
    data: any;
    updateData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function FleetStep({ data, updateData, onNext, onBack }: FleetStepProps) {
    const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/vehicles')
            .then(res => res.json())
            .then(data => setAvailableVehicles(data))
            .catch(err => console.error(err));
    }, []);

    const addVehicleRow = () => {
        updateData({ vehicles: [...data.vehicles, { type: '', count: 1 }] });
    };

    const removeVehicleRow = (index: number) => {
        const newVehicles = [...data.vehicles];
        newVehicles.splice(index, 1);
        updateData({ vehicles: newVehicles });
    };

    const updateVehicle = (index: number, field: string, value: any) => {
        const newVehicles = [...data.vehicles];
        newVehicles[index][field] = value;
        updateData({ vehicles: newVehicles });
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation: at least one vehicle with type selected
        if (data.vehicles.every((v: any) => v.type)) {
            onNext();
        } else {
            alert('Please select vehicle types for all rows');
        }
    };

    return (
        <form onSubmit={handleNext} className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fleet Configuration</h2>
                    <p className="text-slate-500 mt-1">Select the vehicles needed for this booking.</p>
                </div>
                <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold text-sm">
                    <ChevronLeft size={18} /> Back
                </button>
            </div>

            <div className="space-y-4">
                {data.vehicles.map((v: any, index: number) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 dark:bg-slate-800 p-6 rounded-[24px] border border-slate-100 dark:border-slate-700 relative group animate-in slide-in-from-right-4 duration-300">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Vehicle Type</label>
                            <div className="relative">
                                <Bus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500/50 transition-all appearance-none text-slate-900 dark:text-white"
                                    value={v.vehicleId || ''}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        const selectedVehicle = availableVehicles.find(av => av._id === selectedId);
                                        if (selectedVehicle) {
                                            const newVehicles = [...data.vehicles];
                                            newVehicles[index] = {
                                                ...newVehicles[index],
                                                vehicleId: selectedId,
                                                type: selectedVehicle.name
                                            };
                                            updateData({ vehicles: newVehicles });
                                        }
                                    }}
                                    required
                                >
                                    <option value="">Select Vehicle...</option>
                                    {availableVehicles.map(av => (
                                        <option key={av._id} value={av._id}>{av.name} ({av.capacity} Pax)</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-full md:w-32">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-white text-center font-bold"
                                value={v.count}
                                onChange={(e) => updateVehicle(index, 'count', parseInt(e.target.value))}
                                required
                            />
                        </div>

                        {data.vehicles.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeVehicleRow(index)}
                                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors mb-[2px]"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addVehicleRow}
                    className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                >
                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                    Add Another Vehicle Group
                </button>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20"
                >
                    Next: Passenger Details
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </form>
    );
}
