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
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
            <p style="font-size: 18px; color: #d4af37; font-weight: bold; margin-bottom: 5px;">﷽</p>
            <h1 style="color: #d4af37; margin: 0; font-size: 24px;">Booking Confirmation</h1>
        </div>

        <p>Dear ${booking.name},</p>

        <p style="font-size: 16px;"><strong>Assalamu Alaikum wa Rahmatullahi wa Barakatuh,</strong></p>

        <p>We are honored to serve you on your sacred journey. Your Umrah cab booking has been successfully confirmed with Al Aqsa Umrah Transport.</p>

        <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #d4af37; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">📌 Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 5px 0; color: #666;">Booking ID:</td>
                    <td style="padding: 5px 0; font-weight: bold;">${booking.id}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #666;">Date & Time:</td>
                    <td style="padding: 5px 0; font-weight: bold;">${booking.date} at ${booking.time}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #666;">Pickup:</td>
                    <td style="padding: 5px 0; font-weight: bold;">${booking.pickup}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #666;">Destination:</td>
                    <td style="padding: 5px 0; font-weight: bold;">${booking.dropoff}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #666; vertical-align: top;">Vehicle(s):</td>
                    <td style="padding: 5px 0; font-weight: bold;">${vehiclesHtml}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #666;">Passengers:</td>
                    <td style="padding: 5px 0; font-weight: bold;">${booking.passengers}</td>
                </tr>
                 <tr>
                    <td style="padding: 5px 0; color: #666;">Luggage:</td>
                    <td style="padding: 5px 0; font-weight: bold;">${booking.luggage || 0}</td>
                </tr>
                 ${booking.price ? `
                <tr>
                    <td style="padding: 5px 0; color: #666;">Total Price:</td>
                    <td style="padding: 5px 0; font-weight: bold; color: #d4af37;">${booking.price}</td>
                </tr>` : ''}
            </table>
        </div>

        <p>Our team is dedicated to ensuring your travel is comfortable, safe, and spiritually uplifting.</p>

        <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37; margin: 25px 0;">
            <h3 style="color: #d4af37; margin-top: 0; margin-bottom: 10px;">✨ Spiritual Reflection for Your Journey</h3>
            
            <p style="margin-bottom: 15px;">
                <span style="font-size: 18px; color: #1a1a1a; display: block; margin-bottom: 5px; font-family: 'Times New Roman', serif;">"الْعُمْرَةُ إِلَى الْعُمْرَةِ كَفَّارَةٌ لِمَا بَيْنَهُمَا"</span>
                <em>“The reward of Umrah is expiation for the sins committed between it and the next Umrah.”</em><br/>
                <span style="font-size: 12px; color: #666;">– Prophet Muhammad (S.A.W.W)</span>
            </p>

            <p>
                <em>“When you set out for Hajj or Umrah, remember you are answering Allah’s call, so let your heart be filled with gratitude and humility.”</em>
            </p>
        </div>

        <p>We pray that your journey is blessed, your worship accepted, and your soul enriched with peace.</p>

        <p>If you have any questions or need assistance, please contact our support team.</p>

        <p>May Allah grant you ease and barakah in every step of your pilgrimage.</p>

        <p style="margin-top: 30px;">
            Warm regards,<br/>
            <strong>Al Aqsa Umrah Transport Team</strong>
        </p>
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
