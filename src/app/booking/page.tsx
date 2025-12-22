'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowRight, Calendar, Clock, User, Mail, Phone, MapPin, ChevronDown, Info, ShieldCheck, Headphones, Briefcase, Navigation, Building2, Globe } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/common/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';

import { usePricing } from '@/context/PricingContext';
import ClockTimePicker from '@/components/ui/TimePicker/ClockTimePicker';
import SearchableSelect from '@/components/ui/SearchableSelect';

export default function BookingPage() {
    const { routes, vehicles, calculatePrice, isLoading } = usePricing();
    const [step, setStep] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState<string>('journey');
    const [bookingData, setBookingData] = useState({
        routeId: '',
        selectedVehicles: [] as { vehicleId: string; quantity: number }[],
        date: null as Date | null,
        time: null as Date | null,
        name: '',
        email: '',
        phone: '',
        country: 'Saudi Arabia',
        flightNumber: '',
        arrivalDate: null as Date | null,
        notes: '',
        pickup: '',
        dropoff: ''
    });

    // New Service Type State
    const [serviceType, setServiceType] = useState<'intercity' | 'arrival' | 'departure'>('intercity');

    const [totalPrice, setTotalPrice] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const dropdownRef = useRef<HTMLDivElement>(null);
    const wizardRef = useRef<HTMLDivElement>(null);

    // Initialize defaults when data loads
    useEffect(() => {
        if (!isLoading && routes.length > 0 && vehicles.length > 0) {
            setIsSearching(true);
            const timer = setTimeout(() => {
                setIsSearching(false);
                setBookingData(prev => ({
                    ...prev,
                    routeId: prev.routeId || routes[0].id,
                    selectedVehicles: prev.selectedVehicles.length > 0 ? prev.selectedVehicles : [{ vehicleId: vehicles[0].id, quantity: 1 }],
                    pickup: routes[0].name.split(' to ')[0] || 'Makkah',
                    dropoff: routes[0].name.split(' to ')[1] || 'Madinah'
                }));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, routes, vehicles]);

    useEffect(() => {
        if (bookingData.routeId && bookingData.selectedVehicles.length > 0) {
            if (bookingData.routeId === 'custom') {
                setTotalPrice(0);
                return;
            }
            const total = bookingData.selectedVehicles.reduce((sum, v) => {
                const priceDetails = calculatePrice(bookingData.routeId, v.vehicleId);
                return sum + (priceDetails.price * v.quantity);
            }, 0);
            setTotalPrice(total);
        } else {
            setTotalPrice(0);
        }
    }, [bookingData.routeId, bookingData.selectedVehicles, calculatePrice]);

    const handleVehicleQuantityChange = (vehicleId: string, delta: number) => {
        setBookingData(prev => {
            const existing = prev.selectedVehicles.find(v => v.vehicleId === vehicleId);
            let newVehicles = [...prev.selectedVehicles];

            if (existing) {
                const newQuantity = existing.quantity + delta;
                if (newQuantity <= 0) {
                    newVehicles = newVehicles.filter(v => v.vehicleId !== vehicleId);
                } else {
                    newVehicles = newVehicles.map(v =>
                        v.vehicleId === vehicleId ? { ...v, quantity: newQuantity } : v
                    );
                }
            } else if (delta > 0) {
                newVehicles.push({ vehicleId, quantity: 1 });
            }

            return { ...prev, selectedVehicles: newVehicles };
        });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const updateData = (field: string, value: string | Date | null) => {
        setBookingData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = () => {
        if (step === 1) {
            if (bookingData.routeId === 'custom') {
                if (!bookingData.pickup) {
                    setErrors(prev => ({ ...prev, pickup: 'Pickup is required' }));
                    return false;
                }
                if (!bookingData.dropoff) {
                    setErrors(prev => ({ ...prev, dropoff: 'Dropoff is required' }));
                    return false;
                }
            }
        }
        if (step === 2) {
            if (bookingData.selectedVehicles.length === 0) return false;
        }
        if (step === 3) {
            const newErrors: Record<string, string> = {};
            if (!bookingData.name.trim()) newErrors.name = 'Name is required';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!bookingData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!emailRegex.test(bookingData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }

            const phoneRegex = /^\+[0-9\s-]{10,}$/;
            if (!bookingData.phone.trim()) {
                newErrors.phone = 'Phone is required';
            } else if (!phoneRegex.test(bookingData.phone)) {
                newErrors.phone = 'Please include your country code';
            }

            if (!bookingData.date) newErrors.date = 'Date is required';
            if (!bookingData.time) newErrors.time = 'Time is required';

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }
        return true;
    };

    const scrollToWizard = () => {
        if (wizardRef.current) {
            const yOffset = -120;
            const y = wizardRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToWizard();
    }, [step]);

    const getSelectedRoute = () => {
        if (bookingData.routeId === 'custom') return { name: 'Custom Route', distance: 'N/A', time: 'N/A', baseRate: 0, id: 'custom' };
        return routes.find(r => r.id === bookingData.routeId);
    };

    const nextStep = async () => {
        if (!validateStep()) {
            scrollToWizard();
            return;
        }

        if (step === 4) {
            const route = getSelectedRoute();

            if (route && bookingData.selectedVehicles.length > 0) {
                try {
                    const res = await fetch('/api/bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: bookingData.name,
                            email: bookingData.email,
                            phone: bookingData.phone,
                            pickup: bookingData.pickup,
                            dropoff: bookingData.dropoff,
                            date: bookingData.date?.toISOString().split('T')[0],
                            time: bookingData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                            country: bookingData.country,
                            flightNumber: bookingData.flightNumber,
                            arrivalDate: bookingData.arrivalDate?.toISOString().split('T')[0],
                            // Sending selectedVehicles array instead of single vehicle details
                            selectedVehicles: bookingData.selectedVehicles,
                            status: 'pending',
                            routeId: bookingData.routeId === 'custom' ? 'custom' : bookingData.routeId
                        }),
                    });

                    if (!res.ok) throw new Error('Booking failed');
                    setStep(5);
                    scrollToWizard();
                } catch (error) {
                    console.error('Booking submission error:', error);
                    alert('Failed to submit booking. Please try again.');
                    return;
                }
            }
        } else {
            setStep(prev => prev + 1);
        }
    };


    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleRouteSelect = (routeId: string) => {
        if (routeId === 'custom') {
            setBookingData(prev => ({
                ...prev,
                routeId: 'custom',
                pickup: '',
                dropoff: ''
            }));
        } else {
            const selectedRoute = routes.find(r => r.id === routeId);
            setBookingData(prev => ({
                ...prev,
                routeId,
                pickup: selectedRoute?.name.split(' to ')[0] || '',
                dropoff: selectedRoute?.name.split(' to ')[1] || ''
            }));
        }
        setIsDropdownOpen(false);
        setErrors(prev => ({ ...prev, pickup: '', dropoff: '' }));
    };

    // Filter routes based on Service Type
    const filteredRoutes = routes.filter(r => {
        const lowerName = r.name.toLowerCase();
        const parts = lowerName.split(/ to | \u2192 | \u2194 /);
        const origin = parts[0] || '';
        const destination = parts.length > 1 ? parts[1] : '';
        const isAirportRoute = lowerName.includes('airport');

        if (serviceType === 'arrival') {
            return origin.includes('airport') || lowerName.startsWith('jeddah airport') || lowerName.startsWith('madinah airport');
        }
        if (serviceType === 'departure') {
            return destination.includes('airport') || lowerName.includes('to jeddah airport') || lowerName.includes('to madinah airport');
        }
        return !isAirportRoute;
    });

    const allPickupLocations = [
        "Makkah Hotel", "Makkah Setup", "Madinah Airport", "Madinah Hotel", "Makkah Haram",
        "Madinah Haram", "Jeddah Hotel", "Jeddah Airport", "Jeddah Port", "Al Taif Hotel",
        "Al Taif Airport", "Badar Hotel", "Al Ula Hotel", "Yanbu Hotel", "Yanbu Airport"
    ];

    const allDropoffLocations = [
        "Makkah Hotel", "Makkah Haram", "Madinah Hotel", "Madinah Airport", "Madinah Haram",
        "Jeddah Hotel", "Jeddah Airport", "Jeddah Port", "Al Taif Hotel", "Al Taif Airport",
        "Badar Hotel", "Al Ula Hotel", "Yanbu Hotel", "Yanbu Airport", "Jeddah City Tour",
        "Makkah Ziyarat", "Madinah Ziyarat", "Taif Ziyarat", "Badar Ziyarat", "Al Ula Tour"
    ];

    const pickupLocations = allPickupLocations.filter(loc => {
        if (serviceType === 'arrival') return loc.toLowerCase().includes('airport');
        return true;
    });

    const dropoffLocations = allDropoffLocations.filter(loc => {
        if (serviceType === 'departure') return loc.toLowerCase().includes('airport');
        return true;
    });

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-secondary">Loading...</div>;

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const inputClasses = (hasError: boolean) => `
        w-full premium-input rounded-xl px-4 py-3.5 
        text-slate-900 dark:text-white placeholder:text-slate-400 
        outline-none transition-all
        ${hasError ? 'border-red-500 ring-2 ring-red-500/10' : ''}
    `;

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
                            className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-t-secondary border-r-secondary border-b-transparent border-l-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin size={32} className="text-secondary animate-pulse" />
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
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Begin Your Journey</h2>
                        <p className="text-slate-500 text-lg">Select your travel details to view exclusive rates</p>
                    </div>

                    <div className="max-w-xl mx-auto md:mx-0 bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-800">

                        {/* Service Type Dropdown */}
                        <div className="mb-6">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                <Building2 size={18} className="text-secondary" />
                                <span>Service Type</span>
                            </label>
                            <div className="relative">
                                <SearchableSelect
                                    name="serviceType"
                                    value={serviceType}
                                    onChange={(e: any) => {
                                        setServiceType(e.target.value);
                                        updateData('routeId', '');
                                    }}
                                    options={[
                                        { value: 'intercity', label: 'Intercity Transfer' },
                                        { value: 'arrival', label: 'Airport Arrival (Pickup)' },
                                        { value: 'departure', label: 'Airport Departure (Drop-off)' }
                                    ]}
                                    placeholder="Select Service Type"
                                    className="w-full premium-input rounded-xl px-4 py-3.5 text-slate-900 dark:text-white outline-none"
                                    icon={<Building2 size={20} />}
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <MapPin size={18} className="text-secondary" />
                            <span>Choose Journey</span>
                        </label>

                        {/* Custom Dropdown for Routes */}
                        <div className="relative mb-8" ref={dropdownRef}>
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    relative w-full premium-input
                                    rounded-xl px-4 py-4 flex items-center justify-between 
                                    cursor-pointer transition-all hover:border-secondary/50 hover:shadow-md
                                    ${isDropdownOpen ? 'border-secondary ring-2 ring-secondary/20' : ''}
                                `}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className="font-semibold text-slate-900 dark:text-white text-lg">
                                    {getSelectedRoute()?.name || 'Select a Route'}
                                </span>
                                <ChevronDown
                                    className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-secondary' : ''}`}
                                    size={20}
                                />
                            </motion.div>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: 10, height: 0 }}
                                        className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar"
                                    >
                                        <motion.div
                                            className={`
                                                px-4 py-3 flex items-center gap-4 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700/50
                                                ${bookingData.routeId === 'custom' ? 'bg-secondary/10 dark:bg-secondary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                                            `}
                                            onClick={() => handleRouteSelect('custom')}
                                        >
                                            <div className={`
                                                w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                                ${bookingData.routeId === 'custom' ? 'bg-secondary/20 dark:bg-secondary/20 text-secondary' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}
                                            `}>
                                                <Navigation size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <span className="block font-semibold text-slate-900 dark:text-white">Custom Journey</span>
                                                <span className="text-xs text-slate-500">Specify your own pickup and dropoff</span>
                                            </div>
                                            {bookingData.routeId === 'custom' && <CheckCircle size={18} className="text-secondary" />}
                                        </motion.div>
                                        {filteredRoutes.length > 0 ? (
                                            filteredRoutes.map((route, i) => (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    key={route.id}
                                                    className={`
                                                        px-4 py-3 flex items-center gap-4 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0
                                                        ${bookingData.routeId === route.id ? 'bg-secondary/10 dark:bg-secondary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                                                    `}
                                                    onClick={() => handleRouteSelect(route.id)}
                                                >
                                                    <div className={`
                                                        w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                                        ${bookingData.routeId === route.id ? 'bg-secondary/20 dark:bg-secondary/20 text-secondary dark:text-secondary' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}
                                                    `}>
                                                        <MapPin size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="block font-semibold text-slate-900 dark:text-white">{route.name}</span>
                                                        <span className="text-xs text-slate-500">{route.distance} • {route.time}</span>
                                                    </div>
                                                    {bookingData.routeId === route.id && <CheckCircle size={18} className="text-secondary" />}
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-slate-500 text-sm">
                                                No specific routes found for this service type. Check "Intercity" or others.
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Custom Route Fields */}
                        <AnimatePresence>
                            {bookingData.routeId === 'custom' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-8 grid md:grid-cols-2 gap-6"
                                >
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Pickup Location</label>
                                        <SearchableSelect
                                            name="pickup"
                                            value={bookingData.pickup}
                                            onChange={(e: any) => updateData('pickup', e.target.value)}
                                            options={pickupLocations.map(p => ({ value: p, label: p }))}
                                            placeholder="Select Pickup"
                                            className={inputClasses(!!errors.pickup)}
                                            icon={<MapPin size={18} />}
                                        />
                                        {errors.pickup && <p className="text-red-500 text-xs mt-1">{errors.pickup}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Dropoff Destination</label>
                                        <SearchableSelect
                                            name="dropoff"
                                            value={bookingData.dropoff}
                                            onChange={(e: any) => updateData('dropoff', e.target.value)}
                                            options={dropoffLocations.map(d => ({ value: d, label: d }))}
                                            placeholder="Select Dropoff"
                                            className={inputClasses(!!errors.dropoff)}
                                            icon={<MapPin size={18} />}
                                        />
                                        {errors.dropoff && <p className="text-red-500 text-xs mt-1">{errors.dropoff}</p>}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Route Info Card */}
                        {bookingData.routeId && bookingData.routeId !== 'custom' && getSelectedRoute() && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Route Details</h4>
                                        <p className="text-sm text-slate-500">
                                            {getSelectedRoute()?.distance} • {getSelectedRoute()?.time} approx
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <span className="block text-[10px] uppercase font-bold text-slate-400">Starting From</span>
                                        <span className="font-bold text-secondary text-lg">{getSelectedRoute()?.baseRate} SAR</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {bookingData.routeId === 'custom' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 shadow-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Custom Quote Required</h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            The final price for custom routes may vary from the estimates. Our team will contact you to confirm the exact rate.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const renderStep2 = () => {

        return (
            <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                <div className="mb-6 pl-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Select Your Vehicle</h2>
                    <p className="text-slate-500 text-sm">Choose a vehicle that fits your needs</p>
                </div>

                {/* Mobile Dropdown (Visible on small screens) */}
                <div className="lg:hidden mb-8">
                    <div className="relative">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <Briefcase size={18} className="text-secondary" />
                            <span>Choose Vehicle</span>
                        </label>

                        {/* Selected Vehicle Cards (Mobile Hero) */}
                        <div className="space-y-4 mb-4">
                            <AnimatePresence>
                                {bookingData.selectedVehicles.map((sv) => {
                                    const v = vehicles.find(veh => veh.id === sv.vehicleId);
                                    if (!v) return null;

                                    return (
                                        <motion.div
                                            key={sv.vehicleId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-lg border border-secondary/20 group"
                                        >
                                            {/* Background Image / Placeholder */}
                                            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
                                                {v.image ? (
                                                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Briefcase className="text-slate-400 opacity-20" size={48} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                            {/* 'SELECTED' Badge */}
                                            <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                                                Selected {sv.quantity > 1 && `x${sv.quantity}`}
                                            </div>

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                                <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{v.name}</h3>
                                                <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
                                                    <span>{v.capacity} Seater</span>
                                                    <span className="w-1 h-1 rounded-full bg-white/50" />
                                                    <span>{v.luggage} Bags</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Dropdown Header */}
                        <div
                            className={`
                                relative w-full premium-input
                                rounded-xl px-4 py-4 flex items-center justify-between 
                                cursor-pointer transition-all hover:border-secondary/50
                                ${isVehicleDropdownOpen ? 'border-secondary ring-2 ring-secondary/20' : ''}
                            `}
                            onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                        >
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {bookingData.selectedVehicles.length > 0
                                    ? `${bookingData.selectedVehicles.reduce((acc, v) => acc + v.quantity, 0)} Vehicles Selected`
                                    : 'Select Vehicles'}
                            </span>
                            <ChevronDown className={`text-slate-400 transition-transform ${isVehicleDropdownOpen ? 'rotate-180 text-secondary' : ''}`} size={20} />
                        </div>

                        {/* Dropdown List */}
                        {isVehicleDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="absolute top-full left-0 w-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-2xl z-[100] max-h-[60vh] overflow-y-auto custom-scrollbar pb-4 ring-1 ring-black/5"
                            >
                                {vehicles.map((vehicle, idx) => {
                                    const priceDetails = calculatePrice(bookingData.routeId, vehicle.id);
                                    const selectedMatch = bookingData.selectedVehicles.find(v => v.vehicleId === vehicle.id);
                                    const quantity = selectedMatch ? selectedMatch.quantity : 0;
                                    const isSelected = quantity > 0;

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={vehicle.id}
                                            className={`
                                                relative p-4 flex flex-col gap-3 border-b border-slate-100 dark:border-white/5 last:border-0 transition-all duration-200 group
                                                ${isSelected ? 'bg-secondary/5 dark:bg-secondary/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}
                                            `}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* List Item Image */}
                                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-white/10 shadow-sm relative">
                                                    {vehicle.image ? (
                                                        <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                                                    ) : <div className="w-full h-full flex items-center justify-center"><User size={20} className="text-slate-300" /></div>}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`block font-bold text-sm ${isSelected ? 'text-secondary dark:text-secondary' : 'text-slate-900 dark:text-white'}`}>
                                                            {vehicle.name}
                                                        </span>
                                                        <div className="text-right shrink-0 ml-2">
                                                            {bookingData.routeId === 'custom' ? (
                                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Quote</span>
                                                            ) : (
                                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                                    {priceDetails.price} <span className="text-xs font-normal text-slate-500">SAR</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                                        <span>{vehicle.capacity} Passengers</span>
                                                        <span>•</span>
                                                        <span>{vehicle.luggage} Bags</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quantity Controls Row */}
                                            <div className="flex justify-end items-center gap-3 pt-2">
                                                {quantity > 0 ? (
                                                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, -1); }}
                                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="font-bold text-sm min-w-[1.5rem] text-center">{quantity}</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, 1); }}
                                                            className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary text-white hover:bg-secondary/90"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, 1); }}
                                                        className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                                                    >
                                                        Add to Booking
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Desktop Grid (Hidden on mobile) */}
                <div className="hidden lg:grid grid-cols-2 gap-6">
                    {vehicles.map((vehicle) => {
                        const Icon = vehicle.icon;
                        const priceDetails = calculatePrice(bookingData.routeId, vehicle.id);
                        const selectedMatch = bookingData.selectedVehicles.find(v => v.vehicleId === vehicle.id);
                        const quantity = selectedMatch ? selectedMatch.quantity : 0;

                        return (
                            <motion.div
                                key={vehicle.id}
                                whileHover={{ y: -6 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    relative rounded-2xl transition-all duration-300 group overflow-hidden flex flex-col
                                    ${quantity > 0 ? 'bg-white dark:bg-slate-800 border-2 border-secondary shadow-xl shadow-secondary/20' : 'premium-card hover:border-secondary/50'}
                                `}
                            >
                                {/* Image Container */}
                                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-white/5">
                                    {vehicle.image ? (
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.name}
                                            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Icon size={64} />
                                        </div>
                                    )}

                                    {/* Overlay Gradient for Text Readability if needed */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                    {/* Quantity Controls Overlay */}
                                    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                                        {quantity > 0 ? (
                                            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-200 dark:border-slate-700">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVehicleQuantityChange(vehicle.id, -1);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="font-bold text-slate-900 dark:text-white w-4 text-center">{quantity}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVehicleQuantityChange(vehicle.id, 1);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary text-white hover:bg-secondary/90 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVehicleQuantityChange(vehicle.id, 1);
                                                }}
                                                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/50 px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm"
                                            >
                                                Add Vehicle
                                            </button>
                                        )}
                                    </div>

                                    {/* Price Tag Overlay */}
                                    <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-white/20">
                                        {bookingData.routeId === 'custom' ? (
                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                Custom Quote
                                            </span>
                                        ) : priceDetails.discountApplied > 0 ? (
                                            <div className="flex flex-col items-end leading-none">
                                                <span className="text-[10px] text-slate-500 line-through decoration-red-500/50 mb-0.5">
                                                    {priceDetails.originalPrice} SAR
                                                </span>
                                                <span className="text-lg font-black text-red-600">
                                                    {priceDetails.price} <span className="text-[10px] font-bold text-slate-500">SAR</span>
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-lg font-black text-slate-900 dark:text-white">
                                                {priceDetails.price} <span className="text-xs font-bold text-slate-500">SAR</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className={`text - xl font - bold mb - 1 transition - colors ${quantity > 0 ? 'text-secondary dark:text-secondary' : 'text-slate-900 dark:text-white'} `}>
                                                {vehicle.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-medium">{vehicle.capacity}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-slate-50 dark:border-white/5">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-1.5 rounded-md border border-slate-100 dark:border-slate-600">
                                            <Briefcase size={12} className="text-slate-400" />
                                            <span>{vehicle.luggage}</span>
                                        </div>
                                        {vehicle.features.slice(0, 2).map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-1.5 rounded-md border border-slate-100 dark:border-slate-600">
                                                <CheckCircle size={12} className="text-emerald-500" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    const renderStep3 = () => (
        <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Trip Details</h2>
                <p className="text-slate-500 text-sm mb-6">When do you need the ride?</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <Calendar size={16} className="text-secondary" /> Date
                        </label>
                        <div className="relative">
                            <DatePicker
                                selected={bookingData.date}
                                onChange={(date) => updateData('date', date)}
                                placeholderText="Select Date"
                                className={inputClasses(!!errors.date)}
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                portalId="datepicker-portal"
                                popperClassName="home-datepicker-popper"
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1 absolute">{errors.date}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <Clock size={16} className="text-secondary" /> Pickup Time
                        </label>
                        <div className="relative">
                            <ClockTimePicker
                                date={bookingData.time}
                                onChange={(date) => updateData('time', date)}
                                placeholderText="Select Time"
                                className={inputClasses(!!errors.time)}
                            />
                            {errors.time && <p className="text-red-500 text-xs mt-1 absolute">{errors.time}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Detailed Information</h2>
                <p className="text-slate-500 text-sm mb-6">Please provide your details below</p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Country / Region */}
                    <div className="col-span-2 relative group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Country / Region *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Globe size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <select
                                className={`${inputClasses(false)} pl-11`}
                                value={bookingData.country}
                                onChange={(e) => updateData('country', e.target.value)}
                            >
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="United Arab Emirates">United Arab Emirates</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Oman">Oman</option>
                                <option value="Qatar">Qatar</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States">United States</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="India">India</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="relative group col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Phone *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <input
                                type="tel"
                                className={`${inputClasses(!!errors.phone)} pl-11`}
                                value={bookingData.phone}
                                onChange={(e) => updateData('phone', e.target.value)}
                                placeholder="+966 50 000 0000"
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div className="relative group col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <input
                                type="email"
                                className={`${inputClasses(!!errors.email)} pl-11`}
                                value={bookingData.email}
                                onChange={(e) => updateData('email', e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                    </div>

                    {/* Flight Details */}
                    <div className="relative group col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Flight Details (Optional)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold text-xs">FL</span>
                            </div>
                            <input
                                type="text"
                                className={`${inputClasses(false)} pl-11`}
                                value={bookingData.flightNumber}
                                onChange={(e) => updateData('flightNumber', e.target.value)}
                                placeholder="Flight Number (e.g., SV123)"
                            />
                        </div>
                    </div>

                    {/* Arrival Airport Date */}
                    <div className="relative group col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Arrival Airport Date (Optional)</label>
                        <div className="relative">
                            <DatePicker
                                selected={bookingData.arrivalDate}
                                onChange={(date) => updateData('arrivalDate', date)}
                                placeholderText="Select Arrival Date"
                                className={`${inputClasses(false)} pl-4`}
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                portalId="datepicker-portal-arrival"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Additional information</h2>

                <div className="relative group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Order Notes (optional)</label>
                    <textarea
                        className={`${inputClasses(false)} pl-4 py-3 min-h-[120px] resize-y`}
                        value={bookingData.notes || ''}
                        onChange={(e) => updateData('notes', e.target.value)}
                        placeholder="Notes about your order, e.g. special notes for delivery."
                    />
                </div>
            </div>
        </motion.div>
    );

    const renderSummary = () => {
        const route = getSelectedRoute();

        // Calculate total price details for all vehicles
        const priceDetails = bookingData.selectedVehicles.reduce((acc, sv) => {
            if (bookingData.routeId === 'custom') return acc;
            const details = calculatePrice(bookingData.routeId, sv.vehicleId);
            return {
                originalPrice: acc.originalPrice + (details.originalPrice || 0) * sv.quantity,
                discountApplied: acc.discountApplied + (details.discountApplied || 0) * sv.quantity,
                price: acc.price + details.price * sv.quantity
            };
        }, { originalPrice: 0, discountApplied: 0, price: 0 });



        return (
            <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                <div className="mb-6 pl-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review & Confirm</h2>
                    <p className="text-slate-500 text-sm">Please verify your booking details</p>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    {/* Journey Details Accordion */}
                    <div className="border-b border-slate-100 dark:border-slate-700">
                        <button
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                            onClick={() => setAccordionOpen(accordionOpen === 'journey' ? '' : 'journey')}
                        >
                            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                                <MapPin size={16} /> Journey Details
                            </h3>
                            <ChevronDown className={`text - slate - 400 transition - transform ${accordionOpen === 'journey' ? 'rotate-180' : ''} `} size={20} />
                        </button>
                        <AnimatePresence>
                            {accordionOpen === 'journey' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 pt-2 space-y-3">
                                        <div className="flex justify-between items-start text-sm">
                                            <span className="text-slate-500 shrink-0">Route</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-right">{route?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-start text-sm">
                                            <span className="text-slate-500 shrink-0">Vehicles</span>
                                            <div className="text-right">
                                                {bookingData.selectedVehicles.map(sv => {
                                                    const vRef = vehicles.find(v => v.id === sv.vehicleId);
                                                    return vRef ? (
                                                        <div key={sv.vehicleId} className="font-bold text-slate-900 dark:text-white">
                                                            {vRef.name} <span className="text-xs font-normal text-slate-500">x{sv.quantity}</span>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Date & Time</span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {bookingData.date?.toLocaleDateString()} at {bookingData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Passenger Details Accordion */}
                    <div className="border-b border-slate-100 dark:border-slate-700">
                        <button
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                            onClick={() => setAccordionOpen(accordionOpen === 'passenger' ? '' : 'passenger')}
                        >
                            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                                <User size={16} /> Passenger Details
                            </h3>
                            <ChevronDown className={`text - slate - 400 transition - transform ${accordionOpen === 'passenger' ? 'rotate-180' : ''} `} size={20} />
                        </button>
                        <AnimatePresence>
                            {accordionOpen === 'passenger' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 pt-2 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Full Name</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{bookingData.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Phone</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{bookingData.phone}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Email</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{bookingData.email}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Country</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{bookingData.country}</span>
                                        </div>
                                        {bookingData.flightNumber && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Flight</span>
                                                <span className="font-semibold text-slate-900 dark:text-white">{bookingData.flightNumber}</span>
                                            </div>
                                        )}
                                        {bookingData.arrivalDate && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Arrival Date</span>
                                                <span className="font-semibold text-slate-900 dark:text-white">{bookingData.arrivalDate?.toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Total - Always Visible */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6">
                        {priceDetails.discountApplied > 0 && (
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Original Price</span>
                                <span className="text-slate-400 line-through">{priceDetails.originalPrice} SAR</span>
                            </div>
                        )}
                        {priceDetails.discountApplied > 0 && (
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-green-600">Discount</span>
                                <span className="text-green-600">-{priceDetails.discountApplied} SAR</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900 dark:text-white text-lg">Total Price</span>
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#B38E2D]">{totalPrice} <span className="text-sm text-slate-500 font-bold ml-1">SAR</span></span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderSuccess = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
        >
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Booking Request Received!</h2>
            <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto">
                Thank you, {bookingData.name}. We have received your booking request. Our team will contact you shortly via WhatsApp to confirm your vehicle and route details.
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/" className="px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#B38E2D]/90 transition-all">
                    Return Home
                </Link>
                <Link href="/contact" className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    Contact Support
                </Link>
            </div>
        </motion.div>
    );

    const Sidebar = () => {
        const route = getSelectedRoute();

        return (
            <div className="sticky top-40 space-y-6">
                {/* Summary Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Briefcase size={20} className="text-secondary" />
                        Booking Summary
                    </h3>

                    {/* Timeline */}
                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-700">
                        {/* Pickup */}
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 bg-secondary shadow-sm" />
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Origin</span>
                                <h4 className="font-bold text-slate-900 dark:text-white">
                                    {bookingData.routeId === 'custom' ? (bookingData.pickup || 'Select Pickup') : (route ? route.name.split(' to ')[0] : 'Select Route')}
                                </h4>
                                {bookingData.date && (
                                    <p className="text-sm text-slate-500 mt-1">
                                        {bookingData.date.toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Dropoff */}
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 bg-slate-900 dark:bg-white shadow-sm" />
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Destination</span>
                                <h4 className="font-bold text-slate-900 dark:text-white">
                                    {bookingData.routeId === 'custom' ? (bookingData.dropoff || 'Select Dropoff') : (route ? route.name.split(' to ')[1] : 'Select Route')}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="my-6 border-t border-slate-100 dark:border-slate-700" />

                    {/* Selected Vehicles */}
                    <div className="mb-6 space-y-4">
                        {bookingData.selectedVehicles.length > 0 ? (
                            bookingData.selectedVehicles.map((sv) => {
                                const v = vehicles.find(v => v.id === sv.vehicleId);
                                if (!v) return null;
                                return (
                                    <div key={sv.vehicleId} className="flex items-center gap-4">
                                        <div className="w-16 h-12 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center justify-center overflow-hidden">
                                            {v.image ? (
                                                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{v.name}</h4>
                                                <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">x{sv.quantity}</span>
                                            </div>
                                            <p className="text-xs text-slate-500">{v.capacity} • {v.luggage}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-sm text-slate-500 italic">No vehicles selected</div>
                        )}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-semibold text-slate-500 pb-1">Total Quote</span>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-slate-900 dark:text-white">
                                {totalPrice} <span className="text-sm font-bold text-slate-400">SAR</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                        <ShieldCheck size={24} className="text-emerald-500 mx-auto mb-2" />
                        <span className="block text-xs font-semibold text-slate-900 dark:text-white">Secure Booking</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                        <Headphones size={24} className="text-blue-500 mx-auto mb-2" />
                        <span className="block text-xs font-semibold text-slate-900 dark:text-white">24/7 Support</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 pb-24">
            {/* Progress Bar (Sticky) */}
            <div className="sticky top-[35px] z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4">
                    <div className="flex items-start justify-between py-3 max-w-4xl mx-auto">
                        {[
                            { step: 1, label: 'Journey' },
                            { step: 2, label: 'Vehicle' },
                            { step: 3, label: 'Details' },
                            { step: 4, label: 'Review' }
                        ].map((s) => (
                            <div key={s.step} className="flex relative group sm:flex-1 last:flex-none">
                                <div className="flex flex-col items-center z-10">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 ring-white dark:ring-slate-950 mb-1
                                        ${step >= s.step ? 'bg-secondary text-white shadow-lg shadow-secondary/30 scale-110' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}
                                    `}>
                                        {step > s.step ? <CheckCircle size={18} /> : s.step}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${step >= s.step ? 'text-secondary' : 'text-slate-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {s.step < 4 && (
                                    <div className={`
                                        flex-1 h-1 mx-4 rounded-full transition-all duration-500 hidden sm:block mt-5
                                        ${step > s.step ? 'bg-secondary' : 'bg-slate-100 dark:bg-slate-800'}
                                    `} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-24" ref={wizardRef}>
                <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
                    {/* Main Wizard Area */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                            {step === 4 && renderSummary()}
                            {step === 5 && renderSuccess()}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        {step < 5 && (
                            <div className="mt-10 flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                {step > 1 && (
                                    <button
                                        onClick={prevStep}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={nextStep}
                                    className="ml-auto flex items-center gap-2 px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#B38E2D]/90 transition-all hover:-translate-y-1 active:translate-y-0"
                                >
                                    {step === 4 ? 'Confirm Booking' : 'Continue'}
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        {step < 5 && <Sidebar />}
                    </div>
                </div>
            </div>

        </main>
    );
}



