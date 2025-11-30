import React from 'react';
import { Shield, Clock, Heart, Star } from 'lucide-react';

const values = [
    {
        icon: Shield,
        title: "Safety First",
        desc: "Your safety is our paramount priority. Our fleet is rigorously maintained and our drivers are professionally trained.",
        color: "blue"
    },
    {
        icon: Clock,
        title: "Reliability",
        desc: "We value your time. Punctuality is at the core of our operations, ensuring you never miss a prayer or ritual.",
        color: "amber"
    },
    {
        icon: Heart,
        title: "Hospitality",
        desc: "We serve with the warmth and generosity that befits the guests of Allah, treating every pilgrim like family.",
        color: "rose"
    },
    {
        icon: Star,
        title: "Spiritual Care",
        desc: "We understand the sanctity of your journey and strive to maintain an atmosphere of respect and tranquility.",
        color: "emerald"
    }
];

export default function CoreValues() {
    return (
        <section className="py-20 px-4 bg-gray-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Core Values</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        The principles that guide every journey we undertake.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((val, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
                            <div className={`w-12 h-12 rounded-lg bg-${val.color}-500/20 flex items-center justify-center mb-4 text-${val.color}-400 group-hover:scale-110 transition-transform`}>
                                <val.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {val.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
