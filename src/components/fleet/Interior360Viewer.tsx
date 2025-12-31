'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Wifi, Info, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface Interior360ViewerProps {
    imageSrc: string;
    title?: string;
    description?: string;
}

export default function Interior360Viewer({
    imageSrc,
    title = "Luxury Interior",
    description = "Experience the premium cabin comfort"
}: Interior360ViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [backgroundPositionX, setBackgroundPositionX] = useState(50); // Percent
    const [isLoaded, setIsLoaded] = useState(false);
    const [showHint, setShowHint] = useState(true);

    // Speed of rotation
    const SENSITIVITY = 0.1;

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setShowHint(false);
        // Change cursor
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setShowHint(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        // Update background position based on delta
        // We move position inversely to drag for natural "camera" feel, or directly for "object" feel.
        // For interior pano, dragging left usually moves view right (so background moves left).

        setBackgroundPositionX(prev => prev - (deltaX * SENSITIVITY));
        setStartX(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        setBackgroundPositionX(prev => prev - (deltaX * SENSITIVITY * 2)); // Higher sensitivity for touch
        setStartX(e.touches[0].clientX);
    };

    const stopDragging = () => {
        setIsDragging(false);
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    // Auto-rotate slowly when not interacting
    useEffect(() => {
        let animationId: number;

        const autoRotate = () => {
            if (!isDragging && showHint) {
                setBackgroundPositionX(prev => prev + 0.02); // Very slow drift
                animationId = requestAnimationFrame(autoRotate);
            }
        };

        const timeoutId = setTimeout(() => {
            animationId = requestAnimationFrame(autoRotate);
        }, 2000);

        return () => {
            cancelAnimationFrame(animationId);
            clearTimeout(timeoutId);
        };
    }, [isDragging, showHint]);

    // Preload image
    useEffect(() => {
        const img = new window.Image();
        img.src = imageSrc;
        img.onload = () => setIsLoaded(true);
    }, [imageSrc]);

    return (
        <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
            {/* Aspect Ratio Container */}
            <div
                ref={containerRef}
                className="relative w-full aspect-[16/9] md:aspect-[21/9] cursor-grab active:cursor-grabbing bg-slate-900 overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={stopDragging}
            >
                {/* 360 Image Layer */}
                <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        backgroundImage: `url('${imageSrc}')`,
                        backgroundPosition: `${backgroundPositionX}% center`,
                        // We use a very large width to simulate the panorama strip.
                        // Ideally strictly equirectangular projection needs WebGL, but for "Premium Look" simple wider scrolling works surprisingly well if the image is wide enough.
                        // We'll trust the user uploaded a wide pano or use `background-size: cover` isn't enough.
                        // We need `background-size: auto 100%` or similar to stretch horizontally.
                        backgroundSize: 'auto 110%', // Slight zoom to avoid edges
                        backgroundRepeat: 'repeat-x'
                    }}
                />

                {/* Loading State */}
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Lighting / Reflection Overlay for Realism */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

                {/* Controls / Hints */}
                <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${showHint ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
                        <div className="relative w-4 h-4">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-slate-900"></span>
                        </div>
                        <span className="text-white text-sm font-bold tracking-wide">Drag to Explore Interior</span>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none flex justify-between items-end">
                    <div>
                        <h3 className="text-white font-bold text-xl font-playfair">{title}</h3>
                        <p className="text-slate-300 text-sm">{description}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                            <Wifi size={14} /> WiFi Onboard
                        </div>
                        <button className="p-2 text-white/50 hover:text-white transition-colors">
                            <Info size={20} />
                        </button>
                        <button className="p-2 text-white/50 hover:text-white transition-colors">
                            <Maximize2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Compass / Navigation Hint (Static for visual flair) */}
                <div className="absolute top-6 left-6 pointer-events-none">
                    <span className="text-[10px] font-mono text-amber-500 tracking-[0.2em] uppercase border border-amber-500/30 px-2 py-1 rounded">360° LIVE VIEW</span>
                </div>
            </div>
        </div>
    );
}
