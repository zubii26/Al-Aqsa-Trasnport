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
        // Enforce strict setting for Mongoose 7/8
        mongoose.set('strictQuery', true);

        const opts = {
            bufferCommands: false,
            // Increase timeout slightly for cloud connections
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4 to prevent local IPv6 timeout issues
        };

        console.log(`[dbConnect] Connecting to MongoDB Atlas cluster...`);

        cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log(`[dbConnect] connection successful!`);
            return mongoose;
        }).catch(err => {
            console.error('[dbConnect] Initial connection error:', err.message);
            if (err.message.includes('ECONNREFUSED')) {
                 console.error('>> DIAGNOSTIC: ECONNREFUSED usually indicates that your current IP address is NOT whitelisted in the MongoDB Atlas Network Access panel.');
            }
            throw err;
        });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        // Log detailed error but clear the cache so the server doesn't get stuck
        console.error('[dbConnect] Database connection failed:', (e as Error).message);
        cached!.promise = null;
        cached!.conn = null;
        throw e;
    }

    return cached!.conn;
}

export default dbConnect;
