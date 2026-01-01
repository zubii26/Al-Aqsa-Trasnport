import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { hashPassword } from '@/lib/password-utils';

export async function GET() {
    try {
        await dbConnect();

        const email = 'driver@alaqsa.com';
        const password = 'driver123';
        const hashedPassword = await hashPassword(password);

        // Check if driver exists
        const existingDriver = await User.findOne({ email });

        if (existingDriver) {
            // Update password/role just in case
            existingDriver.password = hashedPassword;
            existingDriver.role = 'driver';
            await existingDriver.save();
            return NextResponse.json({ message: 'Driver updated successfully', email });
        }

        // Create new driver
        const newDriver = await User.create({
            email,
            password: hashedPassword,
            role: 'driver',
            name: 'Test Driver'
        });

        return NextResponse.json({ message: 'Driver created successfully', driverId: newDriver._id, email });
    } catch (error: any) {
        console.error('Seed Driver Error:', error);
        return NextResponse.json({
            error: error.message,
            details: error.errors, // Mongoose validation errors
            stack: error.stack
        }, { status: 500 });
    }
}
