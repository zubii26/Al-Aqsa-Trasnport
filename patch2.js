const fs = require('fs');
const filePath = 'src/app/(public)/booking/page.tsx';
let code = fs.readFileSync(filePath, 'utf-8');

// Replace handleRouteSelect and renderStep1
const oldBlock = `    const handleRouteSelect = (routeId: string) => {
        if (routeId === 'custom') {
            setBookingData(prev => ({
                ...prev,
                routeId: 'custom',
                pickup: '',
                dropoff: ''
            }));
            setSelectedRoute(null); // Clear selected route for custom
        } else {
            const selectedRoute = routes.find(r => r.id === routeId);
            const pickup = selectedRoute ? getRouteOrigin(selectedRoute) : '';
            const dropoff = selectedRoute ? getRouteDestination(selectedRoute) : '';

            setBookingData(prev => ({
                ...prev,
                routeId,
                pickup,
                dropoff
            }));
            setSelectedRoute(selectedRoute || null); // Set selected route
        }
        setIsDropdownOpen(false);
        setErrors(prev => ({ ...prev, pickup: '', dropoff: '' }));
    };

    const filteredRoutes = routes;

    const pickupLocations = Array.from(new Set(routes.map(r => getRouteOrigin(r)))).filter(Boolean).sort();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-secondary">Loading...</div>;

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const inputClasses = (hasError: boolean) => \`
        w-full premium-input rounded-xl px-4 py-3.5 
        text-slate-900 dark:text-white placeholder:text-slate-400 
        outline-none transition-all
        \${hasError ? 'border-red-500 ring-2 ring-red-500/10' : ''}
    \`;

    const renderStep1 = () => (
        <AnimatePresence mode="wait">
            {isSearching ? (
                <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="relative w-24 h-24 mb-6">
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-t-secondary border-r-secondary border-b-transparent border-l-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin strokeWidth={1.25} size={32} className="text-secondary animate-pulse" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Finding Best Routes...</h3>
                    <p className="text-slate-500">Scanning available luxury transfers</p>
                </motion.div>
            ) : (
                <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Begin Your Journey</h2>
                        <p className="text-slate-500 text-xl font-light mb-4">Experience premium transport with our gold-standard service.</p>
                        <NusukBadge variant="gold" />
                    </div>

                    <div className="max-w-xl mx-auto md:mx-0 ios-glass p-6 md:p-10 rounded-[32px] border border-white/20 dark:border-slate-700/50 shadow-2xl relative">
                        {/* Decorative Gold sheen - Contained to avoid spilling but separate from content clipping */}
                        <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        </div>


                        {/* Pickup & Dropoff Selection */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8 relative z-20">
                            {/* Pickup Location - Higher Z-Index to overlap Dropoff */}
                            <div className="relative group z-20">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-secondary transition-colors">
                                    Pickup From
                                </label>
                                <SearchableSelect
                                    name="pickup"
                                    value={bookingData.pickup}
                                    onChange={(e: any) => {
                                        const val = e.target.value;
                                        if (val === 'custom') {
                                            handleRouteSelect('custom');
                                        } else {
                                            // Reset route ID if changing pickup, wait for dropoff
                                            setBookingData(prev => ({
                                                ...prev,
                                                pickup: val,
                                                dropoff: '', // Reset dropoff when pickup changes
                                                routeId: ''  // Clear route ID until both satisfy
                                            }));
                                            setSelectedRoute(null);
                                        }
                                    }}
                                    options={[
                                        ...Array.from(new Set(filteredRoutes.map(r => getRouteOrigin(r)))).filter(Boolean).sort().map(p => ({ value: p, label: p }))
                                    ]}
                                    placeholder="Select Pickup"
                                    className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none text-base"
                                    icon={<MapPin strokeWidth={1.25} size={20} />}
                                />
                            </div>

                            {/* Dropoff Location - Lower Z-Index */}
                            <div className="relative group z-10">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-secondary transition-colors">
                                    Dropoff To
                                </label>
                                <SearchableSelect
                                    name="dropoff"
                                    value={bookingData.dropoff}
                                    onChange={(e: any) => {
                                        const val = e.target.value;
                                        setBookingData(prev => {
                                            const newData = { ...prev, dropoff: val };

                                            // Try to find matching route using origin/destination
                                            if (prev.pickup && val) {
                                                const matchedRoute = filteredRoutes.find(r =>
                                                    getRouteOrigin(r) === prev.pickup && getRouteDestination(r) === val
                                                );

                                                if (matchedRoute) {
                                                    newData.routeId = matchedRoute.id;
                                                    setSelectedRoute(matchedRoute);
                                                    setErrors(curr => ({ ...curr, pickup: '', dropoff: '' }));
                                                } else {
                                                    newData.routeId = '';
                                                    setSelectedRoute(null);
                                                }
                                            }
                                            return newData;
                                        });
                                    }}
                                    options={
                                        bookingData.pickup && bookingData.pickup !== 'custom'
                                            ? Array.from(new Set(filteredRoutes
                                                .filter(r => getRouteOrigin(r) === bookingData.pickup)
                                                .map(r => getRouteDestination(r))
                                                .filter(Boolean)
                                            )).sort().map(d => ({ value: d, label: d }))
                                            : []
                                    }
                                    disabled={!bookingData.pickup || bookingData.pickup === 'custom'}
                                    placeholder={!bookingData.pickup ? "Select Pickup First" : "Select Dropoff"}
                                    className={\`w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none text-base \${(!bookingData.pickup || bookingData.pickup === 'custom') ? 'opacity-50 cursor-not-allowed' : ''}\`}
                                    icon={<Navigation strokeWidth={1.25} size={20} />}
                                />
                            </div>
                        </div>

                        {/* Route Info Card or Custom Warning */}
                        <AnimatePresence mode='wait'>
                            {bookingData.routeId === 'custom' ? (
                                <motion.div
                                    key="custom-banner"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-8"
                                >
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 shadow-sm mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                <Info strokeWidth={1.25} size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Custom Journey Map Routing</h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Use the interactive map below to select your pickup and dropoff coordinates dynamically.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 p-6 rounded-2xl text-center">
                                            <p className="font-medium">Custom routing is currently unavailable.</p>
                                            <p className="text-sm mt-2 opacity-80">Please select a standard route from the dropdowns above.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                selectedRoute && (
                                    <motion.div
                                        key="route-info"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="ios-glass rounded-[32px] p-6 border border-secondary/20 shadow-lg shadow-secondary/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/30">
                                                <MapPin strokeWidth={1.25} size={28} fill="currentColor" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Route Selected</h4>
                                                <p className="text-sm text-slate-500 font-medium">
                                                    {selectedRoute.distance} • {selectedRoute.time} approx
                                                </p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Starting From</span>
                                                <span className="font-black text-secondary text-2xl tracking-tight">{selectedRoute.baseRate} <span className="text-sm text-slate-500">SAR</span></span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>



                    </div>

                </motion.div>
            )
            }
        </AnimatePresence >
    );`;

