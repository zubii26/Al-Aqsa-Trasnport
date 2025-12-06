'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
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

    // Initialize defaults when data loads
    useEffect(() => {
        if (!isLoading && routes.length > 0 && vehicles.length > 0) {
            setBookingData(prev => ({
                ...prev,
                routeId: prev.routeId || routes[0].id,
                vehicleId: prev.vehicleId || vehicles[0].id
            }));
        }
    }, [isLoading, routes, vehicles]);

    const [totalPrice, setTotalPrice] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const renderStep1 = () => (
        <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={styles.stepContainer}
        >
            <h2 className={styles.stepTitle}>Select Your Route</h2>
            <div className={styles.dropdownContainer}>
                <label className={styles.label}>
                    <MapPin size={18} /> Choose Journey
                </label>

                {/* Custom Dropdown */}
                <div className={styles.customSelect} ref={dropdownRef}>
                    <div
                        className={`${styles.selectTrigger} ${isDropdownOpen ? styles.selectTriggerOpen : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span className={styles.selectedValue}>{getSelectedRoute()?.name}</span>
                        <ChevronDown className={`${styles.selectArrow} ${isDropdownOpen ? styles.rotateArrow : ''}`} size={20} />
                    </div>

                    {isDropdownOpen && (
                        <div className={styles.selectMenu}>
                            {routes.map(route => (
                                <div
                                    key={route.id}
                                    className={`${styles.selectOption} ${bookingData.routeId === route.id ? styles.selectedOption : ''}`}
                                    onClick={() => handleRouteSelect(route.id)}
                                >
                                    <div className={styles.optionIcon}>
                                        <MapPin size={16} />
                                    </div>
                                    <div className={styles.optionContent}>
                                        <span className={styles.optionName}>{route.name}</span>
                                        <span className={styles.optionMeta}>{route.distance} • {route.time}</span>
                                    </div>
                                    {bookingData.routeId === route.id && <CheckCircle size={16} className="text-primary" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Route Info Card */}
                <div className={styles.routeInfoCard}>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Distance</span>
                        <span className={styles.infoValue}>{getSelectedRoute()?.distance}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Est. Time</span>
                        <span className={styles.infoValue}>{getSelectedRoute()?.time}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Base Rate</span>
                        <span className={styles.infoValue}>{getSelectedRoute()?.baseRate} SAR</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

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
                className={styles.stepContainer}
            >
                <h2 className={styles.stepTitle}>Select Your Vehicle</h2>

                {/* Mobile Dropdown (Visible on small screens) */}
                <div className="lg:hidden mb-8">
                    <div className={styles.dropdownContainer}>
                        <label className={styles.label}>
                            <Briefcase size={18} /> Choose Vehicle
                        </label>
                        <div className={styles.customSelect}>
                            <div
                                className={`${styles.selectTrigger} ${isVehicleDropdownOpen ? styles.selectTriggerOpen : ''}`}
                                onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                            >
                                <span className={styles.selectedValue}>
                                    {selectedVehicle ? selectedVehicle.name : 'Select Vehicle'}
                                </span>
                                <ChevronDown className={`${styles.selectArrow} ${isVehicleDropdownOpen ? styles.rotateArrow : ''}`} size={20} />
                            </div>

                            {isVehicleDropdownOpen && (
                                <div className={styles.selectMenu}>
                                    {vehicles.map(vehicle => {
                                        const Icon = vehicle.icon;
                                        const priceDetails = calculatePrice(bookingData.routeId, vehicle.id);
                                        return (
                                            <div
                                                key={vehicle.id}
                                                className={`${styles.selectOption} ${bookingData.vehicleId === vehicle.id ? styles.selectedOption : ''}`}
                                                onClick={() => {
                                                    updateData('vehicleId', vehicle.id);
                                                    setIsVehicleDropdownOpen(false);
                                                }}
                                            >
                                                <div className={styles.optionIcon}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className={styles.optionName}>{vehicle.name}</span>
                                                        <span className="font-bold text-amber-500">{priceDetails.price} SAR</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span>{vehicle.capacity}</span>
                                                        <span>•</span>
                                                        <span>{vehicle.luggage}</span>
                                                    </div>
                                                </div>
                                                {bookingData.vehicleId === vehicle.id && <CheckCircle size={16} className="text-primary" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Selected Vehicle Info Card for Mobile */}
                        {selectedVehicle && (
                            <div className={`${styles.routeInfoCard} mt-4`}>
                                <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="p-2 bg-white dark:bg-slate-700 rounded-full text-amber-500 shadow-sm">
                                        {(() => {
                                            const Icon = selectedVehicle.icon;
                                            return <Icon size={24} />;
                                        })()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{selectedVehicle.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{selectedVehicle.capacity}</p>
                                    </div>
                                </div>
                                <div className={styles.vehicleFeatures}>
                                    {selectedVehicle.features.map((feature, idx) => (
                                        <div key={idx} className={styles.featureItem}>
                                            <CheckCircle size={12} />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Grid (Hidden on mobile) */}
                <div className={`${styles.grid} hidden lg:grid`}>
                    {vehicles.map((vehicle) => {
                        const Icon = vehicle.icon;
                        const priceDetails = calculatePrice(bookingData.routeId, vehicle.id);
                        return (
                            <div
                                key={vehicle.id}
                                className={`${styles.optionCard} ${bookingData.vehicleId === vehicle.id ? styles.selectedCard : ''}`}
                                onClick={() => updateData('vehicleId', vehicle.id)}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardIcon}>
                                        <Icon size={32} />
                                    </div>
                                    <div className={styles.cardPrice}>
                                        {priceDetails.discountApplied > 0 ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-slate-400 line-through decoration-red-500/50">
                                                    {priceDetails.originalPrice} SAR
                                                </span>
                                                <span className={`${styles.priceValue} text-red-600`}>
                                                    {priceDetails.price} SAR
                                                </span>
                                            </div>
                                        ) : (
                                            <span className={styles.priceValue}>{priceDetails.price} SAR</span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.cardContent}>
                                    <h3>{vehicle.name}</h3>
                                    <p className={styles.cardSubtitle}>{vehicle.capacity}</p>

                                    <div className={styles.vehicleFeatures}>
                                        <div className={styles.featureItem}>
                                            <Briefcase size={14} />
                                            <span>{vehicle.luggage}</span>
                                        </div>
                                        {vehicle.features.slice(0, 2).map((feature, idx) => (
                                            <div key={idx} className={styles.featureItem}>
                                                <CheckCircle size={14} />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
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
            className={styles.stepContainer}
        >
            <h2 className={styles.stepTitle}>Trip Details</h2>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <Calendar size={18} /> Date
                    </label>
                    <DatePicker
                        selected={bookingData.date}
                        onChange={(date) => updateData('date', date)}
                        placeholderText="Select Date"
                        className={`${styles.input} ${errors.date ? 'border-red-500' : ''}`}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                        portalId="datepicker-portal"
                        popperClassName="home-datepicker-popper"
                    />
                    {errors.date && <span className="text-red-500 text-sm mt-1">{errors.date}</span>}
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <Clock size={18} /> Pickup Time
                    </label>
                    <ClockTimePicker
                        date={bookingData.time}
                        onChange={(date) => updateData('time', date)}
                        placeholderText="Select Time"
                        className={`${styles.input} ${errors.time ? 'border-red-500' : ''}`}
                    />
                    {errors.time && <span className="text-red-500 text-sm mt-1">{errors.time}</span>}
                </div>
            </div>

            <h2 className={`${styles.stepTitle} mt-8`}>Contact Information</h2>
            <div className={styles.formGrid}>
                <div className={`${styles.formGroup} col-span-2 lg:col-span-1`}>
                    <label className={styles.label}>
                        <User size={18} /> Full Name
                    </label>
                    <input
                        type="text"
                        className={`${styles.input} ${errors.name ? styles.error : ''}`}
                        value={bookingData.name}
                        onChange={(e) => updateData('name', e.target.value)}
                        placeholder="Enter your full name"
                    />
                    {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                </div>
                <div className={`${styles.formGroup} col-span-2 lg:col-span-1`}>
                    <label className={styles.label}>
                        <Mail size={18} /> Email Address
                    </label>
                    <input
                        type="email"
                        className={`${styles.input} ${errors.email ? styles.error : ''}`}
                        value={bookingData.email}
                        onChange={(e) => updateData('email', e.target.value)}
                        placeholder="name@example.com"
                    />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>
                <div className={`${styles.formGroup} col-span-2`}>
                    <label className={styles.label}>
                        <Phone size={18} /> WhatsApp Number
                    </label>
                    <input
                        type="tel"
                        className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                        value={bookingData.phone}
                        onChange={(e) => updateData('phone', e.target.value)}
                        placeholder="+966 50 000 0000"
                    />
                    {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                </div>
            </div>
        </motion.div>
    );

    const renderSummary = () => {
        const route = getSelectedRoute();
        const vehicle = getSelectedVehicle();

        return (
            <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className={styles.stepContainer}
            >
                <h2 className={styles.stepTitle}>Review & Confirm</h2>
                <div className={styles.summaryCard}>
                    <div className={styles.summarySection}>
                        <h3>Journey Details</h3>
                        <div className={styles.summaryRow}>
                            <span>Route</span>
                            <strong>{route?.name}</strong>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Vehicle</span>
                            <strong>{vehicle?.name}</strong>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Date & Time</span>
                            <strong>
                                {bookingData.date?.toLocaleDateString()} at {bookingData.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </strong>
                        </div>
                    </div>

                    <div className={styles.summarySection}>
                        <h3>Passenger Details</h3>
                        <div className={styles.summaryRow}>
                            <span>Name</span>
                            <strong>{bookingData.name}</strong>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Contact</span>
                            <strong>{bookingData.phone}</strong>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Email</span>
                            <strong>{bookingData.email}</strong>
                        </div>
                    </div>

                    <div className={styles.summaryTotal}>
                        {(() => {
                            const priceDetails = calculatePrice(bookingData.routeId, bookingData.vehicleId);
                            return (
                                <>
                                    {priceDetails.discountApplied > 0 && (
                                        <div className="flex justify-between w-full text-sm font-normal mb-2">
                                            <span className="text-slate-500">Original Price</span>
                                            <span className="text-slate-500 line-through">{priceDetails.originalPrice} SAR</span>
                                        </div>
                                    )}
                                    {priceDetails.discountApplied > 0 && (
                                        <div className="flex justify-between w-full text-sm font-normal mb-2">
                                            <span className="text-green-600">Discount</span>
                                            <span className="text-green-600">-{priceDetails.discountApplied} SAR</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between w-full items-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <span>Total Price</span>
                                        <span className={styles.summaryTotalAmount}>{totalPrice} SAR</span>
                                    </div>
                                </>
                            );
                        })()}
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
            className={styles.successMessage}
        >
            <div className={styles.successIcon}>
                <CheckCircle size={80} />
            </div>
            <h2>Booking Confirmed!</h2>
            <p>
                Alhamdulillah! Your booking has been received. <br />
                We have sent a confirmation email to <strong>{bookingData.email}</strong>.
            </p>
            <div className={styles.bookingRef}>
                <span>Booking Reference:</span>
                <strong>#AQ-{Math.floor(10000 + Math.random() * 90000)}</strong>
            </div>
            <Link href="/" className="btn btn-primary">
                Return Home
            </Link>
        </motion.div>
    );

    // Sidebar Component
    const Sidebar = () => {
        const route = getSelectedRoute();
        const vehicle = getSelectedVehicle();

        return (
            <div className={styles.sidebar}>
                <div className={styles.sidebarContent}>
                    <h3 className={styles.sidebarTitle}>Booking Summary</h3>

                    <div className={styles.sidebarSection}>
                        <div className={styles.sidebarItem}>
                            <span className={styles.sidebarLabel}>Route</span>
                            <span className={styles.sidebarValue}>{route?.name}</span>
                        </div>
                        <div className={styles.sidebarItem}>
                            <span className={styles.sidebarLabel}>Vehicle</span>
                            <span className={styles.sidebarValue}>{vehicle?.name}</span>
                        </div>
                        {bookingData.date && (
                            <div className={styles.sidebarItem}>
                                <span className={styles.sidebarLabel}>Date</span>
                                <span className={styles.sidebarValue}>{bookingData.date.toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.sidebarTotal}>
                        {(() => {
                            const priceDetails = calculatePrice(bookingData.routeId || '', bookingData.vehicleId || '');
                            if (priceDetails.discountApplied > 0) {
                                return (
                                    <div className="w-full">
                                        <div className="flex justify-between text-sm text-slate-400 mb-1">
                                            <span>Original</span>
                                            <span className="line-through">{priceDetails.originalPrice} SAR</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-green-500 mb-2">
                                            <span>Discount</span>
                                            <span>-{priceDetails.discountApplied} SAR</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                                            <span>Total</span>
                                            <span className={styles.totalAmount}>{totalPrice} SAR</span>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <>
                                    <span>Total Price</span>
                                    <span className={styles.totalAmount}>{totalPrice} SAR</span>
                                </>
                            );
                        })()}
                    </div>

                    <div className={styles.sidebarNote}>
                        <Info size={14} />
                        <p>Price includes all taxes and fees.</p>
                    </div>

                    {/* Trust Indicators */}
                    <div className={styles.trustIndicators}>
                        <div className={styles.trustItem}>
                            <ShieldCheck size={18} className="text-primary" />
                            <span>Secure Booking</span>
                        </div>
                        <div className={styles.trustItem}>
                            <Headphones size={18} className="text-primary" />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };





    // ... (keep existing effects)



    return (
        <main>
            <section className={styles.hero}>
                <div className="container mx-auto px-4">
                    <div className={styles.heroContent}>
                        {/* Left Column: Hero Text & Sidebar */}
                        <div className={styles.leftColumn}>
                            <div className={styles.heroText}>
                                <FadeIn direction="right">
                                    <h1 className={styles.heroTitle}>
                                        Book Umrah Transport Online Saudi Arabia
                                    </h1>
                                </FadeIn>
                                <FadeIn delay={0.2} direction="right">
                                    <p className={styles.heroSubtitle}>
                                        24/7 Umrah transport booking. Affordable Umrah bus service Jeddah to Makkah.
                                    </p>
                                </FadeIn>
                            </div>

                            {/* Sidebar - Hidden on mobile, shown here on desktop */}
                            {step < 4 && (
                                <div className="hidden lg:block mt-8">
                                    <Sidebar />
                                </div>
                            )}
                        </div>

                        {/* Right Column: Wizard */}
                        <div className={styles.rightColumn}>
                            <FadeIn delay={0.3} direction="left">
                                <div className={styles.wizard} ref={wizardRef}>
                                    {step < 5 && (
                                        <div className={styles.progressContainer}>
                                            <div className={styles.steps}>
                                                <div className={`${styles.step} ${step >= 1 ? styles.activeStep : ''}`}>
                                                    <div className={styles.stepNumber}>1</div>
                                                    <span>Route</span>
                                                </div>
                                                <div className={styles.stepLine} />
                                                <div className={`${styles.step} ${step >= 2 ? styles.activeStep : ''}`}>
                                                    <div className={styles.stepNumber}>2</div>
                                                    <span>Vehicle</span>
                                                </div>
                                                <div className={styles.stepLine} />
                                                <div className={`${styles.step} ${step >= 3 ? styles.activeStep : ''}`}>
                                                    <div className={styles.stepNumber}>3</div>
                                                    <span>Details</span>
                                                </div>
                                                <div className={styles.stepLine} />
                                                <div className={`${styles.step} ${step >= 4 ? styles.activeStep : ''}`}>
                                                    <div className={styles.stepNumber}>4</div>
                                                    <span>Confirm</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.content}>
                                        <AnimatePresence mode="wait">
                                            {step === 1 && renderStep1()}
                                            {step === 2 && renderStep2()}
                                            {step === 3 && renderStep3()}
                                            {step === 4 && renderSummary()}
                                            {step === 5 && renderSuccess()}
                                        </AnimatePresence>

                                        {step < 5 && (
                                            <div className={styles.actions}>
                                                {step > 1 ? (
                                                    <button onClick={prevStep} className={styles.backBtn}>Back</button>
                                                ) : (
                                                    <div></div>
                                                )}

                                                <button
                                                    onClick={nextStep}
                                                    className={styles.nextBtn}
                                                    disabled={
                                                        (step === 3 && (!bookingData.date || !bookingData.time || !bookingData.name || !bookingData.phone))
                                                    }
                                                >
                                                    <span>{step === 4 ? 'Confirm Booking' : 'Next Step'}</span>
                                                    {totalPrice > 0 && step < 4 && (
                                                        <span className="text-sm opacity-90 font-normal ml-2">
                                                            ({totalPrice} SAR)
                                                        </span>
                                                    )}
                                                    {step !== 4 && <ArrowRight size={20} />}
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
