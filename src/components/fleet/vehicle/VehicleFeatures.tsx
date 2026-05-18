import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface VehicleFeaturesProps {
    title?: string;
    features: string[];
}

export default function VehicleFeatures({
    title = "Comfort & Safety Features",
    features
}: VehicleFeaturesProps) {
    return (
        <section className="py-16 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 bg-slate-50 dark:bg-slate-800/50 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={24} />
                                <span className="text-lg text-slate-700 dark:text-slate-300">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
