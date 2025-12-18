'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowRight, Calendar, Clock, User, Mail, Phone, MapPin, ChevronDown, Info, ShieldCheck, Headphones, Briefcase } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/common/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';

import { usePricing } from '@/context/PricingContext';
import ClockTimePicker from '@/components/ui/TimePicker/ClockTimePicker';

export default function BookingPage() {
    const { routes, vehicles, calculatePrice, isLoading } = usePricing();
    const [step, setStep] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState<string>('journey');
    const [bookingData, setBookingData] = useState({
        routeId: '',
        vehicleId: '',
        date: null as Date | null,
        time: null as Date | null,
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    // Initialize defaults when data loads and handle scanning simulation
    useEffect(() => {
        if (!isLoading && routes.length > 0 && vehicles.length > 0) {
            // Simulate scanning delay for premium feel
            setIsSearching(true);
            const timer = setTimeout(() => {
                setIsSearching(false);
                setBookingData(prev => ({
                    ...prev,
                    routeId: prev.routeId || routes[0].id,
                    vehicleId: prev.vehicleId || vehicles[0].id
                }));
            }, 1500); // 1.5s scanning effect
            return () => clearTimeout(timer);
        }
    }, [isLoading, routes, vehicles]);

    const [totalPrice, setTotalPrice] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const dropdownRef = useRef<HTMLDivElement>(null);
    const wizardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bookingData.routeId && bookingData.vehicleId) {
            const priceDetails = calculatePrice(bookingData.routeId, bookingData.vehicleId);
            setTotalPrice(priceDetails.price);
        }
    }, [bookingData.routeId, bookingData.vehicleId, calculatePrice]);

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
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = () => {
        if (step === 3) {
            const newErrors: Record<string, string> = {};
            if (!bookingData.name.trim()) newErrors.name = 'Name is required';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!bookingData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!emailRegex.test(bookingData.email)) {
                newErrors.email = 'Please enter a valid email address (e.g., user@example.com)';
            }

            const phoneRegex = /^\+[0-9\s-]{10,}$/;
            if (!bookingData.phone.trim()) {
                newErrors.phone = 'Phone is required';
            } else if (!phoneRegex.test(bookingData.phone)) {
                newErrors.phone = 'Please include your country code (e.g., +966XXXXXXXXX)';
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
            const yOffset = -120; // Offset for sticky header
            const y = wizardRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Auto-scroll to top of wizard when step changes
    useEffect(() => {
        scrollToWizard();
    }, [step]);

    const nextStep = async () => {
        if (!validateStep()) {
            scrollToWizard();
            return;
        }

        if (step === 4) {
            // Submit booking
            const route = getSelectedRoute();
            const vehicle = getSelectedVehicle();

            if (route && vehicle) {
                try {
                    const res = await fetch('/api/bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: bookingData.name,
                            email: bookingData.email,
                            phone: bookingData.phone,
                            pickup: route.name.split(' to ')[0] || 'Makkah',
                            dropoff: route.name.split(' to ')[1] || 'Madinah',
                            date: bookingData.date?.toISOString().split('T')[0],
                            time: bookingData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                            vehicle: vehicle.name,
                            passengers: parseInt(vehicle.capacity) || 4,
                            status: 'pending'
                        }),
                    });

                    if (!res.ok) throw new Error('Booking failed');

                } catch (error) {
                    console.error('Booking submission error:', error);
                    alert('Failed to submit booking. Please try again.');
                    return;
                }
            }
        }

        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const getSelectedRoute = () => routes.find(r => r.id === bookingData.routeId);
    const getSelectedVehicle = () => vehicles.find(v => v.id === bookingData.vehicleId);

    const handleRouteSelect = (routeId: string) => {
        updateData('routeId', routeId);
        setIsDropdownOpen(false);
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-secondary">Loading...</div>;

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    // Common Input Style
    // Common Input Style
    const inputClasses = (hasError: boolean) => `
        w-full premium-input rounded-xl px-4 py-3.5 
        text-slate-900 dark:text-white placeholder:text-slate-400 
        outline-none transition-all
        ${hasError ? 'border-red-500 ring-2 ring-red-500/10' : ''}
    `;

    const renderStep1 = () => (
        <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="mb-8 pl-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Select Your Route</h2>
                <p className="text-slate-500 text-sm">Choose your pickup and drop-off locations</p>
            </div>

            {isSearching ? (
                // Searching / Scanning Animation
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                >
                    <div className="relative w-24 h-24 mb-6">
                        <motion.span
                            className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"
                        />
                        <motion.span
                            className="absolute inset-0 border-t-4 border-secondary rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <MapPin className="absolute inset-0 m-auto text-secondary" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Finding Best Routes...</h3>
                    <p className="text-sm text-slate-500">Scanning available paths</p>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="max-w-lg mx-auto">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <MapPin size={18} className="text-secondary" />
                            <span>Choose Journey</span>
                        </label>

                        {/* Custom Dropdown */}
                        <div className="relative mb-6" ref={dropdownRef}>
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
                                    {getSelectedRoute()?.name}
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
                                        {routes.map((route, i) => (
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
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Route Info Card - Glass Design */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-white/5">
                            <div className="grid grid-cols-3 gap-4 divide-x divide-slate-200 dark:divide-white/10">
                                <div className="text-center">
                                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Distance</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{getSelectedRoute()?.distance}</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Time</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{getSelectedRoute()?.time}</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Rate</span>
                                    <span className="font-bold text-secondary dark:text-secondary">{getSelectedRoute()?.baseRate} <span className="text-[10px]">SAR</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );

    const renderStep2 = () => {
        const selectedVehicle = getSelectedVehicle();

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

                        {/* Selected Vehicle Hero on Mobile */}
                        {selectedVehicle && !isVehicleDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 rounded-2xl overflow-hidden shadow-lg border-2 border-secondary/30 relative"
                            >
                                <div className="h-40 w-full relative">
                                    {selectedVehicle.image ? (
                                        <img src={selectedVehicle.image} alt={selectedVehicle.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                            {(() => { const I = selectedVehicle.icon; return <I size={48} className="text-slate-400" /> })()}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="text-xl font-bold">{selectedVehicle.name}</h3>
                                        <p className="text-sm text-white/80">{selectedVehicle.capacity} • {selectedVehicle.luggage}</p>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        SELECTED
                                    </div>
                                </div>
                            </motion.div>
                        )}

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
                                {selectedVehicle ? selectedVehicle.name : 'Change Vehicle'}
                            </span>
                            <ChevronDown className={`text-slate-400 transition-transform ${isVehicleDropdownOpen ? 'rotate-180 text-secondary' : ''}`} size={20} />
                        </div>

                        {isVehicleDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="absolute top-full left-0 w-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-2xl z-[100] max-h-[60vh] overflow-y-auto custom-scrollbar pb-4 ring-1 ring-black/5"
                            >
                                {vehicles.map((vehicle, idx) => {
                                    const priceDetails = calculatePrice(bookingData.routeId, vehicle.id);
                                    const isSelected = bookingData.vehicleId === vehicle.id;
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={vehicle.id}
                                            className={`
                                                relative p-4 flex items-center gap-4 cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-0 transition-all duration-200 group
                                                ${isSelected
                                                    ? 'bg-secondary/5 dark:bg-secondary/10'
                                                    : 'hover:bg-slate-50 dark:hover:bg-white/5'}
                                            `}
                                            onClick={() => {
                                                updateData('vehicleId', vehicle.id);
                                                setIsVehicleDropdownOpen(false);
                                            }}
                                        >
                                            {/* Selection Indicator Strip */}
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="activeStrip"
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r-full"
                                                />
                                            )}

                                            {/* List Item Image */}
                                            <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-white/10 shadow-sm relative group-hover:shadow-md transition-shadow">
                                                {vehicle.image ? (
                                                    <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                                ) : <div className="w-full h-full flex items-center justify-center"><User size={24} className="text-slate-300" /></div>}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <div>
                                                        <span className={`block font-bold text-base truncated ${isSelected ? 'text-secondary dark:text-secondary' : 'text-slate-900 dark:text-white'}`}>
                                                            {vehicle.name}
                                                        </span>
                                                        {isSelected && <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Selected</span>}
                                                    </div>

                                                    <div className="text-right shrink-0 ml-2">
                                                        {priceDetails.discountApplied > 0 && (
                                                            <span className="block text-[10px] text-slate-400 line-through decoration-red-500/50">
                                                                {priceDetails.originalPrice}
                                                            </span>
                                                        )}
                                                        <div className={`
                                                            px-2 py-1 rounded-lg text-sm font-bold border
                                                            ${isSelected
                                                                ? 'bg-secondary text-white border-secondary shadow-sm'
                                                                : 'bg-slate-50 dark:bg-white/5 text-secondary dark:text-secondary border-secondary/20'}
                                                        `}>
                                                            {priceDetails.price} <span className={`text-[10px] font-normal ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>SAR</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md border border-slate-100 dark:border-white/5">
                                                        <User size={12} className="text-slate-400" /> {vehicle.capacity}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md border border-slate-100 dark:border-white/5">
                                                        <Briefcase size={12} className="text-slate-400" /> {vehicle.luggage}
                                                    </span>
                                                </div>
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
                        const isSelected = bookingData.vehicleId === vehicle.id;

                        return (
                            <motion.div
                                key={vehicle.id}
                                whileHover={{ y: -6 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateData('vehicleId', vehicle.id)}
                                className={`
                                    relative rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden flex flex-col
                                    ${isSelected
                                        ? 'bg-white dark:bg-slate-800 border-2 border-secondary shadow-xl shadow-secondary/20'
                                        : 'premium-card hover:border-secondary/50'
                                    }
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

                                    {/* Selection Indicator */}
                                    <div className={`
                                        absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-md
                                        ${isSelected
                                            ? 'bg-secondary border-secondary scale-110 shadow-lg'
                                            : 'border-white/70 bg-black/30 text-white group-hover:bg-secondary group-hover:border-secondary'
                                        }
                                    `}>
                                        {isSelected && <CheckCircle size={18} className="text-white" />}
                                    </div>

                                    {/* Price Tag Overlay */}
                                    <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-white/20">
                                        {priceDetails.discountApplied > 0 ? (
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
                                            <h3 className={`text-xl font-bold mb-1 transition-colors ${isSelected ? 'text-secondary dark:text-secondary' : 'text-slate-900 dark:text-white'}`}>
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Contact Information</h2>
                <p className="text-slate-500 text-sm mb-6">How can we reach you?</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 col-span-2">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        className={`${inputClasses(!!errors.name)} pl-11`}
                                        value={bookingData.name}
                                        onChange={(e) => updateData('name', e.target.value)}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                            </div>

                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
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
                        </div>
                    </div>

                    <div className="relative group col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">WhatsApp Number</label>
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

                    <div className="col-span-2">
                        <div className="flex items-center gap-2 p-4 bg-secondary/10 dark:bg-secondary/10 rounded-xl border border-secondary/20 dark:border-secondary/20 text-amber-700 dark:text-amber-400 text-sm">
                            <Info size={18} className="shrink-0" />
                            <p>We'll send your booking confirmation and driver details to this WhatsApp number.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderSummary = () => {
        const route = getSelectedRoute();
        const vehicle = getSelectedVehicle();
        const priceDetails = calculatePrice(bookingData.routeId, bookingData.vehicleId);

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
                            <ChevronDown className={`text-slate-400 transition-transform ${accordionOpen === 'journey' ? 'rotate-180' : ''}`} size={20} />
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
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Route</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{route?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Vehicle</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{vehicle?.name}</span>
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
                            <ChevronDown className={`text-slate-400 transition-transform ${accordionOpen === 'passenger' ? 'rotate-180' : ''}`} size={20} />
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
                                            <span className="text-slate-500">Name</span>
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
            key="step5"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="text-center py-8"
        >
            <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                width="100" height="100" viewBox="0 0 100 100"
                className="mx-auto mb-6"
            >
                <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="6" className="opacity-20" />
                <motion.path
                    d="M30 50 L45 65 L70 35"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                />
            </motion.svg>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Booking Confirmed!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                Alhamdulillah! Your booking has been received. <br />
                We have sent a confirmation email to <strong className="text-slate-900 dark:text-white">{bookingData.email}</strong>.
            </p>

            <div className="inline-block bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl px-8 py-4 mb-8">
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Booking Reference</span>
                <strong className="text-2xl text-secondary font-mono tracking-widest">#AQ-{Math.floor(10000 + Math.random() * 90000)}</strong>
            </div>

            <div>
                <Link href="/" className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                    Return Home
                </Link>
            </div>
        </motion.div>
    );

    // Sidebar Component
    const Sidebar = () => {
        const route = getSelectedRoute();
        const vehicle = getSelectedVehicle();
        const priceDetails = calculatePrice(bookingData.routeId || '', bookingData.vehicleId || '');

        return (
            <div className="hidden lg:block sticky top-32 space-y-6">
                <div className="glass-card bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">Booking Summary</h3>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-slate-500">Route</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white text-right max-w-[60%]">{route?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Vehicle</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{vehicle?.name}</span>
                        </div>
                        {bookingData.date && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Date</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{bookingData.date.toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 mb-6">
                        {priceDetails.discountApplied > 0 && (
                            <>
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>Original</span>
                                    <span className="line-through">{priceDetails.originalPrice} SAR</span>
                                </div>
                                <div className="flex justify-between text-xs text-green-500 mb-2">
                                    <span>Discount</span>
                                    <span>-{priceDetails.discountApplied} SAR</span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/10 mt-1">
                            <span className="font-bold text-slate-700 dark:text-slate-300">Total</span>
                            <span className="text-xl font-bold text-secondary dark:text-secondary">{totalPrice} SAR</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                        <p>Price includes all taxes, fees, and tolls. No hidden charges.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="flex flex-col items-center gap-1.5 text-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                            <ShieldCheck size={20} className="text-emerald-500" />
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">Secure Booking</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 text-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                            <Headphones size={20} className="text-blue-500" />
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden relative">
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex flex-col items-center justify-center pt-20 lg:pt-16 pb-20 px-0 md:px-4">
                {/* Background Image with Ken Burns Effect */}
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover animate-[pulse_40s_ease-in-out_infinite_alternate] scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/80 to-[#0A1F44]/70 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="container px-0 md:px-4 mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col items-center gap-12">

                        {/* Top: Branding & Descriptions (Centered) */}
                        <div className="space-y-8 text-center max-w-4xl mx-auto">

                            <FadeIn delay={0.1} direction="up">
                                <h1
                                    className="text-5xl md:text-7xl lg:text-8xl font-black text-center leading-tight tracking-tight mb-4 drop-shadow-2xl"
                                    style={{ fontFamily: 'var(--font-playfair)' }}
                                >
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 pb-2 drop-shadow-lg">
                                        Book Your
                                    </span>
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FDB931] via-[#eec752] to-[#B38E2D] pb-2 drop-shadow-lg">
                                        Spiritual Journey
                                    </span>
                                </h1>
                            </FadeIn>
                            <FadeIn delay={0.2} direction="up">
                                <p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto dropshadow-md font-light">
                                    Experience the comfort of premium travel between Makkah, Madinah, and Jeddah.
                                    Reliable service, professional drivers, and luxury vehicles for your Umrah.
                                </p>
                            </FadeIn>

                            {/* Trust Highlights - Horizontal Bar Centered */}
                            <FadeIn delay={0.3} direction="up">
                                <div className="hidden md:flex flex-wrap justify-center gap-3 lg:gap-6 pt-2">
                                    {[
                                        { icon: ShieldCheck, title: "Official License", desc: "Ministry Certified" },
                                        { icon: Clock, title: "Punctual", desc: "Always on time" },
                                        { icon: Headphones, title: "24/7 Support", desc: "Multilingual Team" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="group px-5 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md flex items-center gap-3 shadow-lg">
                                            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shadow-sm shrink-0 border border-[#D4AF37]/30">
                                                <item.icon size={16} />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-white text-xs leading-tight">{item.title}</h4>
                                                <p className="text-[10px] text-slate-300">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </FadeIn>
                        </div>

                        {/* Bottom: Wizard (Centered & Full Width Container) */}
                        <div className="w-full max-w-5xl mx-auto relative z-20" ref={wizardRef}>
                            <FadeIn delay={0.4} direction="up">
                                <div className="glass-card bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-none md:rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 ring-1 ring-black/5 dark:ring-white/10">

                                    {/* Wizard Header / Progress */}
                                    {step < 5 && (
                                        <div className="bg-white/50 dark:bg-black/20 border-b border-slate-100 dark:border-white/5 px-6 py-6 md:px-10 md:py-8">
                                            <div className="flex items-center justify-between relative px-2 max-w-3xl mx-auto">
                                                {/* Progress Bar Background */}
                                                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700/50 -z-10 rounded-full"></div>
                                                {/* Dynamic Progress Bar */}
                                                <motion.div
                                                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B38E2D] shadow-[0_0_10px_rgba(212,175,55,0.5)] -z-10 rounded-full"
                                                    initial={{ width: '0%' }}
                                                    animate={{ width: `${((step - 1) / 3) * 100}%` }}
                                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                                />

                                                {/* Steps */}
                                                {[1, 2, 3, 4].map((num) => (
                                                    <div key={num} className="relative flex flex-col items-center group cursor-default">
                                                        <motion.div
                                                            className={`
                                                                w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-sm font-bold border-2 transition-all duration-300 z-10
                                                                ${step >= num
                                                                    ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30'
                                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-400'
                                                                }
                                                                ${step === num ? 'ring-4 ring-[#D4AF37]/20 scale-110' : ''}
                                                            `}
                                                            animate={{ scale: step === num ? 1.15 : 1 }}
                                                        >
                                                            {step > num ? <CheckCircle size={20} /> : num}
                                                        </motion.div>
                                                        <span className={`
                                                            text-[10px] md:text-xs font-bold mt-3 uppercase tracking-widest transition-colors duration-300 hidden md:block
                                                            ${step === num ? 'text-[#D4AF37] translate-y-0' : 'text-slate-400 translate-y-0.5'}
                                                        `}>
                                                            {['Route', 'Vehicle', 'Details', 'Confirm'][num - 1]}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 md:p-10 lg:p-12">
                                        <AnimatePresence mode="wait">
                                            {step === 1 && renderStep1()}
                                            {step === 2 && renderStep2()}
                                            {step === 3 && renderStep3()}
                                            {step === 4 && renderSummary()}
                                            {step === 5 && renderSuccess()}
                                        </AnimatePresence>

                                        {step < 5 && (
                                            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4">
                                                {step > 1 ? (
                                                    <button
                                                        onClick={prevStep}
                                                        className="px-6 py-3 md:px-8 md:py-4 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                                                    >
                                                        Back
                                                    </button>
                                                ) : <div />}

                                                <button
                                                    onClick={nextStep}
                                                    disabled={(step === 3 && (!bookingData.date || !bookingData.time || !bookingData.name || !bookingData.phone))}
                                                    className={`
                                                        group relative flex items-center gap-2 px-8 py-4 md:px-10 md:py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-secondary/20 transition-all overflow-hidden
                                                        ${(step === 3 && (!bookingData.date || !bookingData.time || !bookingData.name || !bookingData.phone))
                                                            ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500 shadow-none'
                                                            : 'bg-gradient-to-r from-secondary to-[#B38E2D] hover:translate-y-[-2px] hover:shadow-secondary/40'
                                                        }
                                                    `}
                                                >
                                                    <span className="relative z-10">{step === 4 ? 'Confirm Booking' : 'Next Step'}</span>
                                                    {step !== 4 && <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1" />}

                                                    {/* Button Shimmer Effect */}
                                                    {step !== 3 && (
                                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
