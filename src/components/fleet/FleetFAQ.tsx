import React from 'react';

const fleetFaqs = [
  {
    question: 'How much luggage can each vehicle carry?',
    answer: 'Our sedans (Camry) comfortably carry 2 large bags, the GMC Yukon carries 4–5, and the Toyota Hiace can carry up to 10. For larger groups, the Toyota Coaster carries 15+ bags.',
  },
  {
    question: 'Is there a vehicle suitable for elderly pilgrims?',
    answer: 'Yes — our GMC Yukon offers easy step-in access and our drivers provide door-to-door assistance, including luggage support for elderly or less mobile passengers.',
  },
  {
    question: 'What if our group is slightly over the seat capacity?',
    answer: 'Contact us via WhatsApp before booking — we can recommend the next vehicle size up or split your group across two vehicles at no extra coordination cost.',
  },
  {
    question: 'Do your drivers speak English?',
    answer: 'Yes, our drivers are multilingual and experienced in serving international pilgrims. Mention your preferred language when booking via WhatsApp.',
  },
];

export default function FleetFAQ() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: fleetFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800" aria-labelledby="fleet-faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-12 relative">
            <h2 id="fleet-faq-heading" className="text-3xl md:text-4xl font-bold text-foreground inline-block relative">
                Frequently Asked Questions
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary rounded-full" />
            </h2>
        </div>
        <div className="space-y-4">
          {fleetFaqs.map((faq) => (
            <details key={faq.question} className="group bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 cursor-pointer border border-slate-200 dark:border-slate-700">
              <summary className="font-bold text-lg text-slate-900 dark:text-white list-none flex justify-between items-center">
                {faq.question}
                <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
