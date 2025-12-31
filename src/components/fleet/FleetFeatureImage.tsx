'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface FleetFeatureImageProps {
    src: string;
    alt: string;
    fallbackSrc: string;
    className?: string;
}

export default function FleetFeatureImage({ src, alt, fallbackSrc, className }: FleetFeatureImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill
            className={className}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
        />
    );
}
