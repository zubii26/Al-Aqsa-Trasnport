'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Phone, User, ArrowRight, Car, Navigation, Clock, CheckCircle, Bus, Mail, MapPin, PlaneLanding, PlaneTakeoff, Building2, ShieldCheck, HeartHandshake, CreditCard, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import SearchableSelect from '@/components/ui/SearchableSelect';

import styles from './QuickBookingForm.module.css';
import { usePricing } from '@/context/PricingContext';

import { Route, Vehicle } from '@/lib/pricing';
import { getWhatsAppLink, createBookingMessage } from '@/lib/whatsapp';

interface QuickBookingFormProps {
    title?: string;
    subtitle?: string;
    className?: string;
    variant?: 'default' | 'fleet';
    initialRoutes?: Route[];
    initialVehicles?: Omit<Vehicle, 'icon'>[];
}

const SkeletonLoader = () => (
    <div className={styles.skeletonWrapper}>
        {[1, 2, 3, 4].map((i) => (
            <div key={i}>
                <div className={styles.skeletonLabel}>
                    <div className={styles.skeletonShimmer} />
                </div>
                <div className={styles.skeletonInput}>
                    <div className={styles.skeletonShimmer} />
                </div>
            </div>
        ))}
        {/* Route and Vehicle Skeletons (Full Width) */}
        {[5, 6].map((i) => (
            <div key={i} className={styles.fullWidth}>
                <div className={styles.skeletonLabel}>
                    <div className={styles.skeletonShimmer} />
                </div>
                <div className={styles.skeletonInput}>
                    <div className={styles.skeletonShimmer} />
                </div>
            </div>
        ))}
        <div className={styles.skeletonButton}>
            <div className={styles.skeletonShimmer} />
        </div>
    </div>
);

