
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const settingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

async function updateSiteName() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await Settings.findOneAndUpdate(
            { key: 'site_name' },
            { value: 'Al Aqsa Umrah' },
            { upsert: true, new: true }
        );

        console.log('Updated site_name:', result);

        // Also update default title for SEO if it exists
        const seoTitleResult = await Settings.findOneAndUpdate(
            { key: 'seo_title' },
            { value: 'Al Aqsa Umrah' },
            { upsert: true, new: true }
        );
        console.log('Updated seo_title:', seoTitleResult);

    } catch (error) {
        console.error('Error updating site name:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateSiteName();
