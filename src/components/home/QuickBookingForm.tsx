'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, User, ArrowRight, Car, Navigation, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';

import styles from './QuickBookingForm.module.css';
import { usePricing } from '@/context/PricingContext';

interface QuickBookingFormProps {
    title?: string;
    subtitle?: string;
    className?: string;
    variant?: 'default' | 'fleet';
}

const QuickBookingForm = ({ title, subtitle, className = '', variant = 'default' }: QuickBookingFormProps) => {
    const { routes, vehicles, isLoading } = usePricing();

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
    }, [isLoading, routes]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

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
                    status: 'pending'
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
        }
    };

    const resetForm = () => {
        setIsSubmitted(false);
    };

    if (isLoading) return <div className={styles.container}>Loading...</div>;

    if (isSubmitted) {
        return (
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.successContent}>
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
                </div>
            </motion.div>
        );
    }

    return (
        <div className={`${styles.container} ${variant === 'fleet' ? styles.fleetForm : ''} ${className}`}>
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

            <form onSubmit={handleSubmit} className={styles.form} noValidate>

                <div className={styles.inputGroup}>
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

                <div className={styles.inputGroup}>
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

                <div className={styles.inputGroup}>
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
                        />
                    </div>
                    {errors.date && <span className={styles.errorMessage}>{errors.date}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Pickup Time</label>
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

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Select Route</label>
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

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Select Vehicle</label>
                    <div className={styles.inputWrapper}>
                        <Car size={20} className={styles.icon} />
                        <select
                            name="vehicleId"
                            value={formData.vehicleId}
                            onChange={handleChange}
                            className={`${styles.input} ${styles.select} ${errors.vehicleId ? styles.error : ''}`}
                        >
                            <option value="">Choose vehicle...</option>
                            {vehicles.map(vehicle => (
                                <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.name} ({vehicle.capacity})
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.vehicleId && <span className={styles.errorMessage}>{errors.vehicleId}</span>}
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                >
                    <span>Book Now</span>
                    <ArrowRight size={20} />
                </button>

            </form>
        </div>
    );
};

export default QuickBookingForm;
