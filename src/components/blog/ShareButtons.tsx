'use client';

import React, { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
    slug: string;
    title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ slug, title }) => {
    const [copied, setCopied] = useState(false);
    const url = `https://alaqsaumrahtransport.com/blog/${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareLinks = [
        {
            name: 'Whatsapp',
            // Using a direct SVG for WhatsApp since it might be missing in some Lucide versions or we want a specific look
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0" opacity="0" />
                    <path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1z" />
                </svg>
            ),
            // Simplified WhatsApp Icon Path manually if needed, or stick to standard Lucide logic if we want consistency. 
            // Actually, let's just use the Lucide 'MessageCircle' as a fallback if specific brand icons are preferred by the user, 
            // but for "Professional" we usually want the real brand. 
            // Let's use a standard WhatsApp SVG path for best recognition.
            customIcon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
            ),
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            colorClass: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
        },
        {
            name: 'Facebook',
            icon: <Facebook size={20} />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            colorClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
        },
        {
            name: 'Twitter',
            icon: <Twitter size={20} />,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            colorClass: 'hover:bg-[#000000] hover:text-white hover:border-[#000000] dark:hover:bg-white dark:hover:text-black',
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin size={20} />,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            colorClass: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
        },
    ];

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex flex-wrap gap-3 justify-center w-full">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative w-[48px] h-[48px] rounded-full bg-slate-50 flex items-center justify-center text-slate-500 transition-all duration-300 border border-slate-200 
                hover:-translate-y-1 hover:shadow-lg
                dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 
                ${link.colorClass}`}
                        aria-label={`Share on ${link.name}`}
                    >
                        {link.customIcon || link.icon}

                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-900">
                            {link.name}
                        </span>
                    </a>
                ))}

                {/* Copy Link Button */}
                <button
                    onClick={handleCopy}
                    className={`group relative w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all duration-300 border 
            hover:-translate-y-1 hover:shadow-lg
            ${copied
                            ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-900 hover:text-[#D4AF37] hover:border-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-[#D4AF37] dark:hover:text-slate-900 dark:hover:border-[#D4AF37]'
                        }`}
                    aria-label="Copy Link"
                >
                    {copied ? <Check size={20} /> : <LinkIcon size={20} />}

                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-900">
                        {copied ? 'Copied!' : 'Copy Link'}
                    </span>
                </button>
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Spread the word</p>
        </div>
    );
};

export default ShareButtons;
