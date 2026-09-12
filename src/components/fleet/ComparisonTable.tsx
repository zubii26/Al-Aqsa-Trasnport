'use client';

export default function ComparisonTable() {

    const data = [
        { name: 'VIP Sedan (Mercedes S-Class)', type: 'mercedes', capacity: '3 Passengers', comfort: 'VIP', price: 'From SAR 700' },
        { name: 'Business Sedan (Toyota Camry)', type: 'camry', capacity: '4 Passengers', comfort: 'High', price: 'From SAR 200' },
        { name: 'Economy Sedan (Kia K5)', type: 'kia', capacity: '4 Passengers', comfort: 'Standard', price: 'From SAR 220' },
        { name: 'Luxury SUV (GMC Yukon)', type: 'gmc', capacity: '7 Passengers', comfort: 'Premium', price: 'From SAR 350' },
        { name: 'Compact Family MPV (Mitsubishi Xpander)', type: 'xpander', capacity: '7 Passengers', comfort: 'Standard', price: 'From SAR 280' },
        { name: 'Family MPV (Hyundai Staria)', type: 'staria', capacity: '7 Passengers', comfort: 'High', price: 'From SAR 300' },
        { name: 'Family MPV (Hyundai Starex)', type: 'starex', capacity: '7 Passengers', comfort: 'Standard', price: 'From SAR 250' },
        { name: 'Executive Van (Toyota Hiace)', type: 'hiace', capacity: '11 Passengers', comfort: 'Standard', price: 'From SAR 250' },
        { name: 'Group Minibus (Toyota Coaster)', type: 'coaster', capacity: '19 Passengers', comfort: 'Standard', price: 'From SAR 450' },
        { name: 'Coach Bus (50-Seater)', type: 'coach-50', capacity: '50 Passengers', comfort: 'Standard', price: 'From SAR 1000' },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <div className="container max-w-5xl mx-auto px-4">
                <div className="text-center mb-16 relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground inline-block relative">
                        Compare Our Vehicles
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary rounded-full" />
                    </h2>
                </div>
                
                <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-card shadow-xl shadow-slate-200/20 dark:shadow-none">
                    <table className="w-full text-start border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="px-8 py-5 text-start text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vehicle Type</th>
                                <th className="px-8 py-5 text-start text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Capacity</th>
                                <th className="px-8 py-5 text-start text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Comfort Level</th>
                                <th className="px-8 py-5 text-start text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Starting Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {data.map((row) => (
                                <tr key={row.type} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200">
                                    <td className="px-8 py-6 font-bold text-slate-900 dark:text-white group-hover:text-secondary transition-colors">
                                        {row.name}
                                    </td>
                                    <td className="px-8 py-6 text-slate-600 dark:text-slate-300">
                                        {row.capacity}
                                    </td>
                                    <td className="px-8 py-6 text-slate-600 dark:text-slate-300">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                                            row.comfort === 'VIP' ? 'bg-black text-secondary border border-secondary/50 dark:bg-black dark:border-secondary shadow-[0_0_15px_rgba(212,175,55,0.3)]' :
                                            row.comfort === 'Premium' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 
                                            row.comfort === 'High' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' :
                                            'bg-transparent text-slate-500'
                                        }`}>
                                            {row.comfort}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-semibold text-slate-900 dark:text-white">
                                        {row.price}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