const QuickBookingForm = ({
    title,
    subtitle,
    className = '',
    variant = 'default',
    initialRoutes,
    initialVehicles
}: QuickBookingFormProps) => {
    const { routes: contextRoutes, vehicles: contextVehicles, isLoading: contextLoading, calculatePrice } = usePricing();

    // Helper to attach icons if missing (for server-side data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attachIcons = (vehiclesData: any[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return vehiclesData.map((v: any) => ({
            ...v,
            icon: v.icon || ((v.name?.toLowerCase().includes('hiace') || v.name?.toLowerCase().includes('coaster') || v.id?.includes('hiace') || v.id?.includes('coaster')) ? Bus : Car)
        }));
    };

    // Use initial data if provided, otherwise fallback to context
    const routes = initialRoutes || contextRoutes;
    const vehicles = initialVehicles ? attachIcons(initialVehicles) : contextVehicles;
    const isLoading = (initialRoutes && initialVehicles) ? false : contextLoading;


    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: null as Date | null,
        time: null as Date | null,
        routeId: '',
        pickup: '',
        dropoff: '',
        vehicleId: '',
        vehicleCount: 1,
        passengers: 1,
        luggage: 0,
        notes: ''
    });



    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [minDate, setMinDate] = useState('');

    useEffect(() => {
        setMinDate(new Date().toISOString().split('T')[0]);
    }, []);

    // Auto-detect route based on Pickup and Dropoff
    useEffect(() => {
        // Auto-detect route based on Pickup and Dropoff
        if (formData.routeId === 'custom') return;
        if (!formData.pickup || !formData.dropoff) return;

        const findBestRoute = () => {
            const p = formData.pickup.toLowerCase();
            const d = formData.dropoff.toLowerCase();

            // Common normalizations
            const normalize = (s: string) => s.replace('madina', 'madinah');

            return routes.find(r => {
                const routeName = r.name.toLowerCase();
                const pNorm = normalize(p);
                const dNorm = normalize(d);

                const parts = routeName.split(/\u2192|\u2194| to /);
                if (parts.length < 2) return false;

                const routeStart = parts[0].trim();
                const routeEnd = parts[1].trim();

                const startMatch = routeStart.includes(pNorm) || pNorm.includes(routeStart);
                const endMatch = routeEnd.includes(dNorm) || dNorm.includes(routeEnd);

                return startMatch && endMatch;
            });
        };

        const matched = findBestRoute();
        if (matched) {
            setFormData(prev => ({ ...prev, routeId: matched.id }));
            if (errors.routeId) setErrors(prev => ({ ...prev, routeId: '' }));
        }
    }, [formData.pickup, formData.dropoff, routes, errors.routeId]);

    // Filter routes to include all available routes
    const filteredRoutes = routes;

    // Enhanced Dropdown Data Preparation
    const routeOptions = [
        ...filteredRoutes.map(r => ({ value: r.id, label: r.name })),
        { value: 'custom', label: 'Other / Custom Route' }
    ];

    const vehicleOptions = vehicles.map(vehicle => {
        let priceDisplay = '';
        let originalPriceDisplay = '';
        let discountAppliedDisplay = 0;
        let finalPrice = 0;

        if (formData.routeId && formData.routeId !== 'custom') {
            const { price, originalPrice, discountApplied } = calculatePrice(formData.routeId, vehicle.id);
            if (price > 0) {
                // priceDisplay = ` - ${price} SAR${discountApplied > 0 ? ' (Offer)' : ''}`;
                // We'll handle display in custom renderer, but keep label simple for the input text
                priceDisplay = `${price} SAR`;
                finalPrice = price;
                originalPriceDisplay = originalPrice > price ? `${originalPrice}` : '';
                discountAppliedDisplay = discountApplied;
            }
        }

        return {
            value: vehicle.id,
            label: `${vehicle.name} (${vehicle.capacity} seater)`, // Main text in input
            // Extra props for custom renderer
            image: vehicle.image,
            capacity: vehicle.capacity,
            luggage: vehicle.luggage,
            price: finalPrice,
            originalPrice: originalPriceDisplay,
            discount: discountAppliedDisplay,
            isVip: vehicle.name.includes('GMC')
        };
    });

    // Update Pickup/Dropoff when Route changes
    const handleRouteChange = (e: any) => {
        const routeId = e.target.value;

        let newPickup = formData.pickup;
        let newDropoff = formData.dropoff;

        if (routeId === 'custom') {
            // If custom, clear fields or keep as is? Let's clear to let user type fresh or keep if they switched back
            // Keeping them empty is safer for "Custom" feeling
            newPickup = '';
            newDropoff = '';
        } else {
            const selectedRoute = routes.find(r => r.id === routeId);
            if (selectedRoute) {
                // Use same split logic as auto-detect for consistency
                const parts = selectedRoute.name.split(/\u2192|\u2194| to /);
                if (parts.length >= 2) {
                    newPickup = parts[0].trim();
                    newDropoff = parts[1].trim();
                } else {
                    newDropoff = selectedRoute.name;
                }
            }
        }

        setFormData(prev => ({
            ...prev,
            routeId,
            pickup: newPickup,
            dropoff: newDropoff
        }));

        if (errors.routeId) setErrors(prev => ({ ...prev, routeId: '' }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Auto-update passengers when vehicle count changes if not manually set? 
        // For simplicity, we just update the field. If it's vehicleId or vehicleCount, we might want to auto-cap passengers?

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // If Vehicle or Count changes, auto-set passengers to max capacity as a suggestion
            // (User can change it later)
            if (name === 'vehicleId' || name === 'vehicleCount') {
                const vId = name === 'vehicleId' ? value : prev.vehicleId;
                const vCount = name === 'vehicleCount' ? Number(value) : prev.vehicleCount;

                const selectedV = vehicles.find(v => v.id === vId);
                if (selectedV) {
                    newData.passengers = parseInt(selectedV.capacity) * vCount;
                }
            }

            return newData;
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleDateChange = (date: Date | null) => {
        setFormData({ ...formData, date });
        if (errors.date) setErrors({ ...errors, date: '' });
    };

    const handleTimeChange = (time: Date | null) => {
        setFormData({ ...formData, time });
        if (errors.time) setErrors({ ...errors, time: '' });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Name
        if (!formData.name.trim()) newErrors.name = 'Name is required';

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        // Strict Phone Validation
        const phoneRegex = /^\+?[0-9\s-]{10,}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Invalid phone format (e.g., +96650...)';
        }

        // Date & Time
        if (!formData.date) newErrors.date = 'Please select a date';
        if (!formData.time) newErrors.time = 'Please select a time';

        // Locations
        if (!formData.pickup.trim()) newErrors.pickup = 'Pickup is required';
        if (!formData.dropoff.trim()) newErrors.dropoff = 'Dropoff is required';

        // Selection
        if (!formData.routeId) newErrors.routeId = 'Please select a route';
        if (!formData.vehicleId) newErrors.vehicleId = 'Please select a vehicle';
        if (formData.vehicleCount < 1) newErrors.vehicleCount = 'Min. 1 vehicle';

        setErrors(newErrors);

        // Shake animation trigger could go here
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Check if we have a selected route to get details
            // Corrected to use global vehicles array instead of route.vehicles
            const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

            // 1. Save to Database
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    date: formData.date?.toISOString().split('T')[0],
                    pickup: formData.pickup,
                    dropoff: formData.dropoff,
                    time: formData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    vehicle: selectedVehicle ? selectedVehicle.name : 'Any',
                    passengers: selectedVehicle ? parseInt(selectedVehicle.capacity) : 1,
                    vehicleCount: Number(formData.vehicleCount),
                    luggage: Number(formData.luggage),
                    notes: formData.notes,
                    status: 'pending',
                    routeId: formData.routeId,
                    vehicleId: formData.vehicleId
                }),
            });

            // 2. Redirect to WhatsApp regardless of API success (or maybe only on success? user said "maintain booking logic")
            // Ideally we save, then redirect. If save fails, we still redirect so we don't lose the customer.

            const message = createBookingMessage({
                service: title || 'Quick Booking',
                pickup: formData.pickup,
                dropoff: formData.dropoff,
                date: formData.date?.toLocaleDateString(),
                time: formData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                vehicle: selectedVehicle ? selectedVehicle.name : 'Not Selected',
                passengers: formData.passengers,
                name: formData.name
            });

            const whatsappUrl = getWhatsAppLink(message);

            if (res.ok) {
                setIsSubmitted(true);
                // Delay slightly to show success state then redirect? Or just redirect immediately?
                // Redirecting immediately is better for "Book Now" flow.
                window.open(whatsappUrl, '_blank');

                setFormData({
                    name: '', phone: '', email: '', date: null, time: null, routeId: '', vehicleId: '',
                    pickup: '', dropoff: '', vehicleCount: 1, passengers: 1, luggage: 0, notes: ''
                });
                setErrors({});
            } else {
                console.error('Booking API failed, but proceeding to WhatsApp');
                // Fallback: Still open WhatsApp so the lead isn't lost
                window.open(whatsappUrl, '_blank');
                setIsSubmitted(true); // Show success UI anyway
            }

        } catch (error) {
            console.error('Booking error:', error);
            // Fallback: Open WhatsApp
            const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
            const message = createBookingMessage({
                service: title || 'Quick Booking',
                pickup: formData.pickup,
                dropoff: formData.dropoff,
                date: formData.date?.toLocaleDateString(),
                time: formData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                vehicle: selectedVehicle ? selectedVehicle.name : 'Not Selected',
                passengers: formData.passengers,
                name: formData.name
            });
            window.open(getWhatsAppLink(message), '_blank');
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setIsSubmitted(false);
    };

    const allPickupLocations = [
        "Makkah Hotel",
        "Makkah Setup",
        "Madinah Airport",
        "Madinah Hotel",
        "Makkah Haram",
        "Madinah Haram",
        "Jeddah Hotel",
        "Jeddah Airport",
        "Jeddah Port",
        "Al Taif Hotel",
        "Al Taif Airport",
        "Badar Hotel",
        "Al Ula Hotel",
        "Yanbu Hotel",
        "Yanbu Airport"
    ];

    const allDropoffLocations = [
        "Makkah Hotel",
        "Makkah Haram",
        "Madinah Hotel",
        "Madinah Airport",
        "Madinah Haram",
        "Jeddah Hotel",
        "Jeddah Airport",
        "Jeddah Port",
        "Al Taif Hotel",
        "Al Taif Airport",
        "Badar Hotel",
        "Al Ula Hotel",
        "Yanbu Hotel",
        "Yanbu Airport",
        "Jeddah City Tour",
        "Makkah Ziyarat",
        "Madinah Ziyarat",
        "Taif Ziyarat",
        "Badar Ziyarat",
        "Al Ula Tour"
    ];

    const pickupLocations = allPickupLocations; // Simplified for now, or filter by category if needed

    const dropoffLocations = allDropoffLocations;

    return (
        <motion.div
            className={`${styles.container} ${variant === 'fleet' ? styles.fleetForm : ''} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Datalists removed in favor of SearchableSelect */}

            {(title || variant === 'fleet') && (
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {title || 'Quick Booking'}
                    </h3>
                    <p className={styles.subtitle}>
                        {subtitle || 'Secure your premium transport in seconds'}
                    </p>
                </div>
            )}

            <AnimatePresence mode='wait'>
                {isLoading ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <SkeletonLoader />
                    </motion.div>
                ) : isSubmitted ? (
                    <motion.div
                        key="success"
                        className={styles.successContent}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.successIconWrapper}>
                            <CheckCircle size={64} className={styles.successIcon} />
                        </div>
                        <h3 className={styles.successTitle}>Opening WhatsApp...</h3>
                        <p className={styles.successMessage}>
                            PLEASE HIT SEND inside WhatsApp to complete your booking. We will reply instantly.
                        </p>
                        <button onClick={resetForm} className={styles.submitBtn}>
                            Book Another Trip
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className={styles.form}
                        noValidate
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >



                        <div className={styles.grid}>



                            {/* Route Selection Pills */}
                            <div className="col-span-full mb-3">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">Where are you going?</label>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                    {[
                                        { label: 'Jeddah ⇄ Makkah', icon: PlaneLanding, pickup: 'Jeddah Airport', dropoff: 'Makkah Hotel' },
                                        { label: 'Makkah ⇄ Madinah', icon: Bus, pickup: 'Makkah Hotel', dropoff: 'Madinah Hotel' },
                                        { label: 'Jeddah ⇄ Madinah', icon: PlaneTakeoff, pickup: 'Jeddah Airport', dropoff: 'Madinah Hotel' },
                                        { label: 'Custom Route', icon: MapPin, pickup: '', dropoff: '', isCustom: true },
                                    ].map((route) => {
                                        // Dynamic active check
                                        let isActive = false;
                                        if (route.isCustom) {
                                            isActive = formData.routeId === 'custom';
                                        } else {
                                            // Check if current form values match this preset
                                            const p = formData.pickup.toLowerCase();
                                            const d = formData.dropoff.toLowerCase();
                                            const rp = route.pickup.toLowerCase();
                                            const rd = route.dropoff.toLowerCase();
                                            // Loose matching for UX
                                            isActive = p.includes(rp) && d.includes(rd) && formData.routeId !== 'custom';
                                        }

                                        return (
                                            <button
                                                key={route.label}
                                                type="button"
                                                onClick={() => {
                                                    if (route.isCustom) {
                                                        setFormData(prev => ({ ...prev, routeId: 'custom', pickup: '', dropoff: '' }));
                                                    } else {
                                                        // Find ID dynamically
                                                        const matched = routes.find(r => {
                                                            const n = r.name.toLowerCase();
                                                            return n.includes(route.pickup.toLowerCase()) && n.includes(route.dropoff.toLowerCase());
                                                        });
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            pickup: route.pickup,
                                                            dropoff: route.dropoff,
                                                            routeId: matched ? matched.id : ''
                                                        }));
                                                    }
                                                    setErrors({});
                                                }}
                                                className={`
                                                    flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                                                    ${isActive
                                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50'
                                                    }
                                                `}
                                            >
                                                <route.icon size={16} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                                                {route.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.routeId && <span className={styles.errorMessage}>{errors.routeId}</span>}
                            </div>

                            {/* Horizontal Input Group */}
                            <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">

                                {/* Date Input */}
                                <div className="md:col-span-3 relative">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">Travel Date</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="date"
                                            value={formData.date ? formData.date.toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                if (!e.target.value) { handleDateChange(null); return; }
                                                handleDateChange(new Date(e.target.value));
                                            }}
                                            min={minDate}
                                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        />
                                    </div>
                                    {errors.date && <span className="absolute -bottom-4 left-0 text-[10px] text-red-500">{errors.date}</span>}
                                </div>

                                {/* Time Input */}
                                <div className="md:col-span-3 relative">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">Pickup Time</label>
                                    <div className="relative">
                                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="time"
                                            value={formData.time ? formData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                                            onChange={(e) => {
                                                if (!e.target.value) { handleTimeChange(null); return; }
                                                const [h, m] = e.target.value.split(':').map(Number);
                                                const t = new Date(); t.setHours(h); t.setMinutes(m);
                                                handleTimeChange(t);
                                            }}
                                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        />
                                    </div>
                                    {errors.time && <span className="absolute -bottom-4 left-0 text-[10px] text-red-500">{errors.time}</span>}
                                </div>

                                {/* Vehicle Select (Simplified) */}
                                <div className="md:col-span-6 relative">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">Preferred Vehicle</label>
                                    <SearchableSelect
                                        name="vehicleId"
                                        value={formData.vehicleId}
                                        onChange={handleChange as any}
                                        // @ts-ignore
                                        options={vehicleOptions}
                                        placeholder="Select Vehicle & See Price"
                                        className="w-full bg-white border border-slate-200 rounded-xl text-sm !py-2.5"
                                        icon={<Car size={18} />}
                                    />
                                    {errors.vehicleId && <span className="absolute -bottom-4 left-0 text-[10px] text-red-500">{errors.vehicleId}</span>}
                                </div>
                            </div>

                            {/* Custom Route Fields (Expandable) */}
                            {formData.routeId === 'custom' && (
                                <div className="col-span-full grid grid-cols-2 gap-3 mt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="md:col-span-6 relative">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">From (Pickup)</label>
                                        <div className="relative">
                                            <SearchableSelect
                                                name="pickup"
                                                value={formData.pickup}
                                                onChange={handleChange as any}
                                                options={pickupLocations}
                                                placeholder="Pickup Location"
                                                className="w-full bg-white border border-slate-200 rounded-xl text-sm !py-2.5"
                                                icon={<MapPin size={18} />}
                                            />
                                        </div>
                                        {errors.pickup && <span className="text-[10px] text-red-500 mt-1 ml-1 block">{errors.pickup}</span>}
                                    </div>
                                    <div className="md:col-span-6 relative">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">Destination (Drop-off)</label>
                                        <div className="relative">
                                            <SearchableSelect
                                                name="dropoff"
                                                value={formData.dropoff}
                                                onChange={handleChange as any}
                                                options={dropoffLocations}
                                                placeholder="Drop-off Location"
                                                className="w-full bg-white border border-slate-200 rounded-xl text-sm !py-2.5"
                                                icon={<MapPin size={18} />}
                                            />
                                        </div>
                                        {errors.dropoff && <span className="text-[10px] text-red-500 mt-1 ml-1 block">{errors.dropoff}</span>}
                                    </div>
                                </div>
                            )}

                            {/* Passenger & Luggage (Compact Row) */}
                            <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                                <div className="relative">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">Vehicles</label>
                                    <div className="relative">
                                        <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            name="vehicleCount"
                                            min="1"
                                            max="5"
                                            value={formData.vehicleCount}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-9 text-sm outline-none focus:border-amber-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">Passengers</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            name="passengers"
                                            min="1"
                                            value={formData.passengers}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-9 text-sm outline-none focus:border-amber-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details (Hidden until Route Selected) */}
                            {formData.routeId && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-3 mt-2 overflow-hidden"
                                >
                                    <div className="relative">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">Full Name</label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-9 text-sm outline-none focus:border-amber-500 transition-colors ${errors.name ? 'border-red-500 bg-red-50' : ''}`}
                                            />
                                        </div>
                                        {errors.name && <span className="text-[10px] text-red-500 mt-1 ml-1 block">{errors.name}</span>}
                                    </div>
                                    <div className="relative">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">Email</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="email@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-9 text-sm outline-none focus:border-amber-500 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                                            />
                                        </div>
                                        {errors.email && <span className="text-[10px] text-red-500 mt-1 ml-1 block">{errors.email}</span>}
                                    </div>
                                    <div className="relative">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1 block">Phone</label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="+966 50..."
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-9 text-sm outline-none focus:border-amber-500 transition-colors ${errors.phone ? 'border-red-500 bg-red-50' : ''}`}
                                            />
                                        </div>
                                        {errors.phone && <span className="text-[10px] text-red-500 mt-1 ml-1 block">{errors.phone}</span>}
                                    </div>
                                </motion.div>
                            )}

                            {/* Price & Action Row */}
                            <div className="col-span-full mt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4">

                                {/* Dynamic Price Display */}
                                <div className="flex-1">
                                    {formData.routeId && formData.vehicleId ? (
                                        (() => {
                                            const { price, originalPrice, discountApplied } = calculatePrice(formData.routeId, formData.vehicleId);
                                            if (price === 0) return <span className="text-sm text-slate-400">Select route & vehicle to see price</span>;
                                            return (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Estimate</span>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-bold text-slate-900">{price * formData.vehicleCount} <span className="text-base font-medium text-slate-500">SAR</span></span>
                                                        {discountApplied > 0 && <span className="text-sm text-slate-400 line-through">{originalPrice} SAR</span>}
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <span className="text-sm text-slate-400 italic">Instant quote available</span>
                                    )}
                                </div>

                                {/* Submit Action */}
                                <div className="w-full md:w-auto">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-64 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Book via WhatsApp <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Trust Indicators (Footer) */}
                        <div className="mt-4 flex justify-center gap-6 text-[10px] text-slate-400 font-medium uppercase tracking-wide opacity-80">
                            <span className="flex items-center gap-1.5"><CreditCard size={12} /> Pay Later</span>
                            <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Insured Rides</span>
                            <span className="flex items-center gap-1.5"><HeartHandshake size={12} /> 24/7 Support</span>
                        </div>
                    </motion.form>

                )}
            </AnimatePresence >
        </motion.div >
    );
};

export default QuickBookingForm;
