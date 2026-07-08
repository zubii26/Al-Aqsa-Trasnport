require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log("Attempting to connect with URI:", process.env.MONGODB_URI.replace(/:([^:@]{3,})@/, ':***@'));
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connection SUCCESS!");
    } catch (error) {
        console.error("Connection FAILED!");
        console.error(error.message);
        if (error.name === 'MongoParseError') {
            console.error("This is a parsing error. The URI format is invalid.");
        } else if (error.name === 'MongoServerError') {
            console.error("This is a server error (e.g. invalid credentials or IP not whitelisted).");
        }
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testConnection();
