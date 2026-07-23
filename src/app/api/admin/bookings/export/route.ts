import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';
import { validateRequest } from '@/lib/server-auth';
import { format } from 'date-fns';

export async function GET(request: Request) {
    try {
        const user = await validateRequest();
        if (!user || !['admin', 'manager', 'operational_manager'].includes(user.role)) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'all';

        await dbConnect();

        // Build query matching the frontend filters
        const query: any = {};
        
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { trackId: searchRegex },
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
            ];
        }

        if (status !== 'all') {
            query.status = status;
        }

        // NOTE: Hard ceiling assumption of 10,000 records.
        // If the database grows beyond this, we'll need to paginate the export or use a streaming cursor.
        const LIMIT = 10000;
        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .limit(LIMIT)
            .lean();

        if (bookings.length === LIMIT) {
            console.warn(`[Export] Reached 10k ceiling on CSV export. Query may have truncated results.`);
        }

        // Define CSV headers
        const headers = [
            'Tracking ID',
            'Status',
            'Payment Status',
            'Created At',
            'Name',
            'Email',
            'Phone',
            'Date',
            'Time',
            'Pickup',
            'Dropoff',
            'Total Price'
        ];

        // Format rows
        const rows = bookings.map((b: any) => {
            return [
                b.trackId || '',
                b.status || 'pending',
                b.paymentStatus || 'pending',
                b.createdAt ? format(new Date(b.createdAt), 'yyyy-MM-dd HH:mm:ss') : '',
                b.name || '',
                b.email || '',
                b.phone || '',
                b.date || '',
                b.time || '',
                b.pickup || '',
                b.dropoff || '',
                b.totalPrice || 0
            ].map(val => {
                const str = String(val);
                // Escape quotes and wrap in quotes if there's a comma or quote
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            }).join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="bookings_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv"`,
            },
        });
    } catch (error) {
        console.error('Error exporting bookings:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
