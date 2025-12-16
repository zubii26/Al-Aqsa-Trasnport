'use client';

import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { RouteWithPrices } from '@/services/routeService';
import { Plane } from 'lucide-react';

interface AirportStylizedCanvasProps {
    routes: RouteWithPrices[];
    activeRouteId: string | null;
    hoveredRouteId: string | null;
    onSelectRoute: (id: string) => void;
}

// Custom nodes for Airport Context
// KAIA (Jeddah Airport) is the Hub at top-left/center
const AIRPORT_NODES: Record<string, { x: number; y: number; label: string; icon?: string }> = {
    'Jeddah Airport': { x: 30, y: 30, label: 'Jeddah (KAIA)' },
    'Jeddah': { x: 30, y: 30, label: 'Jeddah (KAIA)' }, // Fallback
    'Makkah': { x: 70, y: 70, label: 'Makkah' },
    'Madinah': { x: 80, y: 20, label: 'Madinah' },
};

const getAirportCoords = (name: string) => {
    // Simple robust matching
    if (name.toLowerCase().includes('airport') || name.toLowerCase().includes('jeddah')) return AIRPORT_NODES['Jeddah Airport'];
    if (name.toLowerCase().includes('makkah')) return AIRPORT_NODES['Makkah'];
    if (name.toLowerCase().includes('madinah')) return AIRPORT_NODES['Madinah'];
    return { x: 50, y: 50, label: name };
};

export default function AirportStylizedCanvas({ routes, activeRouteId, hoveredRouteId, onSelectRoute }: AirportStylizedCanvasProps) {
    const constraintsRef = useRef(null);

    // Generate Flight Paths
    const routePaths = useMemo(() => {
        return routes.map(route => {
            const start = getAirportCoords(route.origin);
            const end = getAirportCoords(route.destination);

            // Curve calculation (Flight path style - wider arcs)
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            // Perpendicular offset for curve
            const offset = 20;
            const len = Math.sqrt(dx * dx + dy * dy);

            // Determine curve direction based on route
            const offsetX = -dy / len * offset;
            const offsetY = dx / len * offset;

            const cx = midX + offsetX;
            const cy = midY + offsetY;

            return {
                id: route.id,
                path: `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`,
                start,
                end
            };
        });
    }, [routes]);

    return (
        <div className="absolute inset-0 w-full h-full bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing" ref={constraintsRef}>
            {/* Grid / Radar Background Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            <motion.div
                className="w-full h-full"
                drag
                dragConstraints={constraintsRef}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                            <feComposite in="coloredBlur" in2="SourceGraphic" operator="over" />
                        </filter>
                    </defs>

                    {/* Routes */}
                    {routePaths.map(({ id, path, start, end }) => {
                        const isActive = id === activeRouteId;
                        const isHovered = id === hoveredRouteId;
                        const isRelevant = isActive || isHovered;

                        return (
                            <g key={id} onClick={() => onSelectRoute(id)} className="cursor-pointer">
                                {/* Invisible Hit Area */}
                                <path d={path} stroke="transparent" strokeWidth="8" fill="none" />

                                {/* Path Line */}
                                <motion.path
                                    d={path}
                                    fill="none"
                                    stroke={isRelevant ? "#f59e0b" : "#334155"} // Amber if active, Slate-700 if inactive
                                    strokeWidth={isRelevant ? "0.5" : "0.2"}
                                    strokeDasharray={isActive ? "none" : "1 1"} // Dashed for inactive "planned" routes
                                    animate={{
                                        strokeOpacity: isRelevant ? 1 : 0.4,
                                        filter: isActive ? "url(#glow-gold)" : "none"
                                    }}
                                />

                                {/* Moving Plane Icon */}
                                {isRelevant && (
                                    <motion.g>
                                        <switch>
                                            <foreignObject width="4" height="4" x="-2" y="-2">
                                                <div className="w-full h-full flex items-center justify-center text-amber-500">
                                                    <Plane size={8} className="rotate-90" />
                                                </div>
                                            </foreignObject>
                                        </switch>
                                        <animateMotion
                                            dur={isActive ? "4s" : "8s"}
                                            repeatCount="indefinite"
                                            path={path}
                                            rotate="auto" // Auto rotates the plane along the path
                                        />
                                    </motion.g>
                                )}
                            </g>
                        );
                    })}

                    {/* Nodes (Airports/Cities) */}
                    {/* Render unique nodes set */}
                    {Object.values(AIRPORT_NODES).map((node, i) => (
                        <g key={i}>
                            {/* Pulse */}
                            <motion.circle
                                cx={node.x} cy={node.y} r="3"
                                stroke="#f59e0b" strokeWidth="0.1" fill="none"
                                animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            {/* Dot */}
                            <circle cx={node.x} cy={node.y} r="1.5" className="fill-slate-900 stroke-amber-500" strokeWidth="0.3" />
                            {/* Label */}
                            <text
                                x={node.x} y={node.y + 4}
                                textAnchor="middle"
                                className="text-[3px] font-bold fill-white uppercase tracking-widest pointer-events-none"
                            >
                                {node.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* Map Controls Hint */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-xs text-slate-300 font-medium tracking-wide">Live Traffic</span>
            </div>
        </div>
    );
}
