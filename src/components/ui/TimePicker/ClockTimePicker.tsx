'use client';

import React, { useState, useEffect, useRef } from 'react';
import { formatTime, setTimeDate } from './time-utils';
import ClockFace from './ClockFace';
import AmPmToggle from './AmPmToggle';
import { Clock, ChevronDown } from 'lucide-react';

interface ClockTimePickerProps {
    date: Date | null;
    onChange: (date: Date) => void;
    placeholderText?: string;
    className?: string;
}

export default function ClockTimePicker({ date, onChange, placeholderText = "Select Time", className = "" }: ClockTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'hours' | 'minutes'>('hours');

    // Internal state for the picker before confirming
    const [selectedDate, setSelectedDate] = useState<Date>(date || new Date());

    const containerRef = useRef<HTMLDivElement>(null);

    // Sync internal state when prop changes
    useEffect(() => {
        if (date) setSelectedDate(date);
    }, [date]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

            {/* Popup */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-2 z-50 w-[260px] p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                >
                    {/* Header: Time Display */}
                    <div className="flex items-center justify-center gap-1 mb-2">
                        <button
                            type="button"
                            onClick={() => setView('hours')}
                            className={`text-3xl font-bold transition-colors ${view === 'hours' ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'}`}
                        >
                            {displayHours}
                        </button>
                        <span className="text-3xl font-bold text-slate-300 dark:text-slate-700">:</span>
                        <button
                            type="button"
                            onClick={() => setView('minutes')}
                            className={`text-3xl font-bold transition-colors ${view === 'minutes' ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'}`}
                        >
                            {displayMinutes.toString().padStart(2, '0')}
                        </button>
                        <div className="ml-1 flex flex-col text-[10px] font-bold text-slate-400">
                            <span>{displayAmPm}</span>
                        </div>
                    </div>

                    {/* Clock Face */}
                    <div className="relative h-[220px]">
                        {view === 'hours' ? (
                            <div className="absolute inset-0 animate-in fade-in duration-300">
                                <ClockFace
                                    type="hours"
                                    value={displayHours}
                                    onChange={handleHourChange}
                                    onInteractEnd={() => setTimeout(() => setView('minutes'), 300)}
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
                            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold shadow-lg shadow-amber-500/20 transition-all text-sm"
                        >
                            Set Time
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
