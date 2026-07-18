import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import Features from '@/components/home/Features';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, MapPin, Clock, Calendar, Shield, CreditCard, Star } from 'lucide-react';
import RouteVisual from '@/components/services/RouteVisual';
import FAQSection from '@/components/services/FAQSection';
import SchemaInjector from '@/components/SchemaInjector';
import QuickAnswerBox from '@/components/services/QuickAnswerBox';
import { makkahTaifServiceSchema, makkahTaifFAQSchema, makkahTaifBreadcrumbSchema } from '@/lib/schema/makkah-taif-taxi-schema';
import { getSettings } from '@/lib/settings-storage';

export const metadata: Metadata = {
    title: "Makkah to Taif Taxi & VIP Transfers",
    description: "Travel comfortably from Makkah to Taif. Private, air-conditioned taxi service with fixed pricing. Perfect for families, pilgrims, and VIP tourists.",
    keywords: [
        "Makkah to Taif Taxi",
        "Private Taxi Makkah to Taif",
        "Makkah to Taif Transfer",
        "Taif Taxi",
        "Private Transfer Saudi Arabia",
        "Umrah Taxi",
        "Luxury Taxi Makkah",
        "Premium Chauffeur Saudi Arabia",
        "Taif Transportation",
        "Makkah Private Driver",
        "Door to Door Taxi",
        "Family Taxi",
        "VIP Taxi",
        "Taif Ziyarat Tour"
    ],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/routes/makkah-to-taif-taxi',
    },
    openGraph: {
        title: "Makkah to Taif Private Taxi & VIP Transfer",
        description: "Travel comfortably from Makkah to Taif. Private, air-conditioned taxi service with fixed pricing. 24/7 availability.",
        images: [{ url: '/images/routes/taif-ziyarat-1.jpg', width: 1200, height: 630, alt: 'Makkah to Taif Taxi Tour' }]
    }
};

const taifFAQs = [
    {
        question: "How far is Taif from Makkah?",
        answer: "Taif is approximately 85 to 100 kilometers from Makkah, depending on the route taken (Al Hada or Al Sail). The journey offers beautiful scenic mountain views."
    },
    {
        question: "How long does the journey take?",
        answer: "The private taxi journey typically takes between 1 hour 15 minutes to 1 hour 45 minutes, depending on traffic and the chosen route."
    },
    {
        question: "Can I stop during the trip?",
        answer: "Yes, our private taxi service offers complete flexibility. You can stop for photos, refreshments, or prayers at designated rest stops along the way."
    },
    {
        question: "Can I book a return journey?",
        answer: "Absolutely. You can book a one-way trip or a round trip. We can wait for you in Taif while you complete your Ziyarat or tour and bring you back to Makkah."
    },
    {
        question: "Which vehicle should I choose?",
        answer: "For couples or small groups (up to 4), the Toyota Camry is perfect. For families (up to 7), we highly recommend the Hyundai Staria or GMC Yukon for extra luggage space and comfort. For larger groups, our Toyota Hiace is available."
    },
    {
        question: "Can families travel together?",
        answer: "Yes, our Hyundai Staria and GMC Yukon can comfortably seat up to 7 passengers, ensuring your entire family travels together safely."
    },
    {
        question: "Can I pay in cash?",
        answer: "Yes, we accept both cash payments (SAR) upon arrival and secure online bookings."
    },
    {
        question: "Can I book through WhatsApp?",
        answer: "Yes! You can instantly book your ride through WhatsApp. Our support team is available 24/7 to assist you."
    },
    {
        question: "Is the taxi private?",
        answer: "Yes, all our transfers are 100% private. You will not share the vehicle with anyone outside of your booking."
    },
    {
        question: "Do you operate 24/7?",
        answer: "Yes, our operations and drivers are available 24 hours a day, 7 days a week, including holidays and peak seasons."
    },
    {
        question: "What if my plans change?",
        answer: "We offer flexible cancellations and modifications. Please notify us at least 24 hours in advance if your travel plans change."
    },
    {
        question: "Do you provide airport pickups?",
        answer: "Yes, we can pick you up directly from Jeddah or Taif airport and take you straight to your destination."
    }
];

const taifPlaces = [
    {
        title: "Al Hada Mountain",
        desc: "Famous for its stunning views, cable cars, and cool climate, Al Hada is a must-visit.",
        img: "/images/routes/taif-ziyarat-1.jpg"
    },
    {
        title: "Al Shafa",
        desc: "The highest mountain in Taif, known for agricultural terraces and fruit orchards.",
        img: "/images/routes/taif-ziyarat-2.jpg"
    },
    {
        title: "Taif Rose Gardens",
        desc: "Experience the beautiful fragrance of Taif roses, famously harvested every spring.",
        img: "/images/routes/taif-ziyarat-3.jpg"
    },
    {
        title: "Historical Sites",
        desc: "Explore deep Islamic history including the Shubra Palace and Abdullah Ibn Abbas Mosque.",
        img: "/images/routes/taif-ziyarat-4.jpg"
    }
];

