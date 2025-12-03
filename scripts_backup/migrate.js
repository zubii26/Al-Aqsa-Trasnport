const { config } = require('dotenv');
const path = require('path');
const { Client } = require('pg');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const fs = require('fs');

// Helper to load env manually
const loadEnv = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            console.log(`Loading ${filePath}...`);
            let content = fs.readFileSync(filePath);

            // Check for BOM or null bytes indicating UTF-16
            let text;
            if (content[0] === 0xFF && content[1] === 0xFE) {
                text = content.toString('utf16le');
            } else if (content.indexOf('\0') !== -1) {
                // heuristic for UTF-16 LE (basic latin chars have 0 byte)
                text = content.toString('utf16le');
            } else {
                text = content.toString('utf8');
            }

            text.split(/\r?\n/).forEach(line => {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2] ? match[2].trim().replace(/^["']|["']$/g, '') : '';
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        } else {
            console.log(`File not found: ${filePath}`);
        }
    } catch (e) {
        console.error(`Error loading ${filePath}:`, e);
    }
};

const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');

loadEnv(envLocalPath);
loadEnv(envPath);

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Defined' : 'Undefined');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Defined' : 'Undefined');

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport';

if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI not found, using default: mongodb://localhost:27017/transport');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// --- Schemas ---

const VehicleSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    passengers: { type: Number, required: true },
    luggage: { type: Number, required: true },
    features: { type: [String], required: true },
    price: { type: String, required: true },
    hourlyRate: { type: String },
    category: { type: String, default: 'Standard' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const BookingSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    vehicle: { type: String, required: true },
    passengers: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    userId: { type: String },
    price: { type: String },
}, { timestamps: true });

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const ReviewSchema = new Schema({
    googleReviewId: { type: String, unique: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, required: true },
    source: { type: String, enum: ['google', 'website'], default: 'website' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const SettingsSchema = new Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { type: String, default: 'text' },
}, { timestamps: true });

const RouteSchema = new Schema({
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: String },
    duration: { type: String },
    category: { type: String, default: 'Intercity' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const RoutePriceSchema = new Schema({
    route: { type: String, required: true },
    vehicle: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true });

// --- Models ---
const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
const Route = mongoose.models.Route || mongoose.model('Route', RouteSchema);
const RoutePrice = mongoose.models.RoutePrice || mongoose.model('RoutePrice', RoutePriceSchema);

// --- Migration Logic ---

(async () => {
    let pgClient;
    try {
        console.log('Starting migration with pure JS...');

        await dbConnect();
        console.log('Connected to MongoDB.');

        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is missing');
        }

        pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
        });
        await pgClient.connect();
        console.log('Connected to Postgres.');

        // Helper to fetch all rows from a table
        const fetchTable = async (tableName) => {
            try {
                // Try quoted first (case sensitive)
                const res = await pgClient.query(`SELECT * FROM "${tableName}"`);
                return res.rows;
            } catch (e) {
                // Try unquoted (lowercase)
                try {
                    const res = await pgClient.query(`SELECT * FROM ${tableName}`);
                    return res.rows;
                } catch (e2) {
                    console.warn(`Could not fetch table ${tableName}:`, e2.message);
                    return [];
                }
            }
        };

        // Maps to store SQL ID -> Mongo ID mapping
        const vehicleMap = new Map();
        const routeMap = new Map();
        const userMap = new Map();

        // 1. Migrate Users
        console.log('Migrating Users...');
        const users = await fetchTable('User');
        for (const u of users) {
            const result = await User.findOneAndUpdate(
                { email: u.email },
                {
                    email: u.email,
                    name: u.name,
                    role: u.role === 'ADMIN' ? 'admin' : 'user',
                    createdAt: u.createdAt,
                    updatedAt: u.updatedAt
                },
                { upsert: true, new: true }
            );
            userMap.set(u.id, result._id.toString());
        }
        console.log(`Migrated ${users.length} users.`);

        // 2. Migrate Settings
        console.log('Migrating Settings...');
        const settings = await fetchTable('Settings');
        for (const s of settings) {
            await Settings.findOneAndUpdate(
                { key: s.key },
                {
                    key: s.key,
                    value: s.value,
                    type: s.type,
                    updatedAt: s.updatedAt
                },
                { upsert: true, new: true }
            );
        }
        console.log(`Migrated ${settings.length} settings.`);

        // 3. Migrate Vehicles
        console.log('Migrating Vehicles...');
        const vehicles = await fetchTable('Vehicle');
        for (const v of vehicles) {
            const result = await Vehicle.findOneAndUpdate(
                { name: v.name },
                {
                    name: v.name,
                    image: v.image,
                    passengers: v.passengers || v.capacity,
                    luggage: v.luggage,
                    features: v.features,
                    price: v.price,
                    hourlyRate: v.hourlyRate,
                    category: v.category,
                    isActive: v.isActive,
                },
                { upsert: true, new: true }
            );
            vehicleMap.set(v.id, result._id.toString());
        }
        console.log(`Migrated ${vehicles.length} vehicles.`);

        // 4. Migrate Routes
        console.log('Migrating Routes...');
        const routes = await fetchTable('Route');
        for (const r of routes) {
            const result = await Route.findOneAndUpdate(
                { origin: r.origin, destination: r.destination },
                {
                    origin: r.origin,
                    destination: r.destination,
                    distance: r.distance,
                    duration: r.duration,
                    category: r.category,
                    isActive: r.isActive,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt
                },
                { upsert: true, new: true }
            );
            routeMap.set(r.id, result._id.toString());
        }
        console.log(`Migrated ${routes.length} routes.`);

        // 5. Migrate RoutePrices
        console.log('Migrating RoutePrices...');
        const routePrices = await fetchTable('RoutePrice');
        let migratedCount = 0;
        for (const rp of routePrices) {
            const mongoRouteId = routeMap.get(rp.routeId);
            const mongoVehicleId = vehicleMap.get(rp.vehicleId);

            if (mongoRouteId && mongoVehicleId) {
                await RoutePrice.findOneAndUpdate(
                    { route: mongoRouteId, vehicle: mongoVehicleId },
                    {
                        route: mongoRouteId,
                        vehicle: mongoVehicleId,
                        price: rp.price,
                        createdAt: rp.createdAt,
                        updatedAt: rp.updatedAt
                    },
                    { upsert: true, new: true }
                );
                migratedCount++;
            }
        }
        console.log(`Migrated ${migratedCount} route prices.`);

        // 6. Migrate Bookings
        console.log('Migrating Bookings...');
        const bookings = await fetchTable('Booking');
        for (const b of bookings) {
            await Booking.findOneAndUpdate(
                { email: b.email, date: b.date, time: b.time },
                {
                    name: b.name,
                    email: b.email,
                    phone: b.phone,
                    pickup: b.pickup,
                    dropoff: b.dropoff,
                    date: b.date,
                    time: b.time,
                    vehicle: b.vehicle,
                    passengers: b.passengers,
                    status: b.status,
                    userId: b.userId,
                    price: b.price,
                    createdAt: b.createdAt
                },
                { upsert: true, new: true }
            );
        }
        console.log(`Migrated ${bookings.length} bookings.`);

        // 7. Migrate Reviews
        console.log('Migrating Reviews...');
        const reviews = await fetchTable('Review');
        for (const r of reviews) {
            await Review.findOneAndUpdate(
                { googleReviewId: r.googleReviewId },
                {
                    name: r.author,
                    rating: r.rating,
                    comment: r.comment || '',
                    date: r.date ? new Date(r.date).toISOString() : new Date().toISOString(),
                    source: r.source,
                    isActive: r.isVisible,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt
                },
                { upsert: true, new: true }
            );
        }
        console.log(`Migrated ${reviews.length} reviews.`);

        console.log('Migration complete.');
        process.exit(0);

    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    } finally {
        if (pgClient) await pgClient.end();
    }
})();
