import dbConnect from '@/lib/mongodb';
import { unstable_cache } from 'next/cache';
import { Route, RoutePrice, IRoute } from '@/models';

// Helper interface for the frontend (combines Route and its Prices)
export interface RouteWithPrices extends IRoute {
    id: string;
    prices?: { vehicleId: string; price: number }[];
}

export const routeService = {
    getRoutes: unstable_cache(async () => {
        console.log('[routeService] getRoutes starting...');
        const start = Date.now();
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
            console.error('Error in routeService.getRoutes:', error);
            throw error;
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
            console.error('Error in routeService.getActiveRoutes:', error);
            throw error;
        }
    }, ['routes-active'], { revalidate: 3600, tags: ['routes'] }),

    async getRouteById(id: string) {
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
