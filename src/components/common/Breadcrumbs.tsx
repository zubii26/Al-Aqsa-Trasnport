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

    // ... (keep existing logic)

    const jsonLd = {
        // ... (keep existing logic)
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
