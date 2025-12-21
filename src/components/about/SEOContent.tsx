'use client';

import React from 'react';
import Link from 'next/link';
import styles from './SEOContent.module.css';
import { MapPin, Plane, Star, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function SEOContent() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <FadeIn>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Comprehensive Umrah Transport Services</h2>
                        <p className={styles.subtitle}>
                            Your trusted partner for seamless travel between Jeddah, Makkah, and Madinah. We specialize in providing comfort, reliability, and spiritual peace of mind.
                        </p>
                    </div>
                </FadeIn>

                <div className="max-w-4xl mx-auto space-y-10 mb-16">
                    {/* English Paragraphs */}
                    <FadeIn delay={0.1}>
                        <div className="prose dark:prose-invert max-w-none text-center md:text-left">
                            <h3 className="text-2xl font-bold font-playfair mb-4 text-secondary">Al Aqsa Business Profile & Pilgrim Services</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                At <strong>Al Aqsa Umrah Transport</strong>, we are honored to be your trusted partner for <strong>pilgrim transportation in Saudi Arabia</strong>. Our mission is to provide seamless, comfortable, and reliable <strong>Umrah transport services</strong> that allow you to focus entirely on your spiritual journey. From the moment you arrive, we ensure a smooth experience with our premium <strong>Jeddah Airport transfers</strong> and <strong>Madinah Airport pickups</strong>, guiding you safely to the holy cities. Whether you are performing Umrah, Hajj, or embarking on a spiritual visit, our professional team is dedicated to serving the Guests of Allah with the highest standards of hospitality.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We take pride in our diverse fleet designed to cater to every need, offering <strong>private Umrah transfers</strong> for individuals, families, and large groups. Experience the comfort of our <strong>VIP Umrah travel</strong> options, featuring luxury GMC Yukons and spacious buses. Our expert drivers are well-versed in the routes for <strong>Makkah to Madinah transport</strong> and comprehensive <strong>Ziyarat transport</strong> tours, ensuring you visit every sacred site with ease and peace of mind. Choose Al Aqsa for a journey defined by safety, punctuality, and unwavering respect.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Arabic Paragraphs */}
                    <FadeIn delay={0.2}>
                        <div className="prose dark:prose-invert max-w-none text-center md:text-right" dir="rtl">
                            <h3 className="text-2xl font-bold font-reem-kufi mb-4 text-secondary">خدمات نقل المعتمرين الموثوقة</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed font-amiri mb-6">
                                في <strong>شركة الأقصى لنقل المعتمرين</strong>، نتشرف بأن نكون خياركم الأول والموثوق لخدمات <strong>نقل المعتمرين في السعودية</strong>. مهمتنا هي توفير تجربة تنقل مريحة وآمنة تتيح لكم التفرغ الكامل لأداء مناسككم وعباداتكم. من لحظة وصولكم، نضمن لكم استقبالاً مميزاً عبر خدمات <strong>التوصيل من مطار جدة</strong> ومطار المدينة المنورة، لنقلكم بكل يسر وسهولة إلى رحاب الحرمين الشريفين. سواء كنتم تؤدون العمرة أو الحج، فإن فريقنا المحترف ملتزم بتقديم أرقى مستويات <strong>خدمة ضيوف الرحمن</strong> مع الالتزام التام بقيم الضيافة الإسلامية الأصيلة.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed font-amiri">
                                نحن نفخر بأسطولنا المتنوع الذي يلبي كافة احتياجاتكم، حيث نقدم <strong>نقل خاص للمعتمرين</strong>، العائلات، والمجموعات الكبيرة. استمتعوا بتجربة سفر فاخرة مع سياراتنا الحديثة التي تشمل الجمس يوكن والحافلات الواسعة والمجهزة لراحتكم. سائقونا ذوو الخبرة العالية على دراية تامة بجميع مسارات <strong>النقل من مكة إلى المدينة</strong> وجولات <strong>رحلات الزيارات</strong> للمعالم المقدسة، مما يضمن لكم زيارة كل موقع بقلب مطمئن. اختاروا الأقصى لرحلة عنوانها الأمان، الدقة في المواعيد، والراحة التامة.
                            </p>
                        </div>
                    </FadeIn>
                </div>

                <div className={styles.grid}>
                    <FadeIn delay={0.1}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <Plane className="text-[#d4af37]" size={24} />
                                Jeddah Airport to Makkah Taxi
                            </h3>
                            <p className={styles.cardText}>
                                Start your spiritual journey with ease. Our <Link href="/services/airport-transfers" className={styles.highlight + " hover:underline"}>Jeddah Airport to Makkah taxi service</Link> ensures a smooth pickup from King Abdulaziz International Airport (KAIA). We track your flight to guarantee timely arrival, offering a stress-free transfer directly to <Link href="/services/intercity-transfer" className="text-primary hover:underline">your hotel in Makkah</Link>.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <MapPin className="text-[#d4af37]" size={24} />
                                Makkah to Madinah Taxi
                            </h3>
                            <p className={styles.cardText}>
                                Travel between the two Holy Cities in ultimate comfort. Our <Link href="/services/intercity-transfer" className={styles.highlight + " hover:underline"}>Makkah to Madinah taxi</Link> service offers a scenic and relaxing drive. Choose from our <Link href="/fleet" className="text-primary hover:underline">fleet of GMC Yukons</Link>, Hyundai Starias, or Toyota Hiaces for a private and convenient inter-city transfer.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <Star className="text-[#d4af37]" size={24} />
                                VIP & Luxury Transport
                            </h3>
                            <p className={styles.cardText}>
                                Experience the pinnacle of travel with our <Link href="/fleet" className={styles.highlight + " hover:underline"}>VIP Umrah transport</Link>. We offer premium vehicles like the GMC Yukon XL and Lexus ES, driven by professional chauffeurs who understand the needs of VIP pilgrims. Perfect for those seeking privacy and luxury.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <Clock className="text-[#d4af37]" size={24} />
                                Ziyarat Tours in Makkah & Madinah
                            </h3>
                            <p className={styles.cardText}>
                                Explore the historical sites of Islam. We provide comprehensive <span className={styles.highlight}>Ziyarat taxi services</span> in both Makkah and Madinah. Visit Jabal al-Nour, Masjid Quba, Mount Uhud, and more with knowledgeable drivers who can guide you to these blessed locations.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.5}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <ShieldCheck className="text-[#d4af37]" size={24} />
                                Safe & Licensed Drivers
                            </h3>
                            <p className={styles.cardText}>
                                Safety is our priority. All our drivers are fully licensed, experienced, and trained to serve Hajj and Umrah pilgrims. Our vehicles undergo regular maintenance checks to ensure a safe journey for you and your family across Saudi Arabia.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.6}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <HeartHandshake className="text-[#d4af37]" size={24} />
                                Affordable Umrah Taxi Rates
                            </h3>
                            <p className={styles.cardText}>
                                We believe in transparent pricing. Get the best <Link href="/booking" className={styles.highlight + " hover:underline"}>Umrah taxi rates</Link> with no hidden fees. Whether you need a budget-friendly sedan or a spacious bus for a group, we offer competitive packages tailored to your needs.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div >
        </section >
    );
}
