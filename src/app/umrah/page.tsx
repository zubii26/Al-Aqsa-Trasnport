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

export async function generateMetadata() {
  return {
    title: "Al Aqsa Transport | Jeddah Airport Taxi | تاكسي مطار جدة ومكة",
    description: "Book reliable Umrah taxi from Jeddah Airport to Makkah. Luxury GMC Yukon. حجز تاكسي من مطار جدة الى مكة والمدينة. سيارات جمس حديثة وسائقين محترفين.",
    alternates: {
      canonical: 'https://alaqsaumrahtransport.com',
    },
    keywords: [
      "Al Aqsa Umrah Transport", "Taxi Jeddah Airport to Makkah",
      "Makkah to Madinah taxi price", "Jeddah airport transfers", "VIP Umrah taxi",
      "Madinah airport transport", "Haram shuttle Makkah", "luxury GMC Yukon rental", "pilgrim transport saudi arabia",
      "نقل معتمرين", "تاكسي مكة", "توصيل من مطار جدة الى مكة", "شركة نقل عمرة", "سيارات جمس للعمرة",
      "ارخص تاكسي من مطار جدة", "سعر التوصيل من مكة للمدينة", "حجز سيارة عائلية في مكة", "استقبال مطار جدة", "توصيل الحرم المكي"
    ],
    openGraph: {
      title: "Al Aqsa Transport | VIP Jeddah to Makkah Taxi | تاكسي جدة مكة",
      description: "Book trusted private taxi from Jeddah Airport to Makkah. Luxury GMC Yukon & Hyundai Staria fleet. خدمة توصيل vip للمعتمرين.",
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
  const ctaLink = getCustomField(heroSection, 'cta_link') || "/umrah/book";

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
            <Link href="/umrah/book" className={styles.ctaButton}>
              Book Your Ride Now <ArrowRight size={20} />
            </Link>
          </FadeIn>
        </div>
      </section>
      {/* Force Rebuild */}
    </main>
  );
}
