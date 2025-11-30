import React from 'react';

export default function AboutHero() {
    return (
        <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1565552629477-ff145957811e?q=80&w=1920&auto=format&fit=crop')",
                    backgroundPosition: 'center 30%'
                }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    Serving Pilgrims with Sincerity and Excellence
                </h1>
                <p className="text-xl md:text-2xl font-light text-gray-200 drop-shadow-md">
                    Your journey of faith deserves comfort, safety, and care.
                </p>
            </div>
        </div>
    );
}