export default async function MakkahTaifTaxiPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

    return (
        <main className="overflow-x-hidden">
            <SchemaInjector schemas={[makkahTaifServiceSchema, makkahTaifFAQSchema, makkahTaifBreadcrumbSchema]} />
            
            {/* 1. Hero Section */}
            <Hero
                title="Private Makkah to Taif Taxi Service"
                subtitle="Travel comfortably from Makkah to Taif with Al Aqsa Umrah Transport. Enjoy private, air-conditioned vehicles, experienced local chauffeurs, fixed pricing, and 24/7 availability."
                bgImage="/images/routes/taif-ziyarat-1.jpg"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs hideJsonLd />}
            />

            {/* Trust Badges Bar */}
            <div className="bg-slate-900 text-slate-300 py-4 border-b border-slate-800 hidden md:block">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-8 text-sm font-medium">
                        <div className="flex items-center gap-2"><Star className="text-secondary w-4 h-4 fill-amber-500" /> ★★★★★ Customer Rating</div>
                        <div className="flex items-center gap-2"><Shield className="text-secondary w-4 h-4" /> Licensed Drivers</div>
                        <div className="flex items-center gap-2"><Clock className="text-secondary w-4 h-4" /> 24/7 Service</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="text-secondary w-4 h-4" /> Instant Confirmation</div>
                        <div className="flex items-center gap-2"><CreditCard className="text-secondary w-4 h-4" /> Fixed Pricing</div>
                    </div>
                </div>
            </div>

            {/* 2. Quick Journey Overview */}
            <section className="py-8 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            title="Makkah to Taif Transfer"
                            summary="Al Aqsa Umrah Transport provides a luxurious door-to-door private taxi service from Makkah to Taif. Skip the crowded buses and travel at your own pace through the beautiful Al Hada mountain pass."
                            features={[
                                { label: "Distance", value: "Approx. 85-100 km" },
                                { label: "Est. Travel Time", value: "1 Hour 15 Minutes" },
                                { label: "Availability", value: "Available 24/7" },
                                { label: "Service Type", value: "100% Private Door-to-Door Transfer" }
                            ]}
                            ctaText="Book Makkah to Taif Taxi"
                            ctaLink={whatsappLink}
                        />
                    </div>
                </div>
            </section>

            {/* 5. Journey Details */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">A Premium Experience</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">Who is this Transfer For?</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                            Our Makkah to Taif route is expertly designed for <strong>Families, Pilgrims, Tourists, Business Travellers, Elderly Passengers, and VIPs</strong>. 
                            We prioritize your comfort, privacy, and safety. Every journey includes a fully air-conditioned modern vehicle, door-to-door pickup and drop-off, and a professional, punctual chauffeur who knows the local mountain routes perfectly.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Why Choose Al Aqsa */}
            <Features />

            {/* 4. Fleet Section */}
            <div className="bg-slate-50 dark:bg-slate-950">
                <FleetCarouselWrapper />
            </div>

            {/* 6. Popular Places in Taif (Ziyarat Tour Images) */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Ziyarat & Tourism</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Popular Places in Taif</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Discover the rich history, cool climate, and beautiful landscapes of Taif with our guided Ziyarat tours.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {taifPlaces.map((place, idx) => (
                            <div key={idx} className="group bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image 
                                        src={place.img} 
                                        alt={place.title} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{place.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{place.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Booking Process */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Simple Booking Process</h2>
                        <p className="text-slate-500">Secure your premium Taif transfer in just a few clicks.</p>
                    </div>
                    
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="w-16 h-16 bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black">1</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Choose Your Vehicle</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Select the perfect luxury sedan, SUV, or van for your family's size and luggage needs.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-sm relative">
                            {/* Connector Line for Desktop */}
                            <div className="hidden md:block absolute top-1/2 -left-4 w-8 border-t-2 border-dashed border-amber-300 dark:border-amber-700"></div>
                            <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-amber-300 dark:border-amber-700"></div>
                            
                            <div className="w-16 h-16 bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black">2</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Enter Journey Details</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Provide your Makkah hotel, Taif destination, and preferred pickup date and time.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="w-16 h-16 bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black">3</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Enjoy Your Journey</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Receive instant confirmation, meet your professional driver, and travel in absolute comfort.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. Why Book in Advance & 9. Customer Promise */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Why Book in Advance?</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" size={20} />
                                    <span className="text-slate-700 dark:text-slate-300"><strong>Guaranteed availability</strong> during peak Umrah seasons.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" size={20} />
                                    <span className="text-slate-700 dark:text-slate-300"><strong>Fixed pricing</strong> locked in with no unexpected surge charges.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" size={20} />
                                    <span className="text-slate-700 dark:text-slate-300"><strong>Best vehicle selection</strong> for your family's exact needs.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" size={20} />
                                    <span className="text-slate-700 dark:text-slate-300"><strong>Total peace of mind</strong> knowing your professional driver is already assigned.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-8 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-700">
                            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Our Customer Promise</span>
                            <p className="text-slate-800 dark:text-slate-200 text-lg italic font-serif leading-relaxed mb-6">
                                "Your comfort, safety, and punctuality are our highest priorities. From the moment you book until you arrive safely at your destination, our dedicated operations team monitors every journey to ensure a seamless travel experience."
                            </p>
                            <p className="text-sm font-bold text-slate-500">— The Al Aqsa Transport Team</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 10. FAQ */}
            <FAQSection items={taifFAQs} title="Frequently Asked Questions" />

            {/* 11. Strong CTA */}
            <section className="py-20 bg-slate-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Travel?</h2>
                    <p className="text-xl text-slate-300 mb-10">Book your private Makkah to Taif taxi today and experience the luxury of Al Aqsa Umrah Transport.</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            href={whatsappLink} 
                            target="_blank"
                            className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#B49126] text-[#0A1F44] px-8 py-4 rounded-xl font-bold shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            Book via WhatsApp <ArrowRight size={20} />
                        </Link>
                        <Link 
                            href="tel:+966578065096" 
                            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-lg backdrop-blur-sm"
                        >
                            Call Us Now
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
