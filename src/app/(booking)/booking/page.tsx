'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { CheckCircle, ArrowRight, Calendar, Clock, User, Mail, Phone, MapPin, ChevronDown, Info, ShieldCheck, Headphones, Briefcase, Navigation, Building2, Globe, PlaneLanding, PlaneTakeoff, Users, Luggage, HeartHandshake, Car, Trash2, Plus, Lock, MessageCircle, CheckCircle2, ArrowLeft , Copy, Check, BookOpen} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import FadeIn from '@/components/common/FadeIn';
// Mock framer-motion to remove all animations while preserving JSX structure
const motion: any = {
    div: ({ initial, animate, exit, variants, transition, whileHover, whileTap, layout, layoutId, ...props }: any) => <div {...props} />
};
const AnimatePresence: any = ({ children }: any) => <>{children}</>;

import { usePricing } from '@/context/PricingContext';
import { Route } from '@/lib/pricing';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import NusukBadge from '@/components/common/NusukBadge';
import { useSettings } from '@/context/SettingsContext';
import { calculateFinalPrice } from '@/lib/pricing';
import dynamic from 'next/dynamic';
import BookingHeader from '@/components/booking/BookingHeader';
import BookingFooter from '@/components/booking/BookingFooter';
import TrustBadges from '@/components/booking/TrustBadges';
import VehicleCategoryFilter from '@/components/booking/VehicleCategoryFilter';
import BookingGuide from '@/components/booking/BookingGuide';

const CustomRouteMap = dynamic(() => import('@/components/booking/CustomRouteMap'), { ssr: false });

const splitRouteName = (name: string): [string, string] => {
    if (!name) return ['', ''];
    const parts = name.split(/\s*(?:->|to|\u2192)\s*/i);
    return [parts[0]?.trim() || '', parts[1]?.trim() || ''];
};

// Helper: get origin (pickup) from a route — prefer explicit field, fall back to name parsing
const getRouteOrigin = (r: Route): string => r.origin || splitRouteName(r.name)[0] || r.name;
const getRouteDestination = (r: Route): string => r.destination || splitRouteName(r.name)[1] || '';

// Normalize text for fuzzy matching of locations (e.g. Madina vs Madinah, Makka vs Makkah)
const normalizeText = (text: string) => text ? text.toLowerCase().replace(/makkah?/g, 'makka').replace(/madinah?/g, 'madina').replace(/\s+/g, ' ').trim() : '';

const ZIYARAT_PACKAGES: Record<string, { duration: string, places: string[] }> = {
    'makkah ziyarat': {
        duration: '3 Hours',
        places: ['Jabal al Thawr', 'Masjid Nimrah', 'Jabal Al Rahma', 'Zubaida Canal', 'Muzdalifa', 'Ismail Spot', 'Khaif Mosque', 'Mina', 'Jamarat', 'Jabal Al Nour', 'Hira Cave']
    },
    'madinah ziyarat': {
        duration: '3 Hours',
        places: ['Masjid Quba', 'Salman Farsi Garden', 'Masjid Jumma', 'Jable Ohad', 'Masjid al Qiblatayn', 'Masjid Faseh', 'Al Ghars Well', 'Maqam e Khandak', '7 Mosques']
    },
    'taif ziyarat': {
        duration: '6 Hours',
        places: ['Masjid Adas', 'Masjid Ali', 'Masjid Meeqat', 'Masjid Rasool', 'Masjid Abdullah bin Abbas']
    },
    'badr ziyarat': {
        duration: '4 Hours',
        places: ['Beer Al Roha', 'Beer E Shifa', 'Masjid Areesh', 'Site of the Battle of Badr', 'Jabal e Malaika']
    }
};

