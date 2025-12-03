import dbConnect from '@/lib/mongodb';
import { Settings as SettingsModel } from '@/models';
import { Settings } from './validations';
import { unstable_cache, revalidateTag } from 'next/cache';

const DEFAULT_SETTINGS: Settings = {
    general: {
        siteName: 'Al Aqsa Umrah Transport',
        description: 'Premium Umrah Taxi Service & Car Rental in Saudi Arabia',
        footerText: '© 2024 Al Aqsa Transport. All rights reserved.',
        logo: '',
        googleAnalyticsId: '',
    },
    contact: {
        email: 'info@alaqsatransport.com',
        phone: '+966 50 000 0000',
        phone2: '',
        address: 'Makkah, Saudi Arabia',
        social: {
            facebook: '',
            twitter: '',
            instagram: '',
            tiktok: '',
            linkedin: '',
        },
    },
    seo: {
        defaultTitle: 'Al Aqsa Umrah Transport',
        defaultDescription: 'Reliable Umrah taxi service in Makkah and Madinah. Book comfortable, affordable, and safe transport for your spiritual journey. Premium fleet available.',
        keywords: 'umrah taxi, makkah transport, jeddah airport transfer, umrah transport services, pilgrim travel comfort, affordable umrah transport, saudi arabia transport',
    },
    appearance: {
        darkMode: false,
        primaryColor: '#D4AF37', // Gold
    },
    discount: {
        enabled: false,
        type: 'percentage',
        value: 0,
        startDate: '',
        endDate: '',
    },
};

export const getSettings = unstable_cache(
    async (): Promise<Settings> => {
        try {
            await dbConnect();
            const settingsDocs = await SettingsModel.find({}).lean();

            // Convert array of {key, value} to object map
            const settingsMap = settingsDocs.reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {} as Record<string, string>);

            // Map flat keys to nested structure
            const mergedSettings: Settings = {
                general: {
                    siteName: settingsMap['site_name'] || DEFAULT_SETTINGS.general.siteName,
                    description: settingsMap['site_description'] || DEFAULT_SETTINGS.general.description,
                    footerText: settingsMap['footer_text'] || DEFAULT_SETTINGS.general.footerText,
                    logo: settingsMap['logo'] || DEFAULT_SETTINGS.general.logo,
                    googleAnalyticsId: settingsMap['google_analytics_id'] || DEFAULT_SETTINGS.general.googleAnalyticsId,
                },
                contact: {
                    email: settingsMap['contact_email'] || DEFAULT_SETTINGS.contact.email,
                    phone: settingsMap['contact_phone'] || DEFAULT_SETTINGS.contact.phone,
                    phone2: settingsMap['contact_phone_2'] || DEFAULT_SETTINGS.contact.phone2,
                    address: settingsMap['address'] || DEFAULT_SETTINGS.contact.address,
                    social: {
                        facebook: settingsMap['social_facebook'] || DEFAULT_SETTINGS.contact.social.facebook,
                        twitter: settingsMap['social_twitter'] || DEFAULT_SETTINGS.contact.social.twitter,
                        instagram: settingsMap['social_instagram'] || DEFAULT_SETTINGS.contact.social.instagram,
                        tiktok: settingsMap['social_tiktok'] || DEFAULT_SETTINGS.contact.social.tiktok,
                        linkedin: settingsMap['social_linkedin'] || DEFAULT_SETTINGS.contact.social.linkedin,
                    },
                },
                seo: {
                    defaultTitle: settingsMap['seo_title'] || DEFAULT_SETTINGS.seo.defaultTitle,
                    defaultDescription: settingsMap['seo_description'] || DEFAULT_SETTINGS.seo.defaultDescription,
                    keywords: settingsMap['seo_keywords'] || DEFAULT_SETTINGS.seo.keywords,
                },
                appearance: {
                    darkMode: settingsMap['appearance_dark_mode'] === 'true' || DEFAULT_SETTINGS.appearance.darkMode,
                    primaryColor: settingsMap['appearance_primary_color'] || DEFAULT_SETTINGS.appearance.primaryColor,
                },
                discount: {
                    enabled: settingsMap['discount_enabled'] === 'true',
                    type: (settingsMap['discount_type'] as 'percentage' | 'fixed') || DEFAULT_SETTINGS.discount?.type || 'percentage',
                    value: Number(settingsMap['discount_value']) || DEFAULT_SETTINGS.discount?.value || 0,
                    startDate: settingsMap['discount_start_date'] || '',
                    endDate: settingsMap['discount_end_date'] || '',
                },
            };

            console.log('[Settings] Retrieved discount settings:', mergedSettings.discount);
            return mergedSettings;
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            return DEFAULT_SETTINGS;
        }
    },
    ['settings'],
    { revalidate: 1, tags: ['settings'] } // Reduced revalidate time for debugging
);

export async function saveSettings(newSettings: Settings): Promise<void> {
    await dbConnect();

    // Flatten nested object to key-value pairs
    const updates = [
        { key: 'site_name', value: newSettings.general.siteName },
        { key: 'site_description', value: newSettings.general.description },
        { key: 'footer_text', value: newSettings.general.footerText },
        { key: 'logo', value: newSettings.general.logo || '' },
        { key: 'google_analytics_id', value: newSettings.general.googleAnalyticsId || '' },

        { key: 'contact_email', value: newSettings.contact.email },
        { key: 'contact_phone', value: newSettings.contact.phone },
        { key: 'contact_phone_2', value: newSettings.contact.phone2 || '' },
        { key: 'address', value: newSettings.contact.address },

        { key: 'social_facebook', value: newSettings.contact.social.facebook || '' },
        { key: 'social_twitter', value: newSettings.contact.social.twitter || '' },
        { key: 'social_instagram', value: newSettings.contact.social.instagram || '' },
        { key: 'social_tiktok', value: newSettings.contact.social.tiktok || '' },
        { key: 'social_linkedin', value: newSettings.contact.social.linkedin || '' },

        { key: 'seo_title', value: newSettings.seo.defaultTitle },
        { key: 'seo_description', value: newSettings.seo.defaultDescription },
        { key: 'seo_keywords', value: newSettings.seo.keywords },

        { key: 'appearance_dark_mode', value: String(newSettings.appearance.darkMode) },
        { key: 'appearance_primary_color', value: newSettings.appearance.primaryColor },

        { key: 'discount_enabled', value: String(newSettings.discount?.enabled || false) },
        { key: 'discount_type', value: newSettings.discount?.type || 'percentage' },
        { key: 'discount_value', value: String(newSettings.discount?.value || 0) },
        { key: 'discount_start_date', value: newSettings.discount?.startDate || '' },
        { key: 'discount_end_date', value: newSettings.discount?.endDate || '' },
    ];

    // Update each setting
    await Promise.all(updates.map(update =>
        SettingsModel.findOneAndUpdate(
            { key: update.key },
            { value: update.value },
            { upsert: true, new: true }
        )
    ));

    revalidateTag('settings');
}
