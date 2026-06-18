import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { topHotels } from '@/data/hotels';
import QuickBookingForm from '@/components/home/QuickBookingForm';
import TrustSection from '@/components/about/TrustSection';
import FleetShowcase from '@/components/home/FleetShowcase';
import Image from 'next/image';
import { Star, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
    params: Promise<{
        hotelSlug: string;
    }>;
}

// Generate static params for all 100+ hotels to build pages at compile time
export async function generateStaticParams() {
    return topHotels.map((hotel) => ({
        hotelSlug: hotel.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const hotel = topHotels.find((h) => h.slug === resolvedParams.hotelSlug);
    
    if (!hotel) {
        return {
            title: 'Hotel Not Found',
        };
    }

    return {
        title: `Jeddah Airport to ${hotel.name} Taxi & Transfer | Al Aqsa Transport`,
        description: `Book a private, fixed-price taxi from King Abdulaziz Airport (Jeddah) to ${hotel.name} in ${hotel.city}. 24/7 Nusuk-registered service, meet-and-greet, no hidden fees.`,
        openGraph: {
            title: `Jeddah Airport to ${hotel.name} Taxi | VIP Transfer`,
            description: `Comfortable and reliable transfer from Jeddah Airport to ${hotel.name}. Pre-book your Umrah transport now.`,
            images: ['/images/routes/jeddah-airport-hero-professional.png'],
        },
    };
}

export default async function HotelTransferPage({ params }: Props) {
    const resolvedParams = await params;
    const hotel = topHotels.find((h) => h.slug === resolvedParams.hotelSlug);

    if (!hotel) {
        notFound();
    }

    // Default price from Jeddah to Makkah/Madinah
    const startingPrice = hotel.city === 'Makkah' ? 150 : 350;
    const duration = hotel.city === 'Makkah' ? '60-90 Mins' : '4-5 Hours';

    // Structured Data specifically for this hotel route
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Jeddah Airport to ${hotel.name} Transfer`,
        "provider": {
            "@type": "LocalBusiness",
            "name": "Al Aqsa Umrah Transport",
            "image": "https://www.alaqsaumrahtransport.com/images/logo.png"
        },
        "areaServed": [
            { "@type": "City", "name": "Jeddah" },
            { "@type": "City", "name": hotel.city }
        ],
        "description": `Private taxi transfer from Jeddah Airport to ${hotel.name}.`,
        "offers": {
            "@type": "Offer",
            "price": startingPrice.toString(),
            "priceCurrency": "SAR",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <main className="bg-slate-50 min-h-screen pt-24 pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            
            <div className="container mx-auto px-4">
                {/* HERO SECTION */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-slate-100">
                    <div className="grid lg:grid-cols-2 gap-0">
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6 w-fit">
                                <ShieldCheck size={16} /> Official Umrah Transport
                            </div>
                            
                            <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                Taxi from Jeddah Airport to <span className="text-[#D4AF37]">{hotel.name}</span>
                            </h1>
                            
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Avoid the hassle of negotiating with airport taxis. Pre-book your private, air-conditioned vehicle direct to the {hotel.starRating}-star {hotel.name} in {hotel.city}.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-slate-400 mb-1"><MapPin size={20} /></div>
                                    <div className="text-sm text-slate-500">Destination</div>
                                    <div className="font-bold text-slate-900 truncate" title={hotel.name}>{hotel.name}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-slate-400 mb-1"><Clock size={20} /></div>
                                    <div className="text-sm text-slate-500">Est. Time</div>
                                    <div className="font-bold text-slate-900">{duration}</div>
                                </div>
                            </div>
                            
                            <ul className="space-y-3 mb-8">
                                {['Meet & Greet at Arrivals', 'Fixed Price, No Hidden Fees', 'Nusuk Registered Vehicles', 'Free Wait Time for Flight Delays'].map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle2 className="text-emerald-500" size={20} /> {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="relative min-h-[400px] lg:min-h-full bg-slate-900">
                            <Image 
                                src="/images/routes/jeddah-airport-hero-professional.png"
                                alt="Jeddah Airport Arrival"
                                fill
                                className="object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <QuickBookingForm />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="grid lg:grid-cols-3 gap-12 mb-16">
                    <div className="lg:col-span-2 prose prose-slate max-w-none">
                        <h2>Your Journey to {hotel.name}</h2>
                        <p>
                            Arriving at King Abdulaziz International Airport (KAIA) in Jeddah can be overwhelming, especially during the busy Umrah season. By pre-booking your private transfer to <strong>{hotel.name}</strong>, you guarantee a smooth, stress-free start to your spiritual journey.
                        </p>
                        
                        <h3>Why Book in Advance?</h3>
                        <p>
                            Finding a taxi upon arrival often leads to paying surge prices, especially for highly requested drop-offs like {hotel.name} (located just {hotel.distanceFromHaram} from the Haram). Our fixed-price service means the price you see is the price you pay, regardless of traffic or the time of day.
                        </p>
                        
                        <h3>Our Vehicles</h3>
                        <p>
                            Whether you are traveling alone or with a large family group, we have the perfect vehicle to accommodate your luggage and ensure a comfortable ride to {hotel.city}. Our fleet includes Toyota Camry (Sedans), GMC Yukon (Luxury SUVs), and Hyundai Staria (Minivans).
                        </p>
                    </div>
                    
                    <div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
                            <h3 className="text-xl font-bold mb-4">Hotel Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-slate-500 mb-1">Name</div>
                                    <div className="font-semibold">{hotel.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500 mb-1">City</div>
                                    <div className="font-semibold">{hotel.city}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500 mb-1">Rating</div>
                                    <div className="flex gap-1">
                                        {[...Array(hotel.starRating)].map((_, i) => (
                                            <Star key={i} size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500 mb-1">Distance to Haram</div>
                                    <div className="font-semibold">{hotel.distanceFromHaram}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <FleetShowcase />
                <TrustSection />
            </div>
        </main>
    );
}
