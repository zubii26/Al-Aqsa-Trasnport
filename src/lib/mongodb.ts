import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local or Vercel Environment Variables');
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
            // Increase timeout for cloud connections significantly to avoid selection errors
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        };

        console.log(`[dbConnect] Connecting to MongoDB Atlas cluster...`);

        cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log(`[dbConnect] connection successful!`);
            return mongoose;
        }).catch(err => {
            console.error('[dbConnect] Initial connection error:', err.message);
            if (err.message.includes('ECONNREFUSED') || err.message.includes('Server selection timed out')) {
                 console.error('\n======================================================');
                 console.error('>> DIAGNOSTIC: MongooseServerSelectionError / ECONNREFUSED');
                 console.error('>> This usually indicates that your current IP address is NOT whitelisted.');
                 console.error('>> Please go to MongoDB Atlas -> Network Access -> Add your current IP Address.');
                 console.error('======================================================\n');
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
