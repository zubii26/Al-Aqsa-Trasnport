const { RoutePrice } = require('./src/models');
const mongoose = require('mongoose');

async function checkPrices() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const prices = await RoutePrice.find({});
        console.log('--- Route Prices ---');
        console.log(JSON.stringify(prices, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

checkPrices();
