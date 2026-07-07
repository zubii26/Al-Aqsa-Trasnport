import React from 'react';
import { LucideIcon } from 'lucide-react';

interface UseCase {
    title: string;
    description: string;
    icon: LucideIcon;
}

interface VehicleUseCasesProps {
    title?: string;
    cases: UseCase[];
}

export default function VehicleUseCases({
    title = "Ideal For",
    cases
}: VehicleUseCasesProps) {
    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12  text-slate-900 dark:text-white">
                    {title}
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {cases.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-md border-t-4 border-secondary transition-all hover:-translate-y-2 hover:shadow-xl"
                        >
                            <item.icon className="w-12 h-12 text-secondary mb-6" />
                            <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white ">
                                {item.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
