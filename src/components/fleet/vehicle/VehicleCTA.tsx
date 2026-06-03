import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, ShieldCheck, Clock, Award } from 'lucide-react';

interface VehicleCTAProps {
    title?: string;
    description?: string;
    whatsappLink: string;
    phoneNumber?: string;
}

export default function VehicleCTA({
    title = "Ready to Book Your Ride?",
    description = "Contact us via WhatsApp for instant booking and availability. Our support team is available 24/7 to assist you with your Umrah journey.",
    whatsappLink,
    phoneNumber
}: VehicleCTAProps) {
    return (
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6  text-white">
                        {title}
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                        {description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                        <Link 
                            href={whatsappLink} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] text-white hover:bg-[#128C7E] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-[#25D366]/30 hover:-translate-y-1"
                        >
                            Book via WhatsApp <ArrowRight size={20} />
                        </Link>
                        
                        {phoneNumber && (
                            <Link 
                                href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`} 
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-slate-900 border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all"
                            >
                                <Phone size={20} /> Call Us Direct
                            </Link>
                        )}
                    </div>
                    
                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">
                        <div className="flex flex-col items-center gap-3">
                            <ShieldCheck className="text-amber-500 w-10 h-10" />
                            <h4 className="font-bold text-lg">Licensed & Insured</h4>
                            <p className="text-sm text-slate-400">Authorized Umrah Transport</p>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Clock className="text-amber-500 w-10 h-10" />
                            <h4 className="font-bold text-lg">24/7 Availability</h4>
                            <p className="text-sm text-slate-400">Always ready for airport pickups</p>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Award className="text-amber-500 w-10 h-10" />
                            <h4 className="font-bold text-lg">10,000+ Pilgrims</h4>
                            <p className="text-sm text-slate-400">Trusted by families worldwide</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
