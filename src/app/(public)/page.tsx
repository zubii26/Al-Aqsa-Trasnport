import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './page.module.css';
import FadeIn from '@/components/common/FadeIn';
import Hero from '@/components/common/Hero';

import { ArrowRight } from 'lucide-react';

import { getSectionContent, getSectionImage, getCustomField } from '@/lib/content-service';
import { getWhatsAppLink } from '@/lib/whatsapp';

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
const ExpandedSEOContent = dynamic(() => import('@/components/home/ExpandedSEOContent'));

const TransportServices = dynamic(() => import('@/components/home/TransportServices'));
const Testimonials = dynamic(() => import('@/components/home/Testimonials'));
const FleetGallery = dynamic(() => import('@/components/home/FleetGallery'));
const BookingGuide = dynamic(() => import('@/components/home/BookingGuide'));
const QuickBookingForm = dynamic(() => import('@/components/home/QuickBookingForm'));

export async function generateMetadata() {
  return {
    title: "Al Aqsa Umrah Transport – Trusted Global Umrah Travel Partner",
    description: "Al Aqsa Umrah Transport offers trusted, affordable, and safe Umrah travel services worldwide. Serving pilgrims with comfort and care with our luxury fleet.",
    alternates: {
      canonical: 'https://alaqsaumrahtransport.com',
    },
    keywords: [
      "Umrah transport services", "Umrah travel agency", "Umrah packages worldwide",
      "Pilgrimage transport solutions", "Affordable Umrah transport", "Trusted Umrah travel partner",
      "Umrah bus service", "Umrah taxi service", "Umrah group transport", "International Umrah pilgrims",
      "Taxi Jeddah Airport to Makkah", "GMC Yukon Makkah"
    ],
    openGraph: {
      title: "Al Aqsa Umrah Transport – Trusted Global Umrah Travel Partner",
      description: "Al Aqsa Umrah Transport offers trusted, affordable, and safe Umrah travel services worldwide. Serving pilgrims with comfort and care.",
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
  const ctaText = getCustomField(heroSection, 'cta_text') || "Book Now / احجز الآن";
  const ctaLink = "/booking";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Al Aqsa Umrah Transport",
        "url": "https://alaqsaumrahtransport.com",
        "logo": "https://alaqsaumrahtransport.com/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+966-54-549-4921",
          "contactType": "customer service",
          "areaServed": "SA",
          "availableLanguage": ["en", "ar"]
        },
        "sameAs": [
          "https://www.facebook.com/alaqsaumrahtransport",
          "https://www.instagram.com/alaqsaumrahtransport"
        ]
      },
      {
        "@type": "WebSite",
        "name": "Al Aqsa Umrah Transport Services",
        "url": "https://alaqsaumrahtransport.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://alaqsaumrahtransport.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <main className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        <div className="hidden md:block w-full max-w-md ml-auto">
          <QuickBookingForm
            title="Book Your Ride"
            subtitle="Instant Confirmation"
            className="shadow-2xl"
          />
        </div>
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

      {/* SEO Content Section - Enhanced */}
      <ExpandedSEOContent />

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
            <a
              href={getWhatsAppLink("Salam Al Aqsa, I am ready to book my journey.")}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Book Your Ride via WhatsApp <ArrowRight size={20} />
            </a>
          </FadeIn>
        </div>
      </section>
      {/* Force Rebuild */}
    </main>
  );
}
