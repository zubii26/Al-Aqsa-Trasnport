'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ParticleBackground() {
    // Generate random particles only on client to avoid hydration mismatch
    const [particles, setParticles] = useState<{ id: number; top: string; left: string; duration: number }[]>([]);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const count = isMobile ? 8 : 20; // Significantly reduce particles on mobile

        const newParticles = Array.from({ length: count }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            duration: 5 + Math.random() * 10, // 5-15s duration
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
                    style={{ top: p.top, left: p.left }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
