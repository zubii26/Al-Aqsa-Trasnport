import Hero from '@/components/common/Hero';
import { Suspense } from 'react';
import FleetShowcaseLoader from '@/components/fleet/FleetShowcaseLoader';
import ComparisonTable from '@/components/fleet/ComparisonTable';
import FeatureHighlights from '@/components/fleet/FeatureHighlights';
import QuickBookingForm from '@/components/home/QuickBookingForm';
import FadeIn from '@/components/common/FadeIn';
import styles from './page.module.css';
import { getSectionContent, getSectionImage, getCustomField } from '@/lib/content-service';



export async function generateMetadata() {
    return {
        title: "Premium Umrah Fleet | GMC Yukon, Hiace & Luxury Bus Rental",
        description: "Explore our premium fleet for Umrah transport. Rent 2024 GMC Yukon, Toyota Hiace, Hyundai Staria, or luxury buses for comfortable Makkah to Madinah travel.",
        alternates: {
            canonical: 'https://alaqsa-transport.com/fleet',
        },
    };
}

export default async function FleetPage() {
    const section = await getSectionContent('fleet-hero');

    const title = section?.title || "Our Premium Fleet";
    const subtitle = section?.subtitle || "Experience luxury and comfort with our diverse range of vehicles, tailored for your spiritual journey.";
    const bgImage = getSectionImage(section, 'desktop') || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop";
    const badge = getCustomField(section, 'badge_text') || "Premium Collection 2025";

    return (
        <main>
            <Hero
                title={title}
                subtitle={subtitle}
                bgImage={bgImage}
                ctaText="Book Your Ride"
                ctaLink="/booking"
                badge={badge}
            />
            <FadeIn>
                <Suspense fallback={<div className="h-[800px] w-full bg-muted animate-pulse rounded-xl" />}>
                    <FleetShowcaseLoader />
                </Suspense>
            </FadeIn>
            <FadeIn>
                <ComparisonTable />
            </FadeIn>
            <FadeIn>
                <FeatureHighlights />
            </FadeIn>

            <section className={styles.bookingSection}>
                <div className="container">
                    <FadeIn direction="up">
                        <div className={styles.bookingWrapper}>
                            <QuickBookingForm
                                title="Book Your Luxury Ride"
                                subtitle="Reserve your premium vehicle for a comfortable spiritual journey"
                                variant="fleet"
                            />
                        </div>
                    </FadeIn>
                </div>
            </section>
        </main>
    );
}
