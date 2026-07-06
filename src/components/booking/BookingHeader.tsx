'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Lock, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const BookingHeader = () => {
    const { settings } = useSettings();

    return (
        <header className="sticky top-0 z-50 w-full h-[80px] bg-white border-b border-slate-200 shadow-sm flex items-center">
            <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex items-center justify-between">
                
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-12 h-12">
                        <Image
                            src="/logo.png" // assuming standard logo path
                            alt="Al Aqsa Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-xl font-bold text-amber-500 leading-none">Al Aqsa</span>
                        <span className="text-[10px] font-bold text-slate-800 tracking-widest uppercase">Transport</span>
                    </div>
                </Link>

                {/* Center: Secure Booking Badge */}
                <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                    <Lock size={16} className="text-emerald-600" />
                    <span className="text-sm font-bold text-slate-700">Secure Booking Process</span>
                </div>

                {/* Right: Support Contacts */}
                <div className="flex items-center gap-4">
                    {settings?.contact?.phone && (
                        <div className="hidden md:flex items-center gap-2 text-slate-600">
                            <Phone size={18} className="text-[#0f172a]" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">24/7 Support</span>
                                <span className="text-sm font-bold">{settings.contact.phone}</span>
                            </div>
                        </div>
                    )}
                    
                    {settings?.contact?.whatsapp && (
                        <a 
                            href={`https://wa.me/${settings.contact.whatsapp.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full transition-colors border border-emerald-200"
                        >
                            <MessageCircle size={18} />
                            <span className="text-sm font-bold hidden sm:block">WhatsApp</span>
                        </a>
                    )}
                </div>

            </div>
        </header>
    );
};

export default BookingHeader;
