'use strict';
import React from 'react';
import { AlertTriangle, Clock, Phone } from 'lucide-react';

export default function SafetyPromise() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-800">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-48 -mt-48 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -ml-48 -mb-48 opacity-50"></div>
                    <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-5"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 p-8 md:p-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-sm font-bold mb-8 border border-red-500/20">
                                Breakdowns are rare, but our preparedness is absolute. In the unlikely event of any vehicle issue,
                                we guarantee a replacement vehicle routed to your location immediately.
                            </div>


                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-playfair leading-tight">
                                Our "Never Stranded" <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Promise</span>
                            </h2>
                            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                                We don't just hope for the best; we plan for the worst so you don't have to.
                                In the extremely rare event of a mechanical issue, our <strong>Emergency Deployment Protocol</strong> activates instantly.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="bg-amber-500 rounded-xl p-3 text-slate-900 shrink-0">
                                        <Clock size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">60 Min Target</h4>
                                        <p className="text-slate-400 text-sm leading-snug">Maximum wait time for a replacement vehicle.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="bg-green-500 rounded-xl p-3 text-white shrink-0">
                                        <Phone size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">24/7 Command</h4>
                                        <p className="text-slate-400 text-sm leading-snug">Direct hotline to our operations manager.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <a href="/safety" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold transition-colors group">
                                    <span>Read Full Safety Protocol</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </a>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-2 border border-slate-700 shadow-2xl">
                            <div className="border border-dashed border-slate-600 rounded-xl p-8 h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                    S.O.P. Executed
                                </div>
                                <h4 className="text-white font-bold text-2xl mb-8 font-playfair">Standard Operating Procedure</h4>
                                <ul className="space-y-6">
                                    <li className="flex gap-4 group">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-amber-500 font-bold text-sm shrink-0 border border-slate-600 group-hover:border-amber-500 group-hover:text-white transition-colors">1</span>
                                        <span className="text-slate-300 group-hover:text-white transition-colors">Driver secures vehicle in safe zone and ensures passenger comfort (AC/Water).</span>
                                    </li>
                                    <li className="flex gap-4 group">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-amber-500 font-bold text-sm shrink-0 border border-slate-600 group-hover:border-amber-500 group-hover:text-white transition-colors">2</span>
                                        <span className="text-slate-300 group-hover:text-white transition-colors">Control room deploys nearest standby unit locally (Makkah/Madinah bases).</span>
                                    </li>
                                    <li className="flex gap-4 group">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-amber-500 font-bold text-sm shrink-0 border border-slate-600 group-hover:border-amber-500 group-hover:text-white transition-colors">3</span>
                                        <span className="text-slate-300 group-hover:text-white transition-colors"><strong>Full Refund</strong> or credit is processed immediately for the unparalleled inconvenience.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
