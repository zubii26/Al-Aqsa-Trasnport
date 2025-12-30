'use client';

import React from 'react';
import Link from 'next/link';
import FadeIn from '@/components/common/FadeIn';

export default function SEOContentSection() {
    return (
        <section className="py-12 md:py-16 bg-slate-50 dark:bg-[#0B1221] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6">
                <FadeIn>
                    <div className="max-w-4xl mx-auto space-y-10">

                        {/* Block 1: English - Core Service Offering */}
                        <div className="prose dark:prose-invert max-w-none text-center md:text-left space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-secondary">
                                Premium Umrah Transport & VIP Pilgrim Services
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Welcome to <strong>Al Aqsa Umrah Transport</strong>, the most trusted name for <strong>luxury Umrah transport</strong> in Saudi Arabia. We are dedicated to serving the guests of Allah with a blend of spiritual respect, professional reliability, and genuine hospitality. Whether you are performing Umrah, Hajj, or simply visiting the Holy Cities, our <strong>English-speaking drivers</strong> ensure your journey is safe, comfortable, and perfectly punctual.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our comprehensive services include seamless <strong><Link href="/services/jeddah-airport-transfer" className="text-primary hover:underline">Jeddah Airport transfers</Link></strong>, <strong><Link href="/services/madinah-airport-transfer" className="text-primary hover:underline">Madinah Airport pickups</Link></strong>, and reliable <strong><Link href="/services/makkah-madinah-taxi" className="text-primary hover:underline">Makkah to Madinah taxi</Link></strong> services. We specialize in intercity pilgrim travel, offering door-to-door convenience from your hotel in Makkah to your accommodation in Madinah, or directly to the Haram.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Travel in style with our <strong>VIP fleet</strong> comprising modern <strong><Link href="/fleet/gmc-yukon-at4" className="text-primary hover:underline">GMC Yukons</Link></strong>, <strong><Link href="/fleet/hyundai-staria" className="text-primary hover:underline">luxury vans</Link></strong> (H1/Staria), and business-class vehicles tailored for families, ladies, and groups. Our chauffeur-driven services guarantee a stress-free experience, allowing you to focus entirely on your worship. Book your <strong><Link href="/services/makkah-madinah-taxi" className="text-primary hover:underline">Haram shuttle</Link></strong> or airport transfer today and experience the difference of traveling with a company that values your peace of mind above all.
                            </p>
                        </div>

                        {/* Block 2: Arabic - Local Relevance & Keywords */}
                        <div className="prose dark:prose-invert max-w-none text-center md:text-right space-y-6" dir="rtl">
                            <h2 className="text-3xl md:text-4xl font-bold font-reem-kufi mb-6 text-secondary">
                                رفاهية وسكينة في رحاب الحرمين
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed font-amiri">
                                مرحبًا بكم في <strong>شركة الأقصى لنقل المعتمرين</strong>، حيث نجعل من رحلتكم تجربة استثنائية تليق بقدسية المكان. بصفتنا رواداً في مجال <strong>نقل المعتمرين</strong>، نتشرف بخدمة ضيوف الرحمن بأعلى درجات العناية والاحترافية. من لحظة وصولكم إلى أرض المملكة، نلتزم بتوفير تنقلات سلسة ومريحة تتيح لكم التفرغ الكامل للعبادة والسكينة.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed font-amiri">
                                أسطولنا من <strong>مواصلات العمرة VIP</strong> هو واحتكم المتنقلة. سواء كنتم بحاجة إلى سيارة خاصة من طراز جمس يوكن أو حافلة عائلية حديثة لرحلة <strong>نقل من مكة إلى المدينة</strong>، فإن مركباتنا توفر لكم أقصى درجات الراحة والنظافة. سائقونا المحترفون يتمتعون بخبرة واسعة وأخلاق عالية، واضعين سلامتكم وراحتكم في مقدمة أولوياتهم.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed font-amiri">
                                دعوا عناء التنقل علينا وركزوا قلوبكم على الطاعة. نفخر بكوننا الخيار الموثوق للعائلات التي تبحث عن الجودة والمصداقية في <strong>نقل المعتمرين</strong>. مع أسعارنا الشفافة وخدماتنا المتميزة، نحن شركاؤكم الأمناء في هذه الرحلة المباركة. احجزوا رحلتكم الآن واستمتعوا بتجربة سفر يملؤها اليسر والخشوع.
                            </p>
                        </div>

                        {/* Block 3: Combined - Why Choose Us / Routes */}
                        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border/50">
                            <div>
                                <h3 className="text-xl font-bold mb-3 font-playfair text-primary dark:text-white">
                                    Popular Umrah Routes
                                </h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        Jeddah Airport (KAIA) to Makkah Hotel
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        Makkah Hotel to Madinah Munawwarah
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        Madinah Airport to Masjid Nabawi
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        VIP Ziarah & Haram Shuttle Services
                                    </li>
                                </ul>
                            </div>

                            <div dir="rtl" className="text-right">
                                <h3 className="text-xl font-bold mb-3 font-reem-kufi text-primary dark:text-white">
                                    أهم مسارات النقل
                                </h3>
                                <ul className="space-y-2 text-muted-foreground font-amiri">
                                    <li className="flex items-center gap-2 justify-end">
                                        توصيل من مطار جدة إلى فنادق مكة
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                    </li>
                                    <li className="flex items-center gap-2 justify-end">
                                        نقل من مكة المكرمة إلى المدينة المنورة
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                    </li>
                                    <li className="flex items-center gap-2 justify-end">
                                        استقبال من مطار الأمير محمد بن عبدالعزيز
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                    </li>
                                    <li className="flex items-center gap-2 justify-end">
                                        جولات مزارات مكة والمدينة
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
