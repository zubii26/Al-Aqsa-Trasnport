import React from 'react';
import { Shield, Sparkles, UserCheck, CheckCircle, Clock, Search, Heart, AlertTriangle, Phone, Activity, Wrench, FileCheck, Award } from 'lucide-react';
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import FadeIn from '@/components/common/FadeIn';

export const metadata = {
    title: "Safety Standards & Protocols | Al Aqsa Transport | معايير السلامة",
    description: "Your safety is our sacred duty. Comprehensive vehicle sanitation, driver checks, & 24/7 support. معايير سلامة عالية لخدمة المعتمرين. تعقيم شامل وسائقين محترفين.",
    keywords: [
        "Umrah safety", "safe taxi Makkah", "sanitized transport Saudi",
        "female solo travel Umrah", "licensed drivers Jeddah", "family transport safety",
        "معايير السلامة", "نقل معتمرين آمن", "تاكسي عائلي مكة",
        "أمان المعتمرين", "توصيل آمن للنساء", "سائقين مرخصين"
    ],
    openGraph: {
        title: "Safety Standards | Al Aqsa Umrah Transport | الأمان والراحة",
        description: "Verified drivers, sanitized vehicles, and 24/7 support. Travel with peace of mind. رحلة آمنة ومريحة مع الأقصى للنقل.",
        images: ['/images/blog/comfort-safety-new.png'],
    }
};

