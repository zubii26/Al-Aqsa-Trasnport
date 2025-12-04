
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

async function updateFooterText() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await Settings.findOneAndUpdate(
            { key: 'footer_text' },
            { value: '© 2025 Al Aqsa Umrah. All rights reserved.' },
            { upsert: true, new: true }
        );

        console.log('Updated footer_text:', result);

    } catch (error) {
        console.error('Error updating footer text:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateFooterText();
