'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
    if (!gaId) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Default Consent Mode V2 (Denied by default)
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied'
          });

          gtag('js', new Date());

          gtag('config', ${JSON.stringify(gaId)});
        `}
            </Script>
        </>
    );
}
