'use client';

import React, { useState, useEffect, useRef } from 'react';
import { formatTime, setTimeDate } from './time-utils';
import { createPortal } from 'react-dom';
import ClockFace from './ClockFace';
import AmPmToggle from './AmPmToggle';
import { Clock, ChevronDown } from 'lucide-react';

interface ClockTimePickerProps {
    date: Date | null;
    onChange: (date: Date) => void;
    placeholderText?: string;
    className?: string;
    align?: 'left' | 'right';
}

export default function ClockTimePicker({
    date,
    onChange,
    placeholderText = "Select Time",
    className = "",
    align = 'left'
}: ClockTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'hours' | 'minutes'>('hours');

    // Internal state for the picker before confirming
    const [selectedDate, setSelectedDate] = useState<Date>(date || new Date());

    const containerRef = useRef<HTMLDivElement>(null);

    // Sync internal state when prop changes
    useEffect(() => {
        if (date) setSelectedDate(date);
    }, [date]);

    // Close on click outside - REMOVED (Handled by Portal Overlay)
    // The portal overlay covers the screen and handles outside clicks.
    // The previous logic failed because portal content is physically outside containerRef.

    const handleHourChange = (val: number) => {
        const currentHours = selectedDate.getHours();
        const isPM = currentHours >= 12;

        let newHours = val;
        // Handle 12 logic
        if (val === 12) newHours = 0;

        if (isPM && val === 12) newHours = 12; // 12 PM
        else if (!isPM && val === 12) newHours = 0; // 12 AM
        else if (isPM) newHours = val + 12; // 1 PM -> 13
        else newHours = val; // 1 AM -> 1

        setSelectedDate(setTimeDate(selectedDate, newHours, selectedDate.getMinutes()));
    };

    const handleMinuteChange = (val: number) => {
        setSelectedDate(setTimeDate(selectedDate, selectedDate.getHours(), val));
    };

    const handleAmPmChange = (ampm: 'AM' | 'PM') => {
        let hours = selectedDate.getHours();
        if (ampm === 'PM' && hours < 12) hours += 12;
        else if (ampm === 'AM' && hours >= 12) hours -= 12;
        setSelectedDate(setTimeDate(selectedDate, hours, selectedDate.getMinutes()));
    };

    const handleConfirm = () => {
        onChange(selectedDate);
        setIsOpen(false);
    };

    const displayHours = selectedDate.getHours() % 12 || 12;
    const displayMinutes = selectedDate.getMinutes();
    const displayAmPm = selectedDate.getHours() >= 12 ? 'PM' : 'AM';

    // Portal ref
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper for portal - render at root
    const Portal = ({ children }: { children: React.ReactNode }) => {
        if (!mounted || typeof document === 'undefined') return null;
        return createPortal(children, document.body);
    };

    // Calculate position manually since it's a portal now
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Default to bottom-left alignment
            let top = rect.bottom + window.scrollY + 8;
            let left = rect.left + window.scrollX;

            // Handle right alignment
            if (align === 'right') {
                left = rect.right + window.scrollX - 220; // 220 is width of popup
            }

            // Simple viewport check (if too close to bottom, flip up)
            if (rect.bottom + 300 > window.innerHeight + window.scrollY) {
                top = rect.top + window.scrollY - 310; // Flip up
            }

            // Mobile check - center if screen is small
            if (window.innerWidth < 400) {
                left = (window.innerWidth - 220) / 2 + window.scrollX;
            }

            setPosition({ top, left });
        }
    }, [isOpen, align]);

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger Input */}
            <div
                className={`flex items-center gap-2 cursor-pointer ${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {date ? (
                    <span className="text-slate-900 dark:text-white font-medium">
                        {formatTime(date)}
                    </span>
                ) : (
                    <span className="text-slate-400 dark:text-slate-500">
                        {placeholderText}
                    </span>
                )}
            </div>

            {/* Popup via Portal */}
            {isOpen && (
                <Portal>
                    {/* Overlay for clicking outside (needed for portal) */}
                    <div
                        className="fixed inset-0 z-[99999] bg-black/10 backdrop-blur-[1px]"
                        onClick={() => setIsOpen(false)}
                    />

                    <div
                        className="absolute z-[100000] w-[220px] p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                        style={{ top: position.top, left: position.left }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        {/* Header: Time Display */}
                        <div className="flex items-center justify-center gap-1 mb-2">
                            <button
                                type="button"
                                onClick={() => setView('hours')}
                                className={`text-2xl font-bold transition-colors ${view === 'hours' ? 'text-[#fbbf24]' : 'text-slate-400 dark:text-slate-600'}`}
                            >
                                {displayHours}
                            </button>
                            <span className="text-2xl font-bold text-slate-300 dark:text-slate-700">:</span>
                            <button
                                type="button"
                                onClick={() => setView('minutes')}
                                className={`text-2xl font-bold transition-colors ${view === 'minutes' ? 'text-[#fbbf24]' : 'text-slate-400 dark:text-slate-600'}`}
                            >
                                {displayMinutes.toString().padStart(2, '0')}
                            </button>
                            <div className="ml-1 flex flex-col text-[10px] font-bold text-slate-400">
                                <span>{displayAmPm}</span>
                            </div>
                        </div>

                        {/* Clock Face */}
                        <div className="relative h-[170px]">
                            {view === 'hours' ? (
                                <div className="absolute inset-0 animate-in fade-in duration-300">
                                    <ClockFace
                                        type="hours"
                                        value={displayHours}
                                        onChange={handleHourChange}
                                        onInteractEnd={() => setTimeout(() => setView('minutes'), 100)}
                                    />
                                </div>
                            ) : (
                                <div className="absolute inset-0 animate-in fade-in duration-300">
                                    <ClockFace
                                        type="minutes"
                                        value={displayMinutes}
                                        onChange={handleMinuteChange}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer actions */}
                        <div className="flex flex-col gap-2 mt-0">
                            <AmPmToggle value={displayAmPm} onChange={handleAmPmChange} />

                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="w-full py-1.5 bg-gradient-to-r from-[#fbbf24] to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 rounded-lg font-semibold shadow-lg shadow-amber-500/20 transition-all text-sm"
                            >
                                Set Time
                            </button>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
}
