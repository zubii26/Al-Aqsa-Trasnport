const mongoose = require('mongoose');

async function fixTypo() {
    try {
        await mongoose.connect('mongodb://alaqsatransport:alaqsa12345@ac-pf6jxpw-shard-00-00.aheobsa.mongodb.net:27017/transport?ssl=true&authSource=admin');
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
