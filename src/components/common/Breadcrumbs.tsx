'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    overrideLastItem?: string;
    className?: string;
    hideJsonLd?: boolean;
}

export default function Breadcrumbs({ overrideLastItem, className = '', hideJsonLd = false }: BreadcrumbsProps) {
    const pathname = usePathname();

    // Split pathname into segments, filter empty strings
    const segments = pathname.split('/').filter(Boolean);

    // Identify the app root (first segment)
    const appRoot = segments[0] || '';
    const isMultiApp = ['umrah'].includes(appRoot);

    // If we rely on multi-app structure, Home should point to /appRoot
    // And we should filter out the appRoot from the specific breadcrumb segments shown
    const homeLink = isMultiApp ? `/${appRoot}` : '/';

    // Filter segments to display (remove the app root if it is one of our known apps)
    const displaySegments = isMultiApp ? segments.slice(1) : segments;

    // Map segments to readable names (optional dictionary)
    const formatSegment = (segment: string) => {
        // Handle common routes if needed, otherwise capitalize
        if (segment === 'blog') return 'Blog';
        if (segment === 'fleet') return 'Our Fleet';
        if (segment === 'services') return 'Services';
        // Default: remove dashes and capitalize
        return segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `https://alaqsaumrahtransport.com${homeLink}`
            },
            ...displaySegments.map((segment, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": formatSegment(segment),
                "item": `https://alaqsaumrahtransport.com${homeLink === '/' ? '' : homeLink}/${displaySegments.slice(0, index + 1).join('/')}`
            }))
        ]
    };

    return (
        <nav aria-label="Breadcrumb" className={`flex items-center text-sm ${className}`}>
            {!hideJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ol className="flex items-center flex-wrap gap-2">
                {/* Home Link */}
                <li className="flex items-center">
                    <Link
                        href={homeLink}
                        className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Home size={14} />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {displaySegments.map((segment, index) => {
                    const isLast = index === displaySegments.length - 1;
                    // Reconstruct path: /appRoot/seg1/seg2...
                    // If multi-app, prepend /appRoot. If not, just /seg1...
                    const path = isMultiApp
                        ? `/${appRoot}/${displaySegments.slice(0, index + 1).join('/')}`
                        : `/${displaySegments.slice(0, index + 1).join('/')}`;

                    // If it's the last item and we have an override (e.g., Article Title)
                    const displayText = (isLast && overrideLastItem)
                        ? overrideLastItem
                        : formatSegment(segment);

                    return (
                        <li key={path} className="flex items-center">
                            <ChevronRight size={14} className="text-white/40 mx-1" />
                            {isLast ? (
                                <span
                                    className="text-white/90 font-medium truncate max-w-[200px] md:max-w-xs"
                                    aria-current="page"
                                    title={overrideLastItem}
                                >
                                    {displayText}
                                </span>
                            ) : (
                                <Link
                                    href={path}
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    {displayText}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
