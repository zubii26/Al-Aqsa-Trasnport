'use client';

import { motion } from 'framer-motion';
import { Vehicle } from '@/lib/pricing';
import { Users, Briefcase, CheckCircle2 } from 'lucide-react';
import styles from './VehicleSelector.module.css';

interface VehicleSelectorProps {
    vehicles: Vehicle[];
    selectedVehicleId: string;
    onSelect: (vehicleId: string) => void;
}

export default function VehicleSelector({ vehicles, selectedVehicleId, onSelect }: VehicleSelectorProps) {
    return (
        <div className={styles.container}>
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
    );
}
