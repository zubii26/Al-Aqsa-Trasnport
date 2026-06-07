import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const commonDisallow = [
    '/admin/',
    '/track-booking/confirmation',
    '/booking/thankyou',
    '/api/',
    '/*?session=',
    '/*?ref=',
  ];

  return {
    rules: [
      {
        userAgent: [
          'Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User',
          'ClaudeBot', 'anthropic-ai', 'PerplexityBot',
          'Google-Extended', 'Meta-ExternalAgent', 'YouBot',
          'CCBot', 'cohere-ai', 'Omgilibot', 'Diffbot'
        ],
        allow: '/',
        disallow: commonDisallow,
      },
      {
        userAgent: ['DuckDuckBot', 'Slurp', 'Baiduspider'],
        allow: '/',
        disallow: commonDisallow,
        crawlDelay: 1,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: commonDisallow,
        crawlDelay: 1,
      },
    ],
    sitemap: 'https://www.alaqsaumrahtransport.com/sitemap.xml',
  };
}
