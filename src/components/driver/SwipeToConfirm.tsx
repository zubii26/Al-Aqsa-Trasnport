'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Check } from 'lucide-react';

interface SwipeToConfirmProps {
    onConfirm: () => void;
    label?: string;
    startLabel?: string;
    completeLabel?: string;
    isUpdating?: boolean;
    colorClass?: string;
}

export default function SwipeToConfirm({
    onConfirm,
    label = 'Slide to Confirm',
    startLabel = 'Slide',
    completeLabel = 'Completed',
    isUpdating = false,
    colorClass = 'bg-amber-500'
}: SwipeToConfirmProps) {
    const [sliderWidth, setSliderWidth] = useState(0);
    const [swipeWidth, setSwipeWidth] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);

    useEffect(() => {
        if (sliderRef.current) {
            setSliderWidth(sliderRef.current.clientWidth);
        }
    }, []);

    const handleStart = (clientX: number) => {
        if (isUpdating || isConfirmed) return;
        isDragging.current = true;
        startX.current = clientX;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging.current || isUpdating || isConfirmed) return;
        const currentX = clientX;
        const diff = currentX - startX.current;
        const maxSwipe = sliderWidth - 56; // 56px is roughly the handle width + padding

        if (diff > 0 && diff <= maxSwipe) {
            setSwipeWidth(diff);
        } else if (diff > maxSwipe) {
            setSwipeWidth(maxSwipe);
        }
    };

    const handleEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const maxSwipe = sliderWidth - 56;

        if (swipeWidth >= maxSwipe * 0.9) { // Confirm if dragged 90%
            setSwipeWidth(maxSwipe);
            setIsConfirmed(true);
            onConfirm();
        } else {
            setSwipeWidth(0); // Snap back
        }
    };

    return (
        <div
            ref={sliderRef}
            className={`relative w-full h-16 rounded-full bg-slate-100 overflow-hidden shadow-inner select-none touch-none ${colorClass.replace('bg-', 'bg-opacity-20 ')}`}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
        >
            {/* Background Text */}
            <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold uppercase tracking-wider transition-opacity duration-300 ${swipeWidth > 50 ? 'opacity-0' : 'opacity-100'} ${colorClass.replace('bg-', 'text-')}`}>
                {isUpdating ? 'Updating...' : label}
            </div>

            {/* Swipe Track Filling */}
            <div
                className={`absolute left-0 top-0 bottom-0 ${colorClass} transition-none opacity-20`}
                style={{ width: swipeWidth + 56 }}
            />

            {/* Handle */}
            <div
                className={`absolute top-1 bottom-1 left-1 w-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md ${isConfirmed ? 'bg-green-500' : 'bg-white'
                    }`}
                style={{ transform: `translateX(${swipeWidth}px)` }}
            >
                {isConfirmed || isUpdating ? (
                    <div className="animate-spin" /> // Simple feedback, ideally check icon if confirmed
                ) : (
                    <ChevronRight size={24} className={colorClass.replace('bg-', 'text-')} />
                )}
                {isConfirmed && !isUpdating && <Check size={24} className="text-white absolute" />}
                {isUpdating && <div className="absolute border-2 border-white/30 border-t-white rounded-full w-6 h-6 animate-spin" />}
            </div>
        </div>
    );
}
