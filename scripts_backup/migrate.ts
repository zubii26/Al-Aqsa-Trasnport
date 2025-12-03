// @ts-nocheck
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dbConnect from '../src/lib/mongodb.ts';
import { Vehicle, Booking, User, Review, Settings, Route, RoutePrice } from '../src/models/index.ts';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env files
config({ path: path.resolve(__dirname, '../.env.local') });
config({ path: path.resolve(__dirname, '../.env') });

(async () => {
    let pgClient;
    try {
        console.log('Starting migration with pg (ESM)...');

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
        const fetchTable = async (tableName: string) => {
            try {
                // Try quoted first (case sensitive)
                const res = await pgClient.query(`SELECT * FROM "${tableName}"`);
                return res.rows;
            } catch (e) {
                // Try unquoted (lowercase)
                try {
                    const res = await pgClient.query(`SELECT * FROM ${tableName}`);
                    return res.rows;
                } catch (e2: any) {
                    console.warn(`Could not fetch table ${tableName}:`, e2.message);
                    return [];
                }
            }
        };

        // Maps to store SQL ID -> Mongo ID mapping
        const vehicleMap = new Map<string, string>();
        const routeMap = new Map<string, string>();
        const userMap = new Map<string, string>();

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
