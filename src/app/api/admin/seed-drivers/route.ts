
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Driver } from '@/models';
import { drivers } from '@/data/drivers';

export async function GET() {
    try {
        await dbConnect();

        // Check if drivers exist
        const count = await Driver.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: 'Drivers already seeded' });
        }

        // Insert mock drivers
        await Driver.insertMany(drivers.map(d => ({
            ...d,
            // Map id to nothing, let mongo generate _id, or keep as string if schema allows (schema doesn't have id field)
            // Schema has name, photo, etc.
            // We need to remove 'id' from source or just spread it (mongoose ignores unknown fields unless strict: throw)
        })));

        return NextResponse.json({ message: 'Drivers seeded successfully', count: drivers.length });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json(
            { error: 'Failed to seed drivers' },
            { status: 500 }
        );
    }
}
