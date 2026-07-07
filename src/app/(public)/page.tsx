import Link from 'next/link';
import SchemaInjector from '@/components/SchemaInjector';
import { localBusinessSchema, homepageFAQSchema, organizationSchema } from '@/lib/schema/homepage-schema';
import styles from './page.module.css';
import ScrollReveal from '@/components/motion/ScrollReveal';
import Hero from '@/components/common/Hero';

import { ArrowRight } from 'lucide-react';

import { getSectionContent, getSectionImage, getCustomField } from '@/lib/content-service';
import { getWhatsAppLink } from '@/lib/whatsapp';

import AnimatedBackground from '@/components/ui/AnimatedBackground';

import InstantPriceCalculator from '@/components/home/InstantPriceCalculator';
import Features from '@/components/home/Features';
import SafetyPromise from '@/components/home/SafetyPromise';
import PassengerCare from '@/components/home/PassengerCare';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import CustomerGallery from '@/components/home/CustomerGallery';
import RelatedReading from '@/components/blog/RelatedReading';
import ExpandedSEOContent from '@/components/home/ExpandedSEOContent';

import TransportServices from '@/components/home/TransportServices';
import Testimonials from '@/components/home/Testimonials';
import FleetShowcase from '@/components/home/FleetShowcase';
import BookingGuide from '@/components/home/BookingGuide';
import QuickBookingForm from '@/components/home/QuickBookingForm';

export async function generateMetadata() {
  return {
    title: { absolute: "Jeddah Airport to Makkah Taxi | Al Aqsa Umrah Transport" },
    description: "Book reliable Jeddah Airport to Makkah taxi services. We offer VIP, safe, and affordable 24/7 pilgrim travel across Saudi Arabia with our luxury fleet.",
    alternates: {
      canonical: 'https://www.alaqsaumrahtransport.com/',
    },
    keywords: [
      "Umrah transport services", "Umrah travel agency", "Umrah packages worldwide",
      "Pilgrimage transport solutions", "Affordable Umrah transport", "Trusted Umrah travel partner",
      "Umrah bus service", "Umrah taxi service", "Umrah group transport", "International Umrah pilgrims",
      "Taxi Jeddah Airport to Makkah", "GMC Yukon Makkah"
    ],
    openGraph: {
      title: "Jeddah Airport to Makkah Taxi | Al Aqsa Umrah Transport",
      description: "Book reliable Jeddah Airport to Makkah taxi services. We offer VIP, safe, and affordable 24/7 pilgrim travel across Saudi Arabia with our luxury fleet.",
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

  const heroImage = "/images/umrah-pilgrims-makkah-taxi-hero.webp"; // getSectionImage(heroSection, 'desktop') || 
  const ctaText = getCustomField(heroSection, 'cta_text') || "Book Now / احجز الآن";
  const ctaLink = "/booking";

  return (
    <main className="overflow-x-hidden">
      <SchemaInjector schemas={[localBusinessSchema, homepageFAQSchema, organizationSchema]} />
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

      {/* Fleet Showcase - NEW SLIDER */}
      <FleetShowcase />

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

      {/* Fleet Section */}
      <ScrollReveal direction="up">
        <FleetCarouselWrapper />
      </ScrollReveal>

      {/* Gallery Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <CustomerGallery />
      </ScrollReveal>

      {/* Testimonials Section */}
      <ScrollReveal direction="fade" delay={0.2}>
        <Testimonials />
      </ScrollReveal>
      
      {/* Reviews Section */}
      <ScrollReveal direction="up">
        <ReviewsSection />
      </ScrollReveal>

      {/* SEO Content Section - Enhanced */}
      <ScrollReveal direction="fade">
        <ExpandedSEOContent />
      </ScrollReveal>

      {/* Latest Articles Section */}
      <ScrollReveal direction="up">
        <RelatedReading title="Latest from Our Blog" />
      </ScrollReveal>

      {/* Safety Promise Section - Moved to Bottom */}
      <ScrollReveal direction="left">
        <SafetyPromise />
      </ScrollReveal>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container relative z-10">
          <ScrollReveal direction="up">
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
              Book Your Ride via WhatsApp <ArrowRight strokeWidth={1.25} size={20} />
            </a>
          </ScrollReveal>
        </div>
      </section>
      {/* Force Rebuild */}
    </main>
  );
}
