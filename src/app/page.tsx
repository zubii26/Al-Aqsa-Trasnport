import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './page.module.css';
import FadeIn from '@/components/common/FadeIn';
import Hero from '@/components/common/Hero';
import BookingFormWrapper from '@/components/home/BookingFormWrapper';
import { ArrowRight } from 'lucide-react';

import { getSectionContent, getSectionImage, getCustomField } from '@/lib/content-service';

import AnimatedBackground from '@/components/ui/AnimatedBackground';

// Lazy load heavy components
const InstantPriceCalculator = dynamic(() => import('@/components/home/InstantPriceCalculator'));
const Features = dynamic(() => import('@/components/home/Features'));
const FleetCarouselWrapper = dynamic(() => import('@/components/home/FleetCarouselWrapper'));
const ReviewsSection = dynamic(() => import('@/components/reviews/ReviewsSection'));
const CustomerGallery = dynamic(() => import('@/components/home/CustomerGallery'));
const LatestArticles = dynamic(() => import('@/components/home/LatestArticles'));
const SEOContentSection = dynamic(() => import('@/components/home/SEOContentSection'));
const TransportServices = dynamic(() => import('@/components/home/TransportServices'));
const TestimonialHighlight = dynamic(() => import('@/components/reviews/TestimonialHighlight'));

export async function generateMetadata() {
  return {
    title: "Premium Umrah Transport Services Saudi Arabia | Al Aqsa",
    description: "Book luxury Umrah transport in Saudi. Trusted Jeddah airport transfers, Makkah to Madinah taxi & VIP Ziyarat. Safe, comfortable & spiritual journeys.",
    alternates: {
      canonical: 'https://alaqsaumrahtransport.com',
    },
    keywords: [
      "Umrah transport services", "Makkah to Madinah taxi", "Jeddah airport to Makkah", "VIP Umrah transport",
      "Madinah airport transfers", "Haram shuttle", "luxury Umrah vehicles", "pilgrim transportation", "Saudi Arabia pilgrimage transport",
      "نقل معتمرين", "تاكسي مكة", "توصيل من مطار جدة الى مكة", "شركة نقل عمرة", "سيارات جمس للعمرة"
    ],
    openGraph: {
      title: "Premium Umrah Transport Services Saudi Arabia | Al Aqsa",
      description: "Book luxury Umrah transport in Saudi. Trusted Jeddah airport transfers, Makkah to Madinah taxi & VIP Ziyarat. Safe, comfortable & spiritual journeys.",
    }
  };
}

export default async function Home() {
  const heroSection = await getSectionContent('home-hero');
  // SEO Optimized Fallbacks
  const heroTitle = heroSection?.title || "Premium Umrah Transport Services: Jeddah, Makkah & Madinah";
  // Styled Subtitle with Arabic
  const heroSubtitleText = heroSection?.subtitle || "Reliable Jeddah & Madinah Airport Transfers, Luxury Makkah-Madinah Travel";
  const heroSubtitleContent = (
    <>
      <span className="block mb-3 opacity-90">{heroSubtitleText}</span>
      <span
        className="block text-2xl md:text-3xl mt-2 text-amber-400 font-bold tracking-wide"
        style={{ fontFamily: 'var(--font-reem-kufi)' }}
      >
        خدمة نقل المعتمرين VIP
      </span>
    </>
  );

  const heroImage = getSectionImage(heroSection, 'desktop') || "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop";
  const ctaText = getCustomField(heroSection, 'cta_text') || "Book Your Ride / احجز الآن";
  const ctaLink = getCustomField(heroSection, 'cta_link') || "/booking";

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <Hero
        title={heroTitle}
        subtitle={heroSubtitleContent}
        bgImage={heroImage}
        layout="two-column"
        ctaText={ctaText}
        ctaLink={ctaLink}
        backgroundChildren={<AnimatedBackground />}
      >
        <BookingFormWrapper />
      </Hero>

      {/* Transport Services Section - NEW */}
      <TransportServices />

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
      <TestimonialHighlight />
      {/* Reviews Section */}
      <ReviewsSection />

      {/* SEO Content Section */}
      <SEOContentSection />

      {/* Latest Articles Section */}
      <LatestArticles />


      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container relative z-10">
          <FadeIn>
            <h2 className={styles.ctaTitle}>Ready to Begin Your Blessed Journey?</h2>
            <p className={styles.ctaText}>
              Book your VIP transport now and let us take care of the logistics while you focus on your worship.
            </p>
            <Link href="/booking" className={styles.ctaButton}>
              Book Your Ride Now <ArrowRight size={20} />
            </Link>
          </FadeIn>
        </div>
      </section>
      {/* Force Rebuild */}
    </main>
  );
}
