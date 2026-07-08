require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function fixTypo() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.useDb('transport');
        const collection = db.collection('galleryitems');
        
        // Find documents with 'Priglims'
        const result = await collection.updateMany(
            { caption: { $regex: /Priglims/i } },
            { $set: { caption: 'Pilgrims memories' } }
        );
        console.log(`Updated ${result.modifiedCount} documents.`);
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

fixTypo();
