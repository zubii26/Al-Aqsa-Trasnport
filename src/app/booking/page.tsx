'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowRight, Calendar, Clock, User, Mail, Phone, MapPin, ChevronDown, Info, ShieldCheck, Headphones, Briefcase, Navigation, Building2, Globe, PlaneLanding, PlaneTakeoff, Users, Luggage } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import FadeIn from '@/components/common/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';

import { usePricing } from '@/context/PricingContext';
import { Route } from '@/lib/pricing';
import ClockTimePicker from '@/components/ui/TimePicker/ClockTimePicker';
import SearchableSelect from '@/components/ui/SearchableSelect';

const splitRouteName = (name: string): [string, string] => {
    if (!name) return ['', ''];
    const parts = name.split(/\s*(?:->|to|\u2192)\s*/i);
    return [parts[0]?.trim() || '', parts[1]?.trim() || ''];
};

export default function BookingPage() {
    const { routes, vehicles, calculatePrice, isLoading } = usePricing();
    const [step, setStep] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState<string>('journey');

    // Core State
    const [serviceType, setServiceType] = useState<'Intercity' | 'Airport' | 'Ziarat'>('Intercity');
    const [airportType, setAirportType] = useState<'Arrival' | 'Departure'>('Arrival');
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        dropoff: '',
        passengers: 1,
        luggage: 0
    });

    const [bookingResponse, setBookingResponse] = useState<any>(null);

    // New Service Type State


    const [totalPrice, setTotalPrice] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const dropdownRef = useRef<HTMLDivElement>(null);
    const wizardRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();

    // Initialize defaults when data loads and handle URL params for deep linking
    useEffect(() => {
        if (!isLoading && routes.length > 0 && vehicles.length > 0) {
            const paramVehicle = searchParams.get('vehicle');
            const paramStep = searchParams.get('step');
            const paramNotes = searchParams.get('notes');
            const paramRouteId = searchParams.get('routeId');
            const paramQuantity = searchParams.get('quantity');

            // Default values
            let initialRouteId = routes[0].id;
            // Parse quantity, default to 1 if invalid
            const quantity = paramQuantity ? Math.max(1, parseInt(paramQuantity) || 1) : 1;
            let initialVehicles: { vehicleId: string; quantity: number }[] = [];
            let initialPickup = '';
            let initialDropoff = '';
            let initialNotes = '';

            // Handle Route Pre-selection
            if (paramRouteId && routes.find(r => r.id === paramRouteId)) {
                initialRouteId = paramRouteId;
                const selectedRoute = routes.find(r => r.id === paramRouteId);
                if (selectedRoute) {
                    const [p, d] = splitRouteName(selectedRoute.name);
                    initialPickup = p;
                    initialDropoff = d;
                }
            } else if (paramNotes) {
                // Formatting "Notes" to be route-like if we have notes but no ID
                initialRouteId = 'custom';
                const [p, d] = splitRouteName(paramNotes);
                if (p && d) {
                    initialPickup = p;
                    initialDropoff = d;
                }
            }

            if (paramNotes) {
                initialNotes = paramNotes;
            }

            // Handle Vehicle Pre-selection
            if (paramVehicle) {
                const searchParam = paramVehicle.toLowerCase();
                // Find vehicle by checking if ID matches param OR param includes ID OR name matches loosely
                const foundVehicle = vehicles.find(v => {
                    const id = v.id.toLowerCase();
                    const name = v.name.toLowerCase();

                    // Exact ID match 
                    if (id === searchParam) return true;

                    // ID contains param (e.g. 'gmc' matches 'gmc-yukon' if that was passed)
                    if (searchParam.includes(id)) return true;

                    // Name contains param (e.g. "GMC Yukon" matches "gmc")
                    if (name.includes(searchParam.replace(/-/g, ' '))) return true;

                    return false;
                });

                if (foundVehicle) {
                    initialVehicles = [{ vehicleId: foundVehicle.id, quantity: quantity }];
                }
            }

            setBookingData(prev => ({
                ...prev,
                routeId: initialRouteId,
                selectedVehicles: initialVehicles,
                pickup: initialPickup,
                dropoff: initialDropoff,
                notes: initialNotes
            }));

            // Jump to Step if requested
            if (paramStep) {
                setStep(parseInt(paramStep));
            } else {
                // Default behavior (no params)
                setIsSearching(true);
                const timer = setTimeout(() => {
                    setIsSearching(false);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [isLoading, routes, vehicles, searchParams]);

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

    const updateData = (field: string, value: string | Date | null | number) => {
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

            const phoneRegex = /^(\+|00)?[0-9\s-]{9,}$/;
            if (!bookingData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (!phoneRegex.test(bookingData.phone.trim())) {
                newErrors.phone = 'Please enter a valid phone number (e.g., +966 50 123 4567 or 050 123 4567)';
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
                setIsSubmitting(true);
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
                            passengers: bookingData.passengers,
                            luggage: bookingData.luggage,
                            date: bookingData.date ? `${bookingData.date.getFullYear()}-${String(bookingData.date.getMonth() + 1).padStart(2, '0')}-${String(bookingData.date.getDate()).padStart(2, '0')}` : undefined,
                            time: bookingData.time ? `${String(bookingData.time.getHours()).padStart(2, '0')}:${String(bookingData.time.getMinutes()).padStart(2, '0')}` : undefined,
                            country: bookingData.country,
                            flightNumber: bookingData.flightNumber,
                            arrivalDate: bookingData.arrivalDate ? `${bookingData.arrivalDate.getFullYear()}-${String(bookingData.arrivalDate.getMonth() + 1).padStart(2, '0')}-${String(bookingData.arrivalDate.getDate()).padStart(2, '0')}` : undefined,
                            // Sending selectedVehicles array instead of single vehicle details
                            selectedVehicles: bookingData.selectedVehicles,
                            status: 'pending',
                            routeId: bookingData.routeId === 'custom' ? 'custom' : bookingData.routeId
                        }),
                    });

                    const data = await res.json();
                    setBookingResponse(data);
                    setStep(5);
                    scrollToWizard();
                } catch (error: any) {
                    console.error('Booking submission error:', error);
                    alert(error.message || 'Failed to submit booking. Please try again.');
                    return;
                } finally {
                    setIsSubmitting(false);
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
            setSelectedRoute(null); // Clear selected route for custom
        } else {
            const selectedRoute = routes.find(r => r.id === routeId);
            const [pickup, dropoff] = selectedRoute ? splitRouteName(selectedRoute.name) : ['', ''];

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

    // Filter routes based on Service Type (Category)
    const filteredRoutes = routes.filter(r => {
        // Strict category matching from DB
        if (r.category) {

            // Special handling for Airport tab
            if (serviceType === 'Airport') {
                const isArrival = airportType === 'Arrival';
                const targetCategory = isArrival ? 'Airport Arrival' : 'Airport Departure';
                return r.category === targetCategory || r.category === 'Airport';
            }

            return r.category.toLowerCase() === serviceType.toLowerCase();
        }

        // Fallback
        const lowerName = r.name.toLowerCase();
        if (serviceType === 'Airport') return lowerName.includes('airport');
        if (serviceType === 'Ziarat') return lowerName.includes('ziarat') || lowerName.includes('ziyarat');
        return !lowerName.includes('airport') && !lowerName.includes('ziarat') && !lowerName.includes('ziyarat');
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
        if (serviceType === 'Airport') return loc.toLowerCase().includes('airport');
        return true;
    });

    const dropoffLocations = allDropoffLocations.filter(loc => {
        if (serviceType === 'Airport') return loc.toLowerCase().includes('airport');
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
                                        { value: 'Intercity', label: 'Intercity Transfer', icon: '🚗' },
                                        { value: 'Airport', label: 'Airport Transfer', icon: '✈️' },
                                        { value: 'Ziarat', label: 'Ziarat Tour', icon: '🕌' }
                                    ]}
                                    placeholder="Select Service Type"
                                    className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50"
                                    icon={<Building2 size={20} />}
                                />
                            </div>
                        </div>

                        {/* Sub-Category Dropdown for Airport */}
                        {serviceType === 'Airport' && (
                            <div className="mb-6">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    {airportType === 'Arrival' ? <PlaneLanding size={18} className="text-secondary" /> : <PlaneTakeoff size={18} className="text-secondary" />}
                                    <span>Transfer Type</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAirportType('Arrival');
                                            setBookingData(prev => ({ ...prev, routeId: '' }));
                                            setSelectedRoute(null);
                                        }}
                                        className={`
                                            flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all
                                            ${airportType === 'Arrival'
                                                ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-[1.02]'
                                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-secondary/50'
                                            }
                                        `}
                                    >
                                        <PlaneLanding size={20} />
                                        <span>Arrival</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAirportType('Departure');
                                            setBookingData(prev => ({ ...prev, routeId: '' }));
                                            setSelectedRoute(null);
                                        }}
                                        className={`
                                            flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all
                                            ${airportType === 'Departure'
                                                ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-[1.02]'
                                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-secondary/50'
                                            }
                                        `}
                                    >
                                        <PlaneTakeoff size={20} />
                                        <span>Departure</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Pickup & Dropoff Selection */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Pickup Location */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <MapPin size={18} className="text-secondary" />
                                    <span>Pickup From</span>
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
                                        ...Array.from(new Set(filteredRoutes.map(r => {
                                            const [p] = splitRouteName(r.name);
                                            return p || r.name;
                                        }))).sort().map(p => ({ value: p, label: p })),
                                        { value: 'custom', label: 'Other / Custom Location' }
                                    ]}
                                    placeholder="Select Pickup Location"
                                    className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50"
                                    icon={<MapPin size={20} />}
                                />
                            </div>

                            {/* Dropoff Location */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <MapPin size={18} className="text-secondary" />
                                    <span>Dropoff To</span>
                                </label>
                                <SearchableSelect
                                    name="dropoff"
                                    value={bookingData.dropoff}
                                    onChange={(e: any) => {
                                        const val = e.target.value;
                                        setBookingData(prev => {
                                            const newData = { ...prev, dropoff: val };

                                            // Try to find matching route
                                            if (prev.pickup && val) {
                                                const matchedRoute = filteredRoutes.find(r => {
                                                    const [p, d] = splitRouteName(r.name);
                                                    return p === prev.pickup && d === val;
                                                });

                                                if (matchedRoute) {
                                                    newData.routeId = matchedRoute.id;
                                                    setSelectedRoute(matchedRoute);
                                                    setErrors(curr => ({ ...curr, pickup: '', dropoff: '' }));
                                                } else {
                                                    // Fallback or just keep routeId empty? 
                                                    // Let's explicitly check if it's a known connection
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
                                                .filter(r => {
                                                    const [p] = splitRouteName(r.name);
                                                    return p === bookingData.pickup;
                                                })
                                                .map(r => {
                                                    const [, d] = splitRouteName(r.name);
                                                    return d;
                                                })
                                                .filter(Boolean)
                                            )).sort().map(d => ({ value: d, label: d }))
                                            : []
                                    }
                                    disabled={!bookingData.pickup || bookingData.pickup === 'custom'}
                                    placeholder={!bookingData.pickup ? "Select Pickup First" : "Select Dropoff Location"}
                                    className={`w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50 ${(!bookingData.pickup || bookingData.pickup === 'custom') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    icon={<Navigation size={20} />}
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
                                                <Info size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Custom Journey Selected</h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Please specify your exact locations below. Our team will calculate the best rate and contact you.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Precise Pickup Address</label>
                                            <input
                                                type="text"
                                                value={bookingData.pickup === 'custom' ? '' : bookingData.pickup}
                                                onChange={(e) => updateData('pickup', e.target.value)}
                                                placeholder="Enter hotel name, airport terminal, etc."
                                                className={inputClasses(!!errors.pickup)}
                                            />
                                            {errors.pickup && <p className="text-red-500 text-xs mt-1">{errors.pickup}</p>}
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Precise Dropoff Address</label>
                                            <input
                                                type="text"
                                                value={bookingData.dropoff}
                                                onChange={(e) => updateData('dropoff', e.target.value)}
                                                placeholder="Enter destination address"
                                                className={inputClasses(!!errors.dropoff)}
                                            />
                                            {errors.dropoff && <p className="text-red-500 text-xs mt-1">{errors.dropoff}</p>}
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
                                        className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm mb-6"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                                <Info size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">Selected Route</h4>
                                                <p className="text-sm text-slate-500">
                                                    {selectedRoute.distance} • {selectedRoute.time} approx
                                                </p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Starting From</span>
                                                <span className="font-bold text-secondary text-lg">{selectedRoute.baseRate} SAR</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>

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
                    {/* Full Name */}
                    <div className="relative group col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <input
                                type="text"
                                className={`${inputClasses(!!errors.name)} pl-11`}
                                value={bookingData.name}
                                onChange={(e) => updateData('name', e.target.value)}
                                placeholder="Your full name"
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                    </div>

                    {/* Country / Region */}
                    <div className="col-span-2 relative group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Country / Region *</label>
                        <SearchableSelect
                            name="country"
                            value={bookingData.country}
                            onChange={(e: any) => updateData('country', e.target.value)}
                            options={[
                                { value: "Saudi Arabia", label: "Saudi Arabia", icon: "🇸🇦" },
                                { value: "United Arab Emirates", label: "United Arab Emirates", icon: "🇦🇪" },
                                { value: "Kuwait", label: "Kuwait", icon: "🇰🇼" },
                                { value: "Bahrain", label: "Bahrain", icon: "🇧🇭" },
                                { value: "Oman", label: "Oman", icon: "🇴🇲" },
                                { value: "Qatar", label: "Qatar", icon: "🇶🇦" },
                                { value: "United Kingdom", label: "United Kingdom", icon: "🇬🇧" },
                                { value: "United States", label: "United States", icon: "🇺🇸" },
                                { value: "Pakistan", label: "Pakistan", icon: "🇵🇰" },
                                { value: "India", label: "India", icon: "🇮🇳" },
                                { value: "Malaysia", label: "Malaysia", icon: "🇲🇾" },
                                { value: "Indonesia", label: "Indonesia", icon: "🇮🇩" },
                                { value: "Turkey", label: "Turkey", icon: "🇹🇷" },
                                { value: "Other", label: "Other", icon: "🌍" }
                            ]}
                            placeholder="Select Country"
                            className={inputClasses(false)}
                            icon={<Globe size={18} />}
                        />
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
                                placeholder="+966 50 000 0000 or 050..."
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

            {/* Passenger & Luggage Count */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Passenger & Luggage Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Passengers */}
                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Passengers (Optional)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Users size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <input
                                type="number"
                                min="1"
                                className={`${inputClasses(false)} pl-11`}
                                value={bookingData.passengers}
                                onChange={(e) => updateData('passengers', parseInt(e.target.value) || '')}
                                placeholder="1"
                            />
                        </div>
                    </div>

                    {/* Luggage */}
                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Luggage Count (Optional)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Luggage size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <input
                                type="number"
                                min="0"
                                className={`${inputClasses(false)} pl-11`}
                                value={bookingData.luggage}
                                onChange={(e) => updateData('luggage', parseInt(e.target.value) || 0)}
                                placeholder="0"
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
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Passengers</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{bookingData.passengers}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Luggage</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{bookingData.luggage}</span>
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 md:py-12 px-4"
        >
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden max-w-2xl mx-auto text-left relative">

                {/* Header / Islamic Greeting */}
                <style jsx global>{`
                    @media print {
                        @page { margin: 0; size: auto; }
                        
                        /* 1. Hide everything initially */
                        body {
                            visibility: hidden;
                        }

                        /* 2. Hide interfering overlays/layout components */
                        nav, footer, header, aside, .sticky, .fixed, 
                        [role="dialog"], [class*="banner"], iframe, 
                        div[id^="chat-widget"], button[class*="chat"] {
                            display: none !important;
                        }

                        /* 3. Global opacity reset to fix blank page animation bugs */
                        * {
                            opacity: 1 !important;
                        }

                        /* 4. Show Receipt using FIXED positioning to break out of all parent containers */
                        #printable-receipt {
                            visibility: visible !important;
                            position: fixed !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            height: 100% !important;
                            margin: 0 !important;
                            padding: 30px !important;
                            background: white !important;
                            color: black !important;
                            z-index: 2147483647 !important;
                        }

                        /* Ensure children are visible */
                        #printable-receipt * {
                            visibility: visible !important;
                        }
                        
                        /* Hide print utilities */
                        .print\:hidden, #print-button {
                            display: none !important;
                        }
                    }
                `}</style>
                {/* Header / Islamic Greeting */}
                <div className="bg-slate-50/50 dark:bg-slate-900/50 pt-10 pb-8 px-6 md:px-10 text-center border-b border-slate-100 dark:border-slate-800 print:hidden">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-white dark:ring-slate-800">
                        <CheckCircle size={36} className="text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-2xl text-[#D4AF37] font-serif mb-2">﷽</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] mb-2">Booking Confirmation</h2>
                </div>

                <div className="p-6 md:p-10 space-y-8">
                    {/* Welcome Text */}
                    <div className="text-center md:text-left text-slate-600 dark:text-slate-300 space-y-4 text-base md:text-lg leading-relaxed print:hidden">
                        <p>Dear <span className="font-bold text-slate-900 dark:text-white capitalize">{bookingData.name}</span>,</p>
                        <p>
                            Thank you for choosing <span className="font-semibold text-secondary text-nowrap">Al Aqsa Umrah Transport</span>.
                        </p>
                    </div>

                    {/* Booking Details Card */}
                    <div id="printable-receipt" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">

                        {/* Print Header - Visible only in print */}
                        <div className="hidden print:flex flex-row justify-between items-center p-8 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16">
                                    <Image src="/logo.png" alt="Al Aqsa" fill className="object-contain" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">Al Aqsa Transport</h1>
                                    <p className="text-sm text-slate-500 font-serif">النقل المعتمر الأقصى</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-lg font-bold text-[#D4AF37] uppercase tracking-wider">Booking Receipt</h2>
                                <p className="text-xs text-slate-400 mt-1">Confirmed</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center print:hidden">
                            <h3 className="text-secondary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                <Briefcase size={16} /> Booking Details
                            </h3>
                            <button
                                id="print-button"
                                onClick={() => window.print()}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors print:hidden"
                            >
                                <span>Print Receipt</span>
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-y-6 gap-x-8">
                            <div className="col-span-1 md:col-span-2 print:col-span-2 pb-4 border-b border-slate-100 dark:border-slate-700/50 text-center">
                                <p className="text-2xl text-[#D4AF37] font-serif mb-2">﷽</p>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Booking Reference / مرجع الحجز</span>
                                <span className="block font-mono text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {(bookingResponse?._id || bookingResponse?.id || 'PENDING').toString().slice(-8).toUpperCase()}
                                </span>
                            </div>

                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time / التاريخ والوقت</span>
                                <span className="block font-medium text-slate-900 dark:text-white">
                                    {bookingData.date?.toLocaleDateString()}
                                    <span className="text-slate-300 mx-2">|</span>
                                    {bookingData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount / المبلغ الإجمالي</span>
                                <span className="block font-bold text-slate-900 dark:text-white text-lg">
                                    {totalPrice} <span className="text-sm font-normal text-slate-500">SAR</span>
                                </span>
                            </div>

                            <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup / موقع الاستلام</span>
                                <span className="block font-medium text-slate-900 dark:text-white text-sm">{bookingData.pickup}</span>
                            </div>

                            <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination / الوجهة</span>
                                <span className="block font-medium text-slate-900 dark:text-white text-sm">{bookingData.dropoff}</span>
                            </div>

                            <div className="md:col-span-2 print:col-span-2 bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4 mt-2">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Vehicle Configuration / تفاصيل المركبة</span>
                                <div className="space-y-2">
                                    {bookingData.selectedVehicles.map((sv) => {
                                        const v = vehicles.find(veh => veh.id === sv.vehicleId);
                                        return v ? (
                                            <div key={sv.vehicleId} className="flex justify-between items-center text-sm">
                                                <div className="font-bold text-slate-700 dark:text-slate-200">
                                                    {v.name}
                                                </div>
                                                <div className="text-xs font-semibold bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                                                    x{sv.quantity}
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            {/* Print Footer - Spiritual Quote */}
                            <div className="hidden print:block col-span-1 md:col-span-2 mt-8 pt-8 border-t border-slate-100 text-center">
                                <p className="text-lg font-serif italic text-slate-700 mb-2">"The reward of Umrah is expiation for the sins committed between it and the next Umrah."</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">– Prophet Muhammad (S.A.W.W)</p>
                                <div className="mt-4 text-[10px] text-slate-300">
                                    Generated by Al Aqsa Transport System
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-2 print:hidden">
                        <p className="text-slate-500 text-sm mb-6">A confirmation email has been sent to <strong>{bookingData.email}</strong></p>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-3.5 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:shadow-xl hover:bg-[#B38E2D]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <span>Return Home</span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/contact"
                                className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>

                </div>
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
                                    {bookingData.pickup || (route ? splitRouteName(route.name)[0] : 'Select Pickup')}
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
                                    {bookingData.dropoff || (route ? splitRouteName(route.name)[1] : 'Select Dropoff')}
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    {bookingData.passengers > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {bookingData.passengers} Passenger{bookingData.passengers > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Luggage size={14} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {bookingData.luggage} Bag{bookingData.luggage !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}

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
                </div >


            </div >
        );
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 pb-24">
            {/* Progress Bar (Sticky) */}
            <div className="sticky top-[35px] z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 print:hidden">
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
                                    disabled={isSubmitting}
                                    className={`ml-auto flex items-center gap-2 px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#B38E2D]/90 transition-all hover:-translate-y-1 active:translate-y-0 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {step === 4 ? (isSubmitting ? 'Booking...' : 'Confirm Booking') : 'Continue'}
                                    {!isSubmitting && <ArrowRight size={20} />}
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



