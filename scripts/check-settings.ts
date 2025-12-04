
import dbConnect from '../src/lib/mongodb';
import { Settings } from '../src/models';

async function checkSettings() {
    try {
        await dbConnect();
        const settings = await Settings.find({});
        console.log('Current Settings:');
        settings.forEach(s => {
            if (s.key.startsWith('discount_')) {
                console.log(`${s.key}: ${s.value}`);
            }
        });
    } catch (error) {
        console.error('Error checking settings:', error);
    }
    process.exit();
}

checkSettings();
