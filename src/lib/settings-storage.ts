import { prisma } from '@/lib/prisma';
import { Settings } from './validations';
import { unstable_cache } from 'next/cache';

const DEFAULT_SETTINGS: Settings = {
    general: {
        siteName: 'Al Aqsa Umrah Transport',
        description: 'Premium Umrah Taxi Service & Car Rental in Saudi Arabia',
        footerText: '© 2024 Al Aqsa Transport. All rights reserved.',
        logo: '',
    },
    contact: {
        email: 'info@alaqsatransport.com',
        phone: '+966 50 000 0000',
        address: 'Makkah, Saudi Arabia',
        whatsapp: '+966500000000',
        social: {
            facebook: '',
            twitter: '',
            instagram: '',
        },
    },
    seo: {
        defaultTitle: 'Al Aqsa Umrah Transport',
        defaultDescription: 'Reliable Umrah taxi service in Makkah and Madinah.',
        keywords: 'umrah taxi, makkah transport, jeddah airport transfer',
    },
    appearance: {
        darkMode: false,
        primaryColor: '#D4AF37', // Gold
    },
};

export const getSettings = unstable_cache(
    async (): Promise<Settings> => {
        try {
            const settingsData = await prisma.settings.findMany();

            if (settingsData.length === 0) return DEFAULT_SETTINGS;

            const settingsMap = settingsData.reduce((acc: Record<string, string>, curr: any) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {} as Record<string, string>);

            // Merge with defaults to ensure structure
            return {
                general: {
                    siteName: settingsMap['site_name'] || DEFAULT_SETTINGS.general.siteName,
                    description: settingsMap['site_description'] || DEFAULT_SETTINGS.general.description,
                    footerText: settingsMap['general_footerText'] || DEFAULT_SETTINGS.general.footerText,
                    logo: settingsMap['general_logo'] || DEFAULT_SETTINGS.general.logo,
                },
                contact: {
                    email: settingsMap['contact_email'] || DEFAULT_SETTINGS.contact.email,
                    phone: settingsMap['contact_phone'] || DEFAULT_SETTINGS.contact.phone,
                    address: settingsMap['address'] || DEFAULT_SETTINGS.contact.address,
                    whatsapp: settingsMap['contact_phone_2'] || DEFAULT_SETTINGS.contact.whatsapp, // Mapping secondary phone to whatsapp for now
                    social: {
                        facebook: settingsMap['social_facebook'] || '',
                        twitter: settingsMap['social_twitter'] || '',
                        instagram: settingsMap['social_instagram'] || '',
                        tiktok: settingsMap['social_tiktok'] || '',
                        linkedin: settingsMap['social_linkedin'] || '',
                    },
                },
                seo: {
                    defaultTitle: settingsMap['seo_title'] || DEFAULT_SETTINGS.seo.defaultTitle,
                    defaultDescription: settingsMap['seo_description'] || DEFAULT_SETTINGS.seo.defaultDescription,
                    keywords: settingsMap['seo_keywords'] || DEFAULT_SETTINGS.seo.keywords,
                },
                appearance: {
                    darkMode: settingsMap['appearance_darkMode'] === 'true',
                    primaryColor: settingsMap['appearance_primaryColor'] || DEFAULT_SETTINGS.appearance.primaryColor,
                },
            };
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            return DEFAULT_SETTINGS;
        }
    },
    ['settings'],
    { revalidate: 60, tags: ['settings'] }
);

export async function saveSettings(settings: Settings): Promise<void> {
    // This function is now mainly for legacy support or seeding, 
    // as the Admin API handles updates directly via Prisma.
    // We could implement a bulk upsert here if needed.
}
