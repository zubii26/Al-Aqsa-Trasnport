'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vehicle } from '@/lib/pricing';
import { Users, Briefcase, CheckCircle2, ChevronDown, Car } from 'lucide-react';
import styles from './VehicleSelector.module.css';

interface VehicleSelectorProps {
    vehicles: Vehicle[];
    selectedVehicleId: string;
    onSelect: (vehicleId: string) => void;
}

export default function VehicleSelector({ vehicles, selectedVehicleId, onSelect }: VehicleSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.container} ref={dropdownRef}>
            {/* Mobile Dropdown */}
            <div className="md:hidden w-full">
                <button
                    className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                >
                    <div className={styles.triggerContent}>
                        <div className={styles.triggerIconWrapper}>
                            <Car size={20} />
                        </div>
                        <div className={styles.vehicleInfo}>
                            <span className={styles.label}>Select Vehicle</span>
                            <span className={styles.value}>{selectedVehicle?.name || 'Choose a vehicle'}</span>
                        </div>
                    </div>
                    <ChevronDown size={20} className={`${styles.chevron} ${isOpen ? styles.rotate : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className={styles.dropdown}
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className={styles.list}>
                                {vehicles.map((vehicle) => {
                                    const Icon = vehicle.icon;
                                    return (
                                        <button
                                            key={vehicle.id}
                                            className={`${styles.option} ${selectedVehicleId === vehicle.id ? styles.selectedOption : ''}`}
                                            onClick={() => {
                                                onSelect(vehicle.id);
                                                setIsOpen(false);
                                            }}
                                        >
                                            <div className={styles.optionIcon}>
                                                <Icon size={18} />
                                            </div>
                                            <div className={styles.optionContent}>
                                                <span className={styles.optionName}>{vehicle.name}</span>
                                                <div className={styles.optionMeta}>
                                                    <span>{vehicle.capacity}</span>
                                                    <span>•</span>
                                                    <span>{vehicle.luggage}</span>
                                                </div>
                                            </div>
                                            {selectedVehicleId === vehicle.id && (
                                                <div className={styles.selectedIndicator} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:block">
                <div className={styles.grid}>
                    {vehicles.map((vehicle) => {
                        const Icon = vehicle.icon;
                        const isSelected = selectedVehicleId === vehicle.id;

                        return (
                            <motion.button
                                key={vehicle.id}
                                data-id={vehicle.id}
                                onClick={() => onSelect(vehicle.id)}
                                className={`${styles.card} ${isSelected ? styles.selected : ''}`}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="active-vehicle-border"
                                        className={styles.activeBorder}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <div className={styles.iconWrapper}>
                                    <Icon size={28} className={isSelected ? 'text-amber-500' : 'text-muted-foreground'} />
                                </div>

                                <div className={styles.info}>
                                    <h3 className={styles.name}>{vehicle.name}</h3>
                                    <div className={styles.specs}>
                                        <span className={styles.spec}>
                                            <Users size={12} /> {vehicle.capacity}
                                        </span>
                                        <span className={styles.spec}>
                                            <Briefcase size={12} /> {vehicle.luggage}
                                        </span>
                                    </div>
                                </div>

                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={styles.checkIcon}
                                    >
                                        <CheckCircle2 size={16} />
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
