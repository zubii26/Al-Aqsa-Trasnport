
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

// Minimal Schema to avoid import issues
const SectionSchema = new mongoose.Schema({
    name: String,
    title: String,
    content: String,
}, { strict: false });

const Section = mongoose.models.Section || mongoose.model('Section', SectionSchema);

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected.');

        const section = await Section.findOne({ name: 'home-hero' });

        if (!section) {
            console.log('❌ Section "home-hero" not found in database.');
            return;
        }

        console.log(`Found section: "${section.title}"`);

        let updated = false;

        // Fix Title
        if (section.title && section.title.includes('Primium')) {
            console.log('Found typo in title: "Primium" -> "Premium"');
            section.title = section.title.replace('Primium', 'Premium');
            updated = true;
        }

        // Fix Content
        if (section.content && section.content.includes('Primium')) {
            console.log('Found typo in content: "Primium" -> "Premium"');
            section.content = section.content.replace(/Primium/g, 'Premium');
            updated = true;
        }

        if (updated) {
            await section.save();
            console.log('✅ Successfully updated "home-hero" section.');
        } else {
            console.log('ℹ️ No "Primium" typos found in title or content.');
        }

    } catch (error) {
        console.error('❌ Error executing script:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    }
}

run();
