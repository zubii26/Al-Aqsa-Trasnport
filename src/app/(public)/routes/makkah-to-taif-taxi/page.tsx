import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Clock, MapPin, Car, CheckCircle2 } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import SchemaInjector from '@/components/SchemaInjector';
import QuickAnswerBox from '@/components/services/QuickAnswerBox';
import { getSettings } from '@/lib/settings-storage';
import { getPricingData } from '@/lib/pricing-storage';

export const metadata: Metadata = {
    title: "Makkah to Taif Taxi | Fixed Fare from SAR 350 | Al Aqsa",
    description: "Private Makkah to Taif taxi — 85 km, about 1.5 hours. Fixed fares from SAR 350, licensed drivers, Miqat stop on request. Book on WhatsApp, pay on arrival.",
    keywords: [
        "makkah to taif taxi",
        "makkah to taif taxi fare",
        "taif day trip from makkah",
        "makkah to taif distance",
        "private taxi makkah taif",
        "taif ziyarat taxi",
        "makkah to taif and return",
        "تاكسي من مكة الى الطائف",
        "اجرة تاكسي مكة الطائف",
        "رحلة الى الطائف من مكة"
    ],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/routes/makkah-to-taif-taxi',
    },
};

const taifFAQs = [
    {
        question: "How much is a taxi from Makkah to Taif?",
        answer: "Our fares start at SAR 350 one way and SAR 450 for a return trip with waiting time, depending on vehicle. The price is fixed and agreed before you travel — it covers vehicle, driver, fuel and tolls, with nothing added afterwards."
    },
    {
        question: "How long does the drive take?",
        answer: "About 1.5 hours via Highway 15. The Al Hada mountain road takes closer to two hours because of the switchbacks."
    },
    {
        question: "How far is Taif from Makkah?",
        answer: "Approximately 85 to 90 kilometres, depending on the route."
    },
    {
        question: "Is Taif actually cooler than Makkah?",
        answer: "Yes, noticeably. Taif sits at roughly 1,900 metres and typically runs ten to fifteen degrees cooler. It is the main reason families make the trip in summer."
    },
    {
        question: "Do I need to enter ihram on the way back from Taif?",
        answer: "If you intend to perform Umrah on your return, you will pass a Miqat — Qarn al-Manazil (As-Sayl al-Kabeer) on Highway 15, or Wadi Muharram on the Al Hada road. Request a Miqat stop at booking and the driver will build it into the schedule at no extra charge. Please confirm the ruling for your own circumstances with a qualified scholar."
    },
    {
        question: "Can the driver wait while we visit Taif?",
        answer: "Yes. Our return fare includes waiting time so the vehicle stays with you for the day rather than you finding transport back. [CONFIRM: included hours]"
    },
    {
        question: "Which road do you take?",
        answer: "Highway 15 by default, as it is faster and easier on passengers. We will take the Al Hada scenic road on request. Many groups climb via Highway 15 and descend via Al Hada in daylight."
    },
    {
        question: "Is the drive difficult for elderly passengers or children?",
        answer: "Highway 15 is a comfortable, gradual climb and suits most passengers. We would steer you away from Al Hada if you are travelling with elderly parents or anyone prone to motion sickness — the switchbacks are demanding."
    },
    {
        question: "When do the Taif roses bloom?",
        answer: "The harvest runs roughly through April into early May. Visit in that window and the distilleries are actively working. Outside it you can still tour a factory and buy the oil."
    },
    {
        question: "Can you collect us from Jeddah instead of Makkah?",
        answer: "Yes. Jeddah to Taif and return starts from SAR 600. Airport pickups are available with flight monitoring."
    },
    {
        question: "Do you take large groups?",
        answer: "Yes — up to 22 passengers in a Toyota Coaster, and larger parties across multiple vehicles."
    }
];

const taifPlaces = [
    {
        title: "Masjid Addas",
        desc: "The site associated with the Prophet ﷺ taking shelter in a vineyard after the people of Taif rejected his call. A place to sit with the Seerah.",
        img: "/images/routes/taif-ziyarat-1.jpg"
    },
    {
        title: "Masjid Abdullah ibn Abbas",
        desc: "Central Taif. Associated with the companion and cousin of the Prophet ﷺ, رضي الله عنه, who died in Taif.",
        img: "/images/routes/taif-ziyarat-4.jpg"
    },
    {
        title: "Al Hada and Al Shafa",
        desc: "Mountain viewpoints. Al Hada has the cable car; Al Shafa is higher, cooler and greener, with terraced farms.",
        img: "/images/routes/taif-ziyarat-2.jpg"
    },
    {
        title: "The Rose Farms",
        desc: "Taif rose — ward Ta'ifi. The harvest runs through April into early May. Outside season you can still tour a factory.",
        img: "/images/routes/taif-ziyarat-3.jpg"
    }
];

