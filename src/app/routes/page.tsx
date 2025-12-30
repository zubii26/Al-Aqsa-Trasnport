import type { Metadata } from 'next';
import Image from 'next/image';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, ShieldCheck, Star } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import FadeIn from '@/components/common/FadeIn';

export const metadata: Metadata = {
    title: 'Umrah Transport Routes Network | Intercity & Airport Transfers',
    description: 'Explore our comprehensive transport network connecting Jeddah, Makkah, and Madinah. Premium VIP transfers for your spiritual journey.',
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/routes',
    },
    openGraph: {
        title: "Umrah Transport Routes Network | Al Aqsa Transport",
        description: "Connect seamlessly between Holy Cities. VIP Jeddah to Makkah, Makkah to Madinah, and Airport Transfers.",
        images: [{ url: '/images/routes/routes-network-hero.png', width: 1200, height: 630, alt: 'Saudi Arabia Transport Network Map' }]
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Umrah Transport Routes",
    "description": "Premium transport routes connecting Jeddah Airport, Makkah, and Madinah.",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Jeddah Airport to Makkah",
            "url": "https://alaqsaumrahtransport.com/services/jeddah-airport-transfer"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Makkah to Madinah",
            "url": "https://alaqsaumrahtransport.com/services/makkah-madinah-taxi"
        },
        {
            "@type": "ListItem",
            "position": 3,
            "name": "Madinah Airport Transfer",
            "url": "https://alaqsaumrahtransport.com/services/madinah-airport-transfer"
        },
        {
            "@type": "ListItem",
            "position": 4,
            "name": "Makkah to Jeddah Airport",
            "url": "https://alaqsaumrahtransport.com/services/makkah-jeddah-taxi"
        }
    ]
};

const ROUTES = [
    {
        id: 'jeddah-makkah',
        title: 'Jeddah Airport ⇄ Makkah',
        description: 'The most popular route for arriving pilgrims. Direct VIP transfer from King Abdulaziz International Airport (KAIA) to your hotel in Makkah.',
        distance: '95 km',
        time: '60-75 mins',
        price: 'From SAR 250',
        features: ['Meet & Greet', 'Flight Monitoring', 'Luggage Assistance'],
        link: '/services/jeddah-airport-transfer',
        image: '/images/routes/jeddah-airport-hero-professional.png'
    },
    {
        id: 'makkah-madinah',
        title: 'Makkah ⇄ Madinah',
        description: 'A spiritual journey between the two Holy Cities. Travel in absolute comfort with our luxury fleet, including stops at Miqat if requested.',
        distance: '450 km',
        time: '4.5 - 5 hours',
        price: 'From SAR 450',
        features: ['Miqat Stop', 'Premium Comfort', 'Rest Stops Available'],
        link: '/services/makkah-madinah-taxi',
        image: '/images/routes/makkah-madinah-route-hero.png'
    },
    {
        id: 'madinah-airport',
        title: 'Madinah Airport ⇄ Hotel',
        description: 'Seamless transfer from Prince Mohammad Bin Abdulaziz International Airport to your hotel in the Prophet’s City.',
        distance: '20 km',
        time: '25-30 mins',
        price: 'From SAR 150',
        features: ['24/7 Service', 'Door-to-Door', 'Family Friendly'],
        link: '/services/madinah-airport-transfer',
        image: '/images/routes/madinah-airport-hero.png'
    },
    {
        id: 'ziyarat-makkah',
        title: 'Makkah Ziyarat Tours',
        description: 'Visit the sacred sites of Makkah including Jabal Al-Nour (Hira Cave), Jabal Thawr, and Arafat with a knowledgeable driver.',
        distance: 'Various',
        time: '3-4 hours',
        price: 'From SAR 300',
        features: ['Historical Insight', 'Flexible Timing', 'Private Vehicle'],
        link: '/services/ziyarat-tours',
        image: '/images/routes/makkah-ziyarat-hero.png'
    },
    {
        id: 'jeddah-madinah',
        title: 'Jeddah Airport ⇄ Madinah',
        description: 'Direct transfer for those landing in Jeddah but starting their Umrah/Ziyarat in Madinah. A long but comfortable ride in our VIP vehicles.',
        distance: '400 km',
        time: '4 - 4.5 hours',
        price: 'From SAR 500',
        features: ['Direct Route', 'Maximum Comfort', 'Refreshments'],
        link: '/services/intercity-transfer',
        image: '/images/fleet/intercity-hero.png'
    }
];

