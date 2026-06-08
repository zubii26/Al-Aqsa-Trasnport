const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("No MONGODB_URI");
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    
    const vehicles = await db.collection('vehicles').find().toArray();
    const gmc = vehicles.find(v => v.name.toLowerCase().includes('gmc'));
    const camry = vehicles.find(v => v.name.toLowerCase().includes('camry'));

    const gmcId = gmc ? gmc._id.toString() : '';
    const camryId = camry ? camry._id.toString() : '';

    const newRoutes = [
        {
            origin: 'Madinah Hotel',
            destination: 'Madinah Ziyarat + Wadi Jin',
            distance: '100 km',
            duration: '4 hrs',
            category: 'Ziyarat',
            prices: [{ vehicleId: gmcId, price: 800 }, { vehicleId: camryId, price: 400 }],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            origin: 'Madinah Hotel',
            destination: 'Makkah Hotel',
            distance: '450 km',
            duration: '4 hrs 30 min',
            category: 'Intercity',
            stopovers: [
                { name: 'Badr (Jable Malaika)', extraPrice: 300 }
            ],
            prices: [{ vehicleId: gmcId, price: 1400 }, { vehicleId: camryId, price: 500 }],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            origin: 'Makkah Hotel',
            destination: 'Makkah Ziyarat',
            distance: '80 km',
            duration: '3 hrs',
            category: 'Ziyarat',
            prices: [{ vehicleId: gmcId, price: 700 }, { vehicleId: camryId, price: 350 }],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            origin: 'Makkah Hotel',
            destination: 'Taif Ziyarat',
            distance: '120 km',
            duration: '6 hrs',
            category: 'Ziyarat',
            prices: [{ vehicleId: gmcId, price: 1000 }, { vehicleId: camryId, price: 600 }],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            origin: 'Makkah Hotel',
            destination: 'Jeddah Airport',
            distance: '100 km',
            duration: '1 hr 30 min',
            category: 'Airport Departure',
            prices: [{ vehicleId: gmcId, price: 550 }, { vehicleId: camryId, price: 250 }],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    for (const route of newRoutes) {
        const existing = await db.collection('routes').findOne({ origin: route.origin, destination: route.destination });
        if (!existing) {
            await db.collection('routes').insertOne(route);
            console.log(`Inserted: ${route.origin} -> ${route.destination}`);
        } else {
            await db.collection('routes').updateOne({ _id: existing._id }, { $set: { stopovers: route.stopovers || [] } });
            console.log(`Updated: ${route.origin} -> ${route.destination} with stopovers`);
        }
    }
    await client.close();
}
seed().catch(console.error);
