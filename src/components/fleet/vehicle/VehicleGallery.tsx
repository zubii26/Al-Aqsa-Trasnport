'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface VehicleGalleryProps {
    title?: string;
    images: { src: string; alt: string }[];
}

export default function VehicleGallery({
    title = "Vehicle Gallery",
    images
}: VehicleGalleryProps) {
    const [showAll, setShowAll] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const displayedImages = showAll ? images : images.slice(0, 8);
    const hasMore = images.length > 8;

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
        document.body.style.overflow = 'auto';
    };

    const navigateLightbox = (direction: 'prev' | 'next') => {
        if (lightboxIndex === null) return;
        if (direction === 'prev') {
            setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1);
        } else {
            setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1);
        }
    };

    return (
        <section className="py-16 bg-white dark:bg-slate-900" id="gallery">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold  text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    {hasMore && !showAll && (
                        <button 
                            onClick={() => setShowAll(true)}
                            className="hidden md:flex items-center gap-2 text-amber-500 font-bold hover:text-amber-600 transition-colors"
                        >
                            <Camera size={20} /> View All {images.length} Photos
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {displayedImages.map((img, idx) => (
                        <div 
                            key={idx} 
                            className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group bg-slate-100 dark:bg-slate-800"
                            onClick={() => openLightbox(idx)}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                quality={100}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                loading={idx < 4 ? "eager" : "lazy"}
                            />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300"></div>
                        </div>
                    ))}
                </div>

                {hasMore && !showAll && (
                    <div className="mt-8 text-center md:hidden">
                        <button 
                            onClick={() => setShowAll(true)}
                            className="inline-flex items-center gap-2 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 px-6 py-3 rounded-full font-bold transition-colors"
                        >
                            <Camera size={20} /> View All {images.length} Photos
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm">
                    <button 
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white hover:text-amber-500 transition-colors z-50 bg-slate-900/50 p-2 rounded-full"
                    >
                        <X strokeWidth={1.25} size={32} />
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-amber-500 transition-colors z-50 bg-slate-900/50 p-3 rounded-full"
                    >
                        <ChevronLeft size={36} />
                    </button>

                    <div className="relative w-full max-w-6xl h-[80vh] px-12" onClick={closeLightbox}>
                        <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={images[lightboxIndex].src}
                                alt={images[lightboxIndex].alt}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                quality={100}
                                priority
                            />
                        </div>
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-amber-500 transition-colors z-50 bg-slate-900/50 p-3 rounded-full"
                    >
                        <ChevronRight size={36} />
                    </button>

                    <div className="absolute bottom-6 left-0 right-0 text-center text-white/70 font-medium">
                        {lightboxIndex + 1} / {images.length}
                        <p className="text-sm mt-2 text-white/50">{images[lightboxIndex].alt}</p>
                    </div>
                </div>
            )}
        </section>
    );
}
