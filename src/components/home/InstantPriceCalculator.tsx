'use client';

import { useState, useEffect } from 'react';
import styles from './InstantPriceCalculator.module.css';
import { MapPin, Car, ArrowRight, CheckCircle, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePricing } from '@/context/PricingContext';
import FadeIn from '@/components/common/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import VehicleSelector from './VehicleSelector';
import RouteSelector from './RouteSelector';

export default function InstantPriceCalculator() {
    const { routes, vehicles, calculatePrice, isLoading } = usePricing();

    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [price, setPrice] = useState<number | null>(null);

    // Set defaults once data is loaded
    useEffect(() => {
        if (!isLoading && routes.length > 0 && vehicles.length > 0) {
            if (!selectedRoute) setSelectedRoute(routes[0].id);
            if (!selectedVehicle) setSelectedVehicle(vehicles[0].id);
        }
    }, [isLoading, routes, vehicles]);

    useEffect(() => {
        if (selectedRoute && selectedVehicle) {
            const calculatedPrice = calculatePrice(selectedRoute, selectedVehicle);
            setPrice(calculatedPrice);
        }
    }, [selectedRoute, selectedVehicle, calculatePrice]);

    const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoute(e.target.value);
    };

    const currentRoute = routes.find(r => r.id === selectedRoute);
    const currentVehicle = vehicles.find(v => v.id === selectedVehicle);

    if (isLoading) return <div className={styles.calculatorCard}>Loading rates...</div>;

    return (
        <section className={styles.section}>
            <div className="container">
                <FadeIn>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Instant Price Calculator</h2>
                        <p className={styles.subtitle}>
                            Select your route and vehicle to see real-time fares. Transparent pricing, no hidden fees.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <div className={styles.calculatorContainer}>
                        {/* Controls Side */}
                        <div className={styles.controls}>
                            <div>
                                <label className={styles.label}>Select Route</label>
                                <RouteSelector
                                    routes={routes}
                                    selectedRouteId={selectedRoute}
                                    onSelect={setSelectedRoute}
                                />
                            </div>

                            <div>
                                <label className={styles.label}>Select Vehicle</label>
                                <VehicleSelector
                                    vehicles={vehicles}
                                    selectedVehicleId={selectedVehicle}
                                    onSelect={setSelectedVehicle}
                                />
                            </div>
                        </div>

                        {/* Result Side */}
                        <div className={styles.resultDisplay}>
                            <div>
                                <div className={styles.resultHeader}>
                                    <div className={styles.estimatedLabel}>
                                        Estimated Fare
                                    </div>
                                    <div className={styles.guaranteeBadge}>
                                        <ShieldCheck size={15} strokeWidth={2.5} />
                                        <span>Best Rate Guaranteed</span>
                                    </div>
                                </div>

                                <div className={styles.priceContainer}>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={price}
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className={styles.priceValue}
                                        >
                                            <span className={styles.currencySymbol}>SAR</span>
                                            {price ? price.toLocaleString() : 0}
                                        </motion.div>
                                    </AnimatePresence>
                                    <div className={styles.priceLabel}>All Inclusive Price</div>

                                    {currentVehicle && currentRoute && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={styles.priceBreakdown}
                                        >
                                            <span>Base Rate: {currentRoute.baseRate} SAR</span>
                                            {currentVehicle.multiplier > 1 && (
                                                <>
                                                    <span className={styles.breakdownDivider}>•</span>
                                                    <span>{currentVehicle.category || 'Standard'} Tier</span>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </div>

                                <div className={styles.tripDetails}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Distance</span>
                                        <div className={styles.detailValue}>{currentRoute?.distance || '-'}</div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Duration</span>
                                        <div className={styles.detailValue}>{currentRoute?.time || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/booking?route=${selectedRoute}&vehicle=${selectedVehicle}`} className={styles.bookBtn}>
                                <span>Reserve Now</span>
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Mobile Sticky Bar Removed */}

        </section>
    );
}
