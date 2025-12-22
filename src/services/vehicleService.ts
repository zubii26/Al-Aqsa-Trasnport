import dbConnect from '@/lib/mongodb';
import { unstable_cache } from 'next/cache';
import { Vehicle, IVehicle } from '@/models';

// Helper for robust sorting
const getSortIndex = (v: any) => {
    const str = `${v._id} ${v.name}`.toLowerCase();
    if (str.includes('camry')) return 0;
    if (str.includes('gmc') || str.includes('yukon')) return 1;
    if (str.includes('staria')) return 2;
    if (str.includes('starex')) return 3;
    if (str.includes('hiace')) return 4;
    if (str.includes('coaster')) return 5;
    return 999;
};

// Helper to sanitize/override vehicle data (e.g. enforcing Hiace capacity)
const sanitizeVehicle = (v: any) => {
    const nameLower = (v.name || '').toLowerCase();
    if (nameLower.includes('hiace')) {
        return {
            ...v,
            passengers: 10,
            capacity: '10/11 Seater',
            luggage: v.luggage || '10 Bags' // Ensure luggage is also consistent
        };
    }
    return v;
};

export const vehicleService = {
    getVehicles: unstable_cache(async () => {
        await dbConnect();
        const vehicles = await Vehicle.find({}).lean();
        const mapped = vehicles.map(v => sanitizeVehicle({ ...v, id: v._id.toString() }));
        // @ts-ignore
        return mapped.sort((a, b) => getSortIndex(a) - getSortIndex(b));
    }, ['vehicles-list-v2'], { revalidate: 3600, tags: ['vehicles'] }),

    // Optimized method for public facing pages
    getActiveVehicles: unstable_cache(async () => {
        await dbConnect();
        const vehicles = await Vehicle.find({ isActive: true }).lean();
        const mapped = vehicles.map(v => sanitizeVehicle({ ...v, id: v._id.toString() }));
        // @ts-ignore
        return mapped.sort((a, b) => getSortIndex(a) - getSortIndex(b));
    }, ['vehicles-active-v2'], { revalidate: 3600, tags: ['vehicles'] }),

    async getVehicleById(id: string) {
        await dbConnect();
        const vehicle = await Vehicle.findById(id).lean();
        if (!vehicle) return null;
        return sanitizeVehicle({ ...vehicle, id: vehicle._id.toString() });
    },

    async createVehicle(data: Partial<IVehicle>) {
        await dbConnect();
        const newVehicle = await Vehicle.create(data);
        return { ...newVehicle.toObject(), id: newVehicle._id.toString() };
    },

    async updateVehicle(id: string, data: Partial<IVehicle>) {
        await dbConnect();
        const updatedVehicle = await Vehicle.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!updatedVehicle) return null;
        return { ...updatedVehicle, id: updatedVehicle._id.toString() };
    },

    async deleteVehicle(id: string) {
        await dbConnect();
        await Vehicle.findByIdAndDelete(id);
    },
};
