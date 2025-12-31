'use client';

import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

interface ShareButtonsProps {
    slug: string;
    title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ slug, title }) => {
    const url = `https://alaqsa-transport.com/blog/${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: 'Facebook',
            icon: <Facebook size={20} />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
            name: 'Twitter',
            icon: <Twitter size={20} />,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin size={20} />,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        },
    ];

    const handleShare = (shareUrl: string) => {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className="flex gap-4 justify-center">
            {shareLinks.map((link) => (
                <button
                    key={link.name}
                    onClick={() => handleShare(link.url)}
                    className="w-[44px] h-[44px] rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-all duration-300 border border-slate-200 hover:bg-slate-900 hover:text-[#D4AF37] hover:border-slate-900 hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-[#D4AF37] dark:hover:text-slate-900 dark:hover:border-[#D4AF37]"
                    aria-label={`Share on ${link.name}`}
                >
                    {link.icon}
                </button>
            ))}
        </div>
    );
};

export default ShareButtons;
