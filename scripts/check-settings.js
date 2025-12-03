
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const SettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

async function checkSettings() {
    try {
        await mongoose.connect(MONGODB_URI);

        const setting = await Settings.findOne({ key: 'discount_enabled' });
        console.log('discount_enabled:', setting ? setting.value : 'NOT FOUND');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkSettings();
