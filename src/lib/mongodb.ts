import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'development') {
        console.warn('MONGODB_URI is not defined in environment variables');
    }
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {

    var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        }).catch(err => {
            console.error('Mongoose connection error:', err);
            throw err;
        });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        console.error('Database connection failed:', e);
        cached!.promise = null; // Clear failing promise to allow retry
        cached!.conn = null;
        throw e;
    }

    return cached!.conn;
}

export default dbConnect;
