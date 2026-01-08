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
const SafetyPromise = dynamic(() => import('@/components/home/SafetyPromise'));
const PassengerCare = dynamic(() => import('@/components/home/PassengerCare'));
const FleetCarouselWrapper = dynamic(() => import('@/components/home/FleetCarouselWrapper'));
const ReviewsSection = dynamic(() => import('@/components/reviews/ReviewsSection'));
const CustomerGallery = dynamic(() => import('@/components/home/CustomerGallery'));
const LatestArticles = dynamic(() => import('@/components/home/LatestArticles'));
const SEOContentSection = dynamic(() => import('@/components/home/SEOContentSection'));
const TransportServices = dynamic(() => import('@/components/home/TransportServices'));
const Testimonials = dynamic(() => import('@/components/home/Testimonials'));
const FleetGallery = dynamic(() => import('@/components/home/FleetGallery'));
const BookingGuide = dynamic(() => import('@/components/home/BookingGuide'));

export async function generateMetadata() {
  return {
    title: "Umrah Transport Services Saudi Arabia | Taxi Jeddah to Makkah",
    description: "Book trusted Umrah taxi services. Private GMC Yukon & Hyundai Staria transfers from Jeddah Airport to Makkah & Madinah. Official licensed transport company.",
    alternates: {
      canonical: 'https://alaqsaumrahtransport.com',
    },
    keywords: [
      "Umrah Transport Services", "Taxi Jeddah Airport to Makkah",
      "Taxi Makkah to Madinah", "VIP Umrah Taxi", "Jeddah Airport Transfer",
      "GMC Yukon Booking Makkah", "Saudi Transport Company",
      "تاكسي مطار جدة", "نقل معتمرين", "توصيل من مكة للمدينة", "حجز جمس يوكن"
    ],
    openGraph: {
      title: "Umrah Transport Services Saudi Arabia | VIP Taxi Jeddah to Makkah",
      description: "Book trusted private taxi from Jeddah Airport to Makkah. Luxury GMC Yukon & Hyundai Staria fleet. Official licensed service.",
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
      <h2
        className="block text-2xl md:text-3xl mt-2 text-amber-400 font-bold tracking-wide"
        style={{ fontFamily: 'var(--font-reem-kufi)' }}
        lang="ar"
        dir="rtl"
      >
        خدمة نقل المعتمرين VIP
      </h2>
    </>
  );

  const heroImage = getSectionImage(heroSection, 'desktop') || "/images/blog/makkah-haram-view.jpg";
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

      {/* Booking Guide Section - NEW */}
      <BookingGuide />

      {/* Features Section */}
      <Features />

      {/* Passenger Care Section */}
      <PassengerCare />

      {/* Fleet Gallery - NEW */}
      <FleetGallery />

      {/* Fleet Section */}
      <FadeIn>
        <FleetCarouselWrapper />
      </FadeIn>

      {/* Gallery Section */}
      <CustomerGallery />

      {/* Testimonials Section */}
      <Testimonials />
      {/* Reviews Section */}
      <ReviewsSection />

      {/* SEO Content Section */}
      <SEOContentSection />

      {/* Latest Articles Section */}
      <LatestArticles />

      {/* Safety Promise Section - Moved to Bottom */}
      <FadeIn>
        <SafetyPromise />
      </FadeIn>

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
