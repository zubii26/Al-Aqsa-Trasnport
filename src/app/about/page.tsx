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
import { getSectionContent, getSectionImage } from '@/lib/content-service';



export async function generateMetadata() {
    return {
        title: "About Al Aqsa | Premium Umrah Transport & VIP Pilgrim Services",
        description: "Trusted Umrah transport in Saudi Arabia. We provide reliable Jeddah Airport transfers, Makkah-Madinah taxis, and VIP pilgrim services. Book your safe ride today.",
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
                <PilgrimVoices />
                <SEOContent />
            </div>
        </main>
    );
}