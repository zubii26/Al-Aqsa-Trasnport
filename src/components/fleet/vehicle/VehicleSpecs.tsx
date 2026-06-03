import React from 'react';

interface SpecItem {
    label: string;
    value: string;
    subValue?: string;
}

interface VehicleSpecsProps {
    title?: string;
    specs: SpecItem[];
}

export default function VehicleSpecs({ 
    title = "Technical Specifications", 
    specs 
}: VehicleSpecsProps) {
    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12  text-slate-900 dark:text-white">
                    {title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {specs.map((spec, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800"
                        >
                            <h3 className="font-bold text-slate-400 uppercase text-xs md:text-sm tracking-wider mb-3">
                                {spec.label}
                            </h3>
                            <p className="font-bold text-lg md:text-xl text-slate-900 dark:text-white mb-1">
                                {spec.value}
                            </p>
                            {spec.subValue && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {spec.subValue}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
