import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface VehicleHeroProps {
    title: string;
    subtitle: string;
    bgImage: string;
    badge?: string;
    whatsappLink: string;
    bookingLink?: string;
    vehicleName?: string;
    quickSpecs: string[];
    breadcrumbs?: React.ReactNode;
}

export default function VehicleHero({
    title,
    subtitle,
    bgImage,
    badge,
    whatsappLink,
    bookingLink,
    vehicleName,
    quickSpecs,
    breadcrumbs
}: VehicleHeroProps) {
    return (
        <section className="relative min-h-[85vh] flex items-center pt-24 pb-16 overflow-hidden bg-slate-900">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={bgImage}
                    alt={title}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                    quality={100}
                />
                {/* Premium Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                {/* Subtle darkening for text readability with blend mode */}
                <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl">
                    {breadcrumbs && (
                        <div className="mb-3 relative z-20">
                            {breadcrumbs}
                        </div>
                    )}
                    {badge && (
                        <div className="inline-block bg-secondary text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-secondary/20">
                            {badge}
                        </div>
                    )}
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white  leading-tight drop-shadow-lg">
                        {title}
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed max-w-2xl drop-shadow-md">
                        {subtitle}
                    </p>

                    {/* Quick Specs */}
                    <div className="flex flex-wrap gap-4 mb-10">
                        {quickSpecs.map((spec, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white">
                                <CheckCircle2 className="text-amber-400" size={18} />
                                <span className="font-medium">{spec}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {bookingLink ? (
                            <>
                                <Link 
                                    href={bookingLink} 
                                    className="inline-flex items-center justify-center gap-2 bg-secondary text-white hover:bg-secondary/90 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1"
                                >
                                    Book {vehicleName || 'Now'} <ArrowRight strokeWidth={1.25} size={20} />
                                </Link>
                                <Link 
                                    href={whatsappLink} 
                                    target="_blank"
                                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-1"
                                >
                                    WhatsApp
                                </Link>
                            </>
                        ) : (
                            <Link 
                                href={whatsappLink} 
                                target="_blank"
                                className="inline-flex items-center justify-center gap-2 bg-secondary text-white hover:bg-secondary/90 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1"
                            >
                                Book via WhatsApp <ArrowRight strokeWidth={1.25} size={20} />
                            </Link>
                        )}
                        <a 
                            href="#gallery" 
                            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all"
                        >
                            View Gallery
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
