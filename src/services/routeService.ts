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
        try {
            await dbConnect();
            const routes = await Route.find({}).sort({ createdAt: -1 }).lean();

            // Fetch all prices for all routes in one query
            const routeIds = routes.map(r => r._id.toString());
            const allPrices = await RoutePrice.find({ route: { $in: routeIds } }).lean();

            // Group prices by route ID
            const pricesByRoute = allPrices.reduce((acc, price) => {
                const routeId = price.route.toString();
                if (!acc[routeId]) acc[routeId] = [];
                acc[routeId].push({ vehicleId: price.vehicle, price: price.price });
                return acc;
            }, {} as Record<string, { vehicleId: string; price: number }[]>);

            return routes.map(route => {
                const { _id, ...rest } = route;
                return {
                    ...rest,
                    id: _id.toString(),
                    _id: _id.toString(),
                    createdAt: route.createdAt ? new Date(route.createdAt).toISOString() : null,
                    updatedAt: route.updatedAt ? new Date(route.updatedAt).toISOString() : null,
                    prices: pricesByRoute[_id.toString()] || []
                };
            }) as unknown as RouteWithPrices[];
        } catch (error) {
            console.error('Error in routeService.getRoutes:', error);
            throw error;
        }
    }, ['routes-list'], { revalidate: 3600, tags: ['routes'] }),

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
