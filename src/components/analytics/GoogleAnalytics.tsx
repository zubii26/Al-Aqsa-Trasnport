'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
    if (!gaId) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Default Consent Mode V2
          // We grant analytics_storage by default to ensure connection/traffic data is visible.
          // We DENY ad_storage (marketing) until explicit consent to be privacy-friendly but functional.
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'granted'
          });

          gtag('js', new Date());

          gtag('config', ${JSON.stringify(gaId)}, { 'debug_mode': true });
        `}
            </Script>
        </>
    );
}
