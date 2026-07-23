import dbConnect from '@/lib/mongodb';
import { Booking, Vehicle, IBooking, IVehicle, Route } from '@/models';
import { unstable_cache, revalidateTag } from 'next/cache';

export type { IBooking as Booking, IVehicle as Vehicle };

// --- Booking Functions ---

export async function getBookings(
    page: number = 1, 
    limit: number = 50, 
    sort: string = 'createdAt', 
    filter: string = ''
) {
    await dbConnect();
    
    let matchQuery: any = {};
    if (filter === 'needsAction') {
        const now = new Date();
        const next48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        matchQuery = {
            status: 'pending',
            pickupDateTime: { $lte: next48Hours }
        };
    } else if (filter) {
        matchQuery = { status: filter };
    }
    
    const total = await Booking.countDocuments(matchQuery);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    let bookings;
    if (sort === 'urgency') {
        bookings = await Booking.aggregate([
            { $match: matchQuery },
            { 
                $addFields: { 
                    sortOrder: {
                        $cond: {
                            if: { $in: ["$status", ["completed", "cancelled"]] },
                            then: 1, 
                            else: 0
                        }
                    }
                }
            },
            { $sort: { sortOrder: 1, pickupDateTime: 1 } },
            { $skip: skip },
            { $limit: limit }
        ]);
    } else {
        bookings = await Booking.find(matchQuery)
            .sort({ [sort === 'createdAt' ? 'createdAt' : sort]: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }

    const mappedBookings = bookings.map((b: any) => ({
        ...b,
        _id: b._id.toString(),
        id: b._id.toString(),
    })) as unknown as IBooking[];
    
    return {
        bookings: mappedBookings,
        total,
        page,
        totalPages
    };
}

export const getDashboardStats = unstable_cache(async () => {
    await dbConnect();

    // Aggregation for stats
    const [stats] = await Booking.aggregate([
        {
            $facet: {
                counts: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                            confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
                            revenue: { $sum: { $convert: { input: { $ifNull: ["$finalPrice", { $ifNull: ["$price", 0] }] }, to: "double", onError: 0 } } }
                        }
                    }
                ],
                statusStats: [
                    { $group: { _id: "$status", value: { $sum: 1 } } }
                ],
                revenueChart: [
                    { $sort: { createdAt: -1 } },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            revenue: {
                                $sum: {
                                    $convert: {
                                        input: { $ifNull: ["$finalPrice", { $ifNull: ["$price", 0] }] },
                                        to: "double",
                                        onError: 0,
                                        onNull: 0
                                    }
                                }
                            },
                            bookings: { $sum: 1 },
                            actualDate: { $first: "$createdAt" }
                        }
                    },
                    { $sort: { _id: 1 } },
                    { $limit: 7 }
                ],
                vehicleStats: [
                    { $group: { _id: "$vehicle", value: { $sum: 1 } } },
                    { $sort: { value: -1 } },
                    { $limit: 5 }
                ],
                routeStats: [
                    { $group: { _id: { $concat: ["$pickup", " ⇄ ", "$dropoff"] }, value: { $sum: 1 } } },
                    { $sort: { value: -1 } },
                    { $limit: 5 }
                ]
            }
        }
    ]);

    const activeFleetCount = await Vehicle.countDocuments({ isActive: true });
    const totalFleetCount = await Vehicle.countDocuments({});
    const routesCount = await Route.countDocuments({});

    const statusMap: Record<string, string> = {
        confirmed: '#10b981',
        pending: '#f59e0b',
        completed: '#3b82f6',
        cancelled: '#ef4444'
    };

    return {
        totalBookings: stats.counts[0]?.total || 0,
        pendingBookings: stats.counts[0]?.pending || 0,
        confirmedBookings: stats.counts[0]?.confirmed || 0,
        totalRevenue: stats.counts[0]?.revenue || 0,
        activeFleet: activeFleetCount,
        totalFleet: totalFleetCount,
        routesCount: routesCount,
        analyticsData: {
            revenueChart: stats.revenueChart.map((item: any) => ({
                name: item._id,
                revenue: item.revenue,
                bookings: item.bookings
            })),
            statusPie: stats.statusStats.map((item: any) => ({
                name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
                value: item.value,
                color: statusMap[item._id] || '#cbd5e1'
            })).filter((i: any) => i.value > 0),
            vehicleBar: stats.vehicleStats.map((item: any) => ({
                name: item._id || 'Unknown',
                value: item.value
            })),
            routeBar: stats.routeStats.map((item: any) => ({
                name: item._id || 'Custom Route',
                value: item.value
            }))
        }
    };
}, ['dashboard-stats'], { revalidate: 300, tags: ['dashboard'] });

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

export function generateBookingReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = 'AQT-';
    for (let i = 0; i < 6; i++) {
        ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
}

export async function addBooking(bookingData: Partial<IBooking>): Promise<IBooking> {
    await dbConnect();
    
    // Generate unique booking reference
    let bookingReference = generateBookingReference();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
        const existing = await Booking.exists({ bookingReference });
        if (!existing) {
            isUnique = true;
        } else {
            bookingReference = generateBookingReference();
            attempts++;
        }
    }
    
    bookingData.bookingReference = bookingReference;
    
    const newBooking = await Booking.create(bookingData);
    const obj = newBooking.toObject();
    return {
        ...obj,
        _id: obj._id.toString(),
        id: obj._id.toString()
    } as unknown as IBooking;
}

export async function updateBookingStatus(id: string, status: string): Promise<IBooking | null> {
    return updateBooking(id, { status });
}

export async function updateBooking(id: string, updates: Partial<IBooking>): Promise<IBooking | null> {
    await dbConnect();
    const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        updates,
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
