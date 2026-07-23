const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const routePrices = await db.collection('routeprices').find({}).limit(1).toArray();
    
    if (routePrices.length > 0) {
        const rp = routePrices[0];
        console.log("Route field type:", typeof rp.route, rp.route instanceof mongoose.Types.ObjectId ? "ObjectId" : "String");
        console.log("Vehicle field type:", typeof rp.vehicle, rp.vehicle instanceof mongoose.Types.ObjectId ? "ObjectId" : "String");
    }
    process.exit(0);
}
check().catch(console.error);
