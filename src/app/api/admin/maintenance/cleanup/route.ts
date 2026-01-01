
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const months = parseInt(searchParams.get('months') || '6');

        if (isNaN(months) || months < 1) {
            return NextResponse.json(
                { error: 'Invalid months parameter' },
                { status: 400 }
            );
        }

        // Calculate the cutoff date
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - months);

        // Format as YYYY-MM-DD for string comparison (assuming date is stored as string in Booking)
        // Adjust this if your date field is a Date object. 
        // Based on previous code, date seems to be a string "YYYY-MM-DD".
        const cutoffString = cutoffDate.toISOString().split('T')[0];

        // Delete 'completed' or 'cancelled' bookings strictly older than cutoff
        // Note: String comparison works for YYYY-MM-DD. 
        // "2023-01-01" < "2023-02-01" is true.
        const result = await Booking.deleteMany({
            $and: [
                {
                    status: { $in: ['completed', 'cancelled'] }
                },
                {
                    date: { $lt: cutoffString }
                }
            ]
        });

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount,
            message: `Successfully deleted ${result.deletedCount} old bookings.`
        });

    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json(
            { error: 'Internal server error during cleanup' },
            { status: 500 }
        );
    }
}