export default async function MakkahTaifTaxiPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Salam Al Aqsa, I would like to book a Makkah to Taif trip. Date: ___ Passengers: ___ One way or return: ___')}`;

    // Get pricing data dynamically
    const pricingData = await getPricingData();
    const makkahTaifRoute = pricingData?.routes?.find(r => r.id === '692db09a34f15bc89b45a60b');
    const jeddahTaifRoute = pricingData?.routes?.find(r => r.slug === 'jeddah-to-taif-taxi');

    const makkahTaifOneWay = makkahTaifRoute?.customRates?.camry || 350;
    const makkahTaifReturn = makkahTaifRoute?.customRates?.staria || 450;
    const jeddahTaifReturn = jeddahTaifRoute?.customRates?.staria || 600;

    const makkahTaifServiceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Taxi Service",
        "name": "Makkah to Taif Private Taxi & VIP Transfer",
        "description": "Private Makkah to Taif taxi — 85 km, about 1.5 hours. Fixed fares from SAR 350, licensed drivers, Miqat stop on request.",
        "provider": {
            "@type": "Organization",
            "name": "Al Aqsa Umrah Transport",
            "url": "https://www.alaqsaumrahtransport.com"
        },
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 21.2854,
                "longitude": 40.4271
            },
            "geoRadius": "100000"
        },
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": makkahTaifOneWay.toString(),
            "priceCurrency": "SAR",
            "offerCount": "5"
        }
    };

    const makkahTaifFAQSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": taifFAQs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    const makkahTaifBreadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.alaqsaumrahtransport.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Routes",
                "item": "https://www.alaqsaumrahtransport.com/routes"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Makkah to Taif Taxi",
                "item": "https://www.alaqsaumrahtransport.com/routes/makkah-to-taif-taxi"
            }
        ]
    };

    return (
        <main className="overflow-x-hidden bg-slate-50 dark:bg-slate-950 pb-20">
            <SchemaInjector schemas={[makkahTaifServiceSchema, makkahTaifFAQSchema, makkahTaifBreadcrumbSchema]} />
            
            <Hero
                title="Makkah to Taif Taxi | Private Transfer & Day Trip"
                subtitle="تاكسي من مكة المكرمة إلى الطائف"
                bgImage="/images/routes/taif-ziyarat-1.jpg"
                ctaText="Book on WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs hideJsonLd />}
            />

            {/* Quick Facts */}
            <section className="py-8 bg-slate-50 dark:bg-slate-950 -mt-10 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            title="Makkah to Taif — At a Glance"
                            summary="Eighty-five kilometres up the Sarawat escarpment to a city that runs ten to fifteen degrees cooler than Makkah. Private vehicle, fixed fare, licensed driver who knows the mountain road."
                            features={[
                                { label: "Distance", value: "Approximately 85–90 km" },
                                { label: "Journey time", value: "1.5 hours via Highway 15; closer to 2 hours via Al Hada" },
                                { label: "Fare from", value: `SAR ${makkahTaifOneWay} one way · SAR ${makkahTaifReturn} return with waiting [CONFIRM]` },
                                { label: "Routes", value: "Highway 15 (As-Sayl) or the Al Hada mountain road" },
                                { label: "Best for", value: "Half-day or full-day excursion after Umrah, Ziyarat, families escaping the heat" },
                                { label: "Miqat", value: "Both routes pass a Miqat — request a stop if you intend Umrah on return" }
                            ]}
                            ctaText="Get a Fixed Quote"
                            ctaLink={whatsappLink}
                        />
                    </div>
                </div>
            </section>

            {/* The Journey */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Ninety minutes and a different climate</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                        <p>
                            Taif sits at roughly 1,900 metres in the Sarawat Mountains, and the temperature difference is not marketing language — it is commonly ten to fifteen degrees cooler than Makkah. For pilgrims who have spent a week in the heat of the Haram, that alone is reason enough for the drive.
                        </p>
                        <p>
                            The road climbs steadily out of the Makkah basin. It is a genuinely beautiful drive, and it is also a mountain road with sustained gradients, which is why the vehicle and the driver matter more here than on a flat airport run.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Two Routes */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">The Two Routes — and which one you want</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                        Most transport companies do not tell you there is a choice. There is, and it changes the journey considerably.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <MapPin className="text-secondary" /> Highway 15 (As-Sayl al-Kabeer)
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                The faster, wider, more gradual route. Roughly 1.5 hours. This is the default and the right choice for elderly passengers, anyone prone to motion sickness, and travellers who simply want to arrive.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <MapPin className="text-secondary" /> The Al Hada Road
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                The escarpment road — a sequence of tight switchbacks climbing the mountain face, with genuinely spectacular views back over the plain. Closer to two hours, and considerably more demanding on both vehicle and passengers.
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-6 rounded-r-xl">
                        <p className="text-slate-700 dark:text-slate-300">
                            Take Al Hada if the drive itself is part of the day and everyone in the car travels well. Avoid it if you are carrying young children, elderly parents, or anyone who suffers on winding roads. Descending it in the dark is not something we recommend to anyone.
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 mt-4 font-semibold">
                            Tell us which you prefer at booking. If you do not specify, we take Highway 15. Many groups ask us to climb via Highway 15 and descend via Al Hada in daylight, which is a sensible compromise.
                        </p>
                    </div>
                </div>
            </section>

            {/* Miqat Note */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-4xl">
                    <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm mb-2 block">إذا كنت تنوي العمرة عند العودة</span>
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">A Miqat Note for Pilgrims</h2>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                        <p>This is the part most transport pages leave out, and it matters.</p>
                        <p>
                            Both routes to Taif pass a designated Miqat. <strong>Highway 15 passes Qarn al-Manazil, known today as As-Sayl al-Kabeer.</strong> The Al Hada road passes <strong>Wadi Muharram</strong>, which many scholars treat as the same Miqat at higher elevation.
                        </p>
                        <p>
                            If you intend to perform Umrah when you return to Makkah, you will need to enter ihram at the Miqat rather than after you arrive back. Both locations have mosques with washing and changing facilities.
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl my-6 border-l-4 border-secondary">
                            <p className="font-semibold mb-0 text-slate-800 dark:text-slate-200">
                                Tell us at booking if you want a Miqat stop so the driver builds it into the schedule rather than being asked at the last moment on a highway. There is no extra charge for the stop.
                            </p>
                        </div>
                        <p className="text-sm italic">
                            Rulings vary with your circumstances and your route. We are drivers, not scholars — please confirm your own situation with someone qualified before you travel.
                        </p>
                    </div>
                </div>
            </section>

            {/* Taif Places */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">What People Visit in Taif</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {taifPlaces.map((place, idx) => (
                            <div key={idx} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image 
                                        src={place.img} 
                                        alt={place.title} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{place.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{place.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto mt-12 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-secondary" /> A Realistic Day</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Depart Makkah around 8 am, reach Taif by 9:30. Masjid Addas and the mountain viewpoints through the morning, lunch, rose farm and markets in the afternoon. Back in Makkah for Maghrib or Isha. That is a full day and a comfortable pace.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-secondary" /> Saiysad National Park & Al Kar</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Green space and a family recreation area. Useful if you are travelling with children who have spent a week indoors. Finish at the fruit markets for pomegranates, figs, grapes and honey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fares and Vehicles */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white text-center">Fares and Vehicles</h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                        Fixed price, agreed before you travel. It covers the vehicle, driver, fuel and tolls. There is no meter and no renegotiation at the roadside.
                    </p>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-12">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
                                    <th className="p-4 font-bold">Vehicle</th>
                                    <th className="p-4 font-bold">Passengers</th>
                                    <th className="p-4 font-bold">Luggage</th>
                                    <th className="p-4 font-bold">Suits</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-semibold text-slate-900 dark:text-white"><Link href="/fleet/camry" className="hover:text-secondary hover:underline">Toyota Camry</Link></td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">4</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">2 bags</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">Couples, small families, most economical</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-semibold text-slate-900 dark:text-white"><Link href="/fleet/staria" className="hover:text-secondary hover:underline">Hyundai Staria</Link></td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">7</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">5–6 bags</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">Families; high roof, easy step-in, strong AC</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-semibold text-slate-900 dark:text-white"><Link href="/fleet/yukon" className="hover:text-secondary hover:underline">GMC Yukon</Link></td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">7</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">5 bags</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">Elderly parents, best ride quality on the gradients</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-semibold text-slate-900 dark:text-white"><Link href="/fleet/starex" className="hover:text-secondary hover:underline">Hyundai Starex</Link></td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">7</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">4 bags</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">Budget group option</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-semibold text-slate-900 dark:text-white"><Link href="/fleet/hiace" className="hover:text-secondary hover:underline">Toyota Hiace</Link></td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">10–11</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">10 bags</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">Larger groups travelling together</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-semibold text-slate-900 dark:text-white"><Link href="/fleet/coaster" className="hover:text-secondary hover:underline">Toyota Coaster</Link></td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">22</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">15 bags</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">Organised groups and extended families</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Published rates:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <span className="font-medium">Makkah to Taif, one way</span>
                                    <span className="font-bold text-secondary">from SAR {makkahTaifOneWay}</span>
                                </li>
                                <li className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <span className="font-medium">Makkah to Taif and return (Staria)</span>
                                    <span className="font-bold text-secondary">from SAR {makkahTaifReturn}</span>
                                </li>
                                <li className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <span className="font-medium"><Link href="/services/intercity-transfer" className="hover:underline">Jeddah to Taif and return</Link></span>
                                    <span className="font-bold text-secondary">from SAR {jeddahTaifReturn}</span>
                                </li>
                            </ul>
                            <p className="text-sm text-slate-500 mt-4 italic">
                                [CONFIRM: waiting-time allowance included in the return fare, and hourly rate beyond it]
                            </p>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Car className="text-secondary w-5 h-5"/> On vehicle choice for this route specifically:</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                The Al Hada gradients are hard on an underpowered, fully loaded car, and air conditioning working against a sustained climb in summer is a real consideration. If you are six adults with luggage, take the Hiace rather than squeezing into a seven-seater. We would rather tell you that than collect the fare and have you uncomfortable for two hours each way.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Book & How to Book */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Why Book with Al Aqsa</h2>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <Shield className="text-secondary w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Nusuk registered and licensed</h4>
                                        <p className="text-slate-600 dark:text-slate-400">Every vehicle registered under the Nusuk system and licensed for pilgrim transport.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="text-secondary w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Drivers who know the mountain</h4>
                                        <p className="text-slate-600 dark:text-slate-400">The Al Hada descent is not a road to learn on a Tuesday afternoon with your family in the back.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="text-secondary w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Fixed price, agreed first</h4>
                                        <p className="text-slate-600 dark:text-slate-400">No meter, no surge, no negotiation at the kerb.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="text-secondary w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Pay on arrival</h4>
                                        <p className="text-slate-600 dark:text-slate-400">No prepayment required for standard transfers. Cash or transfer to the driver. <br/><span className="text-sm italic opacity-75">[CONFIRM: group and charter terms]</span></p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Clock className="text-secondary w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">24/7 on WhatsApp</h4>
                                        <p className="text-slate-600 dark:text-slate-400">Before, during and after the trip.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">How to Book</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Send us your date, pickup hotel, passenger count and luggage count on WhatsApp. Tell us whether you want one way or return, which route you prefer, and whether you need a Miqat stop. We confirm within minutes with a fixed price and the assigned vehicle.
                            </p>
                            <Link 
                                href={whatsappLink} 
                                target="_blank"
                                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                WhatsApp Us Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection items={taifFAQs} title="FAQ" />

            {/* Final CTA */}
            <section className="py-20 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Book Your Taif Trip</h2>
                    <p className="text-xl text-slate-300 mb-10">Send your date, hotel and passenger count and we will confirm a fixed price within minutes.</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <Link 
                            href={whatsappLink} 
                            target="_blank"
                            className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#B49126] text-[#0A1F44] px-8 py-4 rounded-xl font-bold shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            WhatsApp: +966 54 870 7332
                        </Link>
                        <Link 
                            href="tel:+966567809832" 
                            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-lg backdrop-blur-sm"
                        >
                            Alternate: +966 56 780 9832
                        </Link>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">
                        Nusuk registered · Licensed for pilgrim transport · Fixed fares, no prepayment
                    </p>
                </div>
            </section>
        </main>
    );
}
