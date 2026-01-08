import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Camera, Heart, BookOpen } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';

export const metadata: Metadata = {
    title: "Ziyarat Makkah Madinah Tours | Visit Historical Sites",
    description: "Private Ziyarat tours in Makkah (Jabal Al-Nour, Arafat) & Madinah (Masjid Quba, Uhud). Experienced drivers sharing Islamic history.",
    keywords: [
        "Ziyarat Tours Makkah",
        "Ziyarat Madinah Places",
        "Masjid Quba Transport",
        "Historical Places Tour Makkah",
        "Private Ziyarat Taxi",
        "Taif Day Trip from Makkah",
        "رحلات زيارة مكة",
        "مزارات المدينة المنورة",
        "زيارة مسجد قباء",
        "جبل النور",
        "زيارة غار حراء"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/services/ziyarat-tours',
    },
    openGraph: {
        title: "Ziyarat Makkah Madinah Tours | Historical Site Visits",
        description: "Guided private tours to Jabal Al-Nour, Masjid Quba, Mount Uhud, and more. deeply spiritual experience with knowledgeable drivers.",
        images: [{ url: '/images/routes/makkah-ziyarat-hero.png', width: 1200, height: 630, alt: 'Jabal Al-Nour Makkah Ziyarat' }]
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "Makkah and Madinah Ziyarat Tour",
    "description": "Private guided tour of historical Islamic sites in Makkah and Madinah including Cave Hira and Masjid Quba.",
    "provider": {
        "@type": "TransportationService",
        "name": "Al Aqsa Transport"
    },
    "itinerary": [
        {
            "@type": "City",
            "name": "Makkah",
            "description": "Visit Jabal Al-Nour, Jabal Thawr, and Arafat. زيارة جبل النور وغار ثور."
        },
        {
            "@type": "City",
            "name": "Madinah",
            "description": "Visit Masjid Quba, Mount Uhud, and Qiblatayn. زيارة مسجد قباء وجبل أحد."
        }
    ],
    "offers": {
        "@type": "Offer",
        "price": "300",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock"
    }
};

const ziyaratFAQs = [
    {
        question: "How long is a typical Ziyarat tour?",
        answer: "A standard Ziyarat tour in either Makkah or Madinah takes about 2 to 3 hours. However, we offer extended tours if you wish to visit more distant sites like Badr or Taif."
    },
    {
        question: "Do the drivers speak English?",
        answer: "Yes, our Ziyarat drivers are selected for their language skills and knowledge of the historical sites. They can guide you to the best parking spots and explain the significance of the locations."
    },
    {
        question: "Can we customize the places we visit?",
        answer: "Absolutely. It is a private tour. You can choose which sites to visit and how long to stay at each. We are here to serve your schedule."
    },
];

export default async function ZiyaratToursPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20a%20Ziyarat%20Tour`;

    return (
        <main className="overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero
                title="Ziyarat Tours: Relive Islamic History"
                subtitle="Walk in the footsteps of the Prophet (SAW). Comprehensive engaging tours of the holy sites in Makkah and Madinah."
                bgImage="/images/routes/makkah-ziyarat-hero.png"
                ctaText="Book Ziyarat Tour"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
                alt="Makkah and Madinah Historical Ziyarat Tours - Jabal Al Noor"
            />

            {/* Makkah Ziyarat */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100 border-l-4 border-amber-500 pl-4">
                                Makkah Ziyarat Sites
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                Discover the places where Revelation began. Our Makkah tour covers the most significant landmarks outside the Haram.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { name: "Jabal Al-Nour (Cave Hira)", desc: "The place of the first revelation." },
                                    { name: "Jabal Thawr", desc: "The cave where the Prophet (SAW) hid during migration." },
                                    { name: "Mina, Arafat & Muzdalifah", desc: "The sites of Hajj rituals." },
                                    { name: "Jannat al-Mu'alla", desc: "The cemetery where Khadijah (RA) is buried." }
                                ].map((site, idx) => (
                                    <li key={idx} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex gap-4 hover:shadow-md transition-shadow">
                                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full h-fit text-amber-600 dark:text-amber-400">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">{site.name}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{site.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:w-1/2 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1537181534458-7dc2614c9546?q=80&w=1000&auto=format&fit=crop"
                                alt="Jabal Al-Nour (Cave of Hira) Mountain View Makkah"
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <span className="text-white text-xl font-bold">Jabal Al-Nour</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Madinah Ziyarat */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100 border-l-4 border-green-500 pl-4">
                                Madinah Ziyarat Sites
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                Feel the peace of the City of the Prophet. Visit the first mosque of Islam and the sites of early battles.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { name: "Masjid Quba", desc: "The first mosque in Islam. Offering 2 Rakaats here equals an Umrah." },
                                    { name: "Mount Uhud", desc: "Site of the Battle of Uhud and the cemetery of the martyrs." },
                                    { name: "Masjid Al-Qiblatayn", desc: "The mosque where the Qibla was changed." },
                                    { name: "The Seven Mosques", desc: "Site of the Battle of the Trench." }
                                ].map((site, idx) => (
                                    <li key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-lg flex gap-4 hover:shadow-md transition-shadow">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full h-fit text-green-600 dark:text-green-400">
                                            <Heart size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">{site.name}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{site.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:w-1/2 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1551041777-ed02bed74fc4?q=80&w=1000&auto=format&fit=crop"
                                alt="Masjid Quba Madinah First Mosque in Islam Exterior"
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <span className="text-white text-xl font-bold">Masjid Quba</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Book Ziyarat With Us */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-12 font-playfair">Enhance Your Spiritual Journey</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                                <Clock size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Hasted Visits</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Unlike group buses, we wait for you. Travel in our private <Link href="/fleet/gmc-yukon-at4" className="text-amber-600 hover:underline">GMC Yukon</Link> or <Link href="/fleet/hyundai-staria" className="text-amber-600 hover:underline">Hyundai Staria</Link> and take your time to pray.</p>
                        </div>
                        <div className="p-6">
                            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Historical Context</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Our drivers share the history and significance of the locations you visit.</p>
                        </div>
                        <div className="p-6">
                            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                                <Camera size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Photo Opportunities</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Flexibility to stop for photos at scenic points like the mountains surrounding Makkah.</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <Link href="/booking" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-amber-500/25">
                            Book Your Private Ziyarat Tour <ArrowRight size={20} />
                        </Link>
                        <p className="mt-6 text-sm text-slate-500">
                            Need to travel between cities? We also offer <Link href="/services/makkah-madinah-taxi" className="text-amber-600 hover:underline">Makkah to Madinah Taxi</Link> services.
                        </p>
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={ziyaratFAQs} title="Ziyarat Tours - Frequently Asked Questions" />
        </main>
    );
}
