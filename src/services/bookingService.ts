import dbConnect from '@/lib/mongodb';
import { Booking, IBooking } from '@/models';

export const bookingService = {
    async getBookings() {
        await dbConnect();
        const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
        return bookings.map(b => ({ ...b, id: b._id.toString() }));
    },

    async getBookingById(id: string) {
        await dbConnect();
        const booking = await Booking.findById(id).lean();
        if (!booking) return null;
        return { ...booking, id: booking._id.toString() };
    },

    async createBooking(data: Partial<IBooking>) {
        await dbConnect();
        const newBooking = await Booking.create(data);
        return { ...newBooking.toObject(), id: newBooking._id.toString() };
    },

    async updateBooking(id: string, data: Partial<IBooking>) {
        await dbConnect();
        const updatedBooking = await Booking.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!updatedBooking) return null;
        return { ...updatedBooking, id: updatedBooking._id.toString() };
    },

    async deleteBooking(id: string) {
        await dbConnect();
        await Booking.findByIdAndDelete(id);
    },
};
