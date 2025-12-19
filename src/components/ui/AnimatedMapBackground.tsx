'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedMapBackground() {
    const [mounted, setMounted] = useState(false);
    const [nodeCount, setNodeCount] = useState(15); // Default to desktop count

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            // Reduce complexity on mobile
            setNodeCount(window.innerWidth < 768 ? 8 : 15);
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!mounted) return null;

    // Generate random nodes based on current nodeCount
    const nodes = Array.from({ length: nodeCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
    }));

    // Generate connections
    const connections: { from: typeof nodes[0], to: typeof nodes[0], id: string }[] = [];
    nodes.forEach((node, i) => {
        // Connect to nearest 2 nodes to form a web
        const others = nodes.filter(n => n.id !== node.id);
        others.sort((a, b) => {
            const distA = Math.hypot(a.x - node.x, a.y - node.y);
            const distB = Math.hypot(b.x - node.x, b.y - node.y);
            return distA - distB;
        });

        others.slice(0, 2).forEach(target => {
            connections.push({
                from: node,
                to: target,
                id: `${node.id}-${target.id}`
            });
        });
    });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
            <svg className="w-full h-full text-amber-500" width="100%" height="100%">
                {/* Connections */}
                {connections.map((conn, i) => (
                    <motion.line
                        key={conn.id}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "linear"
                        }}
                        x1={`${conn.from.x}%`}
                        y1={`${conn.from.y}%`}
                        x2={`${conn.to.x}%`}
                        y2={`${conn.to.y}%`}
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <motion.circle
                        key={node.id}
                        cx={`${node.x}%`}
                        cy={`${node.y}%`}
                        r={node.size}
                        fill="currentColor"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </svg>

            {/* Gradient Overlay to fade edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950 opacity-80" />
        </div>
    );
}
