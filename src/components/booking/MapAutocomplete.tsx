'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import DesktopLocationSelector from './DesktopLocationSelector';

interface MapAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    icon?: React.ReactNode;
    className?: string;
    label?: string;
    error?: string;
    pickupLocation?: string; // Passed to desktop selector for smart recommendations
}

declare global {
    interface Window {
        google: any;
        initMapAutocomplete?: () => void;
    }
}

const MapAutocomplete: React.FC<MapAutocompleteProps> = ({
    value,
    onChange,
    placeholder,
    className = '',
    label,
    error,
    pickupLocation
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const autocompleteRef = useRef<any>(null);

    // Only used for the mobile native input
    useEffect(() => {
        if (!window.google) return;

        const initAutocomplete = () => {
            if (!inputRef.current) return;

            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                componentRestrictions: { country: "sa" },
                fields: ["address_components", "formatted_address", "geometry", "name"],
                types: ["establishment", "geocode"]
            });

            autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current.getPlace();
                if (place.formatted_address) {
                    onChange(place.formatted_address);
                } else if (place.name) {
                    onChange(place.name);
                }
            });
        };

        initAutocomplete();

        return () => {
            if (window.google?.maps?.event && autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, []);

    const handleClear = () => {
        onChange('');
        if (inputRef.current) inputRef.current.focus();
    };

    return (
        <div className={className}>
            {/* Desktop Selector (Hidden on Mobile) */}
            <div className="hidden md:block">
                <DesktopLocationSelector
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    label={label}
                    error={error}
                    pickupLocation={pickupLocation}
                />
            </div>

            {/* Mobile Native Selector (Hidden on Desktop) */}
            <div className="md:hidden flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors pointer-events-none">
                        <MapPin size={20} className={value ? 'text-secondary' : ''} />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={`
                            w-full pl-12 pr-10 py-4 bg-white dark:bg-slate-900 
                            border-2 border-slate-100 dark:border-slate-800 
                            rounded-2xl outline-none transition-all
                            focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10
                            text-slate-900 dark:text-white placeholder:text-slate-400
                            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
                        `}
                    />

                    {value && (
                        <button
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}

                    {isLoading && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2">
                            <Loader2 size={18} className="animate-spin text-secondary" />
                        </div>
                    )}
                </div>
                {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
            </div>
        </div>
    );
};

export default MapAutocomplete;
