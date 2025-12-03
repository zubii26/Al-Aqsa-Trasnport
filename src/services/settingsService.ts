import dbConnect from '@/lib/mongodb';
import { Settings } from '@/models';

export const settingsService = {
    async getSettings() {
        await dbConnect();
        const settings = await Settings.find({}).lean();
        return settings.map(s => ({ key: s.key, value: s.value }));
    },

    async getSetting(key: string) {
        await dbConnect();
        const setting = await Settings.findOne({ key }).lean();
        return setting ? setting.value : null;
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
