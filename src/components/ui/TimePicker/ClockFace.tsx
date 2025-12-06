'use client';

import React, { useRef, useState, useEffect } from 'react';
import ClockHand from './ClockHand';
import { getAngleFromTime, getTimeFromAngle } from './time-utils';

interface ClockFaceProps {
    type: 'hours' | 'minutes';
    value: number;
    onChange: (value: number) => void;
    onInteractEnd?: () => void;
}

export default function ClockFace({ type, value, onChange, onInteractEnd }: ClockFaceProps) {
    const faceRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const angle = getAngleFromTime(value, type);

    const calculateAngle = (clientX: number, clientY: number, isFinal: boolean = false) => {
        if (!faceRef.current) return;

        const rect = faceRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const pointerX = clientX;
        const pointerY = clientY;

        const rad = Math.atan2(pointerY - centerY, pointerX - centerX);
        let deg = rad * (180 / Math.PI) + 90;
        if (deg < 0) deg += 360;

        const newValue = getTimeFromAngle(deg, type);
        onChange(newValue);

        if (isFinal && onInteractEnd) {
            onInteractEnd();
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        // Prevent default to stop scrolling/selection
        e.preventDefault();
        setIsDragging(true);
        // Set capture so we track outside the box
        (e.target as Element).setPointerCapture(e.pointerId);
        calculateAngle(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        calculateAngle(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        (e.target as Element).releasePointerCapture(e.pointerId);
        calculateAngle(e.clientX, e.clientY, true);
    };

    const numbers = type === 'hours'
        ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    return (
        <div className="relative w-52 h-52 mx-auto my-2 select-none touch-none">
            {/* Clock Face Background */}
            <div
                ref={faceRef}
                className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner border border-slate-200 dark:border-slate-700 cursor-pointer"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp} // Optional safety
            >
                {/* Numbers */}
                {numbers.map((num, i) => {
                    const numAngle = ((i * (type === 'hours' ? 30 : 30)) - 90) * (Math.PI / 180);
                    const radius = 40;

                    const x = 50 + radius * Math.cos(numAngle);
                    const y = 50 + radius * Math.sin(numAngle);

                    const isSelected = num === value || (num === 0 && value === 60) || (num === 0 && value === 12 && type === 'hours');

                    return (
                        <div
                            key={num}
                            className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 pointer-events-none
                                ${isSelected
                                    ? 'text-white'
                                    : 'text-slate-600 dark:text-slate-400'
                                }`}
                            style={{
                                left: `${x}%`,
                                top: `${y}%`
                            }}
                        >
                            {num}
                        </div>
                    );
                })}

                <ClockHand angle={angle} type={type} />
            </div>
        </div>
    );
}
