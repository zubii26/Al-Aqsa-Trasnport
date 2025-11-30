'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route } from '@/lib/pricing';
import { MapPin, ChevronDown, Search, Navigation } from 'lucide-react';
import styles from './RouteSelector.module.css';

interface RouteSelectorProps {
    routes: Route[];
    selectedRouteId: string;
    onSelect: (routeId: string) => void;
}

export default function RouteSelector({ routes, selectedRouteId, onSelect }: RouteSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedRoute = routes.find(r => r.id === selectedRouteId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredRoutes = routes.filter(route =>
        route.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <div className={styles.triggerContent}>
                    <div className={styles.iconWrapper}>
                        <Navigation size={20} />
                    </div>
                    <div className={styles.routeInfo}>
                        <span className={styles.label}>Selected Route</span>
                        <span className={styles.value}>{selectedRoute?.name || 'Select a route'}</span>
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
                        <div className={styles.searchContainer}>
                            <Search size={16} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className={styles.list}>
                            {filteredRoutes.length > 0 ? (
                                filteredRoutes.map(route => (
                                    <button
                                        key={route.id}
                                        className={`${styles.option} ${selectedRouteId === route.id ? styles.selected : ''}`}
                                        onClick={() => {
                                            onSelect(route.id);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                    >
                                        <div className={styles.optionIcon}>
                                            <MapPin size={16} />
                                        </div>
                                        <div className={styles.optionContent}>
                                            <span className={styles.optionName}>{route.name}</span>
                                            <div className={styles.optionMeta}>
                                                <span>{route.distance}</span>
                                                <span>•</span>
                                                <span>{route.time}</span>
                                            </div>
                                        </div>
                                        {selectedRouteId === route.id && (
                                            <div className={styles.selectedIndicator} />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className={styles.noResults}>No routes found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
