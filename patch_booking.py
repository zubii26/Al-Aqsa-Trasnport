import re
import sys

def main():
    file_path = "src/app/(public)/booking/page.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()

    # 1. Update BookingData state
    code = code.replace(
        """    const [bookingData, setBookingData] = useState({
        routeId: '',
        selectedVehicles: [] as { vehicleId: string; quantity: number }[],
        date: null as Date | null,
        time: null as Date | null,
        name: '',
        email: '',
        phone: '',
        country: '', // Changed from 'Saudi Arabia' to force selection
        flightNumber: '',
        arrivalDate: null as Date | null,
        notes: '',
        pickup: '',
        dropoff: '',
        passengers: 1,
        luggage: 0,
        customRoute: null as {
            pickupLat: number;
            pickupLng: number;
            dropoffLat: number;
            dropoffLng: number;
            distanceKm: number;
            durationMin: number;
            geometry: string;
        } | null
    });""",
        """    const [bookingData, setBookingData] = useState({
        legs: [{
            id: '1',
            routeId: '',
            pickup: '',
            dropoff: '',
            date: null as Date | null,
            time: null as Date | null,
            customRoute: null as {
                pickupLat: number;
                pickupLng: number;
                dropoffLat: number;
                dropoffLng: number;
                distanceKm: number;
                durationMin: number;
                geometry: string;
            } | null
        }],
        selectedVehicles: [] as { vehicleId: string; quantity: number }[],
        name: '',
        email: '',
        phone: '',
        country: '', // Changed from 'Saudi Arabia' to force selection
        flightNumber: '',
        arrivalDate: null as Date | null,
        notes: '',
        passengers: 1,
        luggage: 0,
        // Keep these for backward compatibility during intermediate refactor steps if needed
        routeId: '', pickup: '', dropoff: '', date: null as Date | null, time: null as Date | null, customRoute: null as any
    });"""
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)

    print("Patch applied successfully.")

if __name__ == "__main__":
    main()
