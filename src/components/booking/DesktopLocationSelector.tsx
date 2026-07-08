'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Check, PlaneLanding, Building2, TrainFront, Landmark, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREDEFINED_LOCATIONS, getRecommendations, PredefinedLocation, LocationCategory } from '@/lib/utils/locations';

interface DesktopLocationSelectorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label?: string;
    error?: string;
    pickupLocation?: string; // Used to show recommendations
}

export default function DesktopLocationSelector({
    value,
    onChange,
    placeholder,
    label,
    error,
    pickupLocation
}: DesktopLocationSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [googleResults, setGoogleResults] = useState<any[]>([]);
    const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteService = useRef<any>(null);

    // Initialize Google Places AutocompleteService
    useEffect(() => {
        if (typeof window !== 'undefined' && window.google && !autocompleteService.current) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
    }, []);

    // Handle clicks outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-scroll when opened to ensure dropdown is fully visible
    useEffect(() => {
        if (isOpen && containerRef.current) {
            setTimeout(() => {
                containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [isOpen]);

    // Search logic
    useEffect(() => {
        const query = searchQuery.toLowerCase().trim();
        
        if (query.length > 2 && autocompleteService.current) {
            setIsSearchingGoogle(true);
            autocompleteService.current.getPlacePredictions({
                input: query,
                componentRestrictions: { country: "sa" }
            }, (predictions: any[], status: any) => {
                setIsSearchingGoogle(false);
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setGoogleResults(predictions);
                } else {
                    setGoogleResults([]);
                }
            });
        } else {
            setGoogleResults([]);
        }
        setSelectedIndex(0);
    }, [searchQuery]);

    // Group locations
    const getGroupedLocations = () => {
        const query = searchQuery.toLowerCase().trim();
        let list = [...PREDEFINED_LOCATIONS];

        if (query) {
            list = list.filter(loc => 
                loc.name.toLowerCase().includes(query) || 
                loc.description.toLowerCase().includes(query) ||
                loc.category.toLowerCase().includes(query)
            );
        }

        const groups: { title: string; items: PredefinedLocation[] }[] = [];

        // 1. Search Results (if searching)
        if (query) {
            if (list.length > 0) {
                groups.push({ title: 'Matching Locations', items: list });
            }
            if (googleResults.length > 0) {
                const googleItems: PredefinedLocation[] = googleResults.map(p => ({
                    id: p.place_id,
                    name: p.structured_formatting.main_text,
                    description: p.structured_formatting.secondary_text || '',
                    category: 'Search Results',
                    icon: MapPin
                }));
                groups.push({ title: 'Google Places', items: googleItems });
            }
            return groups;
        }

        // 2. Recommendations (if dropoff and pickup is selected)
        if (pickupLocation) {
            const recommendedIds = getRecommendations(pickupLocation);
            if (recommendedIds.length > 0) {
                const recommendedItems = recommendedIds
                    .map(id => PREDEFINED_LOCATIONS.find(loc => loc.id === id))
                    .filter(Boolean) as PredefinedLocation[];
                groups.push({ title: 'Recommended Destinations', items: recommendedItems });
            }
        }

        // 3. Popular Locations
        const popular = list.filter(loc => loc.isPopular);
        if (popular.length > 0) {
            groups.push({ title: 'Popular Locations', items: popular });
        }

        // 4. Other Categories
        const categories: LocationCategory[] = ['Airports', 'Hotels', 'Train Stations', 'Holy Sites', 'Cities'];
        categories.forEach(cat => {
            const items = list.filter(loc => loc.category === cat && !loc.isPopular);
            if (items.length > 0) {
                groups.push({ title: cat, items });
            }
        });

        return groups;
    };

    const groupedLocations = getGroupedLocations();
    
    // Flatten list for keyboard navigation
    const flatItems = groupedLocations.flatMap(group => group.items);

    const handleSelect = (item: PredefinedLocation) => {
        onChange(item.name);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev < flatItems.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (flatItems[selectedIndex]) {
                    handleSelect(flatItems[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                break;
            case 'Tab':
                setIsOpen(false);
                break;
        }
    };

    // Keep selected item in view
    useEffect(() => {
        if (isOpen && flatItems.length > 0) {
            const selectedElement = document.getElementById(`location-item-${selectedIndex}`);
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex, isOpen]);

    return (
        <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
            {label && (
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    {label}
                </label>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className={`
                    w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 
                    border-2 rounded-2xl outline-none transition-all text-left flex items-center
                    ${isOpen ? 'border-secondary/50 ring-4 ring-secondary/10' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
                `}
            >
                <div className="absolute left-4 text-slate-400 group-focus-within:text-secondary transition-colors pointer-events-none">
                    <MapPin size={20} className={value ? 'text-secondary' : ''} />
                </div>
                
                <span className={`block truncate ${value ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400'}`}>
                    {value || placeholder}
                </span>
            </button>

            {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute z-50 top-[calc(100%+8px)] left-0 w-full md:w-[480px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
                    >
                        {/* Search Input */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 relative bg-slate-50/50 dark:bg-slate-800/50">
                            <Search size={18} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={pickupLocation ? "Search destination..." : "Search pickup location..."}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                            />
                            {isSearchingGoogle && (
                                <Loader2 size={16} className="absolute right-7 top-1/2 -translate-y-1/2 text-secondary animate-spin" />
                            )}
                        </div>

                        {/* Results List */}
                        <div className="max-h-[380px] overflow-y-auto custom-scrollbar p-2">
                            {flatItems.length === 0 && !isSearchingGoogle ? (
                                <div className="p-8 text-center text-slate-500">
                                    <MapPin size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    <p className="text-sm font-medium">No locations found</p>
                                    <p className="text-xs mt-1">Try searching for a different area</p>
                                </div>
                            ) : (
                                groupedLocations.map((group, groupIndex) => (
                                    <div key={groupIndex} className="mb-4 last:mb-0">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">
                                            {group.title}
                                        </h4>
                                        <div className="space-y-1">
                                            {group.items.map((item) => {
                                                const globalIndex = flatItems.indexOf(item);
                                                const isSelected = value === item.name;
                                                const isHighlighted = selectedIndex === globalIndex;
                                                
                                                const Icon = item.icon as any;

                                                return (
                                                    <button
                                                        key={item.id}
                                                        id={`location-item-${globalIndex}`}
                                                        onClick={() => handleSelect(item)}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={`
                                                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left
                                                            ${isHighlighted ? 'bg-secondary/5 dark:bg-secondary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                                                            ${isSelected ? 'bg-secondary/10 dark:bg-secondary/20' : ''}
                                                        `}
                                                    >
                                                        <div className={`
                                                            p-2 rounded-lg flex-shrink-0
                                                            ${isSelected || isHighlighted ? 'bg-white dark:bg-slate-800 text-secondary shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}
                                                        `}>
                                                            <Icon size={18} strokeWidth={isSelected ? 2 : 1.5} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm truncate ${isSelected ? 'font-bold text-secondary dark:text-secondary' : 'font-medium text-slate-900 dark:text-white'}`}>
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500 truncate">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <Check size={18} className="text-secondary flex-shrink-0 ml-2" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e2e8f0;
                    border-radius: 20px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                }
            `}</style>
        </div>
    );
}
