import React from 'react';

export default function TrustSection() {
    return (
        <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="mb-8">
                    <p className="text-3xl md:text-5xl font-arabic mb-6 leading-relaxed text-amber-400 drop-shadow-lg">
                        وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
                    </p>
                    <p className="text-xl md:text-2xl font-light italic text-blue-100">
                        &quot;And cooperate in righteousness and piety&quot;
                    </p>
                    <p className="text-sm text-blue-300 mt-2">— Surah Al-Ma&apos;idah (5:2)</p>
                </div>

                <div className="h-px w-24 bg-amber-400/50 mx-auto my-8"></div>

                <p className="text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
                    We believe that serving pilgrims is a form of worship. Our commitment goes beyond transportation; it is a covenant of trust to ensure your journey is blessed and burden-free.
                </p>
            </div>
        </section>
    );
}
