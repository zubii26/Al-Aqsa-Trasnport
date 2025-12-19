import React from 'react';

interface AnimatedCarProps {
    className?: string;
}

const AnimatedCar: React.FC<AnimatedCarProps> = ({ className }) => {
    return (
        <div className={`relative ${className}`}>
            <svg
                viewBox="0 0 200 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-md"
            >
                {/* Sleek Van Silhouette */}
                <path
                    d="M10,55 L20,35 Q25,25 40,22 L140,22 Q160,22 170,35 L190,55 L190,65 L10,65 Z"
                    fill="#0a192f"
                    stroke="#d4af37"
                    strokeWidth="1.5"
                />

                {/* Windows - Gradient for depth */}
                <path
                    d="M45,28 L135,28 L160,35 L165,45 L135,45 L135,28 M130,28 L130,45 L50,45 L40,35 L45,28"
                    fill="#1e293b"
                    opacity="0.8"
                />

                {/* Headlight Beam (Subtle) */}
                <path
                    d="M190,58 L240,65 L190,72"
                    fill="url(#beamGradient)"
                    opacity="0.4"
                />
                <defs>
                    <linearGradient id="beamGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Wheels - Simplified sleek discs */}
                <g className="animate-[spin_0.8s_linear_infinite] origin-[45px_65px]">
                    <circle cx="45" cy="65" r="11" fill="#0f172a" stroke="#d4af37" strokeWidth="2" />
                    <circle cx="45" cy="65" r="4" fill="#d4af37" />
                    {/* Spoke */}
                    <rect x="44" y="54" width="2" height="22" fill="#d4af37" rx="1" />
                    <rect x="34" y="64" width="22" height="2" fill="#d4af37" rx="1" />
                </g>

                <g className="animate-[spin_0.8s_linear_infinite] origin-[155px_65px]">
                    <circle cx="155" cy="65" r="11" fill="#0f172a" stroke="#d4af37" strokeWidth="2" />
                    <circle cx="155" cy="65" r="4" fill="#d4af37" />
                    {/* Spoke */}
                    <rect x="154" y="54" width="2" height="22" fill="#d4af37" rx="1" />
                    <rect x="144" y="64" width="22" height="2" fill="#d4af37" rx="1" />
                </g>
            </svg>
        </div>
    );
};

export default AnimatedCar;
