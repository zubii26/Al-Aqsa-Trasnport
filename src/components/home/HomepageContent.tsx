// components/home/HomepageContent.tsx
// SERVER COMPONENT — no "use client", no hooks, no client-side fetching.
// All content renders in the initial HTML response — required for SEO word count.

import { getWhatsAppLink } from '@/lib/whatsapp';

export default function HomepageContent() {
  const whatsappHref = getWhatsAppLink(
    'Salam Al Aqsa, I would like to book a transfer. My route is: [route]. Date: [date]. Passengers: [count]. Luggage: [bags].'
  );

  return (
    <section
      className="py-20 md:py-28 bg-white dark:bg-[#060E1E] border-t border-slate-100 dark:border-slate-800"
      aria-label="Al Aqsa Umrah Transport — Services and Route Guide"
    >
      <div className="container mx-auto px-4 max-w-5xl">

        {/* ── H1 Block ─────────────────────────────────────────── */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-3">
            Umrah Taxi Service in Saudi Arabia — Jeddah, Makkah &amp; Madinah
          </h1>
          <p
            lang="ar"
            dir="rtl"
            className="text-xl md:text-2xl font-bold text-secondary mt-2"
            style={{ fontFamily: 'var(--font-reem-kufi)' }}
          >
            خدمة نقل المعتمرين والحجاج في المملكة العربية السعودية
          </p>

          <div className="mt-8 max-w-3xl mx-auto space-y-4 text-left text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              Al Aqsa Umrah Transport is a Nusuk-registered private transport company operating
              across Jeddah, Makkah, Madinah and Taif. We carry pilgrims from the moment they
              clear customs at King Abdulaziz International Airport to the moment they check in
              for the flight home — airport transfers, hotel pickups, intercity runs between the
              two Holy Cities, and Ziyarat tours to the sites that give the journey its context.
            </p>
            <p>
              Every vehicle is licensed. Every driver is vetted. Every price is agreed before
              you travel. There is no meter, no surge, and no negotiation at the kerb at two in
              the morning with a suitcase in each hand.
            </p>
          </div>

          <p
            lang="ar"
            dir="rtl"
            className="mt-5 text-base font-semibold text-secondary/80 text-center"
            style={{ fontFamily: 'var(--font-reem-kufi)' }}
          >
            جميع مركباتنا مسجّلة ومعتمدة في منصة نُسك
          </p>
        </div>

        {/* ── H2: Routes ───────────────────────────────────────── */}
        <div className="mb-16 space-y-10">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              The Routes We Run Every Day
            </h2>
            <p
              lang="ar"
              dir="rtl"
              className="mt-1 text-base text-secondary font-semibold"
              style={{ fontFamily: 'var(--font-reem-kufi)' }}
            >
              المسارات التي نخدمها يومياً
            </p>
          </div>

          {/* H3: KAIA to Makkah */}
          <div className="pl-0 md:pl-4 border-l-0 md:border-l-2 md:border-secondary/30 space-y-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Jeddah Airport to Makkah
              </h3>
              <span
                lang="ar"
                dir="rtl"
                className="text-secondary text-base font-medium"
                style={{ fontFamily: 'var(--font-reem-kufi)' }}
              >
                من مطار جدة إلى مكة المكرمة
              </span>
            </div>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p>
                The first leg of most Umrah journeys. King Abdulaziz International Airport sits
                roughly <strong>90 kilometres</strong> from the Haram; the drive takes{' '}
                <strong>60 to 90 minutes</strong> depending on your terminal and the hour of arrival.
              </p>
              <p>
                We monitor your flight number, so a three-hour delay costs you nothing and no
                driver leaves before you land. Pickup is from the arrivals hall rather than a
                distant car park. We take you to the closest hotel drop-off the traffic police
                permit — and for Clock Tower and Jabal Omar properties, that point changes by
                time of day and shifts again throughout Ramadan. Our drivers know which barrier
                is open tonight.
              </p>
            </div>
          </div>

          {/* H3: Makkah to Madinah */}
          <div className="pl-0 md:pl-4 border-l-0 md:border-l-2 md:border-secondary/30 space-y-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Makkah to Madinah
              </h3>
              <span
                lang="ar"
                dir="rtl"
                className="text-secondary text-base font-medium"
                style={{ fontFamily: 'var(--font-reem-kufi)' }}
              >
                من مكة المكرمة إلى المدينة المنورة
              </span>
            </div>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p>
                Approximately <strong>450 kilometres</strong> on Highway 15; four to four and a
                half hours in normal conditions. This is a long drive, and vehicle choice matters
                more here than on any other route.
              </p>
              <p>
                We stop at the Sasco or Al Bustan rest areas for prayer, food and washrooms, and
                we build those stops into the schedule rather than treating them as lost time.
                Families travelling with young children or elderly parents should budget five hours
                door to door and tell us in advance — we will plan the stops around you.
              </p>
            </div>
          </div>

          {/* H3: Madinah Airport */}
          <div className="pl-0 md:pl-4 border-l-0 md:border-l-2 md:border-secondary/30 space-y-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Madinah Airport Transfers
              </h3>
              <span
                lang="ar"
                dir="rtl"
                className="text-secondary text-base font-medium"
                style={{ fontFamily: 'var(--font-reem-kufi)' }}
              >
                توصيل مطار المدينة المنورة
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Prince Mohammad Bin Abdulaziz Airport sits close to the city centre; most hotel
              transfers take <strong>20 to 30 minutes</strong>. We also run direct Madinah Airport
              to Makkah transfers for pilgrims flying into Madinah first — roughly four and a
              half hours.
            </p>
          </div>

          {/* H3: Makkah to Taif */}
          <div className="pl-0 md:pl-4 border-l-0 md:border-l-2 md:border-secondary/30 space-y-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Makkah to Taif
              </h3>
              <span
                lang="ar"
                dir="rtl"
                className="text-secondary text-base font-medium"
                style={{ fontFamily: 'var(--font-reem-kufi)' }}
              >
                من مكة المكرمة إلى الطائف
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Ninety minutes up the escarpment, and one of the most scenic drives in the Kingdom.
              Popular as a half-day or full-day excursion, particularly through summer when Taif
              runs noticeably cooler than Makkah.
            </p>
          </div>

          {/* H3: Ziyarat */}
          <div className="pl-0 md:pl-4 border-l-0 md:border-l-2 md:border-secondary/30 space-y-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Ziyarat Tours
              </h3>
              <span
                lang="ar"
                dir="rtl"
                className="text-secondary text-base font-medium"
                style={{ fontFamily: 'var(--font-reem-kufi)' }}
              >
                جولات الزيارات في مكة والمدينة
              </span>
            </div>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>In Makkah:</strong> Jabal al-Nour and the Cave of Hira, Jabal Thawr,
                Mina, Muzdalifah, Arafat, and Masjid Aisha at Taneem for those renewing Ihram.
              </p>
              <p>
                <strong>In Madinah:</strong> Masjid Quba, Masjid Qiblatain, Mount Uhud and the
                Seven Mosques.
              </p>
              <p>
                A standard Makkah Ziyarat runs three to four hours; Madinah is typically three.
                Our drivers can tell you what you are looking at, though they are drivers rather
                than licensed scholars. If you want formal guidance, say so when booking and we
                will arrange it.
              </p>
            </div>
          </div>
        </div>

        {/* ── H2: Vehicle Guide ────────────────────────────────── */}
        <div className="mb-16 space-y-8">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Choosing the Right Vehicle
            </h2>
            <p
              lang="ar"
              dir="rtl"
              className="mt-1 text-base text-secondary font-semibold"
              style={{ fontFamily: 'var(--font-reem-kufi)' }}
            >
              اختيار السيارة المناسبة
            </p>
          </div>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            Vehicle choice is where most pilgrims get it wrong, and the error is almost always
            luggage rather than seats. A car that seats seven does not carry seven people&apos;s
            suitcases.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                name: 'Toyota Camry',
                spec: '4 passengers · 2 large bags',
                desc: 'Right for couples and solo travellers with normal luggage, and the most economical option on every route.',
              },
              {
                name: 'Hyundai Staria',
                spec: 'Up to 7 passengers · 5 bags',
                desc: 'Modern, high roof, easy step-in height. A strong middle option for a family of five carrying real luggage.',
              },
              {
                name: 'GMC Yukon XL',
                spec: '7 seats · comfortable at 4–5 adults with full luggage',
                desc: 'Air-ride suspension and superior sound insulation make it the best choice for elderly parents and the Makkah–Madinah leg.',
              },
              {
                name: 'Toyota Hiace',
                spec: '11 seats · 10 large suitcases',
                desc: 'The correct answer for groups of eight and above, and for anyone who has shopped seriously in Madinah.',
              },
              {
                name: 'Toyota Coaster',
                spec: '19 seats',
                desc: 'For organised groups, extended families travelling together, and agency bookings.',
              },
              {
                name: '50-Seater Coach',
                spec: 'Full capacity',
                desc: 'For full group departures and Hajj operations.',
              },
            ].map((v) => (
              <div
                key={v.name}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{v.name}</h3>
                  <span className="text-xs text-secondary font-semibold whitespace-nowrap shrink-0">
                    {v.spec}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            If you are unsure, send us your passenger count and your suitcase count on WhatsApp.
            We will tell you which vehicle fits — including when a cheaper one is enough.
          </p>
        </div>

        {/* ── H2: Pricing ──────────────────────────────────────── */}
        <div className="mb-16 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              How Our Pricing Works
            </h2>
            <p
              lang="ar"
              dir="rtl"
              className="mt-1 text-base text-secondary font-semibold"
              style={{ fontFamily: 'var(--font-reem-kufi)' }}
            >
              أسعار ثابتة ومعلنة مسبقاً
            </p>
          </div>

          <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 text-base md:text-lg">
            <p>
              We quote a fixed, all-inclusive price before you book. It covers the vehicle, the
              driver, fuel and tolls. It does not change because traffic was heavy, because your
              flight landed late, or because it is the last ten nights of Ramadan and you booked
              ahead.
            </p>
            <p>
              No prepayment is required for standard transfers — you pay the driver on arrival,
              in cash or by transfer. For group bookings, multi-day charters and agency contracts,
              we invoice on agreed terms.
            </p>
            <p>
              Rates do rise during Ramadan and Hajj, as they do across the entire market. The
              difference is that ours rise on a published schedule announced in advance, rather
              than at the moment you need a car. Booking early locks your rate.
            </p>
          </div>

          <p
            lang="ar"
            dir="rtl"
            className="text-center text-base font-semibold text-secondary"
            style={{ fontFamily: 'var(--font-reem-kufi)' }}
          >
            سعر ثابت متفق عليه مسبقاً، بدون عداد وبدون مفاجآت · الدفع عند الوصول، دون أي دفعة مقدمة
          </p>
        </div>

        {/* ── H2: Who We Serve ─────────────────────────────────── */}
        <div className="mb-16 space-y-8">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Who We Serve
            </h2>
            <p
              lang="ar"
              dir="rtl"
              className="mt-1 text-base text-secondary font-semibold"
              style={{ fontFamily: 'var(--font-reem-kufi)' }}
            >
              من نخدم
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h3 className="font-bold text-slate-900 dark:text-white">Families</h3>
                <span
                  lang="ar"
                  dir="rtl"
                  className="text-secondary text-sm font-medium"
                  style={{ fontFamily: 'var(--font-reem-kufi)' }}
                >
                  العوائل
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Room for strollers, flexible stops for prayer and for children, and baby seats
                on request with advance notice. We keep families in one vehicle rather than
                splitting them across two cars.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Sisters Travelling Without a Mahram
                </h3>
                <span
                  lang="ar"
                  dir="rtl"
                  className="text-secondary text-sm font-medium"
                  style={{ fontFamily: 'var(--font-reem-kufi)' }}
                >
                  الأخوات المسافرات بدون محرم
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Vetted drivers trained in appropriate conduct, a live trip link you can share
                with family before you set off, and coordination handled entirely over WhatsApp —
                so there is no roadside negotiation with a stranger.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Elderly &amp; Mobility-Limited Pilgrims
                </h3>
                <span
                  lang="ar"
                  dir="rtl"
                  className="text-secondary text-sm font-medium"
                  style={{ fontFamily: 'var(--font-reem-kufi)' }}
                >
                  كبار السن
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Door-to-door assistance boarding and alighting, wheelchair handling, the closest
                permitted drop-off point, and a driving style chosen for comfort rather than speed.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Agencies &amp; Tour Operators
                </h3>
                <span
                  lang="ar"
                  dir="rtl"
                  className="text-secondary text-sm font-medium"
                  style={{ fontFamily: 'var(--font-reem-kufi)' }}
                >
                  الوكالات ومنظمو الرحلات
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Fleet availability across all four cities, a single point of contact, consolidated
                invoicing, and Ramadan and Hajj capacity agreed months ahead.
              </p>
            </div>
          </div>
        </div>

        {/* ── H2: Safety & Licensing ───────────────────────────── */}
        <div className="mb-16 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Licensing, Safety and Accountability
            </h2>
            <p
              lang="ar"
              dir="rtl"
              className="mt-1 text-base text-secondary font-semibold"
              style={{ fontFamily: 'var(--font-reem-kufi)' }}
            >
              التراخيص والسلامة
            </p>
          </div>

          <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 text-base md:text-lg">
            <p>
              Every vehicle in our fleet is registered and verified under the{' '}
              <strong>Nusuk</strong> system and operates under Transport General Authority
              licensing. Drivers hold valid commercial licences and are vetted before they carry
              a single passenger.
            </p>
            <p>
              If a vehicle fails en route, our standing protocol is fixed: the driver secures
              it in a safe zone with air conditioning and water running, the nearest standby
              unit is dispatched from our Makkah or Madinah base against a 60-minute maximum
              target, and the affected booking is refunded or credited in full. Our operations
              line is staffed 24 hours.
            </p>
          </div>

          <p
            lang="ar"
            dir="rtl"
            className="text-center text-sm font-semibold text-secondary"
            style={{ fontFamily: 'var(--font-reem-kufi)' }}
          >
            سائقون مرخّصون وذوو خبرة في طرق الحرمين · خدمة على مدار الساعة طوال أيام الأسبوع
          </p>
        </div>

        {/* ── H2: Booking CTA ──────────────────────────────────── */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 text-center space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Booking
            </h2>
            <p
              lang="ar"
              dir="rtl"
              className="text-base text-secondary font-semibold"
              style={{ fontFamily: 'var(--font-reem-kufi)' }}
            >
              احجز رحلتك
            </p>
          </div>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Send us your route, date, time, passenger count and luggage count on WhatsApp. We
            confirm within minutes with a fixed price and the assigned vehicle. For airport
            pickups, include your flight number so we can track it.
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20bc5a] text-white font-bold text-lg rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-all hover:-translate-y-0.5"
          >
            {/* WhatsApp icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 shrink-0"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span
              lang="ar"
              dir="rtl"
              style={{ fontFamily: 'var(--font-reem-kufi)' }}
            >
              احجز عبر واتساب الآن
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
