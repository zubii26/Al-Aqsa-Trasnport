'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Phone, User, ArrowRight, Car, Navigation, Clock, CheckCircle, Bus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';

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

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: null as Date | null,
        time: null as Date | null,
        routeId: '',
        vehicleId: ''
    });

    // Set default route when loaded
    useEffect(() => {
        if (!isLoading && routes.length > 0 && !formData.routeId) {
            setFormData(prev => ({ ...prev, routeId: routes[0].id }));
        }
    }, [isLoading, routes, formData.routeId]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
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

        // Strict Phone Validation: Must start with + and include country code
        const phoneRegex = /^\+[0-9\s-]{10,}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please include your country code (e.g., +966XXXXXXXXX)';
        }

        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.routeId) newErrors.routeId = 'Route is required';
        if (!formData.vehicleId) newErrors.vehicleId = 'Vehicle is required';

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
                    date: formData.date?.toISOString().split('T')[0],
                    pickup: selectedRoute ? selectedRoute.name.split(' → ')[0] : 'Custom',
                    dropoff: selectedRoute ? selectedRoute.name.split(' → ')[1] || selectedRoute.name : 'Custom',
                    email: 'quick-booking@example.com',
                    time: formData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    vehicle: selectedVehicle ? selectedVehicle.name : 'Any',
                    passengers: selectedVehicle ? parseInt(selectedVehicle.capacity) : 1,
                    status: 'pending',
                    routeId: formData.routeId,
                    vehicleId: formData.vehicleId
                }),
            });

            if (res.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', phone: '', date: null, time: null, routeId: '', vehicleId: '' });
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

    return (
        <motion.div
            className={`${styles.container} ${variant === 'fleet' ? styles.fleetForm : ''} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
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

                        <div className={`${styles.inputGroup} ${styles.fullWidthMobile}`}>
                            <label className={styles.label}><User size={14} /> Full Name</label>
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
                            <label className={styles.label}><Phone size={14} /> Phone Number</label>
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
                            <label className={styles.label}><Calendar size={14} /> Travel Date</label>
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
                                />
                            </div>
                            {errors.date && <span className={styles.errorMessage}>{errors.date}</span>}
                        </div>

                        <div className={`${styles.inputGroup} ${styles.halfWidthMobile}`}>
                            <label className={styles.label}><Clock size={14} /> Pickup Time</label>
                            <div className={styles.inputWrapper}>
                                <Clock size={20} className={styles.icon} />
                                <DatePicker
                                    selected={formData.time}
                                    onChange={handleTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Select Time"
                                    dateFormat="h:mm aa"
                                    placeholderText="Select Time"
                                    className={`${styles.input} ${errors.time ? styles.error : ''}`}
                                    wrapperClassName={styles.datePickerWrapper}
                                    popperPlacement="bottom-start"
                                    popperClassName="time-grid-popper"
                                    portalId="datepicker-portal"
                                />
                            </div>
                            {errors.time && <span className={styles.errorMessage}>{errors.time}</span>}
                        </div>

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}><Navigation size={14} /> Select Route</label>
                            <div className={styles.inputWrapper}>
                                <Navigation size={20} className={styles.icon} />
                                <select
                                    name="routeId"
                                    value={formData.routeId}
                                    onChange={handleChange}
                                    className={`${styles.input} ${styles.select} ${errors.routeId ? styles.error : ''}`}
                                >
                                    <option value="">Choose your journey...</option>
                                    {routes.map(route => (
                                        <option key={route.id} value={route.id}>
                                            {route.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.routeId && <span className={styles.errorMessage}>{errors.routeId}</span>}
                        </div>

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}><Car size={14} /> Select Vehicle</label>
                            <div className={styles.inputWrapper}>
                                <Car size={20} className={styles.icon} />
                                <select
                                    name="vehicleId"
                                    value={formData.vehicleId}
                                    onChange={handleChange}
                                    className={`${styles.input} ${styles.select} ${errors.vehicleId ? styles.error : ''}`}
                                >
                                    <option value="">Choose vehicle...</option>
                                    {vehicles.map(vehicle => {
                                        let priceDisplay = '';
                                        if (formData.routeId) {
                                            const { price, discountApplied } = calculatePrice(formData.routeId, vehicle.id);
                                            if (price > 0) {
                                                priceDisplay = ` - ${price} SAR${discountApplied > 0 ? ' (Offer)' : ''}`;
                                            }
                                        }
                                        return (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.name} ({vehicle.capacity}){priceDisplay}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            {errors.vehicleId && <span className={styles.errorMessage}>{errors.vehicleId}</span>}
                        </div>

                        {/* Price Display */}
                        {formData.routeId && formData.vehicleId && (
                            <div className="col-span-full mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
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
                                                    {price} SAR
                                                </div>
                                                {discountApplied > 0 && (
                                                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                                        Save {discountApplied} SAR
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

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
        </motion.div>
    );
};

export default QuickBookingForm;
