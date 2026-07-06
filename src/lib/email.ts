import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { generateBookingInvoice } from './pdf-generator';

const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Create a transporter using environment variables (fallback)
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
    attachments?: { filename: string; content: string | Buffer }[];
}

export const sendEmail = async ({ to, subject, html, attachments }: EmailOptions) => {
    // Debug logging for server-side troubleshooting
    console.log(`[Email] Attempting to send email to: ${to.substring(0, 3)}***@${to.split('@')[1]}`);

    // Try Resend first if available
    if (resendClient) {
        try {
            const fromEmail = process.env.RESEND_FROM_EMAIL || 'bookings@alaqsaumrahtransport.com';
            const { data, error } = await resendClient.emails.send({
                from: `Al Aqsa Transport <${fromEmail}>`,
                to,
                subject,
                html,
                attachments,
            });
            
            if (error) {
                console.error('[Email] Resend failed:', error);
                return false;
            }
            console.log('[Email] Sent successfully via Resend. MessageId:', data?.id);
            return true;
        } catch (err: any) {
            console.error('[Email] Resend exception:', err.message);
            return false;
        }
    }

    // Fallback to Nodemailer
    console.log(`[Email] Environment check - USER: ${!!process.env.EMAIL_USER ? 'Set' : 'Missing'}, PASS: ${!!process.env.EMAIL_PASS ? 'Set' : 'Missing'}`);
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[Email] Sent successfully via Nodemailer. MessageId:', info.messageId);
        return true;
    } catch (error: any) {
        console.error('[Email] Failed to send via Nodemailer:', error.message);
        if (error.response) {
            console.error('[Email] SMTP Response:', error.response);
        }
        return false;
    }
};

interface BookingData {
    name: string;
    email?: string;
    status: string;
    id: string;
    vehicle: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    passengers: number;
    vehicleCount?: number;
    luggage?: number;
    notes?: string;
    price?: string;
    selectedVehicles?: { name: string; quantity: number }[];
    country?: string;
    flightNumber?: string;
    arrivalDate?: string;
    phone?: string;
    includeWadiJinn?: boolean;
    legs?: any[];
    visaType?: string;
    viaBadr?: boolean;
    bookingReference?: string;
}

import { replaceTemplateVariables } from './email-templates';
import { getSettings } from './settings-storage';

// Helper to format vehicle list for the template substitution
const formatVehicles = (booking: BookingData) => {
    if (booking.selectedVehicles && booking.selectedVehicles.length > 0) {
        return `<ul style="margin: 0; padding-left: 20px;">
            ${booking.selectedVehicles.map(v => `<li>${v.quantity} x ${v.name}</li>`).join('')}
           </ul>`;
    }
    return booking.vehicle || 'Standard Vehicle';
};

const formatPriceRow = (booking: BookingData) => {
    if (!booking.price) return '';
    return `<tr>
        <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
            <div style="font-size: 12px; text-transform: uppercase;">Total Price</div>
            <div style="font-family: 'Amiri', serif; font-size: 12px;">السعر الإجمالي</div>
        </td>
        <td style="padding: 15px 20px; border-bottom: 1px solid #eee; font-weight: bold; color: #d4af37; font-size: 18px;">
            ${booking.price}
        </td>
    </tr>`;
};

