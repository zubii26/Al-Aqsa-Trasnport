import Link from 'next/link';
import { Shield, Clock, Heart } from 'lucide-react';
import styles from './page.module.css';
import FleetCarousel from '@/components/home/FleetCarousel';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import CustomerGallery from '@/components/home/CustomerGallery';
import FadeIn from '@/components/common/FadeIn';
import QuickBookingForm from '@/components/home/QuickBookingForm';
import InstantPriceCalculator from '@/components/home/InstantPriceCalculator';
import LatestArticles from '@/components/home/LatestArticles';
import Hero from '@/components/common/Hero';
import { getFleet } from '@/lib/db';


export default async function Home() {
  const vehicles = await getFleet();
  const carouselVehicles = vehicles.slice(0, 6);

  return (
    <main>
      {/* Hero Section */}
      {/* Hero Section */}
      <Hero
        title="Premium Umrah Taxi Service & Car Rental in Saudi Arabia"
        subtitle="Your trusted partner for Makkah Madinah Taxi Service and reliable Airport to Haram Taxi transfers. Experience comfort and care."
        bgImage="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop"
        ctaText="Book your Umrah transport today"
        ctaLink="/booking"
        secondaryCtaText="View Services"
        secondaryCtaLink="/services"
        layout="two-column"
      >
        <div className="max-w-md mx-auto w-full bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl">
          <QuickBookingForm />
        </div>
      </Hero>

      {/* Instant Price Calculator Section */}
      <InstantPriceCalculator />

      {/* Features Section */}
      <section className={styles.section}>
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>Why Choose Al Aqsa Transport?</h2>
          </FadeIn>
          <div className={styles.features}>
            <FadeIn delay={0.1}>
              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <Shield size={32} />
                </div>
                <h3 className={styles.featureTitle}>Safe & Reliable</h3>
                <p className={styles.featureText}>
                  Licensed drivers and well-maintained vehicles ensuring your safety. The most reliable Umrah transport for your peace of mind.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <Clock size={32} />
                </div>
                <h3 className={styles.featureTitle}>24/7 Umrah Taxi Service</h3>
                <p className={styles.featureText}>
                  We value your time. Our 24/7 service tracks your flight to ensure timely pickups for your Jeddah Airport to Makkah transfer.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <Heart size={32} />
                </div>
                <h3 className={styles.featureTitle}>Family Umrah Taxi</h3>
                <p className={styles.featureText}>
                  Spacious vehicles for the whole family. Dedicated to serving the guests of Allah with the utmost respect, care, and hospitality.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <FadeIn>
        <FleetCarousel vehicles={carouselVehicles} />
      </FadeIn>

      {/* Gallery Section */}
      <CustomerGallery />

      {/* Testimonials Section */}
      {/* Reviews Section */}
      <ReviewsSection />

      {/* Latest Articles Section */}
      <LatestArticles />


      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <FadeIn>
            <h2 className={styles.ctaTitle}>Ready to Begin Your Journey?</h2>
            <p className={styles.ctaText}>
              Book your transport now and let us take care of the logistics while you focus on your worship.
            </p>
            <Link href="/booking" className="btn btn-secondary btn-lg">
              Book Now
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
