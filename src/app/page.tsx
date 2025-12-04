import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './page.module.css';
import FadeIn from '@/components/common/FadeIn';
import InstantPriceCalculator from '@/components/home/InstantPriceCalculator';
import Hero from '@/components/common/Hero';
import BookingFormWrapper from '@/components/home/BookingFormWrapper';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import Features from '@/components/home/Features';

import { getSectionContent, getSectionImage, getCustomField } from '@/lib/content-service';

// Lazy load heavy components
const ReviewsSection = dynamic(() => import('@/components/reviews/ReviewsSection'));
const CustomerGallery = dynamic(() => import('@/components/home/CustomerGallery'));
const LatestArticles = dynamic(() => import('@/components/home/LatestArticles'));

export async function generateMetadata() {
  return {
    title: "Al Aqsa Umrah | Umrah Taxi Service & Car Rental",
    description: "Book reliable Umrah taxi service in Saudi Arabia. Premium GMC Yukon, Toyota Hiace, and bus rentals for Makkah to Madinah taxi, Jeddah airport transfers, and Ziarah tours.",
    alternates: {
      canonical: 'https://alaqsa-transport.com',
    },
  };
}

export default async function Home() {
  const heroSection = await getSectionContent('home-hero');
  const heroTitle = heroSection?.title || "Premium Umrah Taxi Service & Car Rental in Saudi Arabia";
  const heroSubtitle = heroSection?.subtitle || "Your trusted partner for Makkah Madinah Taxi Service and reliable Airport to Haram Taxi transfers. Experience comfort and care.";
  const heroImage = getSectionImage(heroSection, 'desktop') || "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop";
  const ctaText = getCustomField(heroSection, 'cta_text') || "Book your Umrah transport today";
  const ctaLink = getCustomField(heroSection, 'cta_link') || "/booking";

  return (
    <main>
      {/* Hero Section */}
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={heroImage}
        layout="two-column"
        ctaText={ctaText}
        ctaLink={ctaLink}
      >
        <BookingFormWrapper />
      </Hero>

      {/* Instant Price Calculator Section */}
      <InstantPriceCalculator />

      {/* Features Section */}
      <Features />

      {/* Fleet Section */}
      <FadeIn>
        <FleetCarouselWrapper />
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
