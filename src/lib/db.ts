import dbConnect from '@/lib/mongodb';
import { Booking, Vehicle, IBooking, IVehicle } from '@/models';
import { unstable_cache, revalidateTag } from 'next/cache';

// Ensure connection is established
dbConnect();

export type { IBooking as Booking, IVehicle as Vehicle };

// --- Booking Functions ---

export async function getBookings(): Promise<IBooking[]> {
    await dbConnect();
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    return bookings.map(b => ({
        ...b,
        _id: b._id.toString(),
        id: b._id.toString(),
    })) as unknown as IBooking[];
}

export async function getBooking(id: string): Promise<IBooking | null> {
    await dbConnect();
    const booking = await Booking.findById(id).lean();
    if (!booking) return null;
    return {
        ...booking,
        _id: booking._id.toString(),
        id: booking._id.toString(),
    } as unknown as IBooking;
}

export async function addBooking(bookingData: Partial<IBooking>): Promise<IBooking> {
    await dbConnect();
    const newBooking = await Booking.create(bookingData);
    const obj = newBooking.toObject();
    return {
        ...obj,
        _id: obj._id.toString(),
        id: obj._id.toString()
    } as unknown as IBooking;
}

export async function updateBookingStatus(id: string, status: string): Promise<IBooking | null> {
    await dbConnect();
    const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    ).lean();
    if (!updatedBooking) return null;
    return {
        ...updatedBooking,
        _id: updatedBooking._id.toString(),
        id: updatedBooking._id.toString()
    } as unknown as IBooking;
}

export async function deleteBooking(id: string): Promise<boolean> {
    await dbConnect();
    const result = await Booking.findByIdAndDelete(id);
    return !!result;
}

// --- Fleet/Vehicle Functions ---

export const getFleet = async (): Promise<IVehicle[]> => {
    await dbConnect();
    const vehicles = await Vehicle.find({ isActive: true }).lean();
    return vehicles.map(v => ({
        ...v,
        _id: v._id.toString(),
        id: v._id.toString()
    })) as unknown as IVehicle[];
};

export async function addVehicle(vehicleData: Partial<IVehicle>): Promise<IVehicle> {
    await dbConnect();
    const newVehicle = await Vehicle.create(vehicleData);
    const obj = newVehicle.toObject();
    // revalidateTag('fleet');
    return {
        ...obj,
        _id: obj._id.toString(),
        id: obj._id.toString()
    } as unknown as IVehicle;
}

export async function updateVehicle(id: string, updates: Partial<IVehicle>): Promise<IVehicle | null> {
    await dbConnect();
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    ).lean();
    if (!updatedVehicle) return null;
    // revalidateTag('fleet');
    return {
        ...updatedVehicle,
        _id: updatedVehicle._id.toString(),
        id: updatedVehicle._id.toString()
    } as unknown as IVehicle;
}

export async function deleteVehicle(id: string): Promise<boolean> {
    await dbConnect();
    const result = await Vehicle.findByIdAndDelete(id);
    if (result) { /* revalidateTag('fleet') */ }
    return !!result;
}
