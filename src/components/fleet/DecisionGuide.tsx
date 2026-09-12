'use client';

export default function DecisionGuide() {
  const decisionGuide = [
    { need: 'Solo traveler or couple', recommend: 'Toyota Camry', why: 'Comfortable, economical for 1–4 people' },
    { need: 'Small family, extra comfort', recommend: 'GMC Yukon', why: 'Premium ride, handles 4 adults + luggage well' },
    { need: 'Family of 5–7 with luggage', recommend: 'Hyundai Staria or Toyota Hiace', why: 'More cabin and trunk space than the Yukon for the same passenger count' },
    { need: 'Large group (10+)', recommend: 'Toyota Coaster', why: 'Purpose-built for group Umrah/Ziyarat transport' },
    { need: 'VIP / privacy priority', recommend: 'Mercedes S-Class', why: 'Highest comfort tier, best for VIP or business travel' },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-12 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground inline-block relative">
                Which Vehicle Should I Choose?
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary rounded-full" />
            </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {decisionGuide.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{item.need}</h3>
              <p className="text-xl font-bold text-secondary mb-3">{item.recommend}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.why}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
