export interface Booking {
    id: string;
    customer: string;
    service: string;
    date: string;
    time: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    amount: string;
    email: string;
    phone: string;
    timestamp: number;
}

const STORAGE_KEY = 'transport_bookings';

export const getBookings = (): Booking[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored).sort((a: Booking, b: Booking) => b.timestamp - a.timestamp);
    } catch (e) {
        console.error('Failed to parse bookings', e);
        return [];
    }
};

export const saveBooking = (booking: Omit<Booking, 'id' | 'timestamp' | 'status'>): Booking => {
    const bookings = getBookings();
    const newBooking: Booking = {
        ...booking,
        id: `#AQ-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Pending',
        timestamp: Date.now(),
    };

    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return newBooking;
};

export const updateBookingStatus = (id: string, status: Booking['status']) => {
    const bookings = getBookings();
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};
