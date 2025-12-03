import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

console.log('Testing MongoDB connection...');
console.log(`URI: ${MONGODB_URI.substring(0, 20)}...`);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Failed:', err);
        process.exit(1);
    });
