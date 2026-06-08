const fs = require('fs');
const filePath = 'src/app/(public)/booking/page.tsx';
let code = fs.readFileSync(filePath, 'utf-8');

const startIndex = code.indexOf('{/* Route Visual */}');
const endIndexStr = '<div className="border-t border-slate-100 dark:border-slate-800 pt-6">';
const endIndex = code.indexOf(endIndexStr);

if (startIndex === -1 || endIndex === -1) {
    console.log("Error finding bounds", startIndex, endIndex);
} else {
    // Determine the exact spaces before {/* Route Visual */}
    const startLineIndex = code.lastIndexOf('\n', startIndex) + 1;
    
    const newBlock = `{/* Route Visuals */}
                            <div className="relative mb-6">
                                <div className="absolute right-0 top-0 z-10">
                                    <button onClick={() => setStep(1)} className="text-xs font-bold text-secondary hover:text-[#B38E2D] hover:underline underline-offset-4 bg-white dark:bg-slate-900 pl-2">
                                        EDIT
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {legs.map((leg, index) => {
                                        const routeMatch = routes.find(r => r.id === leg.routeId);
                                        return (
                                            <div key={leg.id} className="flex items-start gap-4">
                                                <div className="flex flex-col items-center pt-2">
                                                    <div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/20" />
                                                    <div className="w-0.5 h-16 bg-gradient-to-b from-secondary to-slate-200 dark:to-slate-800 my-1" />
                                                    <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white ring-4 ring-slate-100 dark:ring-slate-700" />
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Route {index + 1} Pickup</p>
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                                            {leg.pickup || 'Unknown Pickup'}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1 text-sm font-medium text-slate-500">
                                                            <Calendar strokeWidth={1.25} size={14} className="text-secondary" /> {leg.date ? new Date(leg.date).toLocaleDateString() : 'No date'}
                                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <Clock strokeWidth={1.25} size={14} className="text-secondary" /> {leg.time ? new Date(leg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Route {index + 1} Destination</p>
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                                            {leg.dropoff || 'Unknown Dropoff'}
                                                        </h3>
                                                        {routeMatch && (
                                                            <div className="flex items-center gap-2 mt-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md w-fit">
                                                                <span>{routeMatch.distance}</span>
                                                                <span>•</span>
                                                                <span>{routeMatch.time}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            `;
                            
    code = code.substring(0, startLineIndex) + newBlock + code.substring(endIndex);
    fs.writeFileSync(filePath, code, 'utf-8');
    console.log("Phase 4 Patch complete");
}
