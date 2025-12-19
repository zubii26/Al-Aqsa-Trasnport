import React from 'react';
import { Users, Briefcase, Car, Truck, Bus } from 'lucide-react';

export default function VehicleCapacityGuide() {
    const vehicles = [
        {
            name: "Small Sedan",
            icon: <Car size={32} className="text-secondary" />,
            pax: "2-3 Passengers",
            bags: "2 Medium Bags",
            desc: "Ideal for couples or solo travelers."
        },
        {
            name: "GMC Yukon / SUV",
            icon: <Truck size={32} className="text-secondary" />,
            pax: "4-7 Passengers",
            bags: "5-6 Bags",
            desc: "Perfect for families with generous luggage space."
        },
        {
            name: "Hyundai H1 / Staria",
            icon: <Bus size={32} className="text-secondary" />,
            pax: "6-8 Passengers",
            bags: "7-8 Bags",
            desc: "Best for larger families or groups."
        }
    ];

    return (
        <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold font-playfair mb-3">Vehicle Capacity Guide</h2>
                    <p className="text-muted-foreground">Choose the right vehicle for your group size and luggage.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {vehicles.map((v, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-secondary transition-colors text-center group">
                            <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                {v.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-4">{v.name}</h3>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Users size={18} className="text-amber-500" />
                                    <span>{v.pax}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Briefcase size={18} className="text-amber-500" />
                                    <span>{v.bags}</span>
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
