import dbConnect from '@/lib/mongodb';
import { unstable_cache } from 'next/cache';
import { Vehicle, IVehicle } from '@/models';
import pricingData from '@/data/pricing.json';

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

const VECHICLE_ID_MAP: Record<string, string> = {
    'camry': '692db09834f15bc89b45a5f6',
    'gmc': '692db09834f15bc89b45a5f8',
    'staria': '692db09834f15bc89b45a5f9',
    'starex': '692db09834f15bc89b45a5fa',
    'hiace': '692db09834f15bc89b45a5fb',
    'kia': 'kia',
    'large-bus': 'large-bus',
    'mercedes': 'mercedes',
    'xpander': 'xpander',
    'coaster': 'coaster'
};

const getFallbackVehicles = (): any[] => {
    const jeddahRoute = pricingData.routes.find((r: any) => r.slug === 'jeddah-airport-to-makkah' || r.id === '692db09934f15bc89b45a5fd');
    const hourlyRoute = pricingData.routes.find((r: any) => r.slug === 'hourly-rental-makkah-madinah' || r.id === '692db09a34f15bc89b45a60e');

    const fallbacks = pricingData.vehicles.map((v: any) => {
        const id = VECHICLE_ID_MAP[v.id] || v.id;
        const capacityNum = parseInt(v.capacity) || 7;
        const luggageNum = parseInt(v.luggage) || 4;
        
        // Find custom price from jeddah-airport-to-makkah route
        const priceStr = (jeddahRoute?.customRates?.[v.id as keyof typeof jeddahRoute.customRates] || 250).toString();
        const hourlyRateStr = (hourlyRoute?.customRates?.[v.id as keyof typeof hourlyRoute.customRates] || 80).toString();
        
        return sanitizeVehicle({
            _id: id,
            id: id,
            name: v.name,
            image: `/images/fleet/${v.id}.webp`,
            passengers: capacityNum,
            luggage: luggageNum,
            features: v.features || [],
            price: priceStr,
            hourlyRate: hourlyRateStr,
            category: v.category || (['camry', 'kia'].includes(v.id) ? 'Standard' : ['gmc', 'staria', 'mercedes'].includes(v.id) ? 'VIP' : 'Premium'),
            isActive: v.isActive !== false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    return fallbacks.sort((a, b) => getSortIndex(a) - getSortIndex(b));
};

export const vehicleService = {
    getVehicles: unstable_cache(async () => {
        try {
            await dbConnect();
            const vehicles = await Vehicle.find({}).lean();
            const mapped = vehicles.map(v => sanitizeVehicle({ ...v, id: v._id.toString() }));
            // @ts-ignore
            return mapped.sort((a, b) => getSortIndex(a) - getSortIndex(b));
        } catch (error) {
            console.error('getVehicles database connection failed, returning fallback static data:', error);
            return getFallbackVehicles();
        }
    }, ['vehicles-list-v2'], { revalidate: 3600, tags: ['vehicles'] }),

    // Optimized method for public facing pages
    getActiveVehicles: unstable_cache(async () => {
        try {
            await dbConnect();
            const vehicles = await Vehicle.find({ isActive: true }).lean();
            const mapped = vehicles.map(v => sanitizeVehicle({ ...v, id: v._id.toString() }));
            // @ts-ignore
            return mapped.sort((a, b) => getSortIndex(a) - getSortIndex(b));
        } catch (error) {
            console.error('getActiveVehicles database connection failed, returning fallback active data:', error);
            return getFallbackVehicles().filter(v => v.isActive);
        }
    }, ['vehicles-active-v2'], { revalidate: 3600, tags: ['vehicles'] }),

    async getVehicleById(id: string) {
        try {
            await dbConnect();
            const vehicle = await Vehicle.findById(id).lean();
            if (!vehicle) return null;
            return sanitizeVehicle({ ...vehicle, id: vehicle._id.toString() });
        } catch (error) {
            console.error(`getVehicleById failed for ${id}, using fallback data:`, error);
            const fallbacks = getFallbackVehicles();
            return fallbacks.find(v => v.id === id || v._id === id) || null;
        }
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
