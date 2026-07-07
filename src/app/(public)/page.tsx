import Link from 'next/link';
import Image from 'next/image';
import SchemaInjector from '@/components/SchemaInjector';
import { localBusinessSchema, homepageFAQSchema, organizationSchema } from '@/lib/schema/homepage-schema';
import styles from './page.module.css';
import Hero from '@/components/common/Hero';
import { ArrowRight } from 'lucide-react';

import { getSectionContent, getSectionImage, getCustomField } from '@/lib/content-service';
import { getWhatsAppLink } from '@/lib/whatsapp';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import TrustBadges from '@/components/home/TrustBadges';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import QuickBookingForm from '@/components/home/QuickBookingForm';
import PopularRoutes from '@/components/home/PopularRoutes';
import FleetPreview from '@/components/home/FleetPreview';
import CustomerGallery from '@/components/home/CustomerGallery';

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
  const heroTitle = heroSection?.title || "Premium Umrah Transport Services: Jeddah, Makkah & Madinah";
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

  const heroImage = "/images/umrah-pilgrims-makkah-taxi-hero.webp";
  const ctaText = getCustomField(heroSection, 'cta_text') || "Book Now / احجز الآن";
  const ctaLink = "/booking";

  return (
    <main className="overflow-x-hidden">
      <SchemaInjector schemas={[localBusinessSchema, homepageFAQSchema, organizationSchema]} />
      
      {/* 1. Hero Section */}
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

      {/* 2. Fleet Preview */}
      <FleetPreview />

      {/* 3. Trust & Assurance Section */}
      <TrustBadges />

      {/* 4. Popular Routes */}
      <PopularRoutes />

      {/* 5. Customer Reviews (Testimonials) */}
      <ReviewsSection />

      {/* 6. Pilgrim Gallery */}
      <CustomerGallery />

      {/* 7. Premium Final CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-t border-slate-800">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* High Quality Background Image */}
          <Image 
            src="/images/umrah-pilgrims-makkah-taxi-hero.webp" 
            alt="Al Aqsa Umrah Transport Premium Background" 
            fill 
            className="object-cover" 
            quality={100} 
            priority={false} 
          />
          
          {/* Professional Overlays */}
          {/* Dark gradient overlay for readability and premium feel */}
          <div className="absolute inset-0 bg-slate-950/80 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/90" />
          
          {/* Glowing orbs for depth */}
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[120px] mix-blend-screen opacity-60" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/15 blur-[100px] mix-blend-screen opacity-60" />
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)] backdrop-blur-md">
              Begin Your Spiritual Journey
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-xl">
              Ready to Experience <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-[#fcd34d] to-secondary drop-shadow-2xl">
                Absolute Comfort?
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-medium">
              Book your VIP transport now and let us take care of the logistics while you focus entirely on your worship and spiritual peace.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link 
                href="/booking" 
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-bold text-lg shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition-all hover:-translate-y-1 overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10">Book Now</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              
              <a 
                href={getWhatsAppLink("Salam Al Aqsa, I am ready to book my journey.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white rounded-full font-bold text-lg transition-all backdrop-blur-lg shadow-xl w-full sm:w-auto hover:-translate-y-1"
              >
                Contact via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
