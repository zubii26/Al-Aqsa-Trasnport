'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { galleryItems } from '@/data/gallery';

interface GalleryItem {
    _id: string;
    image: string;
    caption: string;
    location: string;
}

export default function CustomerGallery() {
    const [items, setItems] = useState<GalleryItem[]>(galleryItems);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchItems = async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                if (data && data.length > 0) {
                    setItems(data);
                }
            } catch (error) {
                console.error('Using fallback gallery due to fetch error:', error);
            }
        };
        fetchItems();
    }, []);

    if (items.length === 0) return null;

    return (
        <section id="visitor-gallery" className="py-20 md:py-28 bg-slate-50 overflow-hidden relative">
            <div className="container mx-auto px-4 lg:px-8 relative">
                
                {/* Header */}
                <div 
                    className={`max-w-3xl mx-auto text-center mb-12 md:mb-16 transition-all duration-700 transform ${
                        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        From the Holy Cities
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                        A window into the sacred routes and landmarks our pilgrims travel every day.
                    </p>
                </div>

                {/* Gallery Wrapper */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-4">
                    {items.map((item, index) => (
                        <div 
                            key={item._id} 
                            className={`transition-all duration-700 ease-out delay-${(index % 3) * 100} ${
                                mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}
                        >
                            <div className="relative w-full aspect-[4/5] md:aspect-video rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] group/card hover:shadow-[0_20px_40px_rgb(212,175,55,0.15)] transition-all duration-500 bg-slate-200 cursor-pointer">
                                <Image
                                    src={item.image}
                                    alt={item.caption}
                                    fill
                                    loading="lazy"
                                    quality={90}
                                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                
                                {/* Premium Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity duration-300" />
                                
                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300 text-shadow-sm group-hover/card:text-secondary">
                                        {item.caption}
                                    </h3>
                                    <div className="flex items-center text-white/80 text-sm md:text-base font-medium opacity-80 group-hover/card:opacity-100 transition-opacity duration-300">
                                        <MapPin size={16} className="mr-1.5 text-secondary" strokeWidth={2} /> 
                                        {item.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
