'use client';

import { motion } from 'framer-motion';

export function IntercityIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
            {/* Road Path */}
            <path
                d="M4 20C4 20 8 12 12 12C16 12 20 4 20 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-amber-500/30"
            />
            {/* Animated Path */}
            <motion.path
                d="M4 20C4 20 8 12 12 12C16 12 20 4 20 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-amber-500"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
            />
            {/* Markers */}
            <motion.circle cx="4" cy="20" r="2" className="fill-amber-600" />
            <motion.circle cx="20" cy="4" r="2" className="fill-amber-600" />

            {/* Moving Dot - Simplified Animation to ensure visibility */}
            <motion.circle
                r="3"
                className="fill-amber-400"
                initial={{ cx: 4, cy: 20 }}
                animate={{
                    cx: [4, 8, 12, 16, 20],
                    cy: [20, 14, 12, 6, 4]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5, times: [0, 0.4, 0.5, 0.8, 1] }}
            />
        </svg>
    );
}

export function AirportIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
            {/* Trajectory */}
            <motion.path
                d="M2 22C2 22 10 22 14 12C18 2 22 2 22 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-amber-500/50"
            />
            {/* Plane */}
            <motion.g
                initial={{ x: 0, y: 20, rotate: -45, opacity: 0 }}
                animate={{ x: 18, y: -4, rotate: 0, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <path
                    d="M12 2L14.5 9H20L16 13L17 19L11 15L5 19L6 13L2 9H7.5L12 2Z"
                    fill="currentColor"
                    className="text-amber-500"
                />
            </motion.g>
        </svg>
    );
}

export function HotelIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
            {/* Building Outline */}
            <path
                d="M6 22V4C6 2.9 6.9 2 8 2H16C17.1 2 18 2.9 18 4V22"
                stroke="currentColor"
                strokeWidth="2"
                className="text-amber-500"
            />
            {/* Windows - Staggered Light up */}
            {[0, 1, 2].map((row) => (
                <g key={row}>
                    {[0, 1].map((col) => (
                        <motion.rect
                            key={`${row}-${col}`}
                            x={9 + col * 4}
                            y={6 + row * 4}
                            width="2"
                            height="2"
                            className="fill-amber-400"
                            initial={{ opacity: 0.2 }}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: row * 0.3 + col * 0.1,
                            }}
                        />
                    ))}
                </g>
            ))}
            {/* Door */}
            <rect x="10" y="18" width="4" height="4" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
        </svg>
    );
}
