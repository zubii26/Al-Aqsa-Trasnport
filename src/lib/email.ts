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
    vehicle: string; // Keep for fallback/summary
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    passengers: number;
    vehicleCount?: number;
    luggage?: number;
    notes?: string;
    price?: string;
    selectedVehicles?: { name: string; quantity: number }[]; // New field
    country?: string;
    flightNumber?: string;
    arrivalDate?: string;
}

export const getBookingConfirmationTemplate = (booking: BookingData) => {
    const vehiclesHtml = booking.selectedVehicles && booking.selectedVehicles.length > 0
        ? `<ul style="margin: 0; padding-left: 20px;">
            ${booking.selectedVehicles.map(v => `<li>${v.quantity} x ${v.name}</li>`).join('')}
           </ul>`
        : booking.vehicle;

    return `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #d4af37;">Booking Confirmation</h1>
        <p>Dear ${booking.name},</p>
        <p>Thank you for choosing Al Aqsa Transport. Your booking has been received and is currently <strong>${booking.status}</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Booking Details:</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <div><strong>Vehicle(s):</strong> ${vehiclesHtml}</div>
            <p><strong>Pickup:</strong> ${booking.pickup}</p>
            <p><strong>Dropoff:</strong> ${booking.dropoff}</p>
            <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</p>
            ${booking.country ? `<p><strong>Country:</strong> ${booking.country}</p>` : ''}
            ${booking.flightNumber ? `<p><strong>Flight:</strong> ${booking.flightNumber}</p>` : ''}
            ${booking.arrivalDate ? `<p><strong>Arrival Date:</strong> ${booking.arrivalDate}</p>` : ''}
            <p><strong>Passengers:</strong> ${booking.passengers}</p>
            <p><strong>Luggage:</strong> ${booking.luggage || 0}</p>
            ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
            ${booking.price ? `<p><strong>Price:</strong> ${booking.price}</p>` : ''}
        </div>

        <p>We will contact you shortly to confirm your ride.</p>
        <p>Safe Travels,<br/>The Al Aqsa Transport Team</p>
    </div>
`;
};

// Admin Template (Similar updates)
export const getAdminBookingNotificationTemplate = (booking: BookingData) => {
    const vehiclesHtml = booking.selectedVehicles && booking.selectedVehicles.length > 0
        ? `<ul style="margin: 0; padding-left: 20px;">
            ${booking.selectedVehicles.map(v => `<li>${v.quantity} x ${v.name}</li>`).join('')}
           </ul>`
        : booking.vehicle;

    return `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #d4af37;">New Booking Received</h1>
        <p><strong>Booking Reference:</strong> ${booking.id}</p>
        <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">Customer Details</h3>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            ${booking.country ? `<p><strong>Country:</strong> ${booking.country}</p>` : ''}
            ${booking.flightNumber ? `<p><strong>Flight:</strong> ${booking.flightNumber}</p>` : ''}
            ${booking.arrivalDate ? `<p><strong>Arrival Date:</strong> ${booking.arrivalDate}</p>` : ''}

            <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 20px;">Service Details</h3>
            <div><strong>Vehicle(s):</strong> ${vehiclesHtml}</div>
            <p><strong>Pickup:</strong> ${booking.pickup}</p>
            <p><strong>Dropoff:</strong> ${booking.dropoff}</p>
            <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</p>
            <p><strong>Passengers:</strong> ${booking.passengers}</p>
            <p><strong>Luggage:</strong> ${booking.luggage || 0}</p>
            ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
            ${booking.price ? `<p><strong>Price:</strong> ${booking.price}</p>` : ''}
        </div>

        <p style="font-size: 12px; color: #666;">This is an automated notification from the Al Aqsa Transport booking system.</p>
    </div>
`;
};

interface ContactFeedbackData {
    name: string;
    message: string;
}

export const getContactFeedbackTemplate = ({ name, message }: ContactFeedbackData) => {
    return `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #d4af37;">Thank you for contacting us</h1>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p>${message}</p>
        </div>

        <p>Best Regards,<br/>Al Aqsa Transport Team</p>
    </div>
`;
};
