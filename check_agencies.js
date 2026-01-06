
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkAgencies() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const agencies = await User.find({ role: 'agency' });
        console.log(`Found ${agencies.length} agencies.`);
        agencies.forEach(a => console.log(`- ${a.name} (${a.email})`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkAgencies();
