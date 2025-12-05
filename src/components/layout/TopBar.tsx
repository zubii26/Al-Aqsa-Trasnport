import React from 'react';
import { Phone, Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

import { getSettings } from '@/lib/settings-storage';


const TopBar = async () => {
    const settings = await getSettings();
    const { contact, discount } = settings;

    // Check if discount is active
    const now = new Date();
    const isDiscountActive = discount?.enabled &&
        (!discount.startDate || new Date(discount.startDate) <= now) &&
        (!discount.endDate || new Date(discount.endDate) > now);

    // if (isDiscountActive) {
    //     return null;
    // }

    return (
        <>
            {/* AnnouncementBanner is rendered in layout.tsx */}
            <div className="hidden md:block bg-gradient-to-r from-slate-900 to-slate-800 text-slate-200 border-b border-white/10">
                <div className="container mx-auto px-4 h-10 flex justify-between items-center text-xs tracking-wide font-medium">
                    <div className="flex items-center gap-6">
                        {contact.email && (
                            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-amber-400 transition-colors duration-300">
                                <Mail size={14} className="text-amber-400" />
                                <span>{contact.email}</span>
                            </a>
                        )}
                        {contact.phone && (
                            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-amber-400 transition-colors duration-300">
                                <Phone size={14} className="text-amber-400" />
                                <span>{contact.phone}</span>
                            </a>
                        )}
                        {contact.phone2 && (
                            <a href={`tel:${contact.phone2}`} className="flex items-center gap-2 hover:text-amber-400 transition-colors duration-300">
                                <Phone size={14} className="text-amber-400" />
                                <span>{contact.phone2}</span>
                            </a>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {contact.social.facebook && (
                            <a href={contact.social.facebook} target="_blank" rel="noreferrer" className="hover:text-amber-400 hover:scale-110 transition-all duration-300">
                                <Facebook size={14} />
                            </a>
                        )}
                        {contact.social.instagram && (
                            <a href={contact.social.instagram} target="_blank" rel="noreferrer" className="hover:text-amber-400 hover:scale-110 transition-all duration-300">
                                <Instagram size={14} />
                            </a>
                        )}
                        {contact.social.twitter && (
                            <a href={contact.social.twitter} target="_blank" rel="noreferrer" className="hover:text-amber-400 hover:scale-110 transition-all duration-300">
                                <Twitter size={14} />
                            </a>
                        )}
                        {contact.social.linkedin && (
                            <a href={contact.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-amber-400 hover:scale-110 transition-all duration-300">
                                <Linkedin size={14} />
                            </a>
                        )}
                        {contact.social.tiktok && (
                            <a href={contact.social.tiktok} target="_blank" rel="noreferrer" className="hover:text-amber-400 hover:scale-110 transition-all duration-300" aria-label="TikTok">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopBar;
