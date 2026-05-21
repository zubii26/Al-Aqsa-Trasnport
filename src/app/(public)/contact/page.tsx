import React from 'react';
import styles from './page.module.css';
import { Clock, ShieldCheck, Globe, Star } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';
import ContactForm from '@/components/contact/ContactForm';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import GlassCard from '@/components/ui/GlassCard';
import { getSettings } from '@/lib/settings-storage';
import ContactGrid from '@/components/contact/ContactGrid';

export async function generateMetadata() {
    const title = "Contact Al Aqsa Umrah Transport | Book Your Ride Today";
    const description = "Contact Al Aqsa Umrah Transport for bookings. 24/7 support via WhatsApp & phone. Let us serve the transport needs of your spiritual journey.";

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
            "رقم تاكسي العمرة", "دعم نقل المعتمرين في السعودية", "شركة نقل في مكة", "توصيل الحرمين",
            "واتساب تاكسي مكة", "رقم سائق في مكة", "حجز موصلات الحرم"
        ],
        alternates: {
            canonical: 'https://www.alaqsaumrahtransport.com/contact',
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
    const phone1 = settings?.contact.phone || '+966 54 549 4921';
    const email = settings?.contact.email || 'info@alaqsaumrahtransport.com';
    const address = settings?.contact.address || 'Al Aziziyah, Makkah, Saudi Arabia';
    const whatsapp = phone1;

    // Contact Cards Data


    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TransportationService",
        "name": "Al Aqsa Umrah Transport",
        "alternateName": "الأقصى لنقل المعتمرين",
        "image": "https://www.alaqsaumrahtransport.com/images/logo.png",
        "@id": "https://www.alaqsaumrahtransport.com",
        "url": "https://www.alaqsaumrahtransport.com",
        "telephone": phone1,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Al Aziziyah",
            "addressLocality": "Makkah",
            "addressRegion": "Makkah Region",
            "postalCode": "24243",
            "addressCountry": "SA"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 21.4478336,
            "longitude": 39.8126588
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": phone1,
            "contactType": "customer service",
            "areaServed": "SA",
            "availableLanguage": ["en", "ar", "ur"]
        }
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do I book my Umrah transport?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can book directly using our online Booking Wizard, which calculates pricing in real-time, or by contacting our 24/7 customer support via WhatsApp. We will confirm your ride within minutes and share your driver details."
                }
            },
            {
                "@type": "Question",
                "name": "What is your flight delay policy?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We monitor all arrival flights at King Abdulaziz International Airport (Jeddah) and Prince Mohammad Bin Abdulaziz International Airport (Madinah). Your driver will wait for you even if your flight is delayed, at no extra cost."
                }
            },
            {
                "@type": "Question",
                "name": "Can I modify or cancel my booking?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can cancel or modify your booking up to 24 hours before your scheduled pickup time with no penalty. For last-minute changes, please contact us directly via WhatsApp or phone."
                }
            },
            {
                "@type": "Question",
                "name": "What types of vehicles are in your fleet?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our premium fleet includes luxury SUVs like the GMC Yukon AT4/Denali, spacious family minivans like the Hyundai Staria, comfortable multi-passenger vans like the Toyota Hiace, and larger buses like the Toyota Coaster. All vehicles are modern, air-conditioned, and Ministry-licensed."
                }
            },
            {
                "@type": "Question",
                "name": "Do you provide child seats?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! We prioritize the safety of your family. Infant, toddler, and booster seats are available upon request during the booking process."
                }
            },
            {
                "@type": "Question",
                "name": "Do your drivers speak English?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we have a dedicated team of professional, multilingual drivers who speak English, Arabic, and Urdu/Hindi, ensuring clear communication throughout your holy journey."
                }
            }
        ]
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <Hero
                title="Get in Touch | تواصل معنا"
                subtitle="Reliable Booking & 24/7 Support for Your Umrah Journey. Premium Transport Services from Makkah to Madinah."
                bgImage="/images/contact-hero.webp"
                breadcrumbs={<Breadcrumbs />}
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
                        <ContactGrid contactSettings={{
                            phone: phone1,
                            email,
                            address
                        }} />

                        {/* Map Placeholder */}
                        <FadeIn direction="up" delay={0.4}>
                            <GlassCard className="p-0 overflow-hidden min-h-[400px] relative flex items-center justify-center bg-slate-200 dark:bg-slate-800" id="map">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3713.526883410923!2d39.8126588!3d21.447833599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c21d9da1e4d599%3A0xb8a485c3949902cc!2sAl%20Aqsa%20Umrah%20Transport!5e0!3m2!1sen!2s"
                                    width="100%"
                                    height="100%"
                                    loading="lazy"
                                    className="w-full h-full min-h-[400px] border-0"
                                    title="Al Aqsa Umrah Transport Map"
                                    allowFullScreen
                                />
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

            {/* FAQ Section */}
            <FadeIn direction="up" delay={0.2}>
                <section className={styles.faqSection}>
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 font-display">
                                Frequently Asked Questions
                                <span className="block text-2xl font-arabic font-normal text-amber-500 mt-2">الأسئلة الشائعة</span>
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                Everything you need to know about our VIP Umrah transport services, booking process, and policies.
                            </p>
                        </div>

                        <div className={styles.faqGrid}>
                            {[
                                {
                                    qEn: "How do I book my Umrah transport?",
                                    qAr: "كيف يمكنني حجز مواصلات العمرة؟",
                                    aEn: "You can book directly using our online Booking Wizard, which calculates pricing in real-time, or by contacting our 24/7 customer support via WhatsApp. We will confirm your ride within minutes and share your driver details.",
                                    aAr: "يمكنك الحجز مباشرة عبر معالج الحجز الإلكتروني الذي يحتسب الأسعار في الوقت الفعلي، أو بالتواصل مع دعم العملاء المتاح 24/7 عبر الواتساب. سنؤكد رحلتك ونرسل تفاصيل السائق خلال دقائق."
                                },
                                {
                                    qEn: "What is your flight delay policy?",
                                    qAr: "ما هي سياستكم في حال تأخر الرحلة؟",
                                    aEn: "We monitor all arrival flights at King Abdulaziz International Airport (Jeddah) and Prince Mohammad Bin Abdulaziz International Airport (Madinah). Your driver will wait for you even if your flight is delayed, at no extra cost.",
                                    aAr: "نحن نتابع جميع الرحلات القادمة إلى مطار الملك عبد العزيز بجدة ومطار الأمير محمد بن عبد العزيز بالمدينة. سينتظرك السائق حتى لو تأخرت رحلتك دون أي تكاليف إضافية."
                                },
                                {
                                    qEn: "Can I modify or cancel my booking?",
                                    qAr: "هل يمكنني تعديل أو إلغاء الحجز؟",
                                    aEn: "Yes, you can cancel or modify your booking up to 24 hours before your scheduled pickup time with no penalty. For last-minute changes, please contact us directly via WhatsApp or phone.",
                                    aAr: "نعم، يمكنك إلغاء أو تعديل حجزك قبل 24 ساعة من موعد التوصيل المحدد دون أي رسوم. للتغييرات في اللحظة الأخيرة، يرجى التواصل معنا مباشرة عبر الواتساب أو الهاتف."
                                },
                                {
                                    qEn: "What types of vehicles are in your fleet?",
                                    qAr: "ما هي أنواع السيارات المتوفرة في أسطولكم؟",
                                    aEn: "Our premium fleet includes luxury SUVs like the GMC Yukon AT4/Denali, spacious family minivans like the Hyundai Staria, comfortable multi-passenger vans like the Toyota Hiace, and larger buses like the Toyota Coaster. All vehicles are modern, air-conditioned, and Ministry-licensed.",
                                    aAr: "يضم أسطولنا المتميز سيارات رياضية فاخرة مثل جمس يوكن AT4، وسيارات عائلية فسيحة مثل هيونداي ستاريا، وحافلات صغيرة مثل تويوتا هايس، وحافلات أكبر مثل تويوتا كوستر. جميع المركبات حديثة ومكيفة ومرخصة من وزارة النقل."
                                },
                                {
                                    qEn: "Do you provide child seats?",
                                    qAr: "هل توفرون مقاعد للأطفال؟",
                                    aEn: "Yes! We prioritize the safety of your family. Infant, toddler, and booster seats are available upon request during the booking process.",
                                    aAr: "نعم! نحن نولي الأولوية لسلامة عائلتك. تتوفر مقاعد الرضع والأطفال الصغار والمقاعد الداعمة عند الطلب أثناء عملية الحجز."
                                },
                                {
                                    qEn: "Do your drivers speak English?",
                                    qAr: "هل يتحدث السائقون اللغة الإنجليزية؟",
                                    aEn: "Yes, we have a dedicated team of professional, multilingual drivers who speak English, Arabic, and Urdu/Hindi, ensuring clear communication throughout your holy journey.",
                                    aAr: "نعم، لدينا فريق متخصص من السائقين المحترفين متعددي اللغات الذين يتحدثون الإنجليزية والعربية والأردية/الهندية، مما يضمن تواصلًا واضحًا طوال رحلتك الإيمانية."
                                }
                            ].map((faq, idx) => (
                                <div key={idx} className={styles.faqItem}>
                                    <h3 className={styles.faqQuestion}>
                                        <span className="block text-slate-800 dark:text-slate-100 mb-1">{faq.qEn}</span>
                                        <span className="block text-amber-500 font-arabic text-right text-base font-semibold">{faq.qAr}</span>
                                    </h3>
                                    <p className={styles.faqAnswer}>
                                        <span className="block text-slate-600 dark:text-slate-400 text-sm mb-3 leading-relaxed">{faq.aEn}</span>
                                        <span className="block text-slate-500 dark:text-slate-300 font-arabic text-right text-sm border-t border-slate-100 dark:border-slate-800/50 pt-2 leading-relaxed">{faq.aAr}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </FadeIn>
        </div>
    );
}
