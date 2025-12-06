'use client';

import React from 'react';

interface ClockHandProps {
    angle: number;
    type: 'hours' | 'minutes';
}

export default function ClockHand({ angle, type }: ClockHandProps) {
    return (
        <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            style={{
                transform: `rotate(${angle}deg)`,
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            {/* Center Axis Pole */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-amber-500 rounded-full shadow-md z-20" />

            {/* The Hand */}
            <div
                className={`absolute bottom-1/2 left-1/2 -translate-x-1/2 bg-amber-500 rounded-full origin-bottom
                    ${type === 'hours' ? 'h-[28%] w-1.5' : 'h-[38%] w-1'}`}
            >
                {/* Hand Gradient/Shine */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-white/20 to-white/40 rounded-full" />
            </div>

            {/* The Knob (Selector Circle) */}
            <div
                className={`absolute left-1/2 -translate-x-1/2 bg-amber-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg
                    ${type === 'hours' ? 'top-[22%] w-8 h-8' : 'top-[12%] w-6 h-6'}`}
            />
        </div>
    );
}
