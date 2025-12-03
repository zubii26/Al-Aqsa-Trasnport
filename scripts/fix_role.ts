
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://zubair:zubair123@cluster0.p2q3l.mongodb.net/transport_db?retryWrites=true&w=majority';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, enum: ['user', 'admin', 'manager', 'operational_manager'], default: 'user' },
    password: { type: String },
}, { timestamps: true });

// Prevent overwriting model if already compiled
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function fixRole() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // Find user with name starting with "Operational" or email containing "manager"
        // Adjust criteria as needed based on what we know
        const user = await User.findOne({
            $or: [
                { name: /Operational/i },
                { email: /manager/i }
            ]
        });

        if (user) {
            console.log(`Found user: ${user.name} (${user.email}) with role: ${user.role}`);
            user.role = 'operational_manager';
            await user.save();
            console.log(`Updated user role to: ${user.role}`);
        } else {
            console.log('User not found. Listing all users:');
            const allUsers = await User.find({});
            allUsers.forEach(u => console.log(`- ${u.name} (${u.email}): ${u.role}`));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

fixRole();
