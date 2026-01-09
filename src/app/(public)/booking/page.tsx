'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowRight, Calendar, Clock, User, Mail, Phone, MapPin, ChevronDown, Info, ShieldCheck, Headphones, Briefcase, Navigation, Building2, Globe, PlaneLanding, PlaneTakeoff, Users, Luggage, HeartHandshake, Car } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import FadeIn from '@/components/common/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';

import { usePricing } from '@/context/PricingContext';
import { Route } from '@/lib/pricing';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Breadcrumbs from '@/components/common/Breadcrumbs';

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

    // PWA Install Prompt State
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // Core State
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
        country: '', // Changed from 'Saudi Arabia' to force selection
        flightNumber: '',
        arrivalDate: null as Date | null,
        notes: '',
        pickup: '',
        dropoff: '',
        passengers: 1,
        luggage: 0
    });

    const [bookingResponse, setBookingResponse] = useState<any>(null);

    const [totalPrice, setTotalPrice] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);
    const wizardRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const [draftId, setDraftId] = useState<string | null>(null);

    // Auto-Save Draft Logic
    useEffect(() => {
        const saveDraft = async () => {
            // Only save if we have at least some contact info or substantial progress (Step 3+)
            // Or if we are in Step 3 and have typed something
            const hasContact = bookingData.email || bookingData.phone;

            if (!hasContact && step < 3) return;

            try {
                const payload = {
                    draftId,
                    step,
                    email: bookingData.email,
                    phone: bookingData.phone,
                    name: bookingData.name,
                    data: {
                        ...bookingData,
                        currentStep: step
                    }
                };

                const res = await fetch('/api/bookings/draft', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.draftId && data.draftId !== draftId) {
                        setDraftId(data.draftId);
                    }
                }
            } catch (err) {
                // Silent fail for drafts
                console.error("Draft Auto-save failed", err);
            }
        };

        const timeoutId = setTimeout(saveDraft, 2000); // Debounce 2s
        return () => clearTimeout(timeoutId);
    }, [bookingData, step, draftId]);

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
            // @ts-ignore
            if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

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

            if (!bookingData.country) newErrors.country = 'Please select your country/region';

            // Phone Validation: Allow international formats, ensure reasonable length
            // Accepts: +966..., 00966..., 050... (local), with spaces/dashes
            const phoneRegex = /^(\+|00)?[0-9\s-]{9,15}$/;
            const saudiPhoneRegex = /^(\+966|00966|0)?5\d{8}$/;

            if (!bookingData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (bookingData.country === 'Saudi Arabia' && !saudiPhoneRegex.test(bookingData.phone.replace(/[\s-]/g, ''))) {
                newErrors.phone = 'Invalid Saudi number. Format: 05XXXXXXXX or +9665XXXXXXXX';
            } else if (!phoneRegex.test(bookingData.phone.trim())) {
                newErrors.phone = 'Please enter a valid phone number (min 9 digits)';
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

    const filteredRoutes = routes;

    const pickupLocations = Array.from(new Set(routes.map(r => {
        const [p] = splitRouteName(r.name);
        return p || r.name;
    }))).sort();

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
                            className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"
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
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Begin Your Journey</h2>
                        <p className="text-slate-500 text-xl font-light">Experience premium transport with our gold-standard service.</p>
                    </div>

                    <div className="max-w-xl mx-auto md:mx-0 glass-card p-6 md:p-10 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl relative">
                        {/* Decorative Gold sheen - Contained to avoid spilling but separate from content clipping */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
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
                                        ...Array.from(new Set(filteredRoutes.map(r => {
                                            const [p] = splitRouteName(r.name);
                                            return p || r.name;
                                        }))).sort().map(p => ({ value: p, label: p })),
                                        { value: 'custom', label: 'Other / Custom Location' }
                                    ]}
                                    placeholder="Select Pickup"
                                    className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none text-base"
                                    icon={<MapPin size={20} />}
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
                                    placeholder={!bookingData.pickup ? "Select Pickup First" : "Select Dropoff"}
                                    className={`w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none text-base ${(!bookingData.pickup || bookingData.pickup === 'custom') ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 block">Precise Pickup Address</label>
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
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 block">Precise Dropoff Address</label>
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
                                        className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-6 border border-secondary/20 shadow-lg shadow-secondary/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/30">
                                                <MapPin size={28} fill="currentColor" />
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
                className="space-y-8"
            >
                <div className="mb-6 pl-1">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Select Your Vehicle</h2>
                    <p className="text-slate-500 text-lg">Choose the perfect ride for your journey</p>
                </div>

                {/* Mobile Dropdown (Visible on small screens) */}


                <div className="lg:hidden mb-8">
                    <div className="relative">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <Briefcase size={18} className="text-secondary" />
                            <span>Vehicle Selection</span>
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
                                            className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl border-2 border-secondary/50 group"
                                        >
                                            {/* Background Image / Placeholder */}
                                            <div className="absolute inset-0 bg-slate-900">
                                                {v.image ? (
                                                    <img src={v.image} alt={v.name} className="w-full h-full object-cover opacity-90" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Briefcase className="text-slate-700" size={48} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                                            {/* 'SELECTED' Badge */}
                                            <div className="absolute top-4 right-4 bg-secondary text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                                                <CheckCircle size={12} fill="currentColor" className="text-white" />
                                                Selected {sv.quantity > 1 && `x${sv.quantity}`}
                                            </div>

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                                <h3 className="text-2xl font-bold text-white mb-1 leading-tight flex items-center gap-2">
                                                    {v.name}
                                                    {v.name.includes('GMC') && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full">VIP</span>}
                                                </h3>
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
                                relative w-full premium-input bg-white dark:bg-slate-900
                                rounded-xl px-4 py-4 flex items-center justify-between 
                                cursor-pointer transition-all hover:border-secondary/50 shadow-sm
                                ${isVehicleDropdownOpen ? 'border-secondary ring-2 ring-secondary/20' : 'border-slate-200 dark:border-slate-700'}
                            `}
                            onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                        >
                            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Car size={20} className="text-secondary" />
                                {bookingData.selectedVehicles.length > 0
                                    ? `${bookingData.selectedVehicles.reduce((acc, v) => acc + v.quantity, 0)} Vehicles Added`
                                    : 'Tap to Add Vehicles'}
                            </span>
                            <ChevronDown className={`text-slate-400 transition-transform ${isVehicleDropdownOpen ? 'rotate-180 text-secondary' : ''}`} size={20} />
                        </div>

                        {/* Dropdown List */}
                        {isVehicleDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[100] max-h-[60vh] overflow-y-auto custom-scrollbar pb-4 ring-1 ring-black/5"
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
                                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-white/10 shadow-sm relative">
                                                    {vehicle.image ? (
                                                        <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                                                    ) : <div className="w-full h-full flex items-center justify-center"><User size={20} className="text-slate-300" /></div>}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`block font-bold text-sm ${isSelected ? 'text-secondary dark:text-secondary' : 'text-slate-900 dark:text-white'}`}>
                                                            {vehicle.name}
                                                            {vehicle.name.includes('GMC') && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full">VIP</span>}
                                                        </span>
                                                        <div className="text-right shrink-0 ml-2">

                                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                                {bookingData.routeId === 'custom' ? 'Quote' : `${priceDetails.price} SAR`}
                                                            </span>

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
                                                        Add Vehicle
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

                {/* Desktop Grid (Hidden on mobile) - Refined Premium Look */}
                <div className="hidden lg:grid grid-cols-2 gap-8">
                    {vehicles.map((vehicle) => {
                        const Icon = vehicle.icon;
                        const priceDetails = calculatePrice(bookingData.routeId, vehicle.id);
                        const selectedMatch = bookingData.selectedVehicles.find(v => v.vehicleId === vehicle.id);
                        const quantity = selectedMatch ? selectedMatch.quantity : 0;
                        const isSelected = quantity > 0;

                        return (
                            <motion.div
                                key={vehicle.id}
                                whileHover={{ y: -6 }}
                                onClick={() => !isSelected && handleVehicleQuantityChange(vehicle.id, 1)}
                                className={`
                                    relative rounded-3xl transition-all duration-300 group overflow-hidden flex flex-col cursor-pointer
                                    ${isSelected
                                        ? 'bg-white dark:bg-slate-900 border-2 border-secondary shadow-[0_0_30px_rgba(212,175,55,0.15)] ring-1 ring-secondary/20'
                                        : 'bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-secondary/30 hover:shadow-xl'
                                    }
                                `}
                            >
                                {/* Image Container */}
                                <div className={`
                                    relative h-56 w-full overflow-hidden 
                                    ${isSelected ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-slate-100/50 dark:bg-slate-950/50'}
                                    transition-colors duration-300
                                `}>
                                    {vehicle.image ? (
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.name}
                                            className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Icon size={72} />
                                        </div>
                                    )}

                                    {/* Features Badges - Absolute */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {vehicle.name.includes('GMC') && (
                                            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider border border-slate-700">Premium</span>
                                        )}
                                        {vehicle.name.includes('Hiace') && (
                                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider">Group</span>
                                        )}
                                    </div>

                                    {/* Price Tag - Absolute */}
                                    <div className={`
                                        absolute bottom-4 right-4 px-4 py-2 rounded-xl shadow-lg border backdrop-blur-md
                                        ${isSelected
                                            ? 'bg-secondary text-white border-secondary'
                                            : 'bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white border-white/20'
                                        }
                                    `}>
                                        {bookingData.routeId === 'custom' ? (
                                            <span className="text-sm font-bold">Quote</span>
                                        ) : (
                                            <div className="flex flex-col items-end leading-none">
                                                {priceDetails.discountApplied > 0 && (
                                                    <span className={`text-[10px] font-medium line-through mb-0.5 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                                                        {priceDetails.originalPrice}
                                                    </span>
                                                )}
                                                <span className="text-xl font-black">
                                                    {priceDetails.price} <span className="text-xs font-bold opacity-70">SAR</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-secondary' : 'text-slate-900 dark:text-white'}`}>
                                                {vehicle.name}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                                <span className="flex items-center gap-1.5"><Users size={14} /> {vehicle.capacity}</span>
                                                <span className="flex items-center gap-1.5"><Luggage size={14} /> {vehicle.luggage}</span>
                                            </div>
                                        </div>

                                        {/* Quantity Control (Desktop) */}
                                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 rounded-lg p-1 border border-slate-100 dark:border-slate-800">
                                            {quantity > 0 ? (
                                                <>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, -1); }}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-bold text-slate-900 dark:text-white w-6 text-center">{quantity}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, 1); }}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary text-white hover:bg-secondary/90 transition-colors shadow-sm"
                                                    >
                                                        +
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, 1); }}
                                                    className="px-4 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-secondary dark:hover:text-secondary transition-colors"
                                                >
                                                    Select
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-dashed dark:border-slate-800 grid grid-cols-2 gap-2">
                                        {vehicle.features.slice(0, 4).map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                                                <span className="truncate">{feature}</span>
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
            <div className="mb-6 pl-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trip Details</h2>
                <p className="text-slate-500 text-lg">Help us coordinate your perfect pickup</p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            <Calendar size={14} className="text-secondary" /> Pickup Date
                        </label>
                        <div className="relative group">
                            <input
                                type="date"
                                value={bookingData.date ? bookingData.date.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        updateData('date', null);
                                        return;
                                    }
                                    const newDate = new Date(e.target.value);
                                    updateData('date', newDate);
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50 text-base font-medium [color-scheme:light] dark:[color-scheme:dark]"
                            />
                            {errors.date && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><Info size={18} /></div>}
                        </div>
                        {errors.date && <p className="text-red-500 text-xs ml-1 font-medium">{errors.date}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            <Clock size={14} className="text-secondary" /> Pickup Time
                        </label>
                        <div className="relative group">
                            <input
                                type="time"
                                value={bookingData.time ? bookingData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        updateData('time', null);
                                        return;
                                    }
                                    const [hours, minutes] = e.target.value.split(':').map(Number);
                                    const newTime = new Date();
                                    newTime.setHours(hours);
                                    newTime.setMinutes(minutes);
                                    updateData('time', newTime);
                                }}
                                className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50 text-base font-medium [color-scheme:light] dark:[color-scheme:dark]"
                            />
                            {errors.time && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><Info size={18} /></div>}
                        </div>
                        {errors.time && <p className="text-red-500 text-xs ml-1 font-medium">{errors.time}</p>}
                    </div>
                </div>

                <div className="my-8 border-t border-slate-100 dark:border-slate-700/50" />

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Contact Information</h3>
                    <p className="text-sm text-slate-400">Where should we send your booking confirmation?</p>
                </div>

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
                                className="w-full premium-input rounded-xl pl-11 pr-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-secondary/20"
                                value={bookingData.name}
                                onChange={(e) => updateData('name', e.target.value)}
                                placeholder="Your full name"
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.name}</p>}
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
                            className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50"
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
                                className="w-full premium-input rounded-xl pl-11 pr-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-secondary/20"
                                value={bookingData.phone}
                                onChange={(e) => updateData('phone', e.target.value)}
                                placeholder="+966 54 549 4921"
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.phone}</p>}
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
                                className="w-full premium-input rounded-xl pl-11 pr-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-secondary/20"
                                value={bookingData.email}
                                onChange={(e) => updateData('email', e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
                    </div>
                </div>
            </div>

            {/* Optional Details Section */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Additional Details</h3>
                        <p className="text-sm text-slate-400">Optional info to help us serve you better</p>
                    </div>
                    <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full">Optional</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Flight Details */}
                    <div className="relative group col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Flight Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <PlaneLanding size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-white dark:bg-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-all text-sm"
                                value={bookingData.flightNumber}
                                onChange={(e) => updateData('flightNumber', e.target.value)}
                                placeholder="e.g. SV123 (Helps us track delays)"
                            />
                        </div>
                    </div>

                    {/* Arrival Airport Date */}
                    <div className="relative group col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Arrival Date (If different)</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={bookingData.arrivalDate ? bookingData.arrivalDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        updateData('arrivalDate', null);
                                        return;
                                    }
                                    const newDate = new Date(e.target.value);
                                    updateData('arrivalDate', newDate);
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-white dark:bg-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-all text-sm pl-4 [color-scheme:light] dark:[color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Passengers</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Users size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <input
                                type="number"
                                min="1"
                                className="w-full bg-white dark:bg-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700 focus:border-secondary transition-all text-sm"
                                value={bookingData.passengers}
                                onChange={(e) => updateData('passengers', parseInt(e.target.value) || '')}
                                placeholder="1"
                            />
                        </div>
                    </div>

                    {/* Luggage */}
                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Luggage Items</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Luggage size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-white dark:bg-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700 focus:border-secondary transition-all text-sm"
                                value={bookingData.luggage}
                                onChange={(e) => updateData('luggage', parseInt(e.target.value) || 0)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="col-span-2 border-t border-slate-200 dark:border-slate-700/50 my-2" />

                    <div className="relative group col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Special Requests / Notes</label>
                        <textarea
                            className="w-full bg-white dark:bg-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700 focus:border-secondary transition-all text-sm min-h-[100px] resize-y"
                            value={bookingData.notes || ''}
                            onChange={(e) => updateData('notes', e.target.value)}
                            placeholder="Any special instructions for the driver..."
                        />
                    </div>
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
                className="space-y-8"
            >
                <div className="mb-6 pl-1">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Review Booking</h2>
                    <p className="text-slate-500 text-lg">One last check before we secure your ride</p>
                </div>

                {/* Digital Ticket Container */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 relative">
                    {/* Top Gold Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-secondary/80 to-[#B38E2D]" />

                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">

                        {/* Left Section: Trip Details */}
                        <div className="p-8 col-span-2 space-y-8">
                            {/* Route Visual */}
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center pt-2">
                                    <div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/20" />
                                    <div className="w-0.5 h-16 bg-gradient-to-b from-secondary to-slate-200 dark:to-slate-800 my-1" />
                                    <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white ring-4 ring-slate-100 dark:ring-slate-700" />
                                </div>
                                <div className="flex-1 space-y-8">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup</p>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                            {bookingData.pickup || (route ? splitRouteName(route.name)[0] : 'Unknown Pickup')}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2 text-sm font-medium text-slate-500">
                                            <Calendar size={14} className="text-secondary" /> {bookingData.date?.toLocaleDateString()}
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <Clock size={14} className="text-secondary" /> {bookingData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                            {bookingData.dropoff || (route ? splitRouteName(route.name)[1] : 'Unknown Dropoff')}
                                        </h3>
                                        {route && (
                                            <div className="flex items-center gap-2 mt-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md w-fit">
                                                <span>{route.distance}</span>
                                                <span>•</span>
                                                <span>{route.time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => setStep(1)} className="text-xs font-bold text-secondary hover:text-[#B38E2D] hover:underline underline-offset-4">
                                    EDIT
                                </button>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Briefcase size={18} className="text-secondary" />
                                        Selected Vehicles
                                    </h4>
                                    <button onClick={() => setStep(2)} className="text-xs font-bold text-secondary hover:text-[#B38E2D] hover:underline underline-offset-4">
                                        EDIT
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {bookingData.selectedVehicles.map(sv => {
                                        const v = vehicles.find(veh => veh.id === sv.vehicleId);
                                        return v ? (
                                            <div key={sv.vehicleId} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                                <div className="w-16 h-10 bg-white dark:bg-slate-700/50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-600">
                                                    {v.image ? <img src={v.image} alt={v.name} className="w-full h-full object-cover" /> : <User size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{v.name}</p>
                                                    <p className="text-xs text-slate-500">{v.capacity} Passengers • {v.luggage} Bags</p>
                                                </div>
                                                <div className="ml-auto font-bold text-sm bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 shadow-sm">
                                                    x{sv.quantity}
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Passenger & Pricing */}
                        <div className="bg-slate-50/50 dark:bg-black/20 p-8 flex flex-col h-full">
                            <div className="mb-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Passenger</h4>
                                    <button onClick={() => setStep(3)} className="text-[10px] font-bold text-secondary hover:text-[#B38E2D] hover:underline underline-offset-4">
                                        EDIT
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm">
                                            <User size={14} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-slate-900 dark:text-white truncate">{bookingData.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{bookingData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm">
                                            <Phone size={14} />
                                        </div>
                                        <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">{bookingData.phone}</p>
                                    </div>
                                </div>
                                {(bookingData.notes) && (
                                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg">
                                        <p className="text-[10px] uppercase font-bold text-yellow-600 dark:text-yellow-500 mb-1">Notes</p>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{bookingData.notes}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-6 border-t border-dashed border-slate-300 dark:border-slate-700">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Base Rate</span>
                                        <span>{priceDetails?.originalPrice && priceDetails.originalPrice > priceDetails.price ? priceDetails.originalPrice : priceDetails.price} SAR</span>
                                    </div>
                                    {priceDetails.discountApplied > 0 && (
                                        <div className="flex justify-between text-sm text-green-600 font-medium">
                                            <span>Discount</span>
                                            <span>-{priceDetails.discountApplied} SAR</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Taxes & Fees</span>
                                        <span>Included</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-400">Total</span>
                                        <span className="block text-xl font-black text-slate-900 dark:text-white">
                                            {totalPrice} <span className="text-xs text-slate-500 font-bold">SAR</span>
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Secure SSL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck size={14} />
                    <span>Your data is encrypted and secure. We never share your details. (Official License #12345)</span>
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

                    {/* Safar Dua Card - Spiritual Resonance */}
                    <div className="bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 rounded-xl border border-amber-100 dark:border-slate-700 text-center print:hidden">
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-3">Travel Supplication (Dua)</p>
                        <p className="text-2xl md:text-3xl font-serif text-slate-800 dark:text-slate-200 mb-4 leading-loose" dir="rtl">
                            سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                            &quot;Glory be to Him who has subjected this to us, and we could not have otherwise subdued it. And indeed we, to our Lord, will surely return.&quot;
                        </p>
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
                <div className="mb-6">
                    <Breadcrumbs />
                </div>
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
                                    {step === 4 ? (isSubmitting ? 'Securing Ride...' : 'Secure Your Safe Ride') : 'Continue'}
                                    {!isSubmitting && <ArrowRight size={20} />}
                                </button>
                            </div>
                        )}

                        {/* Trust Bar - Conversion Optimizer (Visible on Details & Review Steps) */}
                        {step >= 3 && step < 5 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-1 group cursor-default opacity-70 hover:opacity-100 transition-opacity">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <span className="text-xs text-slate-500 font-medium">Official License</span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1 group cursor-default opacity-70 hover:opacity-100 transition-opacity">
                                    <Navigation className="w-5 h-5 text-blue-500" />
                                    <span className="text-xs text-slate-500 font-medium">GPS Tracked</span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1 group cursor-default opacity-70 hover:opacity-100 transition-opacity">
                                    <HeartHandshake className="w-5 h-5 text-pink-500" />
                                    <span className="text-xs text-slate-500 font-medium">Family Staff</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        {step < 5 && <Sidebar />}
                    </div>
                </div>
            </div>

        </main >
    );
}



