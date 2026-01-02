
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { DraftBooking } from '@/models';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { email, phone, name, step, data, draftId } = body;

        // Validation: At least some data needed
        if (!data) {
            return NextResponse.json({ error: 'No data provided' }, { status: 400 });
        }

        let draft;

        // 1. Try to find by draftId
        if (draftId) {
            draft = await DraftBooking.findById(draftId);
        }

        // 2. Try to find by email if no draftId or not found (and email is provided)
        if (!draft && email) {
            draft = await DraftBooking.findOne({ email, recoveryEmailSent: false });
        }

        // 3. Upsert
        if (draft) {
            // Update
            if (email) draft.email = email;
            if (phone) draft.phone = phone;
            if (name) draft.name = name;
            draft.step = step || draft.step;
            draft.data = { ...draft.data, ...data };
            draft.lastActive = new Date();
            await draft.save();
        } else {
            // Create New
            draft = await DraftBooking.create({
                email,
                phone,
                name,
                step: step || 1,
                data,
                lastActive: new Date()
            });
        }

        return NextResponse.json({
            success: true,
            draftId: draft._id
        });

    } catch (error) {
        console.error('Draft Save Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
