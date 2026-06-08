const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("No MONGODB_URI");
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    
    const routes = await db.collection('routes').find().toArray();
    console.log("Total routes:", routes.length);
    const hasJhmh = routes.find(r => r.origin === 'Jeddah Hotel' && r.destination === 'Makkah Hotel');
    console.log("Has Jed Hot -> Mak Hot:", !!hasJhmh);

    if (!hasJhmh) {
        const vehicles = await db.collection('vehicles').find().toArray();
        const gmc = vehicles.find(v => v.name.toLowerCase().includes('gmc'));
        const camry = vehicles.find(v => v.name.toLowerCase().includes('camry'));

        const gmcId = gmc ? gmc._id.toString() : '';
        const camryId = camry ? camry._id.toString() : '';

        const newRoutes = [
            {
                origin: 'Jeddah Hotel',
                destination: 'Makkah Hotel',
                distance: '100 km',
                duration: '1 hr 30 min',
                category: 'Intercity',
                prices: [{ vehicleId: gmcId, price: 550 }, { vehicleId: camryId, price: 250 }],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                origin: 'Jeddah Hotel',
                destination: 'Madinah Hotel',
                distance: '400 km',
                duration: '4 hrs',
                category: 'Intercity',
                prices: [{ vehicleId: gmcId, price: 1350 }, { vehicleId: camryId, price: 600 }],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                origin: 'Madinah Hotel',
                destination: 'Jeddah Airport',
                distance: '400 km',
                duration: '4 hrs',
                category: 'Airport Departure',
                prices: [{ vehicleId: gmcId, price: 1350 }, { vehicleId: camryId, price: 600 }],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                origin: 'Madinah Airport',
                destination: 'Makkah Hotel',
                distance: '450 km',
                duration: '4 hrs 30 min',
                category: 'Intercity',
                prices: [{ vehicleId: gmcId, price: 1400 }, { vehicleId: camryId, price: 500 }],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                origin: 'Makkah Hotel',
                destination: 'Madinah Airport',
                distance: '450 km',
                duration: '4 hrs 30 min',
                category: 'Intercity',
                prices: [{ vehicleId: gmcId, price: 1400 }, { vehicleId: camryId, price: 500 }],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await db.collection('routes').insertMany(newRoutes);
        console.log("Inserted missing routes.");
    }
    await client.close();
}
seed().catch(console.error);
