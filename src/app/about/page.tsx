'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/context/LanguageContext';
import Hero from '@/components/common/Hero';

// Skeleton components for loading states
const SectionSkeleton = () => (
    <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    </div>
);

// Dynamically import components with loading states
const WelcomeSection = dynamic(() => import('@/components/about/WelcomeSection'), {
    loading: () => <SectionSkeleton />
});

const CompanyStory = dynamic(() => import('@/components/about/CompanyStory'), {
    loading: () => <SectionSkeleton />
});

const MissionVision = dynamic(() => import('@/components/about/MissionVision'), {
    loading: () => <SectionSkeleton />
});

const CoreValues = dynamic(() => import('@/components/about/CoreValues'), {
    loading: () => <SectionSkeleton />
});

const TrustSection = dynamic(() => import('@/components/about/TrustSection'), {
    loading: () => <SectionSkeleton />
});

const Leadership = dynamic(() => import('@/components/about/Leadership'), {
    loading: () => <SectionSkeleton />
});

const ImpactStats = dynamic(() => import('@/components/about/ImpactStats'), {
    loading: () => <SectionSkeleton />
});

const PilgrimVoices = dynamic(() => import('@/components/about/PilgrimVoices'), {
    loading: () => <SectionSkeleton />
});

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="contents">
                <Hero
                    title={t('about.hero.title')}
                    subtitle={t('about.hero.subtitle')}
                    bgImage="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop"
                />
                <WelcomeSection />
                <ImpactStats />
                <CompanyStory />
                <MissionVision />
                <CoreValues />
                <TrustSection />
                <PilgrimVoices />
                <Leadership />
            </div>
        </main>
    );
}