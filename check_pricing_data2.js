const mongoose = require('mongoose');

// Assuming MongoDB URI is in .env or .env.local
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get some route prices
    const db = mongoose.connection.db;
    const routePrices = await db.collection('routeprices').find({}).limit(5).toArray();
    console.log("Sample routeprices:", JSON.stringify(routePrices, null, 2));

    // Get a route that should have prices
    if (routePrices.length > 0) {
        const routeId = routePrices[0].route;
        // The id might be an ObjectId, let's see how Route has it
        const route = await db.collection('routes').findOne({ _id: new mongoose.Types.ObjectId(routeId) });
        console.log("Matching Route (by ObjectId):", route ? route.origin + ' to ' + route.destination : 'NOT FOUND');
        
        const routeStr = await db.collection('routes').findOne({ _id: routeId });
        console.log("Matching Route (by string):", routeStr ? 'FOUND' : 'NOT FOUND');
    }

    process.exit(0);
}

check().catch(console.error);