function BookingContent() {
    const { routes, vehicles, calculatePrice, isLoading } = usePricing();
    const { settings } = useSettings();
    const [step, setStep] = useState(1);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState<string>('journey');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
        routeType: 'single' as 'single' | 'multi',
        legs: [] as { id: string, pickup: string, dropoff: string, date: Date | null, time: Date | null, stopovers?: string[], vehicleId?: string, routeId?: string, selectedVehicles?: { vehicleId: string; quantity: number }[], includeWadiJinn?: boolean, viaBadr?: boolean }[],
        sameVehicleForAllLegs: true,
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
        luggage: 0,
        customRoute: null as {
            pickupLat: number;
            pickupLng: number;
            dropoffLat: number;
            dropoffLng: number;
            distanceKm: number;
            durationMin: number;
            geometry: string;
        } | null,
        includeWadiJinn: false,
        visaType: '' as string,
        viaBadr: false,
    });

    const [bookingResponse, setBookingResponse] = useState<any>(null);

    const [totalPrice, setTotalPrice] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);
    const wizardRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [draftId, setDraftId] = useState<string | null>(null);

    // Load from sessionStorage on mount
    useEffect(() => {
        try {
            const savedData = sessionStorage.getItem('bookingData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                // Rehydrate dates
                if (parsed.date) parsed.date = new Date(parsed.date);
                if (parsed.time) parsed.time = new Date(parsed.time);
                if (parsed.arrivalDate) parsed.arrivalDate = new Date(parsed.arrivalDate);
                if (parsed.legs) {
                    parsed.legs = parsed.legs.map((leg: any) => ({
                        ...leg,
                        date: leg.date ? new Date(leg.date) : null,
                        time: leg.time ? new Date(leg.time) : null,
                    }));
                }
                setBookingData(prev => ({ ...prev, ...parsed }));
            }
        } catch (e) {
            console.error('Error loading booking from sessionStorage', e);
        }
    }, []);

    // Save to sessionStorage on change
    useEffect(() => {
        // Skip saving if empty
        if (bookingData.routeType === 'single' && !bookingData.routeId && !bookingData.pickup) return;
        try {
            sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
        } catch (e) {
            console.error('Error saving booking to sessionStorage', e);
        }
    }, [bookingData]);

    // BeforeUnload to prevent accidental loss
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (step > 1 && step < 5) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [step]);

    // Sync URL with Step
    useEffect(() => {
        const urlStep = searchParams.get('step');
        if (urlStep) {
            const parsedStep = parseInt(urlStep, 10);
            if (!isNaN(parsedStep) && parsedStep >= 1 && parsedStep <= 5) {
                setStep(parsedStep);
            }
        } else if (step !== 1) {
            setStep(1);
        }
    }, [searchParams]);

    // Update URL initially if not present
    useEffect(() => {
        if (!searchParams.has('step') && step === 1) {
            router.replace(`${pathname}?step=1`, { scroll: false });
        }
    }, [pathname, router, searchParams, step]);

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

    const isInitialized = useRef(false);

    // Initialize defaults when data loads and handle URL params for deep linking
    useEffect(() => {
        if (!isLoading && routes.length > 0 && vehicles.length > 0 && !isInitialized.current) {
            isInitialized.current = true;
            const paramVehicle = searchParams.get('vehicle');
            const paramStep = searchParams.get('step');
            const paramNotes = searchParams.get('notes');
            const paramRouteId = searchParams.get('routeId');
            const paramQuantity = searchParams.get('quantity');

            // Default values
            let initialRouteId = '';
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
                    initialPickup = getRouteOrigin(selectedRoute);
                    initialDropoff = getRouteDestination(selectedRoute);
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

    const getPriceDetails = useCallback((routeId: string, vehicleId: string) => {
        if (routeId === 'multi') {
            const validLegs = bookingData.legs.filter(l => l.pickup && l.dropoff);
            let totalPrice = 0;
            let totalOriginalPrice = 0;
            let totalDiscount = 0;
            
            validLegs.forEach(leg => {
                const matchedRoute = routes.find(r => normalizeText(getRouteOrigin(r)).includes(normalizeText(leg.pickup)) && getRouteDestination(r) === leg.dropoff);
                if (matchedRoute) {
                    const legPrice = calculatePrice(matchedRoute.id, vehicleId, { 
                        includeWadiJinn: leg.includeWadiJinn, 
                        viaBadr: leg.viaBadr,
                        visaType: bookingData.visaType,
                        pickup: leg.pickup,
                        dropoff: leg.dropoff,
                    });
                    totalPrice += legPrice.price;
                    totalOriginalPrice += legPrice.originalPrice;
                    totalDiscount += legPrice.discountApplied;
                }
            });
            return { price: totalPrice, originalPrice: totalOriginalPrice, discountApplied: totalDiscount };
        }

        if (routeId === 'custom') {
            const distance = bookingData.customRoute?.distanceKm;
            if (!distance) {
                return { price: 0, originalPrice: 0, discountApplied: 0 };
            }
            const baseFare = settings?.customRoute?.baseFare ?? 50;
            const kmRate = settings?.customRoute?.kmRate ?? 3;
            const minFare = settings?.customRoute?.minFare ?? 50;
            const vehicle = vehicles.find(v => v.id === vehicleId);
            const multiplier = vehicle?.multiplier ?? 1;
            
            const rawCost = Math.max(minFare, baseFare + distance * kmRate);
            return calculateFinalPrice(rawCost * multiplier, settings?.discount);
        }
        return calculatePrice(routeId, vehicleId, { 
            includeWadiJinn: bookingData.includeWadiJinn, 
            viaBadr: bookingData.viaBadr,
            visaType: bookingData.visaType,
            pickup: bookingData.pickup,
            dropoff: bookingData.dropoff,
        });
    }, [bookingData.customRoute, bookingData.legs, bookingData.includeWadiJinn, bookingData.viaBadr, bookingData.visaType, bookingData.pickup, bookingData.dropoff, calculatePrice, vehicles, settings, routes]);

    useEffect(() => {
        let total = 0;
        let originalTotal = 0;

        if (bookingData.routeType === 'multi' && !bookingData.sameVehicleForAllLegs) {
            total = bookingData.legs.reduce((legSum, leg) => {
                if (!leg.routeId || !leg.selectedVehicles) return legSum;
                const legVehiclesTotal = leg.selectedVehicles.reduce((sum, v) => {
                    const priceDetails = calculatePrice(leg.routeId!, v.vehicleId);
                    return sum + (priceDetails.price * v.quantity);
                }, 0);
                return legSum + legVehiclesTotal;
            }, 0);
        } else if (bookingData.routeId && bookingData.selectedVehicles.length > 0) {
            total = bookingData.selectedVehicles.reduce((sum, v) => {
                const priceDetails = getPriceDetails(bookingData.routeId, v.vehicleId);
                return sum + (priceDetails.price * v.quantity);
            }, 0);
        }

        // Apply 10% multi-route discount if 3 or more routes are selected
        if (bookingData.routeType === 'multi' && bookingData.legs.filter(l => l.routeId).length >= 3 && total > 0) {
            total = total * 0.9;
        }

        setTotalPrice(total);
    }, [bookingData.routeId, bookingData.selectedVehicles, bookingData.legs, bookingData.routeType, bookingData.sameVehicleForAllLegs, getPriceDetails, calculatePrice]);

    const handleVehicleQuantityChange = (vehicleId: string, delta: number, legId?: string) => {
        setBookingData(prev => {
            if (legId && prev.routeType === 'multi' && !prev.sameVehicleForAllLegs) {
                const newLegs = prev.legs.map(leg => {
                    if (leg.id !== legId) return leg;
                    const vehicles = leg.selectedVehicles || [];
                    const existing = vehicles.find(v => v.vehicleId === vehicleId);
                    let newVehicles = [...vehicles];
                    if (existing) {
                        const newQuantity = existing.quantity + delta;
                        if (newQuantity <= 0) {
                            newVehicles = newVehicles.filter(v => v.vehicleId !== vehicleId);
                        } else {
                            newVehicles = newVehicles.map(v => v.vehicleId === vehicleId ? { ...v, quantity: newQuantity } : v);
                        }
                    } else if (delta > 0) {
                        newVehicles.push({ vehicleId, quantity: delta });
                    }
                    return { ...leg, selectedVehicles: newVehicles };
                });
                return { ...prev, legs: newLegs };
            }

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

    const isAirportRoute = (() => {
        if (bookingData.routeType === 'multi') {
            return bookingData.legs?.some((leg: any) => 
                (leg.pickup && leg.pickup.toLowerCase().includes('airport')) || 
                (leg.dropoff && leg.dropoff.toLowerCase().includes('airport'))
            );
        } else {
            return (bookingData.pickup && bookingData.pickup.toLowerCase().includes('airport')) || 
                   (bookingData.dropoff && bookingData.dropoff.toLowerCase().includes('airport'));
        }
    })();

    const validateStep = () => {
        if (step === 1) {
            if (bookingData.routeType === 'multi') {
                if (bookingData.legs.length === 0) {
                    alert('Please add at least one route.');
                    return false;
                }
                const incompleteLegs = bookingData.legs.some(l => !l.pickup || !l.dropoff);
                if (incompleteLegs) {
                    alert('Please complete all pickup and dropoff locations for your multi-city route.');
                    return false;
                }
                const incompleteLegDates = bookingData.legs.some(l => !l.date || !l.time);
                if (incompleteLegDates) {
                    alert('Please select a date and time for each route.');
                    return false;
                }
            } else {
                if (bookingData.routeId === 'custom') {
                    if (!bookingData.pickup || !bookingData.customRoute?.pickupLat) {
                        setErrors(prev => ({ ...prev, pickup: 'Pickup location must be pinned on the map' }));
                        return false;
                    }
                    if (!bookingData.dropoff || !bookingData.customRoute?.dropoffLat) {
                        setErrors(prev => ({ ...prev, dropoff: 'Dropoff location must be pinned on the map' }));
                        return false;
                    }
                } else if (!bookingData.routeId) {
                    alert('Please select a valid pickup and dropoff location.');
                    return false;
                }
            }
        }

        if (step === 2) {
            if (bookingData.routeType === 'multi' && !bookingData.sameVehicleForAllLegs) {
                const validLegs = bookingData.legs.filter(l => l.pickup && l.dropoff);
                const allLegsHaveVehicles = validLegs.every(leg => leg.selectedVehicles && leg.selectedVehicles.length > 0);
                if (!allLegsHaveVehicles) {
                    alert('Please select at least one vehicle for each route.');
                    return false;
                }
            } else {
                if (bookingData.selectedVehicles.length === 0) {
                    alert('Please select a vehicle.');
                    return false;
                }
            }
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

            if (!bookingData.country) newErrors.country = 'Please enter your nationality';
            if (!bookingData.visaType) newErrors.visaType = 'Please select your visa type';

            // Phone Validation: Allow international formats, ensure reasonable length
            // Accepts: +966..., 00966..., 050... (local), with spaces/dashes
            const phoneRegex = /^(\+|00)?[0-9\s-]{9,15}$/;
            const saudiPhoneRegex = /^(\+966|00966|0)?5\d{8}$/;

            if (!bookingData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (bookingData.country?.toLowerCase() === 'saudi arabia' && !saudiPhoneRegex.test(bookingData.phone.replace(/[\s-]/g, ''))) {
                newErrors.phone = 'Invalid Saudi number. Format: 05XXXXXXXX or +9665XXXXXXXX';
            } else if (!phoneRegex.test(bookingData.phone.trim())) {
                newErrors.phone = 'Please enter a valid phone number (min 9 digits)';
            }

            if (bookingData.routeType !== 'multi') {
                if (!bookingData.date) newErrors.date = 'Date is required';
                if (!bookingData.time) newErrors.time = 'Time is required';
            }

            if (isAirportRoute) {
                if (!bookingData.flightNumber || !bookingData.flightNumber.trim()) {
                    newErrors.flightNumber = 'Flight number is required for airport transfers';
                }
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }
        return true;
    };

    const scrollToWizard = () => {
        if (wizardRef.current) {
            const yOffset = -120;
            const y = wizardRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'auto' });
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
            const isMulti = bookingData.routeType === 'multi';
            const hasVehicles = isMulti && !bookingData.sameVehicleForAllLegs
                ? bookingData.legs.filter(l => l.pickup && l.dropoff).every(leg => leg.selectedVehicles && leg.selectedVehicles.length > 0)
                : bookingData.selectedVehicles.length > 0;

            if ((route || isMulti) && hasVehicles) {
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
                            date: (bookingData.routeType === 'multi' && bookingData.legs[0]?.date) ? `${bookingData.legs[0].date.getFullYear()}-${String(bookingData.legs[0].date.getMonth() + 1).padStart(2, '0')}-${String(bookingData.legs[0].date.getDate()).padStart(2, '0')}` : (bookingData.date ? `${bookingData.date.getFullYear()}-${String(bookingData.date.getMonth() + 1).padStart(2, '0')}-${String(bookingData.date.getDate()).padStart(2, '0')}` : undefined),
                            time: (bookingData.routeType === 'multi' && bookingData.legs[0]?.time) ? `${String(bookingData.legs[0].time.getHours()).padStart(2, '0')}:${String(bookingData.legs[0].time.getMinutes()).padStart(2, '0')}` : (bookingData.time ? `${String(bookingData.time.getHours()).padStart(2, '0')}:${String(bookingData.time.getMinutes()).padStart(2, '0')}` : undefined),
                            country: bookingData.country,
                            flightNumber: bookingData.flightNumber,
                            arrivalDate: bookingData.arrivalDate ? `${bookingData.arrivalDate.getFullYear()}-${String(bookingData.arrivalDate.getMonth() + 1).padStart(2, '0')}-${String(bookingData.arrivalDate.getDate()).padStart(2, '0')}` : undefined,
                            // Sending selectedVehicles array instead of single vehicle details
                            selectedVehicles: bookingData.selectedVehicles,
                            status: 'pending',
                            routeType: bookingData.routeType,
                            sameVehicleForAllLegs: bookingData.sameVehicleForAllLegs,
                            legs: bookingData.routeType === 'multi' ? bookingData.legs.map(leg => {
                                const matchedRoute = routes.find(r => normalizeText(getRouteOrigin(r)).includes(normalizeText(leg.pickup)) && getRouteDestination(r) === leg.dropoff);
                                return { 
                                    ...leg, 
                                    routeId: matchedRoute?.id || '',
                                    date: leg.date ? `${leg.date.getFullYear()}-${String(leg.date.getMonth() + 1).padStart(2, '0')}-${String(leg.date.getDate()).padStart(2, '0')}` : undefined,
                                    time: leg.time ? `${String(leg.time.getHours()).padStart(2, '0')}:${String(leg.time.getMinutes()).padStart(2, '0')}` : undefined,
                                };
                            }) : undefined,
                            routeId: bookingData.routeType === 'multi' ? 'multi' : (bookingData.routeId === 'custom' ? 'custom' : bookingData.routeId),
                            customRoute: bookingData.routeId === 'custom' ? bookingData.customRoute : undefined,
                            includeWadiJinn: bookingData.includeWadiJinn || undefined,
                            visaType: bookingData.visaType || undefined,
                            viaBadr: bookingData.viaBadr || undefined,
                        }),
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.message || data.error || 'Failed to submit booking');
                    }
                    setBookingResponse(data);
                    try {
                        sessionStorage.removeItem('bookingData');
                    } catch (e) {}
                    setStep(5);
                    router.push(`${pathname}?step=5`, { scroll: false });
                    scrollToWizard();
                } catch (error: any) {
                    console.error('Booking submission error:', error);
                    alert(error.message || 'Failed to submit booking. Please try again.');
                    return;
                } finally {
                    setIsSubmitting(false);
                }
            } else {
                alert('Please ensure all vehicle selections are complete before submitting.');
                return;
            }
        } else {
            const next = step + 1;
            setStep(next);
            router.push(`${pathname}?step=${next}`, { scroll: false });
        }
    };


    const prevStep = () => {
        const prev = step - 1;
        setStep(prev);
        router.push(`${pathname}?step=${prev}`, { scroll: false });
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

    const getVehicleCategory = (vehicle: any): string => {
        const name = (vehicle.name || '').toLowerCase();
        const id = (vehicle.id || vehicle.vehicleId || '').toLowerCase();
        const combined = `${name} ${id}`;
        if (combined.includes('camry') || combined.includes('kia') || combined.includes('sedan')) return 'Sedan';
        if (combined.includes('gmc') || combined.includes('xpander') || combined.includes('suv')) return 'SUV';
        if (combined.includes('mercedes') || combined.includes('luxury')) return 'Luxury';
        if (combined.includes('staria') || combined.includes('starex') || combined.includes('van')) return 'Van';
        if (combined.includes('hiace') || combined.includes('coaster') || combined.includes('bus')) return 'Bus';
        return 'Other';
    };

    const availableCategories = ['Sedan', 'SUV', 'Luxury', 'Van', 'Bus'];

    const filteredVehicles = vehicles.filter(v => selectedCategory === 'All' || getVehicleCategory(v) === selectedCategory);

    const filteredRoutes = routes;

    const pickupLocations = Array.from(new Set(routes.map(r => getRouteOrigin(r)))).filter(Boolean).sort();

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

    const addLeg = () => {
        setBookingData(prev => ({
            ...prev,
            legs: [...prev.legs, { id: Date.now().toString(), pickup: prev.legs.length > 0 ? prev.legs[prev.legs.length - 1].dropoff : '', dropoff: '', date: null, time: null }]
        }));
    };

    const updateLeg = (index: number, field: string, value: any) => {
        setBookingData(prev => {
            const newLegs = [...prev.legs];
            newLegs[index] = { ...newLegs[index], [field]: value };
            return { ...prev, legs: newLegs };
        });
    };

    const removeLeg = (index: number) => {
        setBookingData(prev => {
            const newLegs = [...prev.legs];
            newLegs.splice(index, 1);
            return { ...prev, legs: newLegs };
        });
    };

    const renderZiyaratDetails = (destination: string) => {
        const destLower = destination.toLowerCase();
        let packageKey = '';
        if (destLower.includes('makkah ziyarat') && !destLower.includes('madinah')) packageKey = 'makkah ziyarat';
        else if (destLower.includes('madinah ziyarat')) packageKey = 'madinah ziyarat';
        else if (destLower.includes('taif ziyarat')) packageKey = 'taif ziyarat';
        else if (destLower.includes('badr ziyarat')) packageKey = 'badr ziyarat';
        
        const pkg = ZIYARAT_PACKAGES[packageKey];
        if (!pkg) return null;

        return (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 mb-4 p-5 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-xl relative z-10"
            >
                <div className="flex items-center gap-2 mb-3">
                    <Info size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm md:text-base capitalize">
                        {packageKey} – <span className="font-black">{pkg.duration}</span>
                    </h4>
                </div>
                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Included Ziyarat Places:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pkg.places.map((place, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                            <span>{place}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    };

    const renderReceiptZiyarat = (destination: string) => {
        const destLower = destination.toLowerCase();
        let packageKey = '';
        if (destLower.includes('makkah ziyarat') && !destLower.includes('madinah')) packageKey = 'makkah ziyarat';
        else if (destLower.includes('madinah ziyarat')) packageKey = 'madinah ziyarat';
        else if (destLower.includes('taif ziyarat')) packageKey = 'taif ziyarat';
        else if (destLower.includes('badr ziyarat')) packageKey = 'badr ziyarat';
        
        const pkg = ZIYARAT_PACKAGES[packageKey];
        if (!pkg) return null;

        return (
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {packageKey} – {pkg.duration}
                </div>
                <div className="text-[11px] mt-0.5">
                    Includes: {pkg.places.join(', ')}
                </div>
            </div>
        );
    };

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
                    <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4 text-center md:text-left">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Begin Your Journey</h2>
                            <p className="text-slate-500 text-xl font-light mb-4">Experience premium transport with our gold-standard service.</p>
                            <NusukBadge variant="gold" />
                        </div>
                        <button onClick={() => setIsGuideOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-secondary dark:text-[#E5B842] bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 dark:border-secondary/30 rounded-xl hover:bg-secondary hover:text-white dark:hover:bg-secondary dark:hover:text-white transition-all shadow-sm shrink-0 mt-2 md:mt-0">
                            <BookOpen size={18} className="shrink-0" />
                            Booking Guide
                        </button>
                    </div>

                    <div className="max-w-xl mx-auto md:mx-0 ios-glass p-6 md:p-10 rounded-[32px] border border-white/20 dark:border-slate-700/50 shadow-2xl relative">
                        {/* Decorative Gold sheen - Contained to avoid spilling but separate from content clipping */}
                        <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        </div>

                        {/* Route Type Selector */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 relative z-20">
                            <button
                                onClick={() => setBookingData(prev => ({ ...prev, routeType: 'single', routeId: '' }))}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${bookingData.routeType === 'single' ? 'bg-white shadow-sm text-secondary' : 'text-slate-500'}`}
                            >
                                Single Route
                            </button>
                            <button
                                onClick={() => {
                                    setBookingData(prev => ({ 
                                        ...prev, 
                                        routeType: 'multi', 
                                        routeId: 'multi',
                                        pickup: '',
                                        dropoff: '',
                                        legs: prev.legs.length === 0 ? [{ id: Date.now().toString(), pickup: prev.pickup, dropoff: prev.dropoff, date: null, time: null }] : prev.legs 
                                    }));
                                    setSelectedRoute(null);
                                }}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${bookingData.routeType === 'multi' ? 'bg-white shadow-sm text-secondary' : 'text-slate-500'}`}
                            >
                                Multi-City Route
                            </button>
                        </div>

                        {bookingData.routeType === 'single' ? (
                            <>
                                <div className="grid md:grid-cols-2 gap-6 mb-8 relative z-[60]">
                            {/* Pickup Location - Higher Z-Index to overlap Dropoff */}
                            <div className="relative group z-[50]">
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
                            <div className="relative group z-[40]">
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
                                                    normalizeText(getRouteOrigin(r)).includes(normalizeText(prev.pickup)) && getRouteDestination(r) === val
                                                );

                                                if (matchedRoute) {
                                                    newData.routeId = matchedRoute.id;
                                                    // Auto-correct pickup to match actual route
                                                    newData.pickup = getRouteOrigin(matchedRoute);
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
                                                .filter(r => normalizeText(getRouteOrigin(r)).includes(normalizeText(bookingData.pickup)))
                                                .map(r => getRouteDestination(r))
                                                .filter(Boolean)
                                            )).sort().map(d => ({ value: d, label: d }))
                                            : []
                                    }
                                    disabled={!bookingData.pickup || bookingData.pickup === 'custom'}
                                    placeholder={!bookingData.pickup ? "Select Pickup First" : "Select Dropoff"}
                                    className={`w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none text-base ${(!bookingData.pickup || bookingData.pickup === 'custom') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    icon={<Navigation strokeWidth={1.25} size={20} />}
                                    emptyStateAction={
                                        <Link 
                                            href="/contact" 
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-bold shadow-md hover:bg-secondary/90 transition-all"
                                        >
                                            <Navigation size={16} />
                                            Request Custom Route
                                        </Link>
                                    }
                                />
                            </div>
                        </div>
                        
                        {/* Ziyarat Details Block */}
                        {selectedRoute && renderZiyaratDetails(getRouteDestination(selectedRoute))}

                        {selectedRoute && getRouteDestination(selectedRoute).toLowerCase().includes('madinah ziyarat') && !selectedRoute.name.toLowerCase().includes('wadi jin') && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-4 bg-secondary/10 dark:bg-secondary/20 border border-secondary/30 dark:border-secondary rounded-xl flex items-start gap-3 relative z-10"
                            >
                                <input 
                                    type="checkbox" 
                                    id="wadiJinn-single"
                                    checked={bookingData.includeWadiJinn} 
                                    onChange={(e) => setBookingData(prev => ({...prev, includeWadiJinn: e.target.checked}))}
                                    className="mt-1 w-4 h-4 text-secondary rounded border-gray-300 focus:ring-secondary cursor-pointer"
                                />
                                <div>
                                    <label htmlFor="wadiJinn-single" className="font-bold text-secondary dark:text-secondary/50 text-sm cursor-pointer">
                                        Add Wadi Jinn (External Ziyarat) +150 SAR
                                    </label>
                                    <p className="text-xs text-secondary dark:text-secondary/90 mt-1">
                                        Wadi Jinn is an external ziyarat outside the standard Madinah Ziyarat package and requires an additional fee.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Via Badr Route Selector — Madinah → Makkah */}
                        {selectedRoute && (() => {
                            const dest = getRouteDestination(selectedRoute).toLowerCase();
                            const orig = getRouteOrigin(selectedRoute).toLowerCase();
                            const isMadinahToMakkah = (orig.includes('madin') && (dest.includes('makk') || dest.includes('mecc')));
                            return isMadinahToMakkah;
                        })() && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 relative z-10"
                            >
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Route Option</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Straight Route */}
                                    <label 
                                        className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${!bookingData.viaBadr ? 'border-secondary bg-secondary/5 shadow-lg shadow-secondary/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                                        onClick={() => setBookingData(prev => ({...prev, viaBadr: false}))}
                                    >
                                        {!bookingData.viaBadr && (
                                            <div className="absolute top-3 right-3">
                                                <CheckCircle size={18} className="text-secondary" />
                                            </div>
                                        )}
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Straight Route (Standard)</span>
                                        <span className="text-xs text-slate-500 mt-1">Fastest route, no additional distance</span>
                                        <span className="text-xs font-bold text-green-600 mt-2">No Extra Fee</span>
                                    </label>

                                    {/* Via Badr Route */}
                                    <label 
                                        className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${bookingData.viaBadr ? 'border-secondary bg-secondary/5 shadow-lg shadow-secondary/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                                        onClick={() => setBookingData(prev => ({...prev, viaBadr: true}))}
                                    >
                                        {bookingData.viaBadr && (
                                            <div className="absolute top-3 right-3">
                                                <CheckCircle size={18} className="text-secondary" />
                                            </div>
                                        )}
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Via Badr Route (Extended + Ziyarat)</span>
                                        <span className="text-xs text-slate-500 mt-1">Includes Badr region &amp; Jabal Malaika ziyarat</span>
                                        <span className="text-xs text-slate-400 mt-0.5">~150–200 km extra distance</span>
                                        <span className="text-xs font-bold text-secondary mt-2">+{settings?.routeFees?.viaBadrFeeAmount ?? 150} SAR</span>
                                    </label>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-2 ml-1 flex items-start gap-1">
                                    <Info size={12} className="mt-0.5 shrink-0" />
                                    This route includes the ziyarat point Jabal Malaika and adds approximately 150–200 km to the journey. An additional fee applies.
                                </p>
                            </motion.div>
                        )}
                            </>
                        ) : (
                            <div className="space-y-6 mb-8 relative z-10">
                                {bookingData.legs.length >= 3 && (
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                                                <span className="font-bold text-sm">%</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-green-800 dark:text-green-300 text-sm">10% Multi-Route Discount Unlocked!</h4>
                                                <p className="text-xs text-green-600 dark:text-green-400">Applied automatically to your total package.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {bookingData.legs.map((leg, index) => {
                                    const matchedRoute = filteredRoutes.find(r => normalizeText(getRouteOrigin(r)).includes(normalizeText(leg.pickup)) && getRouteDestination(r) === leg.dropoff);
                                    const hasStopovers = matchedRoute && matchedRoute.stopovers && matchedRoute.stopovers.length > 0;
                                    return (
                                    <div key={leg.id} className="relative p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700" style={{ zIndex: 50 - index }}>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Route {index + 1}</span>
                                            </div>
                                            {index > 0 && (
                                                <button onClick={() => removeLeg(index)} className="text-red-500 text-xs font-bold flex items-center gap-1 hover:underline">
                                                    <Trash2 size={12} /> Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="relative group z-[50]">
                                                <SearchableSelect
                                                    name={`pickup-${leg.id}`}
                                                    value={leg.pickup}
                                                    onChange={(e: any) => updateLeg(index, 'pickup', e.target.value)}
                                                    options={[...Array.from(new Set(filteredRoutes.map(r => getRouteOrigin(r)))).filter(Boolean).sort().map(p => ({ value: p, label: p }))]}
                                                    placeholder="Select Pickup"
                                                    className="w-full premium-input rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white"
                                                    icon={<MapPin strokeWidth={1.25} size={16} />}
                                                />
                                            </div>
                                            <div className="relative group z-[40]">
                                                <SearchableSelect
                                                    name={`dropoff-${leg.id}`}
                                                    value={leg.dropoff}
                                                    onChange={(e: any) => {
                                                        updateLeg(index, 'dropoff', e.target.value);
                                                        const r = filteredRoutes.find(r => normalizeText(getRouteOrigin(r)).includes(normalizeText(leg.pickup)) && getRouteDestination(r) === e.target.value);
                                                        if (r) updateLeg(index, 'routeId', r.id);
                                                    }}
                                                    options={
                                                        leg.pickup
                                                            ? Array.from(new Set(filteredRoutes
                                                                .filter(r => normalizeText(getRouteOrigin(r)).includes(normalizeText(leg.pickup)))
                                                                .map(r => getRouteDestination(r))
                                                                .filter(Boolean)
                                                            )).sort().map(d => ({ value: d, label: d }))
                                                            : []
                                                    }
                                                    disabled={!leg.pickup}
                                                    placeholder={!leg.pickup ? "Select Pickup First" : "Select Dropoff"}
                                                    className={`w-full premium-input rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white ${!leg.pickup ? 'opacity-50' : ''}`}
                                                    icon={<Navigation strokeWidth={1.25} size={16} />}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                                            <div className="relative group">
                                                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">
                                                    <Calendar strokeWidth={1.25} size={12} className="text-secondary" /> Pickup Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={leg.date ? leg.date.toISOString().split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        if (!e.target.value) {
                                                            updateLeg(index, 'date', null);
                                                            return;
                                                        }
                                                        updateLeg(index, 'date', new Date(e.target.value));
                                                    }}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full premium-input rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">
                                                    <Clock strokeWidth={1.25} size={12} className="text-secondary" /> Pickup Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={leg.time ? leg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                                                    onChange={(e) => {
                                                        if (!e.target.value) {
                                                            updateLeg(index, 'time', null);
                                                            return;
                                                        }
                                                        const [hours, minutes] = e.target.value.split(':').map(Number);
                                                        const newTime = new Date();
                                                        newTime.setHours(hours);
                                                        newTime.setMinutes(minutes);
                                                        updateLeg(index, 'time', newTime);
                                                    }}
                                                    className="w-full premium-input rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Ziyarat Details Block */}
                                        {matchedRoute && renderZiyaratDetails(getRouteDestination(matchedRoute))}

                                        {matchedRoute && getRouteDestination(matchedRoute).toLowerCase().includes('madinah ziyarat') && !matchedRoute.name.toLowerCase().includes('wadi jin') && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 p-4 bg-secondary/10 dark:bg-secondary/20 border border-secondary/30 dark:border-secondary rounded-xl flex items-start gap-3"
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    id={`wadiJinn-${leg.id}`}
                                                    checked={leg.includeWadiJinn || false} 
                                                    onChange={(e) => updateLeg(index, 'includeWadiJinn', e.target.checked)}
                                                    className="mt-1 w-4 h-4 text-secondary rounded border-gray-300 focus:ring-secondary cursor-pointer"
                                                />
                                                <div>
                                                    <label htmlFor={`wadiJinn-${leg.id}`} className="font-bold text-secondary dark:text-secondary/50 text-sm cursor-pointer">
                                                        Add Wadi Jinn (External Ziyarat) +150 SAR
                                                    </label>
                                                    <p className="text-xs text-secondary dark:text-secondary/90 mt-1">
                                                        Wadi Jinn is an external ziyarat outside the standard Madinah Ziyarat package and requires an additional fee.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                        
                                        {/* Via Badr Route Selector for Multi-Route Legs */}
                                        {matchedRoute && (() => {
                                            const dest = getRouteDestination(matchedRoute).toLowerCase();
                                            const orig = getRouteOrigin(matchedRoute).toLowerCase();
                                            return orig.includes('madin') && (dest.includes('makk') || dest.includes('mecc'));
                                        })() && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4"
                                            >
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Route Option</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <label 
                                                        className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${!leg.viaBadr ? 'border-secondary bg-secondary/5' : 'border-slate-200 dark:border-slate-700'}`}
                                                        onClick={() => updateLeg(index, 'viaBadr', false)}
                                                    >
                                                        <span className="font-bold text-slate-900 dark:text-white text-xs">Straight Route</span>
                                                        <span className="text-[10px] text-green-600 font-bold mt-1">No Extra Fee</span>
                                                    </label>
                                                    <label 
                                                        className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${leg.viaBadr ? 'border-secondary bg-secondary/5' : 'border-slate-200 dark:border-slate-700'}`}
                                                        onClick={() => updateLeg(index, 'viaBadr', true)}
                                                    >
                                                        <span className="font-bold text-slate-900 dark:text-white text-xs">Via Badr</span>
                                                        <span className="text-[10px] text-secondary font-bold mt-1">+{settings?.routeFees?.viaBadrFeeAmount ?? 150} SAR</span>
                                                    </label>
                                                </div>
                                            </motion.div>
                                        )}
                                        {hasStopovers && (
                                            <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Add Optional Stopover (Via)</p>
                                                <div className="space-y-2">
                                                    {matchedRoute.stopovers?.map((stopover: any) => (
                                                        <label key={stopover.name} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={leg.stopovers?.includes(stopover.name) || false}
                                                                onChange={(e) => {
                                                                    const newStopovers = e.target.checked 
                                                                        ? [...(leg.stopovers || []), stopover.name]
                                                                        : (leg.stopovers || []).filter(s => s !== stopover.name);
                                                                    updateLeg(index, 'stopovers', newStopovers);
                                                                }}
                                                                className="w-4 h-4 rounded border-slate-300 text-secondary focus:ring-secondary"
                                                            />
                                                            <span className="flex-1">{stopover.name}</span>
                                                            <span className="font-medium text-slate-900 dark:text-white">+{stopover.extraPrice} SAR</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/* Professional Route Info Card */}
                                        {matchedRoute && (
                                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shadow-inner">
                                                        <MapPin strokeWidth={1.25} size={20} fill="currentColor" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Route Selected</h4>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            {matchedRoute.distance} • {matchedRoute.time} approx
                                                        </p>
                                                    </div>
                                                    <div className="ml-auto text-right">
                                                        {matchedRoute.baseRate > 0 && (
                                                            <>
                                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Starting From</span>
                                                                <span className="font-black text-secondary text-lg tracking-tight">
                                                                    {matchedRoute.baseRate + (leg.viaBadr ? (settings?.routeFees?.viaBadrFeeAmount ?? 150) : 0) + (leg.includeWadiJinn ? 150 : 0) + (leg.stopovers?.reduce((acc: number, cur: string) => { const st = matchedRoute.stopovers?.find((s:any) => s.name === cur); return acc + (st?.extraPrice || 0); }, 0) || 0)} <span className="text-xs font-bold text-slate-500 ml-0.5">SAR</span>
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )})}
                                <button onClick={addLeg} className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center gap-2">
                                    <Plus size={16} /> Add Route
                                </button>
                            </div>
                        )}

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
                                        <div className="bg-secondary/10 border border-secondary/20 text-secondary p-6 rounded-2xl text-center">
                                            <p className="font-medium">Custom routing is currently unavailable.</p>
                                            <p className="text-sm mt-2 opacity-80">Please select a standard route from the dropdowns above.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                bookingData.routeType === 'single' && selectedRoute && (
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
                                                {selectedRoute.baseRate > 0 && (
                                                    <>
                                                        <span className="block text-[10px] uppercase font-bold text-slate-400">Starting From</span>
                                                        <span className="font-black text-secondary text-2xl tracking-tight">{selectedRoute.baseRate} <span className="text-sm text-slate-500">SAR</span></span>
                                                    </>
                                                )}
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
                    <button onClick={prevStep} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Route Selection</button>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Select Your Vehicle</h2>
                            <p className="text-slate-500 text-lg">Choose the perfect ride for your journey</p>
                        </div>
                        <button onClick={() => setIsGuideOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-secondary dark:text-[#E5B842] bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 dark:border-secondary/30 rounded-xl hover:bg-secondary hover:text-white dark:hover:bg-secondary dark:hover:text-white transition-all shadow-sm shrink-0 mt-2 md:mt-0">
                            <BookOpen size={18} className="shrink-0" />
                            Booking Guide
                        </button>
                    </div>
                    <VehicleCategoryFilter 
                        selectedCategory={selectedCategory} 
                        onSelect={setSelectedCategory} 
                        categories={availableCategories} 
                    />
                </div>

                {bookingData.routeType === 'multi' && (
                    <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Vehicle Selection Preference</h4>
                            <p className="text-xs text-slate-500">Do you want to book the same vehicle for all routes?</p>
                        </div>
                        <div className="flex bg-slate-200 dark:bg-slate-900 p-1 rounded-lg w-full md:w-auto">
                            <button onClick={() => setBookingData(p => ({ ...p, sameVehicleForAllLegs: true }))} className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${bookingData.sameVehicleForAllLegs ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Yes, same for all</button>
                            <button onClick={() => setBookingData(p => ({ ...p, sameVehicleForAllLegs: false }))} className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${!bookingData.sameVehicleForAllLegs ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>No, select per route</button>
                        </div>
                    </div>
                )}

                {bookingData.routeType === 'multi' && !bookingData.sameVehicleForAllLegs ? (
                    <div className="space-y-12">
                        {bookingData.legs.filter(l => l.pickup && l.dropoff && l.routeId).map((leg, legIndex) => (
                            <div key={leg.id} className="space-y-6 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">{legIndex + 1}</div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{leg.pickup} → {leg.dropoff}</h3>
                                        {leg.date && leg.time && <p className="text-sm text-slate-500">{leg.date.toLocaleDateString()} at {leg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-6">
                                    {filteredVehicles.map((vehicle) => {
                                        const Icon = vehicle.icon;
                                        const priceDetails = calculatePrice(leg.routeId!, vehicle.id);
                                        const selectedMatch = leg.selectedVehicles?.find(v => v.vehicleId === vehicle.id);
                                        const quantity = selectedMatch ? selectedMatch.quantity : 0;
                                        const isSelected = quantity > 0;

                                        return (
                                            <motion.div
                                                key={vehicle.id}
                                                whileHover={{ y: -6 }}
                                                onClick={() => !isSelected && handleVehicleQuantityChange(vehicle.id, 1, leg.id)}
                                                className={`
                                                    relative rounded-[32px] transition-all duration-300 group overflow-hidden flex flex-col md:flex-row cursor-pointer w-full max-w-full
                                                    ${isSelected
                                                        ? 'bg-white dark:bg-slate-900 border-2 border-secondary shadow-[0_0_30px_rgba(212,175,55,0.15)] ring-1 ring-secondary/20 scale-[1.01]'
                                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-secondary/30 hover:shadow-xl'
                                                    }
                                                `}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-4 right-4 z-10 bg-secondary text-white rounded-full p-1 shadow-lg">
                                                        <CheckCircle2 size={24} />
                                                    </div>
                                                )}
                                                {/* Image Container */}
                                                <div className={`
                                                    relative md:w-[35%] w-full h-56 md:h-auto overflow-hidden shrink-0 flex items-center justify-center p-6
                                                    ${isSelected ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-slate-50/50 dark:bg-slate-950/50'}
                                                    transition-colors duration-300 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800
                                                `}>
                                                    {vehicle.image ? (
                                                        <img
                                                            src={vehicle.image}
                                                            alt={vehicle.name}
                                                            className="w-full h-full max-w-[280px] object-contain transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Icon size={72} />
                                                        </div>
                                                    )}

                                                    {/* Features Badges - Absolute */}
                                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                        {vehicle.name.includes('GMC') && (
                                                            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider border border-slate-700">Premium Luxury</span>
                                                        )}
                                                        {vehicle.name.includes('Hiace') && (
                                                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider">Group Travel</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h3 className={`text-2xl font-bold ${isSelected ? 'text-secondary' : 'text-slate-900 dark:text-white'}`}>
                                                                {vehicle.name}
                                                            </h3>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium mb-4">
                                                            <span className="flex items-center gap-1.5"><Users strokeWidth={1.25} size={16} /> {vehicle.capacity}</span>
                                                            <span className="flex items-center gap-1.5"><Luggage strokeWidth={1.25} size={16} /> {vehicle.luggage}</span>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 mb-6">
                                                            {vehicle.features.slice(0, 4).map((feature, idx) => (
                                                                <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">
                                                                    <CheckCircle2 strokeWidth={2.5} size={12} className="text-emerald-500" />
                                                                    <span>{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 gap-6">
                                                        <div className="text-center md:text-left w-full md:w-auto">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL PRICE</div>
                                                            <div className="flex items-end justify-center md:justify-start gap-1">
                                                                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                                                                    {priceDetails.price}
                                                                </span>
                                                                <span className="text-sm font-bold text-slate-500 mb-0.5">SAR</span>
                                                            </div>
                                                        </div>

                                                        {/* Quantity Control or Select Button */}
                                                        <div className="w-full md:w-auto">
                                                            {quantity > 0 ? (
                                                                <div className="flex items-center gap-3 bg-secondary/10 dark:bg-secondary/5 rounded-xl p-1.5 border border-secondary/20">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, -1, leg.id); }}
                                                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 text-slate-600 transition-colors"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="font-black text-secondary w-6 text-center text-lg">{quantity}</span>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, 1, leg.id); }}
                                                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors shadow-sm"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, 1, leg.id); }}
                                                                    className="px-8 py-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors w-full md:w-auto text-center"
                                                                >
                                                                    Select Vehicle
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Vehicle List - Responsive Horizontal Layout */}
                        <div className="flex flex-col gap-6">
                    {filteredVehicles.map((vehicle) => {
                        const Icon = vehicle.icon;
                        const priceDetails = getPriceDetails(bookingData.routeId, vehicle.id);
                        const selectedMatch = bookingData.selectedVehicles.find(v => v.vehicleId === vehicle.id);
                        const quantity = selectedMatch ? selectedMatch.quantity : 0;
                        const isSelected = quantity > 0;

                        return (
                            <motion.div
                                key={vehicle.id}
                                whileHover={{ y: -6 }}
                                onClick={() => !isSelected && handleVehicleQuantityChange(vehicle.id, 1)}
                                className={`
                                    relative rounded-[32px] transition-all duration-300 group overflow-hidden flex flex-col md:flex-row cursor-pointer w-full max-w-full
                                    ${isSelected
                                        ? 'bg-white dark:bg-slate-900 border-2 border-secondary shadow-[0_0_30px_rgba(212,175,55,0.15)] ring-1 ring-secondary/20 scale-[1.01]'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-secondary/30 hover:shadow-xl'
                                    }
                                `}
                            >
                                {isSelected && (
                                    <div className="absolute top-4 right-4 z-10 bg-secondary text-white rounded-full p-1 shadow-lg">
                                        <CheckCircle2 size={24} />
                                    </div>
                                )}
                                {/* Image Container */}
                                <div className={`
                                    relative md:w-[35%] w-full h-56 md:h-auto overflow-hidden shrink-0 flex items-center justify-center p-6
                                    ${isSelected ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-slate-50/50 dark:bg-slate-950/50'}
                                    transition-colors duration-300 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800
                                `}>
                                    {vehicle.image ? (
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.name}
                                            className="w-full h-full max-w-[280px] object-contain transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Icon size={72} />
                                        </div>
                                    )}

                                    {/* Features Badges - Absolute */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {vehicle.name.includes('GMC') && (
                                            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider border border-slate-700">Premium Luxury</span>
                                        )}
                                        {vehicle.name.includes('Hiace') && (
                                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider">Group Travel</span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className={`text-2xl font-bold ${isSelected ? 'text-secondary' : 'text-slate-900 dark:text-white'}`}>
                                                {vehicle.name}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium mb-4">
                                            <span className="flex items-center gap-1.5"><Users strokeWidth={1.25} size={16} /> {vehicle.capacity}</span>
                                            <span className="flex items-center gap-1.5"><Luggage strokeWidth={1.25} size={16} /> {vehicle.luggage}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {vehicle.features.slice(0, 4).map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">
                                                    <CheckCircle2 strokeWidth={2.5} size={12} className="text-emerald-500" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 gap-6">
                                        <div className="text-center md:text-left w-full md:w-auto">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL PRICE</div>
                                            <div className="flex items-end justify-center md:justify-start gap-1">
                                                {bookingData.routeId === 'custom' && priceDetails.price === 0 ? (
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Pin map for price</span>
                                                ) : (
                                                    <>
                                                        {priceDetails.discountApplied > 0 && (
                                                            <span className="text-xs font-medium line-through mb-1 text-slate-400 mr-2">
                                                                {priceDetails.originalPrice}
                                                            </span>
                                                        )}
                                                        <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                                                            {priceDetails.price}
                                                        </span>
                                                        <span className="text-sm font-bold text-slate-500 mb-0.5">SAR</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity Control or Select Button */}
                                        <div className="w-full md:w-auto">
                                            {quantity > 0 ? (
                                                <div className="flex items-center gap-3 bg-secondary/10 dark:bg-secondary/5 rounded-xl p-1.5 border border-secondary/20">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, -1); }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 text-slate-600 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-black text-secondary w-6 text-center text-lg">{quantity}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, 1); }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors shadow-sm"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleVehicleQuantityChange(vehicle.id, 1); }}
                                                    className="px-8 py-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors w-full md:w-auto text-center"
                                                >
                                                    Select Vehicle
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                    </>
                )}
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
                <button onClick={prevStep} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Vehicle Selection</button>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trip Details</h2>
                        <p className="text-slate-500 text-lg">Help us coordinate your perfect pickup</p>
                    </div>
                    <button onClick={() => setIsGuideOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-secondary dark:text-[#E5B842] bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 dark:border-secondary/30 rounded-xl hover:bg-secondary hover:text-white dark:hover:bg-secondary dark:hover:text-white transition-all shadow-sm shrink-0 mt-2 md:mt-0">
                        <BookOpen size={18} className="shrink-0" />
                        Booking Guide
                    </button>
                </div>
            </div>

            <div className="ios-glass p-6 md:p-8 rounded-[32px] border border-white/20 dark:border-slate-700/50 shadow-xl relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />

                {bookingData.routeType !== 'multi' && (
                    <>
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    <Calendar strokeWidth={1.25} size={14} className="text-secondary" /> Pickup Date
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
                                    {errors.date && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><Info strokeWidth={1.25} size={18} /></div>}
                                </div>
                                {errors.date && <p className="text-red-500 text-xs ml-1 font-medium">{errors.date}</p>}
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    <Clock strokeWidth={1.25} size={14} className="text-secondary" /> Pickup Time
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
                                    {errors.time && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><Info strokeWidth={1.25} size={18} /></div>}
                                </div>
                                {errors.time && <p className="text-red-500 text-xs ml-1 font-medium">{errors.time}</p>}
                            </div>
                        </div>

                        <div className="my-8 border-t border-slate-100 dark:border-slate-700/50" />
                    </>
                )}

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
                                <User strokeWidth={1.25} size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
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

                    {/* Nationality */}
                    <div className="col-span-2 relative group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Nationality *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Globe strokeWidth={1.25} size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="w-full premium-input rounded-xl pl-11 pr-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-secondary/20"
                                value={bookingData.country}
                                onChange={(e) => updateData('country', e.target.value)}
                                placeholder="E.g. Pakistani"
                            />
                        </div>
                        {errors.country && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.country}</p>}
                    </div>

                    {/* Visa Type */}
                    <div className="col-span-2 relative group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Visa Type *</label>
                        <SearchableSelect
                            name="visaType"
                            value={bookingData.visaType}
                            onChange={(e: any) => updateData('visaType', e.target.value)}
                            options={[
                                { value: "Umrah Visa", label: "Umrah Visa", icon: "🕋" },
                                { value: "Visit Visa", label: "Visit Visa", icon: "📋" },
                                { value: "Tourist Visa", label: "Tourist Visa", icon: "✈️" },
                                { value: "Saudi Resident (Iqama)", label: "Saudi Resident (Iqama)", icon: "🏠" },
                                { value: "GCC Resident", label: "GCC Resident", icon: "🌐" }
                            ]}
                            placeholder="Select Visa Type"
                            className="w-full premium-input rounded-xl px-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50"
                            icon={<ShieldCheck strokeWidth={1.25} size={18} />}
                            searchable={false}
                        />
                        {errors.visaType && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.visaType}</p>}
                    </div>

                    {/* Phone */}
                    <div className="relative group col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Phone *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone strokeWidth={1.25} size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
                            </div>
                            <input
                                type="tel"
                                className="w-full premium-input rounded-xl pl-11 pr-4 py-4 text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700/50 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-secondary/20"
                                value={bookingData.phone}
                                onChange={(e) => updateData('phone', e.target.value)}
                                placeholder="+966 54 870 7332"
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div className="relative group col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail strokeWidth={1.25} size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
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
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Additional Details</h3>
                        <p className="text-sm text-slate-400">
                            {isAirportRoute ? 'Please provide your flight details' : 'Optional info to help us serve you better'}
                        </p>
                    </div>
                    {!isAirportRoute && <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full">Optional</span>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Flight Details */}
                    <div className="relative group col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                            Flight Number {isAirportRoute ? '*' : ''}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <PlaneLanding strokeWidth={1.25} size={18} className={`text-slate-400 ${errors.flightNumber ? 'text-red-400' : 'group-focus-within:text-blue-500'} transition-colors`} />
                            </div>
                            <input
                                type="text"
                                className={`w-full bg-white dark:bg-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white outline-none border ${errors.flightNumber ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} transition-all text-sm`}
                                value={bookingData.flightNumber}
                                onChange={(e) => updateData('flightNumber', e.target.value)}
                                placeholder="e.g. SV123 (Helps us track delays)"
                            />
                        </div>
                        {errors.flightNumber && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.flightNumber}</p>}
                    </div>

                    {/* Passengers */}
                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Passengers</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Users strokeWidth={1.25} size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
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
                                <Luggage strokeWidth={1.25} size={18} className="text-slate-400 group-focus-within:text-secondary transition-colors" />
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
            const details = getPriceDetails(bookingData.routeId, sv.vehicleId);
            return {
                originalPrice: acc.originalPrice + (details.originalPrice || 0) * sv.quantity,
                discountApplied: acc.discountApplied + (details.discountApplied || 0) * sv.quantity,
                price: acc.price + details.price * sv.quantity
            };
        }, { originalPrice: 0, discountApplied: 0, price: 0 });

        let wadiJinnFeeTotal = 0;
        const wadiJinnFee = settings?.wadiJinnFee ?? 150;
        if (bookingData.routeType === 'multi') {
            bookingData.legs.forEach(leg => {
                if (leg.includeWadiJinn) {
                    const legVehicles = bookingData.sameVehicleForAllLegs ? bookingData.selectedVehicles : (leg.selectedVehicles || []);
                    wadiJinnFeeTotal += legVehicles.reduce((sum, sv) => sum + wadiJinnFee * sv.quantity, 0);
                }
            });
        } else {
            if (bookingData.includeWadiJinn) {
                wadiJinnFeeTotal = bookingData.selectedVehicles.reduce((sum, sv) => sum + wadiJinnFee * sv.quantity, 0);
            }
        }

        // Nusuk Direct Route Fee — Jeddah Airport → Madinah + Umrah Visa
        let nusukFeeTotal = 0;
        const umrahFeeAmount = settings?.routeFees?.umrahFeeAmount ?? 150;
        if (bookingData.visaType === 'Umrah Visa' && settings?.routeFees?.enableUmrahFee !== false) {
            const pickupLower = bookingData.pickup?.toLowerCase() || '';
            const dropoffLower = bookingData.dropoff?.toLowerCase() || '';
            if (pickupLower.includes('jeddah') && pickupLower.includes('airport') && dropoffLower.includes('madin')) {
                nusukFeeTotal = bookingData.selectedVehicles.reduce((sum, sv) => sum + umrahFeeAmount * sv.quantity, 0);
            }
        }

        // Via Badr Route Fee — Madinah → Makkah
        let viaBadrFeeTotal = 0;
        const viaBadrFeeAmount = settings?.routeFees?.viaBadrFeeAmount ?? 150;
        if (bookingData.routeType === 'multi') {
            bookingData.legs.forEach(leg => {
                if (leg.viaBadr) {
                    const legVehicles = bookingData.sameVehicleForAllLegs ? bookingData.selectedVehicles : (leg.selectedVehicles || []);
                    viaBadrFeeTotal += legVehicles.reduce((sum, sv) => sum + viaBadrFeeAmount * sv.quantity, 0);
                }
            });
        } else {
            if (bookingData.viaBadr && settings?.routeFees?.enableViaBadr !== false) {
                viaBadrFeeTotal = bookingData.selectedVehicles.reduce((sum, sv) => sum + viaBadrFeeAmount * sv.quantity, 0);
            }
        }

        const totalExtraFees = wadiJinnFeeTotal + nusukFeeTotal + viaBadrFeeTotal;

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
                    <button onClick={prevStep} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Trip Details</button>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Review Booking</h2>
                            <p className="text-slate-500 text-lg">One last check before we secure your ride</p>
                        </div>
                        <button onClick={() => setIsGuideOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-secondary dark:text-[#E5B842] bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 dark:border-secondary/30 rounded-xl hover:bg-secondary hover:text-white dark:hover:bg-secondary dark:hover:text-white transition-all shadow-sm shrink-0 mt-2 md:mt-0">
                            <BookOpen size={18} className="shrink-0" />
                            Booking Guide
                        </button>
                    </div>
                </div>

                {/* Digital Ticket Container */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 relative w-full max-w-full">
                    {/* Top Gold Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-secondary/80 to-[#B38E2D]" />

                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">

                        {/* Left Section: Trip Details */}
                        <div className="p-4 md:p-8 md:col-span-2 space-y-8">
                            {/* Route Visual */}
                            <div className="flex items-start gap-4 w-full relative">
                                {bookingData.routeType === 'multi' ? (
                                    <div className="space-y-6 w-full">
                                        {bookingData.legs.filter(l => l.pickup && l.dropoff).map((leg, index) => (
                                            <div key={leg.id || index} className="flex gap-4 items-stretch relative">
                                                <div className="flex flex-col items-center mt-4 z-10 w-6">
                                                    <div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/20 shrink-0" />
                                                    {index !== bookingData.legs.length - 1 && (
                                                        <div className="w-0.5 bg-slate-200 dark:bg-slate-700 flex-1 my-2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Route {index + 1}</span>
                                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                            <Calendar strokeWidth={1.25} size={12} className="text-secondary" /> {leg.date?.toLocaleDateString()}
                                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <Clock strokeWidth={1.25} size={12} className="text-secondary" /> {leg.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-slate-900 dark:text-white text-sm break-words">{leg.pickup}</p>
                                                        </div>
                                                        <ArrowRight size={14} className="text-slate-400 shrink-0" />
                                                        <div className="flex-1 text-right min-w-0">
                                                            <p className="font-bold text-slate-900 dark:text-white text-sm break-words">{leg.dropoff}</p>
                                                        </div>
                                                    </div>
                                                    {renderReceiptZiyarat(leg.dropoff)}
                                                    {(() => {
                                                        const legVehicles = bookingData.sameVehicleForAllLegs ? bookingData.selectedVehicles : (leg.selectedVehicles || []);
                                                        if (legVehicles.length === 0 || !leg.routeId) return null;
                                                        
                                                        let legTotal = 0;
                                                        return (
                                                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                                                <p className="text-[10px] font-bold text-slate-500 uppercase">Selected Vehicles for Route {index + 1}</p>
                                                                {legVehicles.map(sv => {
                                                                    const v = vehicles.find(veh => veh.id === sv.vehicleId);
                                                                    if (!v) return null;
                                                                    
                                                                    // We calculate the exact price for this specific leg with all its add-ons
                                                                    const legPriceDetails = calculatePrice(leg.routeId!, sv.vehicleId, {
                                                                        includeWadiJinn: leg.includeWadiJinn,
                                                                        viaBadr: leg.viaBadr,
                                                                        visaType: bookingData.visaType,
                                                                        pickup: leg.pickup,
                                                                        dropoff: leg.dropoff,
                                                                    });
                                                                    
                                                                    const vehicleLegTotal = legPriceDetails.price * sv.quantity;
                                                                    legTotal += vehicleLegTotal;
                                                                    
                                                                    return (
                                                                        <div key={sv.vehicleId} className="flex justify-between items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 min-w-0">
                                                                            <div className="flex items-start gap-2 flex-1 min-w-0">
                                                                                <span className="font-bold text-xs text-slate-900 dark:text-white break-words min-w-0">{v.name}</span>
                                                                                <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">x{sv.quantity}</span>
                                                                            </div>
                                                                            <span className="font-bold text-xs text-secondary shrink-0">{vehicleLegTotal} SAR</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                                <div className="flex justify-between items-center pt-2 px-1">
                                                                    <span className="text-xs font-bold text-slate-500 uppercase">Route {index + 1} Subtotal</span>
                                                                    <span className="font-black text-secondary">{legTotal} SAR</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col items-center pt-2 w-6">
                                            <div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/20" />
                                            <div className="w-0.5 h-16 bg-gradient-to-b from-secondary to-slate-200 dark:to-slate-800 my-1" />
                                            <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white ring-4 ring-slate-100 dark:ring-slate-700" />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-8">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup</p>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight break-words">
                                                    {bookingData.pickup || (route ? getRouteOrigin(route) : 'Unknown Pickup')}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-2 text-sm font-medium text-slate-500">
                                                    <Calendar strokeWidth={1.25} size={14} className="text-secondary" /> {bookingData.date?.toLocaleDateString()}
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <Clock strokeWidth={1.25} size={14} className="text-secondary" /> {bookingData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight break-words">
                                                    {bookingData.dropoff || (route ? getRouteDestination(route) : 'Unknown Dropoff')}
                                                </h3>
                                                {renderReceiptZiyarat(bookingData.dropoff || (route ? getRouteDestination(route) : ''))}
                                                {route && (
                                                    <div className="flex items-center gap-2 mt-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md w-fit">
                                                        <span>{route.distance}</span>
                                                        <span>•</span>
                                                        <span>{route.time}</span>
                                                    </div>
                                                )}
                                                {bookingData.viaBadr && (
                                                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-md w-fit">
                                                        <Navigation size={12} /> Via Badr (Jabal Malaika Ziyarat)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {bookingData.visaType && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md">
                                                    <ShieldCheck size={12} /> {bookingData.visaType}
                                                </span>
                                                {bookingData.visaType === 'Umrah Visa' && nusukFeeTotal > 0 && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-secondary/50 px-2.5 py-1 rounded-md">
                                                        Nusuk Registered
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                                <button onClick={() => setStep(1)} className="text-xs font-bold text-secondary hover:text-[#B38E2D] hover:underline underline-offset-4 mt-2 shrink-0">
                                    EDIT
                                </button>
                            </div>

                            {(!bookingData.routeType || bookingData.routeType === 'single' || bookingData.sameVehicleForAllLegs) && (
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Briefcase strokeWidth={1.25} size={18} className="text-secondary" />
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
                                                <div key={sv.vehicleId} className="flex items-start sm:items-center gap-2 sm:gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl min-w-0">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm break-words">{v.name}</p>
                                                        <p className="text-xs text-slate-500 break-words">{v.capacity} Passengers • {v.luggage} Bags</p>
                                                    </div>
                                                    <div className="font-bold text-sm bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 shadow-sm shrink-0 mt-1 sm:mt-0">
                                                        x{sv.quantity}
                                                    </div>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Section: Passenger & Pricing */}
                        <div className="bg-slate-50/50 dark:bg-black/20 p-4 md:p-8 flex flex-col h-full">
                            <div className="mb-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Passenger</h4>
                                    <button onClick={() => setStep(3)} className="text-[10px] font-bold text-secondary hover:text-[#B38E2D] hover:underline underline-offset-4">
                                        EDIT
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                            <User strokeWidth={1.25} size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <p className="font-bold text-slate-900 dark:text-white truncate">{bookingData.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{bookingData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                            <Phone strokeWidth={1.25} size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-700 dark:text-slate-300 text-sm truncate">{bookingData.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                {(bookingData.notes) && (
                                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg">
                                        <p className="text-[10px] uppercase font-bold text-yellow-600 dark:text-yellow-500 mb-1">Notes</p>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 italic break-words">"{bookingData.notes}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-6 border-t border-dashed border-slate-300 dark:border-slate-700">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-start gap-2 text-sm text-slate-500">
                                        <span className="min-w-0 break-words">Base Rate</span>
                                        <span className="shrink-0">{(priceDetails?.originalPrice && priceDetails.originalPrice > priceDetails.price ? priceDetails.originalPrice : priceDetails.price) - totalExtraFees} SAR</span>
                                    </div>
                                    {wadiJinnFeeTotal > 0 && (
                                        <div className="flex justify-between items-start gap-2 text-sm text-secondary font-medium">
                                            <span className="min-w-0 break-words">External Ziyarat (Wadi Jinn)</span>
                                            <span className="shrink-0">+{wadiJinnFeeTotal} SAR</span>
                                        </div>
                                    )}
                                    {nusukFeeTotal > 0 && (
                                        <div className="flex justify-between items-start gap-2 text-sm text-blue-600 font-medium">
                                            <span className="flex items-start gap-1 min-w-0 break-words">
                                                <span>Nusuk Direct Route Fee</span>
                                                <span className="relative group/tip cursor-help mt-1 shrink-0">
                                                    <Info size={12} className="text-blue-400" />
                                                    <span className="absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-48 sm:w-56 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50">
                                                        This fee applies only to Umrah Visa passengers traveling directly from Jeddah Airport to Madinah using Nusuk‑registered vehicles.
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="shrink-0">+{nusukFeeTotal} SAR</span>
                                        </div>
                                    )}
                                    {viaBadrFeeTotal > 0 && (
                                        <div className="flex justify-between items-start gap-2 text-sm text-purple-600 font-medium">
                                            <span className="flex items-start gap-1 min-w-0 break-words">
                                                <span>Via Badr (Jabal Malaika Ziyarat)</span>
                                                <span className="relative group/tip cursor-help mt-1 shrink-0">
                                                    <Info size={12} className="text-purple-400" />
                                                    <span className="absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-48 sm:w-56 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50">
                                                        This route includes the ziyarat point Jabal Malaika and adds approximately 150–200 km to the journey.
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="shrink-0">+{viaBadrFeeTotal} SAR</span>
                                        </div>
                                    )}
                                    {priceDetails.discountApplied > 0 && (
                                        <div className="flex justify-between items-start gap-2 text-sm text-green-600 font-medium">
                                            <span className="min-w-0 break-words">Discount</span>
                                            <span className="shrink-0">-{priceDetails.discountApplied} SAR</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start gap-2 text-sm text-slate-500">
                                        <span className="min-w-0 break-words">Taxes & Fees</span>
                                        <span className="shrink-0">Included</span>
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
                    <ShieldCheck strokeWidth={1.25} size={14} />
                    <span>Your data is encrypted and secure. We never share your details.</span>
                </div>
            </motion.div>
        );
    };

    const renderSuccess = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white dark:bg-slate-900 md:bg-transparent min-h-screen md:min-h-0 md:py-12 pb-[max(96px,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]"
        >
            <div className="md:bg-white md:dark:bg-slate-800 md:rounded-[24px] md:shadow-xl overflow-hidden max-w-3xl mx-auto md:border md:border-slate-200 md:dark:border-slate-700 w-full">
                {/* 1. Success Header */}
                <div className="pt-12 pb-10 px-6 text-center md:border-b md:border-slate-100 dark:border-slate-700/50">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-white dark:ring-slate-800"
                    >
                        <CheckCircle strokeWidth={1.5} size={48} className="text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h2 className="text-[38px] md:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">Booking Confirmed</h2>
                    <p className="text-[22px] md:text-xl font-medium text-[#D4AF37] mb-3 leading-tight">JazakAllah Khair for choosing Al Aqsa Umrah Transport.</p>
                    <p className="text-[16px] md:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto">Your reservation has been successfully confirmed. Everything is ready for your upcoming journey.</p>
                </div>

                <div className="p-0 space-y-[20px] md:space-y-8 md:p-8 bg-slate-50/30 dark:bg-slate-900/30 md:bg-transparent w-full">
                    {/* 2. Booking Reference */}
                    <div className="bg-white dark:bg-slate-800 rounded-[20px] p-[24px] flex flex-col items-center justify-center gap-4 border border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.06)] mx-4 md:mx-0">
                        <div className="text-center w-full">
                            <span className="block text-[14px] font-bold text-slate-400 uppercase tracking-wider mb-2">Booking Reference</span>
                            <span className="block font-mono text-[40px] font-[800] text-slate-900 dark:text-white tracking-tight leading-none mb-4">
                                {bookingResponse?.bookingReference || (bookingResponse?._id || bookingResponse?.id || 'PENDING').toString().slice(-8).toUpperCase()}
                            </span>
                        </div>
                        <button 
                            onClick={() => {
                                const ref = bookingResponse?.bookingReference || (bookingResponse?._id || bookingResponse?.id || 'PENDING').toString().slice(-8).toUpperCase();
                                navigator.clipboard.writeText(ref);
                                alert("Reference copied to clipboard!");
                            }}
                            className="flex items-center gap-2 px-6 h-[56px] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors w-full justify-center"
                        >
                            <Copy size={18} />
                            Copy
                        </button>
                    </div>

                    {/* 3. Booking Summary */}
                    <div className="bg-white dark:bg-slate-800 rounded-[20px] border border-slate-200 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden mx-4 md:mx-0">
                        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-slate-900 dark:text-white font-bold text-[14px] uppercase tracking-wider flex items-center gap-2">
                                <Briefcase strokeWidth={1.5} size={18} className="text-[#D4AF37]" /> Trip Details
                            </h3>
                        </div>
                        <div className="p-[24px] space-y-[24px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                                <div className="space-y-1">
                                    <span className="block text-[14px] font-bold text-slate-400 uppercase tracking-wider">Date &amp; Time</span>
                                    <div className="flex items-center gap-2 font-medium text-[16px] text-slate-900 dark:text-white">
                                        <Calendar size={16} className="text-secondary" /> {bookingData.date?.toLocaleDateString()}
                                        <span className="text-slate-300">|</span>
                                        <Clock size={16} className="text-secondary" /> {bookingData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-[14px] font-bold text-slate-400 uppercase tracking-wider">Passengers</span>
                                    <div className="flex items-center gap-2 font-medium text-[16px] text-slate-900 dark:text-white">
                                        <Users size={16} className="text-secondary" /> {bookingData.passengers || bookingData.selectedVehicles.reduce((acc, sv) => { const v = vehicles.find(veh => veh.id === sv.vehicleId); return acc + (v ? parseInt(v.capacity) * sv.quantity : 0); }, 0)} Passengers
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-[24px] rounded-[20px] border border-slate-100 dark:border-slate-700 space-y-4">
                                {bookingData.routeType === 'multi' ? (
                                    bookingData.legs.filter(l => l.pickup && l.dropoff).map((leg, index) => (
                                        <div key={index} className="flex flex-col gap-2 relative pl-6 border-l-2 border-slate-200 dark:border-slate-600 pb-4 last:pb-0 last:border-0">
                                            <div className="absolute w-3 h-3 bg-secondary rounded-full -left-[7px] top-1" />
                                            <span className="block text-[14px] font-bold text-slate-400 uppercase tracking-wider">Route {index + 1}</span>
                                            <div className="font-bold text-[16px] text-slate-900 dark:text-white">{leg.pickup} <ArrowRight size={14} className="inline mx-1 text-slate-400" /> {leg.dropoff}</div>
                                            {renderReceiptZiyarat(leg.dropoff)}
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="flex flex-col gap-1 relative pl-6 border-l-2 border-slate-200 dark:border-slate-600 pb-4">
                                            <div className="absolute w-3 h-3 bg-slate-400 rounded-full -left-[7px] top-1" />
                                            <span className="block text-[14px] font-bold text-slate-400 uppercase tracking-wider">Pickup</span>
                                            <span className="font-bold text-[16px] text-slate-900 dark:text-white">{bookingData.pickup}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 relative pl-6">
                                            <div className="absolute w-3 h-3 bg-secondary rounded-full -left-[7px] top-1" />
                                            <span className="block text-[14px] font-bold text-slate-400 uppercase tracking-wider">Destination</span>
                                            <span className="font-bold text-[16px] text-slate-900 dark:text-white">{bookingData.dropoff}</span>
                                            {renderReceiptZiyarat(bookingData.dropoff)}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div className="space-y-1">
                                    <span className="block text-[14px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[14px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <CheckCircle size={12} /> Confirmed
                                    </span>
                                </div>
                                <div className="text-left sm:text-right">
                                    <span className="block text-[14px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Paid</span>
                                    <span className="block font-[800] text-slate-900 dark:text-white text-[28px]">
                                        {totalPrice} <span className="text-[16px] font-bold text-slate-500">SAR</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Invoice Confirmation */}
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-[20px] p-[24px] border border-green-100 dark:border-green-800 flex items-start gap-4 mx-4 md:mx-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                        <div className="bg-white dark:bg-green-900/50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                            <Mail className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                        <div>
                            <h4 className="text-[16px] text-green-800 dark:text-green-400 font-bold mb-1 flex items-center gap-2">
                                <Check size={16} /> Invoice Sent Successfully
                            </h4>
                            <p className="text-[14px] text-green-700 dark:text-green-300/80 mb-2 leading-relaxed">
                                Your booking confirmation and PDF invoice have been securely sent to: <br/>
                                <strong className="text-green-900 dark:text-green-200">{bookingData.email}</strong>
                            </p>
                            <p className="text-[12px] text-green-600 dark:text-green-400/60 font-medium">No further action is required. Please keep this email for your travel records.</p>
                        </div>
                    </div>

                    {/* 5. What Happens Next? */}
                    <div className="bg-white dark:bg-slate-800 rounded-[20px] p-[24px] border border-slate-200 dark:border-slate-700 mx-4 md:mx-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                        <h3 className="text-[22px] font-bold text-slate-900 dark:text-white mb-6">What Happens Next?</h3>
                        
                        <div className="space-y-[24px]">
                            <p className="text-[16px] text-slate-600 dark:text-slate-300">
                                Our operations team is now preparing your journey. Before your scheduled pickup, we will contact you via WhatsApp or email to confirm all travel arrangements.
                            </p>
                            
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[20px] p-[24px] border border-slate-100 dark:border-slate-700">
                                <p className="text-[16px] font-bold text-slate-900 dark:text-white mb-3">You will receive:</p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {['Driver\'s name', 'Driver\'s contact number', 'Vehicle make and model', 'Vehicle registration details', 'Pickup instructions', 'Airport meeting point'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[14px] text-slate-600 dark:text-slate-300">
                                            <CheckCircle2 size={16} className="text-secondary shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="flex items-start gap-3 p-[24px] bg-blue-50 dark:bg-blue-900/10 rounded-[20px] border border-blue-100 dark:border-blue-900/30">
                                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[14px] text-blue-700 dark:text-blue-300">
                                    If you have provided your flight details, our team will monitor your flight in real time and adjust your pickup accordingly in the event of delays. Simply arrive at your pickup location, and we'll take care of the rest.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 6. Travel Supplication (Dua) */}
                    <div className="bg-[#1a2332] dark:bg-slate-950 p-[24px] rounded-[20px] border-2 border-[#D4AF37]/30 text-center relative overflow-hidden mx-4 md:mx-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-5 rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37] opacity-5 rounded-tr-full" />
                        
                        <p className="text-[14px] font-bold text-[#D4AF37] uppercase tracking-widest mb-6 relative z-10">Travel Supplication (Dua)</p>
                        <p className="text-2xl md:text-4xl font-serif text-white mb-6 leading-[1.8] relative z-10" dir="rtl">
                            سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ
                        </p>
                        <p className="text-[16px] text-slate-400 italic relative z-10 max-w-xl mx-auto">
                            &quot;Glory be to Him who has subjected this to us, and we could not have otherwise subdued it. And indeed we, to our Lord, will surely return.&quot;
                        </p>
                    </div>

                    {/* 7. Primary Actions */}
                    <div className="pt-4 flex flex-col md:flex-row gap-4 items-center justify-center mx-4 md:mx-0">
                        <Link
                            href="/"
                            className="w-full h-[56px] flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
                        >
                            Return Home
                        </Link>
                        <div className="flex flex-col sm:flex-row w-full gap-4">
                            <Link
                                href="/contact"
                                className="w-full h-[56px] flex items-center justify-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            >
                                Contact Support
                            </Link>
                            <a
                                href="https://wa.me/966XXXXXXXXX"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-[56px] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors shadow-sm"
                            >
                                <MessageCircle size={18} /> WhatsApp
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );

    const Sidebar = () => {
        const route = getSelectedRoute();

        const renderSidebarZiyarat = (destination: string) => {
            const destLower = destination.toLowerCase();
            let packageKey = '';
            if (destLower.includes('makkah ziyarat') && !destLower.includes('madinah')) packageKey = 'makkah ziyarat';
            else if (destLower.includes('madinah ziyarat')) packageKey = 'madinah ziyarat';
            else if (destLower.includes('taif ziyarat')) packageKey = 'taif ziyarat';
            else if (destLower.includes('badr ziyarat')) packageKey = 'badr ziyarat';
            
            const pkg = ZIYARAT_PACKAGES[packageKey];
            if (!pkg) return null;

            return (
                <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Info size={14} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-indigo-900 dark:text-indigo-300 text-[11px] uppercase tracking-wider">
                            {packageKey} ({pkg.duration})
                        </span>
                    </div>
                    <div className="text-[10px] text-indigo-700 dark:text-indigo-400 leading-tight">
                        <span className="font-semibold">Includes {pkg.places.length} places:</span> {pkg.places.join(', ')}
                    </div>
                </div>
            );
        };

        return (
            <div className="space-y-6 pb-10">
                {/* Summary Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Briefcase strokeWidth={1.25} size={20} className="text-secondary" />
                        Booking Summary
                    </h3>

                    {/* Timeline */}
                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-700">
                        {bookingData.routeType === 'multi' ? (
                            bookingData.legs.map((leg, index) => {
                                const legVehicles = bookingData.sameVehicleForAllLegs ? bookingData.selectedVehicles : (leg.selectedVehicles || []);
                                let legTotal = 0;
                                if (leg.routeId && legVehicles.length > 0) {
                                    legTotal = legVehicles.reduce((sum, sv) => {
                                        const priceDetails = calculatePrice(leg.routeId!, sv.vehicleId, {
                                            includeWadiJinn: leg.includeWadiJinn,
                                            viaBadr: leg.viaBadr,
                                            visaType: bookingData.visaType,
                                            pickup: leg.pickup,
                                            dropoff: leg.dropoff,
                                        });
                                        return sum + priceDetails.price * sv.quantity;
                                    }, 0);
                                }

                                return (
                                    <div key={leg.id} className="relative pl-8 mb-4 last:mb-0">
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 ${index === 0 ? 'bg-secondary' : 'bg-slate-400'} shadow-sm`} />
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Route {index + 1}</span>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                                                    {leg.pickup || 'Select Pickup'}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 my-0.5">↓</p>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                                                    {leg.dropoff || 'Select Dropoff'}
                                                </h4>
                                                {leg.date && (
                                                    <p className="text-[10px] text-secondary font-medium mt-1">
                                                        {leg.date.toLocaleDateString()} {leg.time && `• ${leg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`}
                                                    </p>
                                                )}
                                            </div>
                                            {legTotal > 0 && (
                                                <div className="text-right shrink-0">
                                                    <span className="font-black text-secondary text-sm">{legTotal}</span>
                                                    <span className="text-[10px] text-slate-500 block">SAR</span>
                                                </div>
                                            )}
                                        </div>
                                        {renderSidebarZiyarat(leg.dropoff)}
                                        {leg.includeWadiJinn && (
                                            <div className="mt-2 text-[10px] text-secondary font-bold bg-secondary/10 px-2 py-1 rounded">
                                                + Wadi Jinn (150 SAR)
                                            </div>
                                        )}
                                        {leg.viaBadr && (
                                            <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                                                + Via Badr / Jabal Malaika (150 SAR)
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                {/* Pickup */}
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 bg-secondary shadow-sm" />
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Origin</span>
                                        <h4 className="font-bold text-slate-900 dark:text-white">
                                            {bookingData.pickup || (route ? getRouteOrigin(route) : 'Select Pickup')}
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
                                            {bookingData.dropoff || (route ? getRouteDestination(route) : 'Select Dropoff')}
                                        </h4>
                                    </div>
                                    {renderSidebarZiyarat(bookingData.dropoff || (route ? getRouteDestination(route) : ''))}
                                    {bookingData.includeWadiJinn && (
                                        <div className="mt-2 text-[10px] text-secondary font-bold bg-secondary/10 px-2 py-1 rounded w-max">
                                            + Wadi Jinn (150 SAR)
                                        </div>
                                    )}
                                    {bookingData.viaBadr && (
                                        <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded w-max">
                                            + Via Badr / Jabal Malaika (150 SAR)
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Quick Stats */}
                    {bookingData.passengers > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Users strokeWidth={1.25} size={14} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {bookingData.passengers} Passenger{bookingData.passengers > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Luggage strokeWidth={1.25} size={14} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {bookingData.luggage} Bag{bookingData.luggage !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="my-6 border-t border-slate-100 dark:border-slate-700" />

                    {/* Selected Vehicles */}
                    <div className="mb-6 space-y-4">
                        {(!bookingData.routeType || bookingData.routeType === 'single' || bookingData.sameVehicleForAllLegs) ? (
                            bookingData.selectedVehicles.length > 0 ? (
                                bookingData.selectedVehicles.map((sv) => {
                                    const v = vehicles.find(v => v.id === sv.vehicleId);
                                    if (!v) return null;
                                    return (
                                        <div key={sv.vehicleId} className="flex items-center">
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
                            )
                        ) : (
                            bookingData.legs.filter(l => l.selectedVehicles && l.selectedVehicles.length > 0).length > 0 ? (
                                bookingData.legs.map((leg, i) => (
                                    leg.selectedVehicles && leg.selectedVehicles.length > 0 && (
                                        <div key={leg.id} className="space-y-2 mt-4 first:mt-0">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Route {i + 1}</p>
                                            {leg.selectedVehicles.map(sv => {
                                                const v = vehicles.find(v => v.id === sv.vehicleId);
                                                if (!v) return null;
                                                return (
                                                    <div key={sv.vehicleId} className="flex items-center">
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{v.name}</h4>
                                                                <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">x{sv.quantity}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-500">{v.capacity} • {v.luggage}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                ))
                            ) : (
                                <div className="text-sm text-slate-500 italic">No vehicles selected</div>
                            )
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

                {/* Sidebar Trust Badges */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 tracking-wider uppercase">The Premium Difference</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Licensed Drivers</span></div>
                        <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Free Waiting Time</span></div>
                        <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Flight Monitoring</span></div>
                        <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-sm text-slate-600 dark:text-slate-300 font-medium">24/7 Support</span></div>
                        <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Fixed Pricing</span></div>
                        <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-sm text-slate-600 dark:text-slate-300 font-medium">No Hidden Charges</span></div>
                    </div>
                </div>
            </div >
        );
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
                        {/* Integrated Booking Header with Stepper */}
            <header className="sticky top-0 z-50 w-full h-[80px] bg-white border-b border-slate-200 shadow-sm flex items-center print:hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex items-center justify-between">
                    
                    {/* Left: Logo & Secure Booking */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-secondary leading-none">Al Aqsa</span>
                                <span className="text-[10px] font-bold text-slate-800 tracking-widest uppercase">Transport</span>
                            </div>
                        </Link>
                        <div className="hidden md:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                            <Lock size={14} className="text-emerald-600" />
                            <span className="text-xs font-bold text-slate-700">Secure Booking</span>
                        </div>
                    </div>

                    {/* Center: Progress Stepper */}
                    <div className="flex-1 max-w-2xl mx-4 md:mx-12 hidden md:flex items-end justify-between gap-2">
                        {[
                            { step: 1, label: 'Journey' },
                            { step: 2, label: 'Vehicle' },
                            { step: 3, label: 'Details' },
                            { step: 4, label: 'Review' }
                        ].map((s, idx, arr) => (
                            <div key={s.step} className={`flex-1 flex flex-col relative ${idx === arr.length - 1 ? 'flex-none w-16' : ''}`}>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors duration-300 ${step === s.step ? 'text-slate-900 dark:text-white' : step > s.step ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                    {s.label}
                                </span>
                                {/* Line container */}
                                <div className="relative flex items-center w-full h-[2px]">
                                    {/* Full width background line */}
                                    {idx < arr.length - 1 && <div className="absolute w-full h-full bg-slate-200 dark:bg-slate-800" />}
                                    {/* Active fill line */}
                                    {idx < arr.length - 1 && <div className={`absolute h-full bg-slate-900 dark:bg-white transition-all duration-500 ease-in-out`} style={{ width: step > s.step ? '100%' : step === s.step ? '50%' : '0%' }} />}
                                    {/* Node */}
                                    <div className={`absolute left-0 w-2.5 h-2.5 rounded-full -ml-[1px] transition-all duration-300 ${step > s.step ? 'bg-slate-900 dark:bg-white ring-2 ring-slate-900 dark:ring-white' : step === s.step ? 'bg-slate-900 dark:bg-white ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-slate-950' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Support */}
                    <div className="flex items-center gap-3">
                        {settings?.contact?.phone && (
                            <a 
                                href={`https://wa.me/${(settings?.contact?.whatsapp || settings.contact.phone)?.replace(/[^0-9]/g, '') || ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden lg:flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group cursor-pointer"
                            >
                                <Phone size={16} className="text-[#0f172a] group-hover:scale-110 transition-transform" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">24/7 Support</span>
                                    <span className="text-xs font-bold">{settings.contact.phone}</span>
                                </div>
                            </a>
                        )}
                        {settings?.contact?.whatsapp && (
                            <a 
                                href={`https://wa.me/${settings.contact.whatsapp?.replace(/[^0-9]/g, '') || ''}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full transition-colors border border-emerald-200"
                            >
                                <MessageCircle size={16} />
                                <span className="text-xs font-bold hidden sm:block">WhatsApp</span>
                            </a>
                        )}
                    </div>

                </div>
            </header>

            <div className={`${step === 5 ? 'w-full md:container md:mx-auto md:px-4' : 'container mx-auto px-4'} mt-4 pb-48 md:pb-48`} ref={wizardRef}>
                {step !== 5 && (
                    <div className="mb-2">
                        <Breadcrumbs />
                    </div>
                )}
                <div className={`${step === 5 ? 'w-full' : 'max-w-6xl mx-auto grid lg:grid-cols-3 gap-12'}`}>
                    {/* Main Wizard Area */}
                    <div className={step === 5 ? "w-full md:max-w-3xl mx-auto" : "lg:col-span-2 min-w-0"}>
                        {/* Mobile Guide Removed - Slide Over Used Instead */}
                        <AnimatePresence mode="wait">
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                            {step === 4 && renderSummary()}
                            {step === 5 && renderSuccess()}
                        </AnimatePresence>

                        {/* Trust Bar - Conversion Optimizer (Visible on Details & Review Steps) */}
                        {step >= 3 && step < 5 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-1 group cursor-default opacity-70 hover:opacity-100 transition-opacity">
                                    <ShieldCheck strokeWidth={1.25} className="w-5 h-5 text-emerald-500" />
                                    <span className="text-xs text-slate-500 font-medium">Official License</span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1 group cursor-default opacity-70 hover:opacity-100 transition-opacity">
                                    <Navigation strokeWidth={1.25} className="w-5 h-5 text-blue-500" />
                                    <span className="text-xs text-slate-500 font-medium">GPS Tracked</span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1 group cursor-default opacity-70 hover:opacity-100 transition-opacity">
                                    <HeartHandshake strokeWidth={1.25} className="w-5 h-5 text-pink-500" />
                                    <span className="text-xs text-slate-500 font-medium">Family Staff</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Navigation Buttons */}
                        {step < 5 && (
                            (() => {
                                const isVehicleSelected = bookingData.routeType === 'multi' && !bookingData.sameVehicleForAllLegs
                                    ? bookingData.legs.some(leg => leg.selectedVehicles && leg.selectedVehicles.length > 0)
                                    : bookingData.selectedVehicles && bookingData.selectedVehicles.length > 0;
                                
                                const showBottomBar = step !== 2 || isVehicleSelected;

                                return (
                                    <div className={`fixed bottom-0 left-0 w-full z-[150] lg:relative lg:bottom-auto lg:left-auto lg:w-auto lg:z-0 lg:mt-8 transition-all duration-500 ease-in-out ${showBottomBar ? 'translate-y-0 opacity-100' : 'translate-y-full lg:translate-y-0 opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'}`}>
                                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:hidden" />
                                        <div className="relative container mx-auto px-4 lg:px-0 lg:max-w-none w-full">
                                            <div className="w-full lg:border-t lg:border-slate-200 lg:dark:border-slate-800 lg:pt-6">
                                                <div className="flex gap-2 md:gap-4 py-4 md:py-6 lg:py-0 items-center w-full min-w-0">
                                                    {step > 1 && (
                                                        <button
                                                            onClick={prevStep}
                                                            className="px-4 md:px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                                                        >
                                                            Back
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={nextStep}
                                                        disabled={isSubmitting}
                                                        className={`ml-auto flex items-center justify-center max-md:flex-1 gap-1 md:gap-2 px-4 md:px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#B38E2D]/90 transition-all hover:-translate-y-1 active:translate-y-0 min-w-0 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    >
                                                        <span className="truncate">{step === 4 ? (isSubmitting ? 'Securing Ride...' : 'Secure Your Safe Ride') : 'Continue'}</span>
                                                        {!isSubmitting && <ArrowRight strokeWidth={1.25} size={20} className="shrink-0" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block h-full">
                        {step < 5 && (
                            <div className="sticky top-32 space-y-6 pb-10">
                                <Sidebar />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BookingGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} step={step} />
        </main >
    );
}

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-secondary/30">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div></div>}>
                <BookingContent />
            </Suspense>
        </div>
    );
}
