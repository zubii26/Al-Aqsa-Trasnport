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
    title: "Jeddah Airport to Makkah Taxi | Al Aqsa Umrah Transport",
    description: "Book reliable Jeddah Airport to Makkah taxi services. We offer VIP, safe, and affordable 24/7 pilgrim travel across Saudi Arabia with our luxury fleet.",
    alternates: {
      canonical: 'https://www.alaqsaumrahtransport.com',
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

  const heroImage = getSectionImage(heroSection, 'desktop') || "/images/blog/makkah-haram-view.jpg";
  const ctaText = getCustomField(heroSection, 'cta_text') || "Book Now / احجز الآن";
  const ctaLink = "/booking";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "Al Aqsa Umrah Transport",
          "url": "https://www.alaqsaumrahtransport.com",
          "logo": "https://www.alaqsaumrahtransport.com/logo.png",
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
          "url": "https://www.alaqsaumrahtransport.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.alaqsaumrahtransport.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "name": "Al Aqsa Umrah Transport",
      "url": "https://www.alaqsaumrahtransport.com",
      "telephone": "+966548707332",
      "email": "alaqsaumrahtransport@gmail.com",
      "description": "Private Umrah taxi in Saudi Arabia. Jeddah Airport to Makkah, Makkah to Madinah, Ziyarat tours. GMC Yukon, Hiace, Staria fleet. 24/7 service.",
      "areaServed": [
        { "@type": "City", "name": "Makkah" },
        { "@type": "City", "name": "Madinah" },
        { "@type": "City", "name": "Jeddah" }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Makkah",
        "addressRegion": "Makkah Province",
        "addressCountry": "SA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 21.3891,
        "longitude": 39.8579
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      },
      "priceRange": "SAR 200–1100",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "87",
        "bestRating": "5"
      },
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61586281396171",
        "https://www.instagram.com/al_aqsa_umrah_transport"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much is a taxi from Jeddah Airport to Makkah?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A private taxi from Jeddah Airport (KAIA) to Makkah starts from SAR 200 for a Toyota Camry (4 passengers) and SAR 500 for a GMC Yukon XL (7 passengers). All prices are fixed with no hidden fees. Pay on arrival."
          }
        },
        {
          "@type": "Question",
          "name": "How long does the journey from Makkah to Madinah take by taxi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The journey from Makkah to Madinah is approximately 450km and takes 4 to 4.5 hours. We can stop at the Miqat (Bir Ali) for Ihram at no extra charge."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer Ziyarat tours in Makkah and Madinah?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Private Ziyarat tours in Makkah (Jabal Al-Nour, Arafat, Jannat al-Mu'alla) and Madinah (Masjid Quba, Mount Uhud). Tours start from SAR 400 per vehicle."
          }
        },
        {
          "@type": "Question",
          "name": "Is transport available for elderly or wheelchair users?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Drivers are trained to assist elderly pilgrims. GMC Yukon XL and Hyundai Staria provide the most comfortable seating with easy boarding for elderly and mobility-impaired passengers."
          }
        }
      ]
    }
  ];

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