export default function RoutesPage() {
    return (
        <main className="bg-background min-h-screen pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero
                title="Our Transport Network"
                subtitle="Connecting the Holy Cities with comfort, reliability, and precision. Your journey of faith deserves the best path."
                bgImage="/images/routes/routes-network-hero.png"
                breadcrumbs={<Breadcrumbs />}
            />

            <section className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {ROUTES.map((route, index) => (
                        <FadeIn key={route.id} delay={index * 0.1}>
                            <div className="block h-full group relative">
                                <GlassCard className="h-full hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 overflow-hidden border-0 ring-1 ring-white/20 relative">
                                    <Link href={route.link} className="absolute inset-0 z-10">
                                        <span className="sr-only">View {route.title}</span>
                                    </Link>
                                    <div className="flex flex-col md:flex-row h-full">
                                        <div className="md:w-2/5 relative min-h-[200px] md:min-h-full overflow-hidden">
                                            <Image
                                                src={route.image}
                                                alt={route.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                                            <div className="absolute bottom-4 left-4 text-white md:hidden relative z-10">
                                                <div className="flex items-center gap-1 text-sm font-medium mb-1">
                                                    <Clock size={14} className="text-secondary" />
                                                    {route.time}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm font-medium">
                                                    <MapPin size={14} className="text-secondary" />
                                                    {route.distance}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 md:w-3/5 flex flex-col">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-2xl font-bold font-playfair group-hover:text-secondary transition-colors">
                                                    {route.title}
                                                </h3>
                                            </div>

                                            <p className="text-muted-foreground mb-6 line-clamp-3 text-sm">
                                                {route.description}
                                            </p>

                                            <div className="hidden md:flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 rounded-full text-secondary-foreground font-medium">
                                                    <Clock size={14} />
                                                    {route.time}
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 rounded-full text-secondary-foreground font-medium">
                                                    <MapPin size={14} />
                                                    {route.distance}
                                                </div>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                                        Starting from
                                                    </span>
                                                    <span className="text-xl font-bold text-secondary">
                                                        {route.price}
                                                    </span>
                                                </div>
                                                <div className="flex gap-3 relative z-20">
                                                    <Link
                                                        href="/fleet"
                                                        className="hidden md:flex items-center text-xs font-medium text-muted-foreground hover:text-secondary transition-colors"
                                                        aria-label="View Fleet"
                                                    >
                                                        View Fleet
                                                    </Link>
                                                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-secondary transition-colors">
                                                        View Details <ArrowRight size={16} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <FadeIn>
                            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4">Why Travel With Al Aqsa?</h2>
                            <p className="text-muted-foreground">More than just transport, we provide a seamless bridge between your spiritual destinations.</p>
                        </FadeIn>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Licensed & Insured",
                                desc: "Fully licensed by the Ministry of Transport. Every vehicle is insured and monitored for your safety."
                            },
                            {
                                icon: Star,
                                title: "Premium Experience",
                                desc: "From the moment you step into our vehicles, experience the hospitality that honors the Guests of Allah."
                            },
                            {
                                icon: Clock,
                                title: "Punctuality",
                                desc: "We value your time. Our drivers arrive before schedule to ensure your journey is stress-free."
                            }
                        ].map((feature, idx) => (
                            <FadeIn key={idx} delay={0.2 + (idx * 0.1)}>
                                <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
                                        <feature.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
