const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://transport-admin:transport123@transport-cluster.mongodb.net/transport-db?retryWrites=true&w=majority';

async function verifyData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections found:', collections.map(c => c.name));

        const vehicleCount = await mongoose.connection.db.collection('vehicles').countDocuments();
        console.log(`Vehicles count: ${vehicleCount}`);

        const routeCount = await mongoose.connection.db.collection('routes').countDocuments();
        console.log(`Routes count: ${routeCount}`);

        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        console.log(`Users count: ${userCount}`);

        const settingsCount = await mongoose.connection.db.collection('settings').countDocuments();
        console.log(`Settings count: ${settingsCount}`);

        const auditLogCount = await mongoose.connection.db.collection('auditlogs').countDocuments();
        console.log(`AuditLogs count: ${auditLogCount}`);

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

verifyData();
