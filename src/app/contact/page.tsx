import React from 'react';
import styles from './page.module.css';
import { Mail, MapPin, Phone, MessageCircle, Clock, ShieldCheck, Globe, Star } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';
import ContactForm from '@/components/contact/ContactForm';
import Hero from '@/components/common/Hero';
import GlassCard from '@/components/ui/GlassCard';
import { getSettings } from '@/lib/settings-storage';

export async function generateMetadata() {
    const title = "Contact Al Aqsa Umrah Transport | Book Taxi Makkah to Madinah | اتصل بنا";
    const description = "Contact Al Aqsa Umrah Transport for reliable VIP taxi services in Saudi Arabia. Book Jeddah airport pickup, Makkah to Madinah transport, and Ziarah tours. 24/7 Support. تواصل مع أفضل شركة نقل معتمرين";

    return {
        title: title,
        description: description,
        keywords: [
            // English Keywords
            "Umrah transport contact", "book Umrah transport", "Jeddah airport pickup contact",
            "Makkah to Madinah transport booking", "Umrah taxi service contact", "Saudi Arabia pilgrim transport support",
            "Al Aqsa Transport Booking", "VIP Umrah Taxi",
            // Arabic Keywords
            "اتصال نقل العمرة", "حجز نقل العمرة", "تواصل استقبال مطار جدة", "حجز نقل مكة المدينة",
            "رقم تاكسي العمرة", "دعم نقل المعتمرين في السعودية", "شركة نقل في مكة", "توصيل الحرمين"
        ],
        alternates: {
            canonical: 'https://alaqsaumrahtransport.com/contact',
        },
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            locale: 'en_US', // Primary, but content supports bilingual context
        }
    };
}

export default async function ContactPage() {
    const settings = await getSettings();

    // Fallback values
    const phone1 = settings?.contact.phone || '+966 50 000 0000';
    const email = settings?.contact.email || 'info@alaqsa-transport.com';
    const address = settings?.contact.address || 'Al Aziziyah, Makkah, Saudi Arabia';
    const whatsapp = phone1;

    // Contact Cards Data
    const contactCards = [
        {
            icon: Phone,
            title: "Call Us 24/7 (اتصل بنا)",
            value: phone1,
            sub: "Support in English, Arabic, Urdu",
            action: `tel:${phone1.replace(/\s/g, '')}`,
            btnText: "Call Now"
        },
        {
            icon: MessageCircle,
            title: "WhatsApp Support (واتساب)",
            value: "Instant replies for bookings",
            sub: "Average response: < 5 mins",
            action: `https://wa.me/${whatsapp.replace(/\D/g, '')}`,
            btnText: "Chat on WhatsApp"
        },
        {
            icon: Mail,
            title: "Email Us (البريد الإلكتروني)",
            value: email,
            sub: "For quote requests & inquiries",
            action: `mailto:${email}`,
            btnText: "Send Email"
        },
        {
            icon: MapPin,
            title: "Visit Our Office (موقعنا)",
            value: address,
            sub: "Open Daily: 9 AM - 10 PM",
            action: "#map",
            btnText: "View Location"
        }
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-950 pb-20">
            <Hero
                title="Get in Touch | تواصل معنا"
                subtitle="Reliable Booking & 24/7 Support for Your Umrah Journey. Premium Transport Services from Makkah to Madinah."
                bgImage="/images/contact-hero.jpg"
            />

            <div className="container mx-auto px-4 -mt-16 relative z-10">
                {/* Intro Trust Strip */}
                <FadeIn direction="up" delay={0.1}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[
                            { icon: Clock, text: "24/7 Service", sub: "خدمة على مدار الساعة" },
                            { icon: ShieldCheck, text: "Licensed & Safe", sub: "مرخص ومؤمن" },
                            { icon: Globe, text: "Multilingual", sub: "دعم متعدد اللغات" },
                            { icon: Star, text: "Top Rated", sub: "أعلى تقييم" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 text-center transform hover:-translate-y-1 transition-transform duration-300">
                                <item.icon className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">{item.text}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-arabic">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Contact Info Column */}
                    <div className="lg:col-span-5 space-y-6">
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

                        {/* Map Placeholder */}
                        <FadeIn direction="up" delay={0.4}>
                            <GlassCard className="p-0 overflow-hidden min-h-[250px] relative flex items-center justify-center bg-slate-200 dark:bg-slate-800" id="map">
                                {/* Use an actual iframe here if you have one, or keep placeholder */}
                                <div className="text-center p-6">
                                    <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                    <p className="text-slate-500 font-medium">Interactive Map Integration</p>
                                    <p className="text-sm text-slate-400">Head Office: Makkah Al Mukarramah</p>
                                </div>
                            </GlassCard>
                        </FadeIn>
                    </div>

                    {/* Contact Form Column */}
                    <div className="lg:col-span-7">
                        <FadeIn direction="left" delay={0.3}>
                            <GlassCard className="p-8 md:p-10 border-t-4 border-t-amber-500">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-display">
                                        Send Us a Message
                                        <span className="block text-xl font-arabic font-normal text-slate-500 mt-1">أرسل لنا رسالة</span>
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        Need a custom quote for your Umrah group? Have questions about our GMC Yukon fleet?
                                        Fill out the form below and our team will get back to you within minutes.
                                    </p>
                                </div>
                                <ContactForm />
                            </GlassCard>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
