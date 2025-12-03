import dbConnect from '@/lib/mongodb';
import { unstable_cache } from 'next/cache';
import { Vehicle, IVehicle } from '@/models';

export const vehicleService = {
    getVehicles: unstable_cache(async () => {
        await dbConnect();
        const vehicles = await Vehicle.find({}).lean();
        return vehicles.map(v => ({ ...v, id: v._id.toString() }));
    }, ['vehicles-list'], { revalidate: 3600, tags: ['vehicles'] }),

    async getVehicleById(id: string) {
        await dbConnect();
        const vehicle = await Vehicle.findById(id).lean();
        if (!vehicle) return null;
        return { ...vehicle, id: vehicle._id.toString() };
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
