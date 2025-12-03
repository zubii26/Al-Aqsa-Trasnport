import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Vehicle, User, Booking } from '../src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyMigration() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env.local');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const vehicleCount = await Vehicle.countDocuments();
        const userCount = await User.countDocuments();
        const bookingCount = await Booking.countDocuments();

        console.log('--- Verification Results ---');
        console.log(`Vehicles: ${vehicleCount}`);
        console.log(`Users: ${userCount}`);
        console.log(`Bookings: ${bookingCount}`);

        if (vehicleCount === 0 && userCount === 0) {
            console.error('WARNING: MongoDB appears to be empty! Do not delete Prisma yet.');
            process.exit(1);
        } else {
            console.log('SUCCESS: Data found in MongoDB. Safe to proceed with Prisma removal.');
            process.exit(0);
        }
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verifyMigration();
