const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function reset() {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');
    const db = mongoose.connection.db;
    const adminUser = await db.collection('users').findOne({ role: 'admin' });
    if (!adminUser) {
        console.log('Admin user not found');
        process.exit(1);
    }
    const hash = await bcrypt.hash('Admin123!', 10);
    await db.collection('users').updateOne({ _id: adminUser._id }, { $set: { password: hash }});
    console.log('Successfully reset admin password to Admin123!');
    console.log('Admin Email:', adminUser.email);
    process.exit(0);
}
reset().catch(err => { console.error(err); process.exit(1); });
