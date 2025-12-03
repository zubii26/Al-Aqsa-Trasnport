import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Section } from '@/models';
import { validateRequest } from '@/lib/server-auth';


export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        if (name) {
            const section = await Section.findOne({ name });
            if (!section) {
                return NextResponse.json({ error: 'Section not found' }, { status: 404 });
            }
            return NextResponse.json(section);
        }

        const sections = await Section.find({}).sort({ name: 1 });
        return NextResponse.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await validateRequest();
        if (!user || !['admin', 'manager', 'operational_manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        // Check if section already exists
        const existingSection = await Section.findOne({ name: body.name });
        if (existingSection) {
            return NextResponse.json({ error: 'Section already exists' }, { status: 400 });
        }

        const section = await Section.create({
            ...body,
            lastUpdatedBy: user.id
        });

        return NextResponse.json(section, { status: 201 });
    } catch (error) {
        console.error('Error creating section:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
