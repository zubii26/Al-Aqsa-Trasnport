'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, Preload } from '@react-three/drei';
import { TextureLoader, BackSide, Texture } from 'three';
import { Maximize2, Rotate3d, Info } from 'lucide-react';
import * as THREE from 'three';

interface Interior360ViewerProps {
    imageUrl: string;
    title?: string;
}

function Sphere({ imageUrl }: { imageUrl: string }) {
    const texture = useLoader(TextureLoader, imageUrl);
    // Determine mapping based on image aspect ratio? Standard equirectangular is 2:1.
    // Three.js handles this well by default on spheres.
    // We render on the *back* side so we view it from inside.
    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={BackSide} toneMapped={false} />
        </mesh>
    );
}

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-3"></div>
                <div className="text-white font-mono text-sm tracking-widest">{progress.toFixed(0)}% LOADED</div>
            </div>
        </Html>
    );
}

export default function Interior360Viewer({ imageUrl, title = "360° Interior Experience" }: Interior360ViewerProps) {
    const [isInteracting, setIsInteracting] = useState(false);
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        // Hide hint after 5 seconds of interaction
        if (isInteracting) {
            const timer = setTimeout(() => setShowHint(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isInteracting]);

    return (
        <div className="relative w-full h-[500px] md:h-[600px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            {/* Header / Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-10 pointer-events-none">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium mb-2">
                        <Rotate3d className="w-4 h-4 text-[#d4af37]" />
                        <span>Interactive 3D View</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-md hidden md:block">{title}</h3>
                </div>
                <button className="pointer-events-auto p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl text-white transition-colors border border-white/10">
                    <Maximize2 className="w-5 h-5" />
                </button>
            </div>

            {/* Hint Overlay */}
            {showHint && !isInteracting && (
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                    <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-white/10 animate-pulse">
                        <div className="flex items-center gap-3 text-white font-medium">
                            <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
                                <span className="block w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                            </div>
                            <span>Drag to Explore</span>
                        </div>
                    </div>
                </div>
            )}

            <Canvas
                camera={{ fov: 75, position: [0, 0, 0.1] }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                onPointerDown={() => setIsInteracting(true)}
            >
                <Suspense fallback={<Loader />}>
                    <Sphere imageUrl={imageUrl} />
                    <Preload all />
                </Suspense>

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    enableDamping={true}
                    dampingFactor={0.05}
                    autoRotate={!isInteracting}
                    autoRotateSpeed={0.5}
                    rotateSpeed={-0.5} // Invert rotation for intuitive "drag scene" feel
                    zoomSpeed={1.2}
                    minDistance={0.1} // Prevent going outside sphere
                    maxDistance={100} // Prevent zooming too far out (though inside sphere it behaves differently)
                // We are actually inside the sphere, so zoom is FOV or position.
                // OrbitControls moves the camera. 
                />
            </Canvas>

            {/* Bottom Gradient for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

            <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
                <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Use Mouse/Touch to Rotate • Scroll to Zoom</p>
            </div>
        </div>
    );
}
