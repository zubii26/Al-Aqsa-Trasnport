import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { hashPassword } from '@/lib/password-utils';

export async function GET() {
    try {
        await dbConnect();
        const users = await User.find({});
        let migratedCount = 0;

        for (const user of users) {
            // Check if password is NOT already hashed
            if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
                const hashedPassword = await hashPassword(user.password);
                user.password = hashedPassword;
                await user.save();
                migratedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Migrated ${migratedCount} users to hashed passwords.`
        });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ success: false, error: 'Migration failed' }, { status: 500 });
    }
}
