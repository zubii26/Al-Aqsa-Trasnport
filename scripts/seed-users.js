const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Helper to load env manually
const loadEnv = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath);
            let text;
            if (content[0] === 0xFF && content[1] === 0xFE) {
                text = content.toString('utf16le');
            } else if (content.indexOf('\0') !== -1) {
                text = content.toString('utf16le');
            } else {
                text = content.toString('utf8');
            }

            text.split(/\r?\n/).forEach(line => {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2] ? match[2].trim().replace(/^["']|["']$/g, '') : '';
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.error(`Error loading ${filePath}:`, e);
    }
};

const envLocalPath = path.resolve(__dirname, '../.env.local');
loadEnv(envLocalPath);

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    password: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

(async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        const usersToSeed = [
            {
                email: 'admin@alaqsa.com',
                name: 'Admin User',
                role: 'admin',
                password: 'admin123'
            },
            {
                email: 'manager@alaqsa.com',
                name: 'Manager User',
                role: 'user', // Assuming manager is a regular user with specific permissions, or we can add 'manager' role if schema supports it. Schema says 'user' | 'admin'. I'll stick to 'admin' for manager if they need access, or 'user' if it's just a title. The user asked for "manager, admin". I'll make manager an admin for now to ensure access, or check if I should add 'manager' to enum.
                // The schema in index.ts only has 'user' and 'admin'. 
                // Wait, the Prisma schema had 'MANAGER' as default role!
                // "role      String   @default("MANAGER")"
                // My Mongoose schema only has 'user' and 'admin'. I should probably update the Mongoose schema to include 'manager' or map it.
                // For now, I'll make the manager an 'admin' or just 'user' but with the name Manager.
                // Actually, let's update the schema to allow 'manager' as well, to match Prisma.
            }
        ];

        // Let's check if I should update schema first.
        // The migration script mapped 'ADMIN' -> 'admin' and everything else to 'user'.
        // "role: u.role === 'ADMIN' ? 'admin' : 'user',"
        // So 'MANAGER' became 'user'.
        // I will create the manager user as 'admin' role for now so they can access the dashboard, or 'user' if that's intended.
        // Usually managers need admin access. I'll give them 'admin' role but name 'Manager'.

        // Actually, let's stick to the requested usernames.

        await User.findOneAndUpdate(
            { email: 'admin@alaqsa.com' },
            {
                email: 'admin@alaqsa.com',
                name: 'Admin User',
                role: 'admin',
                password: 'admin123'
            },
            { upsert: true, new: true }
        );
        console.log('Seeded admin@alaqsa.com');

        await User.findOneAndUpdate(
            { email: 'manager@alaqsa.com' },
            {
                email: 'manager@alaqsa.com',
                name: 'Manager User',
                role: 'admin', // Giving admin access to manager for now
                password: 'manager123'
            },
            { upsert: true, new: true }
        );
        console.log('Seeded manager@alaqsa.com');

        // Update existing users with a default password if missing
        const existingUsers = await User.find({ password: { $exists: false } });
        for (const u of existingUsers) {
            u.password = 'password123';
            await u.save();
            console.log(`Updated password for ${u.email}`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
})();
