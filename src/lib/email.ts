import nodemailer from 'nodemailer';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'host', 'port', etc. for other providers
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

interface BookingData {
    name: string;
    status: string;
    id: string;
    vehicle: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    passengers: number;
}

export const getBookingConfirmationTemplate = (booking: BookingData) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #d4af37;">Booking Confirmation</h1>
        <p>Dear ${booking.name},</p>
        <p>Thank you for choosing Al Aqsa Transport. Your booking has been received and is currently <strong>${booking.status}</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Booking Details:</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
            <p><strong>Pickup:</strong> ${booking.pickup}</p>
            <p><strong>Dropoff:</strong> ${booking.dropoff}</p>
            <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</p>
            <p><strong>Passengers:</strong> ${booking.passengers}</p>
        </div>

        <p>We will contact you shortly to confirm your ride.</p>
        <p>Safe Travels,<br/>The Al Aqsa Transport Team</p>
    </div>
`;

interface ContactData {
    name: string;
    message: string;
}

export const getContactFeedbackTemplate = (data: ContactData) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #d4af37;">Message Received</h1>
        <p>Dear ${data.name},</p>
        <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p>${data.message}</p>
        </div>

        <p>Best Regards,<br/>The Al Aqsa Transport Team</p>
    </div>
`;
