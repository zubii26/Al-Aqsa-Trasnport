
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Shift } from '@/models';
import { validateRequest } from '@/lib/server-auth';

export async function PATCH(request: Request) {
    try {
        const user = await validateRequest();

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'driver' && user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
        }

        const { isOnline } = await request.json();

        await dbConnect();

        // Shift Logging Logic
        if (isOnline) {
            // Check for existing active shift to prevent duplicates
            const activeShift = await Shift.findOne({ driverId: user.id, status: 'active' });
            if (!activeShift) {
                await Shift.create({
                    driverId: user.id,
                    startTime: new Date(),
                    status: 'active',
                    initialLocation: user.location ? { lat: user.location.lat, lng: user.location.lng } : undefined
                });
            }
        } else {
            // Close active shift
            const activeShift = await Shift.findOne({ driverId: user.id, status: 'active' });
            if (activeShift) {
                const endTime = new Date();
                const duration = Math.round((endTime.getTime() - new Date(activeShift.startTime).getTime()) / 60000); // minutes

                activeShift.endTime = endTime;
                activeShift.duration = duration;
                activeShift.status = 'completed';
                if (user.location) {
                    activeShift.endLocation = { lat: user.location.lat, lng: user.location.lng };
                }
                // Optional: Calculate earnings/trips here if we had that data handy, or do it on a separate background job

                await activeShift.save();
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { isOnline },
            { new: true }
        ).select('-password');

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error('Update Status Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
