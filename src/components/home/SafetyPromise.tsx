'use strict';
import React from 'react';
import { AlertTriangle, Clock, Phone, ShieldCheck, Zap } from 'lucide-react';

export default function SafetyPromise() {
    return (
        <section className="py-12 md:py-24 relative overflow-hidden bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-800 ring-1 ring-white/10">
                    {/* Decorative Background Effects */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] -mr-48 -mt-48 opacity-40 animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -ml-48 -mb-48 opacity-40"></div>
                    <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-[0.03] mix-blend-overlay"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 p-6 md:p-12 lg:p-16 items-center">

                        {/* Left Column: Content */}
                        <div className="order-2 lg:order-1 flex flex-col justify-center">
                            {/* Alert Banner */}
                            <div className="inline-flex items-start md:items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-100 text-sm md:text-base font-medium mb-8 max-w-xl group hover:bg-red-500/15 transition-colors cursor-default">
                                <AlertTriangle className="shrink-0 text-red-500 animate-pulse" size={20} />
                                <span className="leading-snug">
                                    <strong className="text-red-400">Guarantee:</strong> In the unlikely event of any issue, a replacement vehicle is routed to you instantly.
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-playfair leading-tight tracking-tight">
                                Our "Never Stranded" <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-sm">Promise</span>
                            </h2>

                            <p className="text-slate-300 text-base md:text-lg lg:text-xl mb-10 leading-relaxed max-w-xl">
                                We don't just hope for the best; we engineer for the unexpected.
                                Our <strong>Emergency Deployment Protocol</strong> ensures your spiritual journey remains uninterrupted, no matter what.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {/* Feature Card 1 */}
                                <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300">
                                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-3 text-slate-900 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                        <Clock size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg leading-none mb-1.5">60 Min Target</h4>
                                        <p className="text-slate-400 text-xs md:text-sm font-medium">Max wait for replacement</p>
                                    </div>
                                </div>

                                {/* Feature Card 2 */}
                                <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-3 text-white shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                                        <Phone size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg leading-none mb-1.5">24/7 Command</h4>
                                        <p className="text-slate-400 text-xs md:text-sm font-medium">Direct Ops Manager Line</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Visual SOP Interface */}
                        <div className="order-1 lg:order-2">
                            <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-slate-700 to-slate-800 shadow-2xl">
                                <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 relative overflow-hidden">

                                    {/* Status Badge */}
                                    <div className="flex justify-between items-center mb-8 border-b border-slate-700/50 pb-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="text-emerald-500" size={20} />
                                            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Protocol Status</span>
                                        </div>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-2 animate-pulse">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            Active & Ready
                                        </div>
                                    </div>

                                    <h4 className="text-white font-bold text-xl md:text-2xl mb-6 font-playfair">Standard Operating Procedure</h4>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                step: 1,
                                                title: "Secure & Comfort",
                                                desc: "Driver secures vehicle in safe zone. AC & Water provided immediately."
                                            },
                                            {
                                                step: 2,
                                                title: "Rapid Deployment",
                                                desc: "Nearest standby unit dispatched from Makkah/Madinah bases."
                                            },
                                            {
                                                step: 3,
                                                title: "Instant Refund",
                                                desc: "Full refund or credit processed for the inconvenience."
                                            }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                                                <div className="flex-shrink-0 relative">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500 font-bold font-mono group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300 z-10 relative shadow-lg">
                                                        {item.step}
                                                    </div>
                                                    {idx !== 2 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[2px] h-full bg-slate-800 group-hover:bg-slate-700 transition-colors -z-0"></div>}
                                                </div>
                                                <div>
                                                    <h5 className="text-white font-bold text-sm md:text-base mb-1 group-hover:text-amber-400 transition-colors">{item.title}</h5>
                                                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                                        <a href="/safety" className="text-xs md:text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 group">
                                            View Full Safety Documentation
                                            <Zap size={14} className="text-amber-500 group-hover:fill-amber-500 transition-all" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
