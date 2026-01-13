'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function FloatingHelpBtn() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8"
        >
            <a
                href={getWhatsAppLink("Salam Al Aqsa, I need help with booking.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white p-3 md:px-5 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
                <div className="relative">
                    <MessageCircle size={28} className="fill-white/20" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-green-500"></span>
                    </span>
                </div>
                <span className="font-bold text-sm hidden md:block group-hover:block pr-1">
                    Need Help?
                </span>
            </a>
        </motion.div>
    );
}
