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
import TeamTeaser from '@/components/about/TeamTeaser';
import PilgrimVoices from '@/components/about/PilgrimVoices';
import { getSectionContent, getSectionImage } from '@/lib/content-service';



export async function generateMetadata() {
    return {
        title: "About Al Aqsa Umrah Transport | Premier Makkah Taxi | من نحن",
        description: "Al Aqsa Umrah Transport: #1 choice for pilgrims. VIP Jeddah Airport transfers, Makkah to Madinah taxi, and GMC fleet. أفضل شركة نقل معتمرين في السعودية.",
        keywords: [
            "About Al Aqsa Transport", "Best Umrah transport company Saudi Arabia",
            "Makkah to Madinah taxi price", "Jeddah airport to Makkah taxi service",
            "VIP Umrah transfers", "Luxury GMC for Umrah", "Haramain transfer",
            "Ziyarat Makkah Madinah", "Pilgrim transport services",
            "من نحن", "مؤسسة الاقصى لنقل المعتمرين", "شركة نقل في مكة",
            "ارقام تكاسي مكة", "خدمات المعتمرين", "توصيل مطار الملك عبدالعزيز"
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Al Aqsa Umrah Transport",
        "description": "Information about Al Aqsa Umrah Transport, a leading provider of pilgrim transport services in Saudi Arabia.",
        "url": "https://alaqsaumrahtransport.com/about",
        "mainEntity": {
            "@type": "TransportationService",
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
                <TeamTeaser />
                <PilgrimVoices />
                <SEOContent />
            </div>
        </main>
    );
}