'use client';

import React from 'react';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { trackConversion } from '@/lib/analytics';
import FadeIn from '@/components/common/FadeIn';

interface ContactGridProps {
    contactSettings: {
        phone: string;
        email: string;
        address: string;
    }
}

export default function ContactGrid({ contactSettings }: ContactGridProps) {
    const { phone, email, address } = contactSettings;
    const whatsapp = phone;

    const contactCards = [
        {
            icon: Phone,
            title: "Call Us 24/7 (اتصل بنا)",
            value: phone,
            sub: "Support in English, Arabic, Urdu",
            action: `tel:${phone.replace(/\s/g, '')}`,
            btnText: "Call Now",
            type: 'call'
        },
        {
            icon: MessageCircle,
            title: "WhatsApp Support (واتساب)",
            value: "Instant replies for bookings",
            sub: "Average response: < 5 mins",
            action: `https://wa.me/${whatsapp.replace(/\D/g, '')}`,
            btnText: "Chat on WhatsApp",
            type: 'whatsapp'
        },
        {
            icon: Mail,
            title: "Email Us (البريد الإلكتروني)",
            value: email,
            sub: "For quote requests & inquiries",
            action: `mailto:${email}`,
            btnText: "Send Email",
            type: 'email'
        },
        {
            icon: MapPin,
            title: "Visit Our Office (موقعنا)",
            value: address,
            sub: "Open Daily: 9 AM - 10 PM",
            action: "#map",
            btnText: "View Location",
            type: 'other'
        }
    ];

    return (
        <FadeIn direction="right" delay={0.2}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactCards.map((card, index) => (
                    <GlassCard key={index} className="p-6 hover:border-amber-400/50 transition-colors group">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform">
                                <card.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{card.title}</h3>
                                <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">{card.value}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{card.sub}</p>
                                <a
                                    href={card.action}
                                    target={card.action.startsWith('http') ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    onClick={() => trackConversion(card.type as any, 'contact_page')}
                                    className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400"
                                >
                                    {card.btnText} →
                                </a>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </FadeIn>
    );
}
