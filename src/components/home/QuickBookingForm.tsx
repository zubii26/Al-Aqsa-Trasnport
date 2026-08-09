'use client';

import React, { useState } from 'react';
import { Phone, User, ArrowRight, Car, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import styles from './QuickBookingForm.module.css';
import { usePricing } from '@/context/PricingContext';
import { getWhatsAppLink, createBookingMessage } from '@/lib/whatsapp';

export default function QuickBookingForm() {
    const { vehicles } = usePricing();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pickup: '',
        dropoff: '',
        vehicle: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const message = createBookingMessage({
                service: 'Quick Booking',
                pickup: formData.pickup,
                dropoff: formData.dropoff,
                vehicle: formData.vehicle || 'Not Selected',
                name: formData.name,
                passengers: 1
            });
            
            const whatsappUrl = getWhatsAppLink(message);
            window.open(whatsappUrl, '_blank');
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className={styles.header}>
                <h3 className={styles.title}>Book Your Ride</h3>
                <p className={styles.subtitle}>Fast, premium, and reliable transport</p>
            </div>

            <AnimatePresence mode="wait">
                {isSubmitted ? (
                    <motion.div 
                        key="success"
                        className={styles.successContent}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <h3 className={styles.successTitle}>Redirecting to WhatsApp</h3>
                        <p className={styles.successMessage}>Please hit send to confirm your booking.</p>
                        <button onClick={() => setIsSubmitted(false)} className={styles.submitBtn}>
                            Book Another Ride
                        </button>
                    </motion.div>
                ) : (
                    <motion.form 
                        key="form"
                        onSubmit={handleSubmit}
                        className={styles.form}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Full Name</label>
                            <div className={styles.inputWrapper}>
                                <User className={styles.icon} size={18} />
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    placeholder="Your Name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className={styles.input} 
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>WhatsApp Number</label>
                            <div className={styles.inputWrapper}>
                                <Phone className={styles.icon} size={18} />
                                <input 
                                    type="tel" 
                                    name="phone"
                                    required
                                    placeholder="+966 50..." 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    className={styles.input} 
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Pickup Location</label>
                            <div className={styles.inputWrapper}>
                                <MapPin className={styles.icon} size={18} />
                                <input 
                                    type="text" 
                                    name="pickup"
                                    required
                                    placeholder="E.g., Jeddah Airport" 
                                    value={formData.pickup} 
                                    onChange={handleChange} 
                                    className={styles.input} 
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Drop-off Location</label>
                            <div className={styles.inputWrapper}>
                                <MapPin className={styles.icon} size={18} />
                                <input 
                                    type="text" 
                                    name="dropoff"
                                    required
                                    placeholder="E.g., Makkah Hotel" 
                                    value={formData.dropoff} 
                                    onChange={handleChange} 
                                    className={styles.input} 
                                />
                            </div>
                        </div>

                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Vehicle Preference</label>
                            <div className={styles.inputWrapper}>
                                <Car className={styles.icon} size={18} />
                                <select 
                                    name="vehicle"
                                    value={formData.vehicle}
                                    onChange={handleChange}
                                    className={`${styles.input} ${styles.select}`}
                                >
                                    <option value="">Any Vehicle</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.name}>{v.name} ({v.capacity} Seats)</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                            {isSubmitting ? 'Processing...' : (
                                <>
                                    Book via WhatsApp <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
