import { NextResponse } from 'next/server';
import { formatDistanceToNow } from 'date-fns';

// ── Static Representative Bookings (M-002 Fix Option B) ─────────────
// No live database queries. No real records. Complete PDPL safety.
// These are representative templates that rotate to look dynamic.
const REPRESENTATIVE_BOOKINGS = [
    { name: "Ahmed", city: "Jeddah Airport", vehicle: "GMC Yukon", action: "Just booked" },
    { name: "Fatima", city: "Makkah", vehicle: "Toyota Hiace", action: "Just booked" },
    { name: "Omar", city: "Madinah", vehicle: "VIP Transport", action: "Just booked" },
    { name: "Yousef", city: "Jeddah", vehicle: "Toyota Camry", action: "Just booked" },
    { name: "Aisha", city: "Makkah", vehicle: "Ford Taurus", action: "Just booked" },
    { name: "Zayn", city: "Madinah Airport", vehicle: "GMC Yukon", action: "Just booked" },
    { name: "Hassan", city: "Jeddah Airport", vehicle: "VIP Transport", action: "Just booked" },
    { name: "Layla", city: "Makkah", vehicle: "Toyota Hiace", action: "Just booked" },
];

export async function GET() {
    try {
        // Rotate the selection based on the current hour so it feels "live" 
        // without touching a database or exposing real customers.
        const currentHour = new Date().getHours();
        const startIndex = currentHour % REPRESENTATIVE_BOOKINGS.length;
        
        // Take 4 items, wrapping around if necessary
        const selected = [
            ...REPRESENTATIVE_BOOKINGS.slice(startIndex, startIndex + 4),
            ...REPRESENTATIVE_BOOKINGS.slice(0, Math.max(0, (startIndex + 4) - REPRESENTATIVE_BOOKINGS.length))
        ];

        const formattedBookings = selected.map((booking, i) => {
            // Generate realistic "recent" timestamps (e.g. 5m ago, 12m ago, 25m ago, 45m ago)
            const minutesAgo = (i * 12) + 5; 
            const fakeDate = new Date(Date.now() - (minutesAgo * 60000));
            
            return {
                id: `rep-${currentHour}-${i}`, // No real DB IDs
                name: booking.name,
                city: booking.city,
                country: "Saudi Arabia",
                vehicle: booking.vehicle,
                action: booking.action,
                timestamp: fakeDate.toISOString(),
                time: formatDistanceToNow(fakeDate, { addSuffix: true })
            };
        });

        // Add standard Next.js cache headers so edge networks can cache this heavily
        return NextResponse.json(
            { bookings: formattedBookings },
            { 
                headers: { 
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' 
                } 
            }
        );
    } catch (error) {
        console.error('Error generating recent bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
