import { prisma } from './prisma';
import { Booking as PrismaBooking, Vehicle as PrismaVehicle } from '@prisma/client';

export type Booking = PrismaBooking;
export type Vehicle = PrismaVehicle;

export async function getBookings(): Promise<Booking[]> {
    return await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    return await prisma.booking.create({
        data: {
            ...booking,
            status: 'pending',
        }
    });
}

export async function updateBookingStatus(id: string, status: string): Promise<Booking | null> {
    try {
        return await prisma.booking.update({
            where: { id },
            data: { status }
        });
    } catch {
        return null;
    }
}

export async function deleteBooking(id: string): Promise<boolean> {
    try {
        await prisma.booking.delete({
            where: { id }
        });
        return true;
    } catch {
        return false;
    }
}

export async function getFleet(): Promise<Vehicle[]> {
    return await prisma.vehicle.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    return await prisma.vehicle.create({
        data: {
            ...vehicle,
            category: vehicle.category || 'Standard',
            isActive: vehicle.isActive ?? true,
        }
    });
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
    try {
        return await prisma.vehicle.update({
            where: { id },
            data: updates
        });
    } catch {
        return null;
    }
}

export async function deleteVehicle(id: string): Promise<boolean> {
    try {
        await prisma.vehicle.delete({
            where: { id }
        });
        return true;
    } catch {
        return false;
    }
}
