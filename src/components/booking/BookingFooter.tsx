'use client';

import Link from 'next/link';
import { Lock, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const BookingFooter = () => {
    const { settings } = useSettings();

    return (
        <footer className="w-full bg-[#0f172a] text-slate-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row justify-between items-center gap-8">
                
                {/* Left: Branding & Trust */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-2">
                        <Lock size={20} className="text-secondary" />
                        <span className="text-lg font-bold text-white">Secure Booking</span>
                    </div>
                    <span className="text-sm font-medium text-slate-400">Licensed Saudi Transport</span>
                    
                    <div className="flex items-center gap-6 mt-2">
                        {settings?.contact?.phone && (
                            <div className="flex items-center gap-2 text-sm font-bold text-white">
                                <Phone size={16} className="text-secondary" />
                                {settings.contact.phone}
                            </div>
                        )}
                        {settings?.contact?.whatsapp && (
                            <a 
                                href={`https://wa.me/${settings.contact.whatsapp.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-bold text-white hover:text-secondary transition-colors"
                            >
                                <MessageCircle size={16} className="text-secondary" />
                                WhatsApp Support
                            </a>
                        )}
                    </div>
                </div>

                {/* Right: Legal Links */}
                <div className="flex flex-col items-center md:items-end gap-4 text-sm font-medium">
                    <div className="flex items-center gap-4">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <span className="text-slate-700">•</span>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                        <span className="text-slate-700">•</span>
                        <Link href="/cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link>
                    </div>
                    <span className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} Al Aqsa Umrah Transport. All rights reserved.
                    </span>
                </div>

            </div>
        </footer>
    );
};

export default BookingFooter;
