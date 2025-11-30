import Hero from '@/components/common/Hero';
import FleetShowcase from '@/components/fleet/FleetShowcase';
import ComparisonTable from '@/components/fleet/ComparisonTable';
import FeatureHighlights from '@/components/fleet/FeatureHighlights';
import QuickBookingForm from '@/components/home/QuickBookingForm';
import FadeIn from '@/components/common/FadeIn';
import styles from './page.module.css';
import { getFleet } from '@/lib/db';

export default async function FleetPage() {
    const vehicles = await getFleet();

    return (
        <main>
            <Hero
                title="Our Premium Fleet"
                subtitle="Experience luxury and comfort with our diverse range of vehicles, tailored for your spiritual journey."
                bgImage="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop"
                ctaText="Book Your Ride"
                ctaLink="/booking"
                badge="Premium Collection 2025"
            />
            <FadeIn>
                <FleetShowcase vehicles={vehicles} />
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
