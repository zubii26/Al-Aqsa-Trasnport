import React from 'react';
import { MapPin, ArrowRight, Clock } from 'lucide-react';

interface RouteVisualProps {
    from?: string;
    fromLabel?: string;
    to?: string;
    toLabel?: string;
    duration?: string;
    distance?: string;
    showMiqat?: boolean;
}

export default function RouteVisual({
    from = "Makkah Hotel",
    fromLabel = "Pickup Location",
    to = "Madinah Hotel",
    toLabel = "Drop-off Location",
    duration = "4.5 Hours",
    distance = "450 km Highway",
    showMiqat = true
}: RouteVisualProps) {
    return (
        <div className="py-8">
            <div className="relative flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto bg-slate-50 dark:bg-slate-800/50 p-6 md:p-10 rounded-2xl border border-slate-200 dark:border-slate-700">

                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[40%] left-20 right-20 h-1 bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20 -z-10" />

                {/* Point A */}
                <div className="flex flex-col items-center text-center z-10 mb-8 md:mb-0">
                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full border-4 border-secondary flex items-center justify-center shadow-lg mb-4">
                        <MapPin className="text-secondary" size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-playfair">{from}</h3>
                    <p className="text-sm text-muted-foreground">{fromLabel}</p>
                </div>

                {/* Mid Point: Distance/Time */}
                <div className="flex flex-col items-center z-10 bg-white dark:bg-slate-900 px-6 py-2 rounded-full border border-border shadow-sm mb-8 md:mb-0">
                    <span className="text-sm font-bold text-secondary flex items-center gap-2">
                        <Clock size={16} /> {duration}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">{distance}</span>
                </div>

                {/* Stop: Miqat (Conditional) */}
                {showMiqat && (
                    <div className="flex flex-col items-center text-center z-10 mb-8 md:mb-0">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center mb-3">
                            <div className="w-4 h-4 rounded-full bg-green-500" />
                        </div>
                        <h3 className="text-lg font-bold">Miqat (Bir Ali)</h3>
                        <p className="text-sm text-muted-foreground">Optional Stop</p>
                    </div>
                )}

                {/* Point B */}
                <div className="flex flex-col items-center text-center z-10">
                    <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg mb-4 shadow-secondary/30">
                        <MapPin size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-playfair">{to}</h3>
                    <p className="text-sm text-muted-foreground">{toLabel}</p>
                </div>

            </div>
        </div>
    );
}
