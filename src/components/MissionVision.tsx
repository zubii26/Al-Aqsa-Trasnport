import React from 'react';
import { Target, Eye } from 'lucide-react';

export default function MissionVision() {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Mission Card */}
                <div className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target size={120} className="text-blue-600" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Target size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To provide safe, reliable, and spiritually aligned transport for every pilgrim. We aim to remove the stress of travel so you can devote your heart and mind to your worship.
                        </p>
                    </div>
                </div>

                {/* Vision Card */}
                <div className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Eye size={120} className="text-amber-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <Eye size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To be the most trusted Umrah transport provider in Saudi Arabia, recognized for our unwavering commitment to excellence, hospitality, and the spiritual well-being of our guests.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
