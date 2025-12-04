
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

const settingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

async function update() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update end date to end of 2025
        await Settings.findOneAndUpdate(
            { key: 'discount_end_date' },
            { value: '2025-12-31T23:59:59.999Z' },
            { upsert: true }
        );

        // Ensure enabled is true
        await Settings.findOneAndUpdate(
            { key: 'discount_enabled' },
            { value: 'true' },
            { upsert: true }
        );

        console.log('Updated discount settings');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

update();
