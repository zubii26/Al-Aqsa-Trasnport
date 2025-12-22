'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Phone, User, ArrowRight, Car, Navigation, Clock, CheckCircle, Bus, Mail, MapPin, PlaneLanding, PlaneTakeoff, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import ClockTimePicker from '@/components/ui/TimePicker/ClockTimePicker';
import SearchableSelect from '@/components/ui/SearchableSelect';

import styles from './QuickBookingForm.module.css';
import { usePricing } from '@/context/PricingContext';

import { Route, Vehicle } from '@/lib/pricing';

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

    const [serviceType, setServiceType] = useState<'intercity' | 'arrival' | 'departure'>('intercity');

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

    // Enhanced Dropdown Data Preparation
    // Filter routes based on Service Type
    const filteredRoutes = routes.filter(r => {
        const lowerName = r.name.toLowerCase();
        // Parse origin/destination from name since they aren't on the Route object
        const parts = lowerName.split(/ to | \u2192 | \u2194 /); // " to ", " → ", " ↔ "
        const origin = parts[0] || '';
        const destination = parts.length > 1 ? parts[1] : '';

        const isAirportRoute = lowerName.includes('airport');

        if (serviceType === 'arrival') {
            // Must be FROM Airport or explicitly named as an airport pickup
            return origin.includes('airport') || lowerName.startsWith('jeddah airport') || lowerName.startsWith('madinah airport');
        }
        if (serviceType === 'departure') {
            // Must be TO Airport
            return destination.includes('airport') || lowerName.includes('to jeddah airport') || lowerName.includes('to madinah airport');
        }

        // Intercity: exclude routes that are clearly airport transfers
        // Unless it's ambiguous, then show it. Safe default is to hide explicit airport routes.
        return !isAirportRoute;
    });

    // Enhanced Dropdown Data Preparation
    const routeOptions = [
        ...filteredRoutes.map(r => ({ value: r.id, label: r.name })),
        { value: 'custom', label: 'Other / Custom Route' }
    ];

    const vehicleOptions = vehicles.map(vehicle => {
        let priceDisplay = '';
        if (formData.routeId && formData.routeId !== 'custom') {
            const { price, discountApplied } = calculatePrice(formData.routeId, vehicle.id);
            if (price > 0) {
                priceDisplay = ` - ${price} SAR${discountApplied > 0 ? ' (Offer)' : ''}`;
            }
        }
        return {
            value: vehicle.id,
            label: `${vehicle.name} (${vehicle.capacity})${priceDisplay}`
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
        if (!formData.name.trim()) newErrors.name = 'Name is required';

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Strict Phone Validation: Must start with + and include country code
        const phoneRegex = /^\+[0-9\s-]{10,}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please include your country code (e.g., +966XXXXXXXXX)';
        }

        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.pickup.trim()) newErrors.pickup = 'Pickup location is required';
        if (!formData.dropoff.trim()) newErrors.dropoff = 'Dropoff location is required';
        if (!formData.routeId) newErrors.routeId = 'Route is required';
        if (!formData.vehicleId) newErrors.vehicleId = 'Vehicle is required';
        if (formData.vehicleCount < 1) newErrors.vehicleCount = 'At least 1 vehicle is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const selectedRoute = routes.find(r => r.id === formData.routeId);
        const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

        try {
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

            if (res.ok) {
                setIsSubmitted(true);
                setFormData({
                    name: '', phone: '', email: '', date: null, time: null, routeId: '', vehicleId: '',
                    pickup: '', dropoff: '', vehicleCount: 1, passengers: 1, luggage: 0, notes: ''
                });
                setErrors({});
            } else {
                throw new Error('Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to submit booking. Please try again.');
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

    const pickupLocations = allPickupLocations.filter(loc => {
        if (serviceType === 'arrival') return loc.toLowerCase().includes('airport');
        return true;
    });

    const dropoffLocations = allDropoffLocations.filter(loc => {
        if (serviceType === 'departure') return loc.toLowerCase().includes('airport');
        return true;
    });

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
                        <h3 className={styles.successTitle}>Booking Received!</h3>
                        <p className={styles.successMessage}>
                            Thank you for choosing Al Aqsa Transport. We have received your request and will contact you shortly to confirm your trip.
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

                        {/* Service Type Tabs */}
                        <div className="mb-3">
                            <div className={styles.segmentedControl}>
                                {([
                                    { id: 'intercity', label: 'Intercity Transfer' },
                                    { id: 'arrival', label: 'Airport Arrival' },
                                    { id: 'departure', label: 'Airport Departure' }
                                ]).map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                            setServiceType(type.id as any);
                                            setFormData(prev => ({ ...prev, routeId: '' }));
                                        }}
                                        className={`${styles.tab} ${serviceType === type.id ? styles.activeTab : ''}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.grid}>

                            <div className={`${styles.inputGroup} ${styles.fullWidthMobile}`}>
                                <label className={styles.label}>Full Name</label>
                                <div className={styles.inputWrapper}>
                                    <User size={20} className={styles.icon} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`${styles.input} ${errors.name ? styles.error : ''}`}
                                    />
                                </div>
                                {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                            </div>

                            <div className={`${styles.inputGroup} ${styles.fullWidthMobile}`}>
                                <label className={styles.label}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <Mail size={20} className={styles.icon} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`${styles.input} ${errors.email ? styles.error : ''}`}
                                    />
                                </div>
                                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                            </div>

                            <div className={`${styles.inputGroup} ${styles.fullWidthMobile}`}>
                                <label className={styles.label}>Phone Number</label>
                                <div className={styles.inputWrapper}>
                                    <Phone size={20} className={styles.icon} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+966 50 000 0000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                                    />
                                </div>
                                {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                            </div>

                            <div className={`${styles.inputGroup} ${styles.halfWidthMobile}`}>
                                <label className={styles.label}>Travel Date</label>
                                <div className={styles.inputWrapper}>
                                    <Calendar size={20} className={styles.icon} />
                                    <DatePicker
                                        selected={formData.date}
                                        onChange={handleDateChange}
                                        placeholderText="Select Date"
                                        className={`${styles.input} ${errors.date ? styles.error : ''}`}
                                        dateFormat="yyyy-MM-dd"
                                        minDate={new Date()}
                                        wrapperClassName={styles.datePickerWrapper}
                                        popperPlacement="bottom-start"
                                        popperClassName={variant === 'default' ? 'home-datepicker-popper' : ''}
                                        portalId="datepicker-portal"
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>
                                {errors.date && <span className={styles.errorMessage}>{errors.date}</span>}
                            </div>

                            <div className={`${styles.inputGroup} ${styles.halfWidthMobile}`}>
                                <label className={styles.label}>Pickup Time</label>
                                <div className={styles.inputWrapper}>
                                    <Clock size={20} className={styles.icon} />
                                    <ClockTimePicker
                                        date={formData.time}
                                        onChange={handleTimeChange}
                                        placeholderText="Select Time"
                                        className={`${styles.input} ${errors.time ? styles.error : ''}`}
                                        align="right"
                                    />
                                </div>
                                {errors.time && <span className={styles.errorMessage}>{errors.time}</span>}
                            </div>


                            {/* Editable Route Fields */}

                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Select Base Route (Optional)</label>
                                <div className={styles.inputWrapper}>
                                    <SearchableSelect
                                        name="routeId"
                                        value={formData.routeId}
                                        onChange={handleRouteChange}
                                        options={routeOptions}
                                        placeholder="Choose base route for pricing..."
                                        className={`${styles.input} ${errors.routeId ? styles.error : ''}`}
                                        icon={<Navigation size={20} />}
                                    />
                                </div>
                                {errors.routeId && <span className={styles.errorMessage}>{errors.routeId}</span>}
                            </div>

                            {/* Editable Route Fields - Only show if Custom Route is selected */}
                            {formData.routeId === 'custom' && (
                                <>
                                    <div className={`${styles.inputGroup} ${styles.halfWidthMobile}`}>
                                        <label className={styles.label}>From (Pickup)</label>
                                        <div className={styles.inputWrapper}>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/60 pointer-events-none">
                                                {/* Icon handled manually to preserve layout, SearchableSelect will have padding */}
                                            </div>
                                            <SearchableSelect
                                                name="pickup"
                                                value={formData.pickup}
                                                onChange={handleChange as any}
                                                options={pickupLocations}
                                                placeholder="Pickup Location"
                                                className={`${styles.input} ${errors.pickup ? styles.error : ''}`}
                                                icon={<MapPin size={20} />}
                                            />
                                        </div>
                                        {errors.pickup && <span className={styles.errorMessage}>{errors.pickup}</span>}
                                    </div>

                                    <div className={`${styles.inputGroup} ${styles.halfWidthMobile}`}>
                                        <label className={styles.label}>Destination (Drop-off)</label>
                                        <div className={styles.inputWrapper}>
                                            <SearchableSelect
                                                name="dropoff"
                                                value={formData.dropoff}
                                                onChange={handleChange as any}
                                                options={dropoffLocations}
                                                placeholder="Drop-off Location"
                                                className={`${styles.input} ${errors.dropoff ? styles.error : ''}`}
                                                icon={<MapPin size={20} />}
                                            />
                                        </div>
                                        {errors.dropoff && <span className={styles.errorMessage}>{errors.dropoff}</span>}
                                    </div>
                                </>
                            )}

                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className={styles.label}>Vehicle Type</label>
                                        <div className={styles.inputWrapper}>
                                            <SearchableSelect
                                                name="vehicleId"
                                                value={formData.vehicleId}
                                                onChange={handleChange as any}
                                                options={vehicleOptions}
                                                placeholder="Choose vehicle..."
                                                className={`${styles.input} ${errors.vehicleId ? styles.error : ''}`}
                                                icon={<Car size={20} />}
                                            />
                                        </div>
                                        {errors.vehicleId && <span className={styles.errorMessage}>{errors.vehicleId}</span>}
                                    </div>
                                    <div className="w-1/3">
                                        <label className={styles.label}>Count</label>
                                        <div className={styles.inputWrapper}>
                                            <input
                                                type="number"
                                                name="vehicleCount"
                                                min="1"
                                                max="10"
                                                value={formData.vehicleCount}
                                                onChange={handleChange}
                                                className={styles.input}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Passenger & Luggage Section */}
                            <div className="col-span-full border-t border-slate-200 dark:border-slate-700 pt-2 mt-1">
                                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Passenger & Luggage Details</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Passengers</label>
                                        <div className={styles.inputWrapper}>
                                            <User size={20} className={styles.icon} />
                                            <input
                                                type="number"
                                                name="passengers"
                                                min="1"
                                                value={formData.passengers}
                                                onChange={handleChange}
                                                className={`${styles.input} ${errors.passengers ? styles.error : ''}`}
                                            />
                                        </div>
                                        {(() => {
                                            const selectedV = vehicles.find(v => v.id === formData.vehicleId);
                                            if (selectedV) {
                                                const maxCap = parseInt(selectedV.capacity) * Number(formData.vehicleCount);
                                                if (Number(formData.passengers) > maxCap) {
                                                    return (
                                                        <span className="text-[10px] text-amber-500 font-medium mt-1 block leading-tight">
                                                            ⚠️ Exceeds capacity ({maxCap}). Consider upgrading.
                                                        </span>
                                                    );
                                                }
                                            }
                                            return null;
                                        })()}
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Luggage Count</label>
                                        <div className={styles.inputWrapper}>
                                            <input
                                                type="number"
                                                name="luggage"
                                                min="0"
                                                placeholder="0"
                                                value={formData.luggage}
                                                onChange={handleChange}
                                                className={styles.input}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles.inputGroup} mt-2`}>
                                    <label className={styles.label}>Notes (Optional)</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            name="notes"
                                            placeholder="Specific requirements, oversized luggage, etc."
                                            value={formData.notes}
                                            onChange={handleChange}
                                            className={styles.input}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Price Display */}
                            {formData.routeId && formData.vehicleId && (
                                <div className="col-span-full mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                    {(() => {
                                        // Calculate price using the function from context (already available at top level)
                                        const { price, originalPrice, discountApplied } = calculatePrice(formData.routeId, formData.vehicleId);

                                        if (price === 0) return null;

                                        return (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Estimated Price:</span>
                                                <div className="text-right">
                                                    {discountApplied > 0 && (
                                                        <div className="flex items-center justify-end gap-2 text-sm text-slate-400 line-through">
                                                            <span>{originalPrice} SAR</span>
                                                        </div>
                                                    )}
                                                    <div className="text-xl font-bold text-amber-600 dark:text-amber-500">
                                                        {price * formData.vehicleCount} SAR
                                                    </div>
                                                    {discountApplied > 0 && (
                                                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                                            Save {discountApplied * formData.vehicleCount} SAR
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <span>Book Now</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div >
    );
};

export default QuickBookingForm;
