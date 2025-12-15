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
const SEOContentSection = dynamic(() => import('@/components/home/SEOContentSection'));

export async function generateMetadata() {
  return {
    title: "Best Umrah Transport Services Saudi Arabia | أفضل نقل معتمرين - Al Aqsa",
    description: "Book reliable Umrah transport: VIP GMC Yukon, Jeddah Airport to Makkah taxi & Madinah transfers. Trusted, safe & comfortable. احجز سيارة عائلية للعمرة من مطار جدة لمكة",
    alternates: {
      canonical: 'https://alaqsaumrahtransport.com',
    },
    keywords: [
      "Umrah transport services", "Makkah to Madinah taxi", "Jeddah airport to Makkah", "VIP Umrah transport", "GMC Yukon Umrah",
      "نقل معتمرين", "تاكسي مكة", "توصيل من مطار جدة الى مكة", "شركة نقل عمرة", "سيارات جمس للعمرة"
    ],
    openGraph: {
      title: "Luxury Umrah Transport: Makkah to Madinah & Airport Taxi | Al Aqsa",
      description: "Safe, reliable, and comfortable Umrah transport services. 24/7 Support. Book your VIP ride today. خدمة نقل المعتمرين VIP",
    }
  };
}

export default async function Home() {
  const heroSection = await getSectionContent('home-hero');
  // SEO Optimized Fallbacks
  const heroTitle = heroSection?.title || "Premium Umrah Transport Services in Saudi Arabia";
  // Styled Subtitle with Arabic
  const heroSubtitleText = heroSection?.subtitle || "Reliable Jeddah Airport Transfers & Makkah-Madinah Taxi";
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
    <main>
      {/* Hero Section */}
      <Hero
        title={heroTitle}
        subtitle={heroSubtitleContent}
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

      {/* SEO Content Section */}
      <SEOContentSection />

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
