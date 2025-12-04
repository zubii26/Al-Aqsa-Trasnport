
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

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const settings = await Settings.find({});
        console.log('--- Discount Settings ---');
        settings.forEach(s => {
            if (s.key.startsWith('discount_')) {
                console.log(`${s.key}: "${s.value}"`);
            }
        });
        console.log('-------------------------');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