// Generic function to prepare variables
const prepareBookingVariables = (booking: BookingData) => {
    return {
        // Booking variables
        booking_id: booking.bookingReference || `INV-${(booking.id || '').slice(-6).toUpperCase()}`,
        booking_date: new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        dropoff: booking.dropoff,
        vehicle_details: formatVehicles(booking),
        passengers: booking.passengers,
        luggage: booking.luggage || 0,
        price_row: formatPriceRow(booking),
        name: booking.name,
        date: booking.date,
        time: booking.time,
        pickup: booking.pickup,
        status: booking.status,
        submission_time: new Date().toLocaleString(),
        year: new Date().getFullYear(),
        country_row: booking.country ? `<p><strong>Country:</strong> ${booking.country}</p>` : '',
        flight_row: booking.flightNumber ? `<p><strong>Flight:</strong> ${booking.flightNumber}</p>` : '',
        arrival_date_row: booking.arrivalDate ? `<p><strong>Arrival Date:</strong> ${booking.arrivalDate}</p>` : '',
        notes_row: booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : '',
        phone_row: booking.phone ? `<p><strong>Phone:</strong> ${booking.phone}</p>` : '',
        wadiJinn_row: (booking.includeWadiJinn || (booking.legs && booking.legs.some(l => l.includeWadiJinn))) 
            ? `<tr>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
                    <div style="font-size: 12px; text-transform: uppercase;">External Ziyarat</div>
                    <div style="font-family: 'Amiri', serif; font-size: 12px;">زيارة خارجية</div>
                </td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: #1a1a1a;">
                    Wadi Jinn (Included in total)
                </td>
               </tr>`
            : '',
        wadiJinn_admin_row: (booking.includeWadiJinn || (booking.legs && booking.legs.some(l => l.includeWadiJinn))) 
            ? `<p><strong>Add-on:</strong> Wadi Jinn (External Ziyarat) included</p>`
            : '',
        visaType_row: booking.visaType ? `<p><strong>Visa Type:</strong> ${booking.visaType}</p>` : '',
        nusukFee_row: (booking.visaType === 'Umrah Visa' && booking.pickup?.toLowerCase().includes('jeddah') && booking.dropoff?.toLowerCase().includes('madinah'))
            ? `<tr>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
                    <div style="font-size: 12px; text-transform: uppercase;">Nusuk Direct Route Fee</div>
                    <div style="font-family: 'Amiri', serif; font-size: 12px;">رسوم نسك</div>
                </td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: #d4af37; font-weight: bold;">
                    Umrah Visa Only (Included in total)
                </td>
               </tr>`
            : '',
        nusukFee_admin_row: (booking.visaType === 'Umrah Visa' && booking.pickup?.toLowerCase().includes('jeddah') && booking.dropoff?.toLowerCase().includes('madinah'))
            ? `<p><strong>Add-on:</strong> Nusuk Direct Route Fee (Umrah Visa) included</p>`
            : '',
        viaBadr_row: (booking.viaBadr || (booking.legs && booking.legs.some(l => l.viaBadr)))
            ? `<tr>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
                    <div style="font-size: 12px; text-transform: uppercase;">Via Badr Route</div>
                    <div style="font-family: 'Amiri', serif; font-size: 12px;">طريق بدر</div>
                </td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: #1a1a1a;">
                    Includes Jabal Malaika Ziyarat (Included in total)
                </td>
               </tr>`
            : '',
        viaBadr_admin_row: (booking.viaBadr || (booking.legs && booking.legs.some(l => l.viaBadr)))
            ? `<p><strong>Route:</strong> Via Badr (Includes Jabal Malaika Ziyarat)</p>`
            : '',
    };
};

export const getBookingConfirmationTemplate = (booking: BookingData, templateString: string) => {
    return replaceTemplateVariables(templateString, prepareBookingVariables(booking));
};

export const getAdminBookingNotificationTemplate = (booking: BookingData, templateString: string) => {
    return replaceTemplateVariables(templateString, prepareBookingVariables(booking));
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

// Helper function to generate PDF attachment
const getPdfAttachment = (booking: BookingData) => {
    try {
        // Map id to _id for pdf generator
        const bookingForPdf = { ...booking, _id: booking.id, finalPrice: booking.price ? booking.price.replace(' SAR', '') : 0 };
        const arrayBuffer = generateBookingInvoice(bookingForPdf, 'buffer') as ArrayBuffer;
        
        return [{
            filename: `Invoice-${booking.bookingReference || booking.id}.pdf`,
            content: Buffer.from(arrayBuffer),
        }];
    } catch (err) {
        console.error('Failed to generate PDF attachment:', err);
        return undefined;
    }
};

export const sendBookingConfirmationEmail = async (booking: BookingData) => {
    // 1. Fetch Request Settings
    const settings = await getSettings();
    const templateString = settings.emailTemplates?.bookingConfirmation || DEFAULT_BOOKING_CONFIRMATION_TEMPLATE;

    // 2. Prepare HTML using the dynamic template
    const htmlContent = getBookingConfirmationTemplate(booking, templateString);

    // 3. Bilingual Subject
    const vars = prepareBookingVariables(booking);
    const subject = `Booking Confirmation ${vars.booking_id} | تأكيد الحجز`;

    // 4. Attachments
    const attachments = getPdfAttachment(booking);

    // 5. Send
    return await sendEmail({
        to: booking.email || '',
        subject,
        html: htmlContent,
        attachments
    });
};

export const sendAdminNewBookingEmail = async (booking: BookingData) => {
    const adminEmail = process.env.ADMIN_EMAIL_NOTIFICATIONS || process.env.EMAIL_USER;
    if (!adminEmail) return false;

    // 1. Fetch Request Settings
    const settings = await getSettings();
    const templateString = settings.emailTemplates?.adminNotification || DEFAULT_ADMIN_NOTIFICATION_TEMPLATE;

    const htmlContent = getAdminBookingNotificationTemplate(booking, templateString);
    const attachments = getPdfAttachment(booking);

    const vars = prepareBookingVariables(booking);

    return await sendEmail({
        to: adminEmail,
        subject: `🔔 New Booking ${vars.booking_id} Received`,
        html: htmlContent,
        attachments
    });
};

import { DEFAULT_BOOKING_CONFIRMATION_TEMPLATE, DEFAULT_ADMIN_NOTIFICATION_TEMPLATE } from './email-templates';
