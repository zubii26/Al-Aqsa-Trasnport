'use client';

import React from 'react';

interface FleetFeatureImageProps {
    src: string;
    alt: string;
    fallbackSrc: string;
    className?: string;
}

export default function FleetFeatureImage({ src, alt, fallbackSrc, className }: FleetFeatureImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackSrc;
            }}
        />
    );
}
