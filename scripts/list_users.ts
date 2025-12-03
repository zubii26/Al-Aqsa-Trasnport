
import dbConnect from '../src/lib/mongodb';
import { User } from '../src/models';

async function listUsers() {
    try {
        await dbConnect();
        const users = await User.find({});
        console.log('--- USERS ---');
        users.forEach(u => {
            console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
        });
        console.log('--- END ---');
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

listUsers();
