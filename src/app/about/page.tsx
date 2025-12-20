import React from 'react';
import Hero from '@/components/common/Hero';
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
        title: "About Al Aqsa Umrah Transport | Trusted Pilgrim Service",
        description: "Discover Al Aqsa Umrah Transport. Trusted partner for premium pilgrim mobility in Saudi Arabia. Professional drivers & luxury fleet for your peace of mind.",
        keywords: [
            "About Al Aqsa Transport", "Umrah transport company Saudi Arabia",
            "Pilgrim transport services", "VIP Umrah taxi", "Makkah to Madinah transport",
            "Jeddah airport transfer", "Haram shuttle service", "Luxury Umrah fleet"
        ],
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

    return (
        <main className="min-h-screen">
            <div className="contents">
                <Hero
                    title={title}
                    subtitle={subtitle}
                    bgImage={bgImage}
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