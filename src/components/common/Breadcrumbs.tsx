'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    overrideLastItem?: string;
    className?: string;
}

export default function Breadcrumbs({ overrideLastItem, className = '' }: BreadcrumbsProps) {
    const pathname = usePathname();

    // Split pathname into segments, filter empty strings
    const segments = pathname.split('/').filter(Boolean);

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
                "item": "https://alaqsaumrahtransport.com"
            },
            ...segments.map((segment, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": formatSegment(segment),
                "item": `https://alaqsaumrahtransport.com/${segments.slice(0, index + 1).join('/')}`
            }))
        ]
    };

    return (
        <nav aria-label="Breadcrumb" className={`flex items-center text-sm ${className}`}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center flex-wrap gap-2">
                {/* Home Link */}
                <li className="flex items-center">
                    <Link
                        href="/"
                        className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Home size={14} />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const path = `/${segments.slice(0, index + 1).join('/')}`;

                    // Specific logic: if we are on a numeric page (e.g. /blog/page/2), skip or handle?
                    // For now, simple logic is fine.

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
