'use client';

import Link from 'next/link';
import { Lock, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const BookingFooter = () => {
    const { settings } = useSettings();

    return (
        <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-500 py-6 mt-auto">
            <div className="max-w-6xl mx-auto px-4 md:px-6 w-full flex flex-col items-center gap-4 text-xs font-medium">
                
                {/* Top Row: Trust & Contact */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Lock size={14} className="text-emerald-600" />
                        <span>Secure Booking</span>
                    </div>
                    <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-600 dark:text-slate-400">Licensed Saudi Transport</span>
                    
                    {settings?.contact?.phone && (
                        <>
                            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                            <div className="flex items-center gap-1.5">
                                <Phone size={14} className="text-secondary" />
                                <span className="text-slate-600 dark:text-slate-400">24/7 Support: {settings.contact.phone}</span>
                            </div>
                        </>
                    )}
                    
                    {settings?.contact?.whatsapp && (
                        <>
                            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                            <a 
                                href={`https://wa.me/${settings.contact.whatsapp.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
                            >
                                <MessageCircle size={14} className="text-emerald-500" />
                                <span>WhatsApp</span>
                            </a>
                        </>
                    )}
                </div>

                {/* Bottom Row: Legal */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                    <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms & Conditions</Link>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cancellation Policy</Link>
                </div>
                
                {/* Copyright */}
                <div className="text-[10px] text-slate-400">
                    &copy; {new Date().getFullYear()} Al Aqsa Umrah Transport. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default BookingFooter;
