import dbConnect from '@/lib/mongodb';
import { unstable_cache } from 'next/cache';
import { Route, RoutePrice, IRoute } from '@/models';
import pricingData from '@/data/pricing.json';

// Helper interface for the frontend (combines Route and its Prices)
export interface RouteWithPrices extends IRoute {
    id: string;
    prices?: { vehicleId: string; price: number }[];
}

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

const parseRouteName = (name: string) => {
    if (name.toLowerCase().includes('ziyarat') || name.toLowerCase().includes('ziarat')) {
        if (name.toLowerCase().includes('madinah') || name.toLowerCase().includes('madina')) {
            return { origin: 'Madinah', destination: 'Madinah Ziyarat' };
        }
        return { origin: 'Makkah', destination: 'Makkah Ziyarat' };
    }
    const parts = name.split(/ to /i);
    if (parts.length >= 2) {
        return { origin: parts[0].trim(), destination: parts[1].trim() };
    }
    return { origin: name, destination: '' };
};

const getFallbackRoutes = (): RouteWithPrices[] => {
    return pricingData.routes.map((r: any) => {
        const prices = Object.entries(r.customRates || {}).map(([vId, price]) => ({
            vehicleId: VECHICLE_ID_MAP[vId] || vId,
            price: Number(price)
        }));

        const { origin, destination } = parseRouteName(r.name);

        const category = r.category || (
            r.slug.toLowerCase().includes('airport') ? 'Airport Departure' :
            r.name.toLowerCase().includes('airport') ? 'Airport Arrival' :
            (r.name.toLowerCase().includes('ziarat') || r.name.toLowerCase().includes('ziyarat')) ? 'Ziarat' :
            'Intercity'
        );

        return {
            _id: r.id,
            id: r.id,
            origin: origin,
            destination: destination,
            distance: r.distance || '',
            duration: r.time || '',
            category: category,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            prices: prices
        } as unknown as RouteWithPrices;
    });
};

export const routeService = {
    getRoutes: unstable_cache(async () => {
        console.log('[routeService] getRoutes starting...');
        try {
            await dbConnect();
            const routes = await Route.aggregate([
                { $sort: { createdAt: -1 } },
                {
                    $addFields: {
                        routeIdString: { $toString: "$_id" }
                    }
                },
                {
                    $lookup: {
                        from: 'routeprices',
                        localField: 'routeIdString',
                        foreignField: 'route',
                        as: 'prices_data'
                    }
                },
                {
                    $project: {
                        id: { $toString: "$_id" },
                        _id: { $toString: "$_id" },
                        origin: 1,
                        destination: 1,
                        distance: 1,
                        duration: 1,
                        category: 1,
                        isActive: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        prices: {
                            $map: {
                                input: "$prices_data",
                                as: "p",
                                in: {
                                    vehicleId: "$$p.vehicle",
                                    price: "$$p.price"
                                }
                            }
                        }
                    }
                }
            ]);

            return routes.map(route => ({
                ...route,
                createdAt: route.createdAt ? new Date(route.createdAt).toISOString() : null,
                updatedAt: route.updatedAt ? new Date(route.updatedAt).toISOString() : null,
            })) as unknown as RouteWithPrices[];
        } catch (error) {
            console.error('Error in routeService.getRoutes, using static fallback:', error);
            return getFallbackRoutes();
        }
    }, ['routes-list'], { revalidate: 3600, tags: ['routes'] }),

    // Optimized method for public facing pages - Aggregation pipeline
    getActiveRoutes: unstable_cache(async () => {
        try {
            await dbConnect();
            const routes = await Route.aggregate([
                { $match: { isActive: true } },
                { $sort: { createdAt: -1 } },
                // Convert _id to string for matching in lookup if needed, but here we likely match ObjectId to String or ObjectId to ObjectId.
                // Based on schema, RoutePrice.route is a String. So we need to convert Route._id (ObjectId) to string.
                {
                    $addFields: {
                        routeIdString: { $toString: "$_id" }
                    }
                },
                {
                    $lookup: {
                        from: 'routeprices', // Collection name (lowercase plural of model name usually)
                        localField: 'routeIdString',
                        foreignField: 'route',
                        as: 'prices_data'
                    }
                },
                {
                    $project: {
                        id: { $toString: "$_id" },
                        _id: { $toString: "$_id" }, // Keep for compatibility if needed or just use id
                        origin: 1,
                        destination: 1,
                        distance: 1,
                        duration: 1,
                        category: 1,
                        isActive: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        prices: {
                            $map: {
                                input: "$prices_data",
                                as: "p",
                                in: {
                                    vehicleId: "$$p.vehicle",
                                    price: "$$p.price"
                                }
                            }
                        }
                    }
                }
            ]);

            return routes.map(route => ({
                ...route,
                createdAt: route.createdAt ? new Date(route.createdAt).toISOString() : null,
                updatedAt: route.updatedAt ? new Date(route.updatedAt).toISOString() : null,
            })) as unknown as RouteWithPrices[];

        } catch (error) {
            console.error('Error in routeService.getActiveRoutes, using static fallback:', error);
            return getFallbackRoutes().filter(r => r.isActive);
        }
    }, ['routes-active'], { revalidate: 3600, tags: ['routes'] }),

    async getRouteById(id: string) {
        try {
            await dbConnect();
            const route = await Route.findById(id).lean();
            if (!route) return null;

            const prices = await RoutePrice.find({ route: id }).lean();

            return {
                ...route,
                id: route._id.toString(),
                createdAt: route.createdAt,
                updatedAt: route.updatedAt,
                prices: prices.map(p => ({ vehicleId: p.vehicle, price: p.price }))
            } as unknown as RouteWithPrices;
        } catch (error) {
            console.error(`Error in getRouteById for ${id}, using static fallback:`, error);
            const fallbacks = getFallbackRoutes();
            return fallbacks.find(r => r.id === id || r._id?.toString() === id) || null;
        }
    },

    async createRoute(data: Partial<IRoute>) {
        await dbConnect();
        const newRoute = await Route.create(data);
        return { ...newRoute.toObject(), id: newRoute._id.toString() };
    },

    async updateRoute(id: string, data: Partial<IRoute>) {
        await dbConnect();
        const updatedRoute = await Route.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!updatedRoute) return null;
        return { ...updatedRoute, id: updatedRoute._id.toString() };
    },

    async updateRoutePrice(routeId: string, vehicleId: string, price: number) {
        await dbConnect();

        const updatedPrice = await RoutePrice.findOneAndUpdate(
            { route: routeId, vehicle: vehicleId },
            { price },
            { upsert: true, new: true }
        ).lean();

        return { routeId, vehicleId, price: updatedPrice.price };
    },

    async deleteRoute(id: string) {
        await dbConnect();
        await Route.findByIdAndDelete(id);
        // Also delete associated prices
        await RoutePrice.deleteMany({ route: id });
    },
};