export default function SafetyPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <Hero
                title="Your Safety, Our Sacred Duty"
                subtitle="We view your safety not just as a standard, but as an Amanah (Trust) we carry for every pilgrim."
                bgImage="/images/blog/comfort-safety-new.png"
            />

            {/* Trust Signals Bar */}
            <section className="bg-amber-500 py-6 relative z-10 -mt-8 mx-4 md:mx-auto max-w-6xl rounded-xl shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
                        <div className="flex flex-col items-center">
                            <Shield className="mb-2 h-6 w-6" />
                            <span className="font-bold text-sm md:text-base">Ministry Licensed</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <UserCheck className="mb-2 h-6 w-6" />
                            <span className="font-bold text-sm md:text-base">Background Checked</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Search className="mb-2 h-6 w-6" />
                            <span className="font-bold text-sm md:text-base">GPS Tracked Trips</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Clock className="mb-2 h-6 w-6" />
                            <span className="font-bold text-sm md:text-base">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest text-sm mb-3 block">Peace of Mind</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                        Traveling with Confidence
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        At Al Aqsa Umrah Transport, we understand that strict safety measures are essential for you to focus on your Ibadah.
                        We go beyond the industry standards to ensure every aspect of your journey—from the driver's conduct to the vehicle's hygiene—is perfect.
                    </p>
                </div>
            </section>

            {/* Specialized Care Sections */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-playfair">Tailored Safety for Every Pilgrim</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We understand that different guests have different needs. Our protocols are adapted to ensure everyone travels with dignity and security.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Women Safety */}
                        <FadeIn delay={0.1}>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 h-full hover:shadow-xl transition-shadow duration-300">
                                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6">
                                    <Heart size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Solo Sisters Safety</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">Travel without worry. Our "Sisters Protocol" ensures complete privacy and respect.</p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle size={16} className="text-pink-500 shrink-0 mt-0.5" />
                                        <span><strong>Strict Privacy:</strong> No shared rides, ever.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle size={16} className="text-pink-500 shrink-0 mt-0.5" />
                                        <span><strong>Live Tracking:</strong> Shareable GPS link for family.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle size={16} className="text-pink-500 shrink-0 mt-0.5" />
                                        <span><strong>Vetted Drivers:</strong> Trained in Islamic Adab.</span>
                                    </li>
                                </ul>
                            </div>
                        </FadeIn>

                        {/* Family Safety */}
                        <FadeIn delay={0.2}>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 h-full hover:shadow-xl transition-shadow duration-300">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Family Protection</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">Your children are our Amanah. We drive with extra care when little ones are on board.</p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                        <span><strong>Child Seats:</strong> Available upon request.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                        <span><strong>Door Logs:</strong> Child-lock checks before highway.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                        <span><strong>Spacious Vans:</strong> Room for strollers & bags.</span>
                                    </li>
                                </ul>
                            </div>
                        </FadeIn>

                        {/* Elderly Care */}
                        <FadeIn delay={0.3}>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 h-full hover:shadow-xl transition-shadow duration-300">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                                    <Activity size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Elderly Assistance</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">We honor our elders with patience and physical assistance at every step.</p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                                        <span><strong>Door-to-Door:</strong> Minimized walking distance.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                                        <span><strong>Wheelchair:</strong> Assistance with loading/unloading.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                                        <span><strong>Gentle Driving:</strong> Smooth acceleration & braking.</span>
                                    </li>
                                </ul>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Technical Safety Specs */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-3 block">Behind the Scenes</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 font-playfair"> rigorous Fleet Maintenance</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                                A safe journey starts long before you enter the car. Our fleet undergoes a strict maintenance schedule to ensure 100% reliability in the Saudi climate.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl h-fit">
                                        <Wrench size={24} className="text-slate-700 dark:text-slate-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Weekly Mechanical Audit</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Brakes, tires, and fluid levels checked every 7 days.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl h-fit">
                                        <Sparkles size={24} className="text-slate-700 dark:text-slate-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Daily Hygiene Protocol</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Interior vacuum, surface disinfection, and scenting before every trip.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl h-fit">
                                        <FileCheck size={24} className="text-slate-700 dark:text-slate-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Legal Compliance</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">All vehicles fully insured and licensed by the Ministry of Transport.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-amber-100 dark:from-slate-800 dark:to-slate-800 rounded-3xl opacity-50 blur-2xl transform rotate-2"></div>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 relative z-10">
                                <div className="bg-slate-900 p-4 flex items-center justify-between">
                                    <span className="text-white font-mono text-sm">MAINTENANCE_LOG_V8.2.pdf</span>
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4 font-mono text-sm">
                                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <span className="text-slate-500">Check: <span className="text-slate-900 dark:text-white font-bold">Brake Pads</span></span>
                                        <span className="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">PASS</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <span className="text-slate-500">Check: <span className="text-slate-900 dark:text-white font-bold">AC Coolant</span></span>
                                        <span className="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">PASS</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <span className="text-slate-500">Check: <span className="text-slate-900 dark:text-white font-bold">Tire Pressure</span></span>
                                        <span className="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">PASS</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <span className="text-slate-500">Check: <span className="text-slate-900 dark:text-white font-bold">Seatbelts</span></span>
                                        <span className="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">PASS</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-slate-500">Inspector: <span className="text-slate-900 dark:text-white font-bold">Ahmed Al-Sayed</span></span>
                                        <span className="text-slate-400">#8821</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Driver Vetting Process */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-playfair">Only 1 in 10 Applicants Drive for Us</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our driver selection process is rigorous because we trust them with your life and your worship.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Background Check', icon: Search, desc: 'Complete criminal and Ministry of Interior verification.' },
                            { step: '02', title: 'Driving Test', icon: Award, desc: 'Defensive driving assessment on Makkah-Madinah highway.' },
                            { step: '03', title: 'Health Screen', icon: Activity, desc: 'Vision test and drug screening for 100% alertness.' },
                            { step: '04', title: 'Adab Training', icon: UserCheck, desc: 'Workshop on pilgrim interaction, patience, and history.' },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-amber-500 transition-colors">
                                <span className="absolute -top-4 -right-4 text-8xl font-black text-slate-50 dark:text-slate-800 group-hover:text-amber-50 dark:group-hover:text-amber-900/20 transition-colors z-0">{item.step}</span>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-4">
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Emergency Guarantee */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                        <div className="relative z-10 grid md:grid-cols-2 gap-12 p-8 md:p-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-bold mb-6">
                                    <AlertTriangle size={16} />
                                    <span>Emergency Protocol</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-playfair">
                                    Our "Never Stranded" Promise
                                </h3>
                                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                    Breakdowns are rare, but our preparedness is absolute. In the unlikely event of any vehicle issue,
                                    we guarantee a replacement vehicle routed to your location immediately.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                        <div className="bg-red-500 p-2 rounded-lg text-white">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">60 Min Target</p>
                                            <p className="text-slate-400 text-sm">Replacement arrival time</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                        <div className="bg-green-500 p-2 rounded-lg text-white">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">24/7 Hotline</p>
                                            <p className="text-slate-400 text-sm">Always-on support channel</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                                <h4 className="text-white font-bold text-xl mb-4 border-b border-white/10 pb-4">Standard Operating Procedure</h4>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 text-slate-300">
                                        <span className="bg-amber-500/20 text-amber-500 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0">1</span>
                                        <span>Driver secures vehicle in safe zone and ensures passenger comfort.</span>
                                    </li>
                                    <li className="flex gap-4 text-slate-300">
                                        <span className="bg-amber-500/20 text-amber-500 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0">2</span>
                                        <span>Control room deploys nearest standby vehicle (GMC/Starex).</span>
                                    </li>
                                    <li className="flex gap-4 text-slate-300">
                                        <span className="bg-amber-500/20 text-amber-500 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0">3</span>
                                        <span>Full trip refund or discount issued for the inconvenience.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-playfair">Common Safety Questions</h2>
                        <p className="text-slate-600 dark:text-slate-400">Answers to common concerns from our pilgrims</p>
                    </div>

                    <div className="space-y-4">
                        <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 open:border-amber-500 dark:open:border-amber-500 transition-all duration-300">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-slate-900 dark:text-white text-lg">
                                <span>Is it safe for solo female travelers?</span>
                                <span className="transform group-open:rotate-180 transition-transform duration-300 text-amber-500">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                                <p>Absolutely. We specialize in family and female-friendly transport. Our drivers are trained in Adab (respect/etiquette), and all trips are GPS tracked by our control room. You can also share your live trip link with family members for added peace of mind.</p>
                            </div>
                        </details>

                        <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 open:border-amber-500 dark:open:border-amber-500 transition-all duration-300">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-slate-900 dark:text-white text-lg">
                                <span>What if I leave something in the taxi?</span>
                                <span className="transform group-open:rotate-180 transition-transform duration-300 text-amber-500">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                                <p>We have a strict "Lost & Found" protocol. Drivers check the vehicle after every drop-off. If you realize you've lost something, contact our 24/7 support immediately. We have a 98% recovery rate for items reported within 24 hours.</p>
                            </div>
                        </details>

                        <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 open:border-amber-500 dark:open:border-amber-500 transition-all duration-300">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-slate-900 dark:text-white text-lg">
                                <span>Are your vehicles insured?</span>
                                <span className="transform group-open:rotate-180 transition-transform duration-300 text-amber-500">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                                <p>Yes, comprehensive insurance covers all vehicles, drivers, and passengers, fulfilling all Saudi Transport Authority regulations. Your ride is legally protected.</p>
                            </div>
                        </details>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
                            <Heart size={18} className="text-red-500" />
                            <span>Contact Safety Team</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": "Umrah Transport Safety Standards",
                        "provider": {
                            "@type": "Organization",
                            "name": "Al Aqsa Umrah Transport"
                        },
                        "serviceType": "Safe Transport",
                        "description": "Comprehensive safety protocols including vehicle sanitation, driver vetting, and 24/7 emergency support.",
                        "areaServed": ["Makkah", "Madinah", "Jeddah"],
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Safety Features",
                            "itemListElement": [
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "GPS Tracking" } },
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sanitized Vehicles" } },
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Female Friendly Transport" } }
                            ]
                        }
                    })
                }}
            />
        </main>
    );
}
