import { NextResponse } from 'next/server';
import { sendEmail, getContactFeedbackTemplate } from '@/lib/email';
import { ContactSchema } from '@/lib/validations';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const validation = ContactSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: 'Invalid contact data', errors: validation.error.format() },
                { status: 400 }
            );
        }

        const { name, email, message } = validation.data;

        // Send feedback email to the customer
        const emailSent = await sendEmail({
            to: email,
            subject: 'We received your message - Al Aqsa Transport',
            html: getContactFeedbackTemplate({ name, message }),
        });

        // Optionally send a notification to the admin
        if (process.env.EMAIL_USER) {
            await sendEmail({
                to: process.env.EMAIL_USER,
                subject: `New Contact Form Submission from ${name}`,
                html: `
                    <h1>New Message</h1>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `,
            });
        }

        return NextResponse.json({ success: true, emailSent });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
