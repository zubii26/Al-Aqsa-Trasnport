const fs = require('fs');
const filePath = 'src/app/(public)/booking/page.tsx';
let code = fs.readFileSync(filePath, 'utf-8');

// 1. Fix settings?.customRoute
code = code.replace(/settings\.customRoute/g, "settings?.customRoute");

// 2. Replace renderStep1 inner content
const startMarker = "{/* Pickup & Dropoff Selection */}";
const endMarker = "</AnimatePresence>";

const renderStep1Start = code.indexOf('const renderStep1 = () => (');
const startIndex = code.indexOf(startMarker, renderStep1Start);
const endIndex = code.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find renderStep1 markers");
    process.exit(1);
}

const newContent = `{/* Multi-Leg Journey Selection */}
<div className="space-y-6 mb-8 relative z-20">
    {legs.map((leg, index) => (
        <div key={leg.id} className="relative ios-glass p-4 md:p-6 rounded-2xl border border-white/10 dark:border-slate-700/30">
            {legs.length > 1 && (
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Route {index + 1}</h4>
                    <button 
                        onClick={() => removeLeg(leg.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 transition-colors"
                    >
                        <X size={16} strokeWidth={2} />
                    </button>
                </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6 mb-4 relative z-20">
                <div className="relative group" style={{ zIndex: 30 - index * 2 }}>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                        Pickup From
                    </label>
                    <SearchableSelect
                        name={\`pickup-\${leg.id}\`}
                        value={leg.pickup}
                        onChange={(e: any) => {
                            const val = e.target.value;
                            updateLeg(leg.id, 'pickup', val);
                            updateLeg(leg.id, 'dropoff', '');
                            updateLeg(leg.id, 'routeId', '');
                        }}
                        options={[
                            ...Array.from(new Set(filteredRoutes.map(r => getRouteOrigin(r)))).filter(Boolean).sort().map(p => ({ value: p, label: p }))
                        ]}
                        placeholder="Select Pickup"
                        className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none text-base"
                        icon={<MapPin strokeWidth={1.25} size={20} />}
                    />
                </div>

                <div className="relative group" style={{ zIndex: 29 - index * 2 }}>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                        Dropoff To
                    </label>
                    <SearchableSelect
                        name={\`dropoff-\${leg.id}\`}
                        value={leg.dropoff}
                        onChange={(e: any) => {
                            const val = e.target.value;
                            updateLeg(leg.id, 'dropoff', val);
                            if (leg.pickup && val) {
                                const matchedRoute = filteredRoutes.find(r =>
                                    getRouteOrigin(r) === leg.pickup && getRouteDestination(r) === val
                                );
                                if (matchedRoute) {
                                    updateLeg(leg.id, 'routeId', matchedRoute.id);
                                } else {
                                    updateLeg(leg.id, 'routeId', '');
                                }
                            }
                        }}
                        options={
                            leg.pickup && leg.pickup !== 'custom'
                                ? Array.from(new Set(filteredRoutes
                                    .filter(r => getRouteOrigin(r) === leg.pickup)
                                    .map(r => getRouteDestination(r))
                                    .filter(Boolean)
                                )).sort().map(d => ({ value: d, label: d }))
                                : []
                        }
                        disabled={!leg.pickup || leg.pickup === 'custom'}
                        placeholder={!leg.pickup ? "Select Pickup First" : "Select Dropoff"}
                        className={\`w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none text-base \${(!leg.pickup || leg.pickup === 'custom') ? 'opacity-50 cursor-not-allowed' : ''}\`}
                        icon={<Navigation strokeWidth={1.25} size={20} />}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="relative group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Date *</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={leg.date ? new Date(leg.date).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                if (!e.target.value) {
                                    updateLeg(leg.id, 'date', null);
                                    return;
                                }
                                updateLeg(leg.id, 'date', new Date(e.target.value));
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            className={inputClasses(errors.date !== undefined)}
                        />
                    </div>
                </div>

                <div className="relative group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Time (Optional)</label>
                    <div className="relative">
                        <input
                            type="time"
                            value={leg.time ? new Date(leg.time).toTimeString().substring(0, 5) : ''}
                            onChange={(e) => {
                                if (!e.target.value) {
                                    updateLeg(leg.id, 'time', null);
                                    return;
                                }
                                const [hours, minutes] = e.target.value.split(':');
                                const newDate = leg.time ? new Date(leg.time) : new Date();
                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                updateLeg(leg.id, 'time', newDate);
                            }}
                            className={inputClasses(false)}
                        />
                    </div>
                </div>
            </div>
            
            {leg.routeId && leg.routeId !== 'custom' && (
                <div className="mt-4 bg-secondary/5 dark:bg-secondary/10 rounded-xl p-3 border border-secondary/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shrink-0">
                        <CheckCircle strokeWidth={2} size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Route Confirmed</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {filteredRoutes.find(r => r.id === leg.routeId)?.name || ''}
                        </p>
                    </div>
                </div>
            )}
        </div>
    ))}

    <div className="flex justify-center mt-6">
        <button
            onClick={addLeg}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Another Route</span>
        </button>
    </div>
</div>`;

code = code.substring(0, startIndex) + newContent + code.substring(endIndex);
fs.writeFileSync(filePath, code, 'utf-8');
console.log("Successfully patched renderStep1 for multi-routes.");
