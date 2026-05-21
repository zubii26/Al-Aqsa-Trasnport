import dbConnect from '@/lib/mongodb';
import { Settings } from '@/models';

export const settingsService = {
    async getSettings() {
        try {
            await dbConnect();
            const settings = await Settings.find({}).lean();
            return settings.map(s => ({ key: s.key, value: s.value }));
        } catch (error) {
            console.error('[SettingsService] Database connection failed in getSettings, returning empty list:', error);
            return [];
        }
    },

    async getSetting(key: string) {
        try {
            await dbConnect();
            const setting = await Settings.findOne({ key }).lean();
            return setting ? setting.value : null;
        } catch (error) {
            console.error(`[SettingsService] Database query failed in getSetting for key ${key}:`, error);
            return null;
        }
    },

    async updateSetting(key: string, value: string) {
        await dbConnect();
        const updatedSetting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        ).lean();
        return updatedSetting;
    },
};
