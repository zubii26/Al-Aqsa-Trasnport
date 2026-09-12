import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Suspense } from 'react';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import ComparisonTable from '@/components/fleet/ComparisonTable';
import FeatureHighlights from '@/components/fleet/FeatureHighlights';
import FadeIn from '@/components/common/FadeIn';
import { getSectionContent, getSectionImage, getCustomField } from '@/lib/content-service';
import { vehicleService } from '@/services/vehicleService';
import SchemaInjector from '@/components/SchemaInjector';
import { fleetCollectionSchema, fleetBreadcrumbSchema } from '@/lib/schema/fleet-schema';
import DecisionGuide from '@/components/fleet/DecisionGuide';
import FleetFAQ from '@/components/fleet/FleetFAQ';

export async function generateMetadata() {
    return {
        title: "Umrah Taxi Fleet 2026 | GMC Yukon, Staria & More | Al Aqsa Umrah Transport",
        description: "Explore our premium Umrah taxi fleet. Book a luxury GMC Yukon XL, VIP Mercedes S-Class, family Hyundai Staria, or Toyota Hiace for your journey in Saudi Arabia.",
        keywords: [
            "Umrah Taxi Fleet", "GMC Yukon Booking", "Hyundai Staria Umrah Taxi",
            "Toyota Hiace Bus Makkah", "Luxury Private Taxi Saudi Arabia", "Family Umrah Transport",
            "أسطول نقل المعتمرين", "حجز جمس يوكن", "سيارة خاصة هيونداي"
        ],
        alternates: {
            canonical: 'https://www.alaqsaumrahtransport.com/fleet',
        },
        openGraph: {
            title: 'Umrah Taxi Fleet 2026 | Al Aqsa Umrah Transport',
            description: 'Book a luxury GMC Yukon XL, VIP Mercedes S-Class, or family Hyundai Staria for Umrah transport in Saudi Arabia.',
            url: 'https://www.alaqsaumrahtransport.com/fleet',
            siteName: 'Al Aqsa Umrah Transport',
            images: [
                {
                    url: 'https://www.alaqsaumrahtransport.com/images/fleet/gmc-yukon-hero-professional.webp',
                    width: 1200,
                    height: 630,
                    alt: 'Al Aqsa Umrah Transport fleet — GMC Yukon and premium vehicles',
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Umrah Taxi Fleet 2026 | Al Aqsa Umrah Transport',
            description: 'Book a luxury GMC Yukon, VIP sedan, or family MPV for Umrah transport.',
        },
    };
}

export default async function FleetPage() {
    const section = await getSectionContent('fleet-hero');

    const title = section?.title || "Our Umrah Taxi Fleet";
    const subtitle = section?.subtitle || "Experience luxury and comfort with our diverse range of vehicles.";
    const fallbackBgImage = getSectionImage(section, 'desktop') || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop";
    const badge = getCustomField(section, 'badge_text') || "Premium Collection 2026";

    // Use premium cinematic images from the VIP category for the hero slider
    const premiumGalleryImages = [
        '/images/fleet/mercedes-s-class/mercedes-s-class-luxury-front-view-makkah.webp',
        '/images/fleet/mercedes-s-class/mercedes-s-class-side-profile-luxury.webp',
        '/images/fleet/mercedes-s-class/mercedes-s-class-rear-hero-view.webp',
        '/images/fleet/mercedes-s-class/mercedes-s-class-front-grille-jeddah-airport.webp',
        '/images/fleet/mercedes-s-class/mercedes-s-class-vip-transport-makkah-madinah.webp'
    ];

    return (
        <main>
            <SchemaInjector schemas={[fleetCollectionSchema, fleetBreadcrumbSchema]} />
            <Hero
                title={title}
                subtitle={subtitle}
                bgImage={fallbackBgImage}
                bgImages={premiumGalleryImages}
                ctaText="Book Your Ride"
                ctaLink="/booking"
                badge={badge}
                breadcrumbs={<Breadcrumbs hideJsonLd />}
            />
            <FadeIn>
                <Suspense fallback={<div className="h-[800px] w-full bg-muted animate-pulse rounded-xl" />}>
                    <FleetCarouselWrapper />
                </Suspense>
            </FadeIn>
            <FadeIn>
                <DecisionGuide />
            </FadeIn>
            <FadeIn>
                <ComparisonTable />
            </FadeIn>
            <FadeIn>
                <FleetFAQ />
            </FadeIn>
            <FadeIn>
                <FeatureHighlights />
            </FadeIn>
        </main>
    );
}
