import React from 'react';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import WelcomeSection from '@/components/about/WelcomeSection';
import CompanyStory from '@/components/about/CompanyStory';
import MissionVision from '@/components/about/MissionVision';
import CoreValues from '@/components/about/CoreValues';
import TrustSection from '@/components/about/TrustSection';
import SEOContent from '@/components/about/SEOContent';
import ImpactStats from '@/components/about/ImpactStats';
import PilgrimVoices from '@/components/about/PilgrimVoices';
import TeamTeaser from '@/components/about/TeamTeaser';
import { getSectionContent, getSectionImage } from '@/lib/content-service';
import dbConnect from '@/lib/mongodb';
import { Driver } from '@/models';



export async function generateMetadata() {
    return {
        title: "About Al Aqsa Umrah Transport | Premier Makkah & Madinah Taxi Service",
        description: "Al Aqsa Umrah Transport is the #1 choice for pilgrims in Saudi Arabia. We provide VIP Jeddah Airport transfers, reliable Makkah to Madinah taxi integration, and luxury GMC/Bus fleets. Experience safety, spiritual comfort, and punctuality.",
        keywords: [
            "About Al Aqsa Transport", "Best Umrah transport company Saudi Arabia",
            "Makkah to Madinah taxi price", "Jeddah airport to Makkah taxi service",
            "VIP Umrah transfers", "Luxury GMC for Umrah", "Haramain transfer",
            "Ziyarat Makkah Madinah", "Pilgrim transport services"
        ],
        openGraph: {
            title: "About Al Aqsa Umrah Transport | Leading Pilgrim Service",
            description: "Trusted by thousands for safe and comfortable Umrah transport. From Jeddah Airport to Makkah hotels and Ziyarat tours, we travel with you.",
            url: "https://alaqsaumrahtransport.com/about",
            siteName: "Al Aqsa Umrah Transport",
            images: [
                {
                    url: "/images/about-og.jpg", // Ensure this image exists or is generic
                    width: 1200,
                    height: 630,
                    alt: "Al Aqsa Transport Fleet",
                },
            ],
            type: "website",
        },
        alternates: {
            canonical: 'https://alaqsaumrahtransport.com/about',
        },
    };
}

export default async function AboutPage() {
    const section = await getSectionContent('about-hero');
    const title = section?.title || "About Al Aqsa Transport";
    const subtitle = section?.subtitle || "Serving Guests of Allah with VIP Transport & Reliable Airport Transfers";
    const bgImage = getSectionImage(section, 'desktop') || "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop";

    await dbConnect();
    let drivers = await Driver.find({ isActive: true }).sort({ rating: -1 }).limit(2).lean();

    if (!drivers || drivers.length === 0) {
        // Fallback to static if DB empty
        const { drivers: staticDrivers } = await import('@/data/drivers');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        drivers = staticDrivers.slice(0, 2) as any;
    }

    const serializedDrivers = JSON.parse(JSON.stringify(drivers));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Al Aqsa Umrah Transport",
        "description": "Information about Al Aqsa Umrah Transport, a leading provider of pilgrim transport services in Saudi Arabia.",
        "url": "https://alaqsaumrahtransport.com/about",
        "mainEntity": {
            "@type": "TravelAgency",
            "name": "Al Aqsa Umrah Transport",
            "sameAs": "https://alaqsaumrahtransport.com"
        }
    };

    return (
        <main className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="contents">
                <Hero
                    title={title}
                    subtitle={subtitle}
                    bgImage={bgImage}
                    breadcrumbs={<Breadcrumbs />}
                />
                <WelcomeSection />
                <ImpactStats />
                <CompanyStory />
                <MissionVision />
                <CoreValues />
                <TrustSection />
                <TeamTeaser drivers={serializedDrivers} />
                <PilgrimVoices />
                <SEOContent />
            </div>
        </main>
    );
}