const newBlock = `    const filteredRoutes = routes;

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-secondary">Loading...</div>;

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const inputClasses = (hasError: boolean) => \`
        w-full premium-input rounded-xl px-4 py-3.5 
        text-slate-900 dark:text-white placeholder:text-slate-400 
        outline-none transition-all
        \${hasError ? 'border-red-500 ring-2 ring-red-500/10' : ''}
    \`;

    const handleLegChange = (legId: string, field: string, value: string) => {
        setLegs(prev => prev.map(leg => {
            if (leg.id === legId) {
                const newLeg = { ...leg, [field]: value };
                if (field === 'pickup') {
                    newLeg.dropoff = '';
                    newLeg.routeId = '';
                }
                if (field === 'dropoff' && newLeg.pickup) {
                    const matched = filteredRoutes.find(r => getRouteOrigin(r) === newLeg.pickup && getRouteDestination(r) === val);
                    newLeg.routeId = matched ? matched.id : '';
                }
                if (prev[0].id === legId) {
                    setBookingData(curr => ({ ...curr, [field]: value, routeId: newLeg.routeId }));
                }
                return newLeg;
            }
            return leg;
        }));
    };

    const renderStep1 = () => (
        <AnimatePresence mode="wait">
            <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
            >
                <div className="mb-8 text-center md:text-left flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Build Your Journey</h2>
                        <p className="text-slate-500 text-xl font-light">Add one or multiple routes.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {legs.map((leg, index) => {
                        const matchedRoute = filteredRoutes.find(r => r.id === leg.routeId);
                        
                        return (
                        <div key={leg.id} className="max-w-xl mx-auto md:mx-0 ios-glass p-6 md:p-8 rounded-[32px] border border-white/20 dark:border-slate-700/50 shadow-xl relative group">
                            {legs.length > 1 && (
                                <button 
                                    onClick={() => removeLeg(leg.id)}
                                    className="absolute -right-3 -top-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-50"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <h3 className="font-bold text-lg">Route {index + 1}</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="relative z-20">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Pickup From</label>
                                    <SearchableSelect
                                        name="pickup"
                                        value={leg.pickup}
                                        onChange={(e: any) => handleLegChange(leg.id, 'pickup', e.target.value)}
                                        options={[...Array.from(new Set(filteredRoutes.map(r => getRouteOrigin(r)))).filter(Boolean).sort().map(p => ({ value: p, label: p }))]}
                                        placeholder="Select Pickup"
                                        className="w-full premium-input rounded-xl px-4 py-3"
                                        icon={<MapPin size={18} />}
                                    />
                                </div>
                                <div className="relative z-10">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Dropoff To</label>
                                    <SearchableSelect
                                        name="dropoff"
                                        value={leg.dropoff}
                                        onChange={(e: any) => handleLegChange(leg.id, 'dropoff', e.target.value)}
                                        options={leg.pickup ? Array.from(new Set(filteredRoutes.filter(r => getRouteOrigin(r) === leg.pickup).map(r => getRouteDestination(r)).filter(Boolean))).sort().map(d => ({ value: d, label: d })) : []}
                                        disabled={!leg.pickup}
                                        placeholder="Select Dropoff"
                                        className="w-full premium-input rounded-xl px-4 py-3"
                                        icon={<Navigation size={18} />}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Date</label>
                                    <input 
                                        type="date" 
                                        className={inputClasses(false)} 
                                        value={leg.date ? new Date(leg.date).toISOString().split('T')[0] : ''} 
                                        onChange={(e) => updateLeg(leg.id, 'date', e.target.value ? new Date(e.target.value) : null)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Time</label>
                                    <input 
                                        type="time" 
                                        className={inputClasses(false)} 
                                        value={leg.time ? new Date(leg.time).toTimeString().substring(0,5) : ''} 
                                        onChange={(e) => {
                                            if (!e.target.value) return updateLeg(leg.id, 'time', null);
                                            const [h,m] = e.target.value.split(':');
                                            const d = new Date(); d.setHours(parseInt(h), parseInt(m));
                                            updateLeg(leg.id, 'time', d);
                                        }}
                                    />
                                </div>
                            </div>

                            {matchedRoute && (
                                <div className="mt-4 flex items-center gap-3 p-3 bg-secondary/5 rounded-xl border border-secondary/20">
                                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{matchedRoute.distance} • {matchedRoute.time}</div>
                                        <div className="text-xs text-slate-500">Base rate from {matchedRoute.baseRate} SAR</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )})}
                    
                    <button 
                        onClick={addLeg}
                        className="w-full max-w-xl mx-auto md:mx-0 py-4 border-2 border-dashed border-secondary/30 rounded-[32px] text-secondary font-bold hover:bg-secondary/5 hover:border-secondary transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> Add Another Route
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );`;

if (!code.includes("const handleRouteSelect")) {
    console.log("Error: could not find old block");
} else {
    code = code.replace(oldBlock, newBlock);
    fs.writeFileSync(filePath, code, 'utf-8');
    console.log("Phase 2 Patch complete");
}
