import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const DEFAULT_BOOKING_CONFIRMATION_TEMPLATE = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; direction: ltr;">
    <!-- Modern Header with Gold Accent -->
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #d4af37; padding-bottom: 20px;">
        <h1 style="color: #d4af37; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 1px;">Booking Confirmed</h1>
        <h2 style="color: #666; margin: 5px 0 0 0; font-size: 18px; font-weight: normal;">تم تأكيد الحجز</h2>
    </div>

    <!-- Bilingual Greeting -->
    <div style="text-align: center; margin-bottom: 30px;">
        <p style="font-size: 16px; margin-bottom: 5px;">Dear <strong>{{name}}</strong>,</p>
        <p style="font-size: 18px; color: #d4af37; font-family: 'Amiri', serif; margin: 0;">أهلاً بك يا ضيف الرحمن</p>
    </div>

    <p style="text-align: center;">Thank you for choosing Al Aqsa Umrah Transport. Your ride has been scheduled successfully.<br>
    <span style="font-family: 'Amiri', serif; color: #666;">شكراً لاختيارك الأقصى للنقل. تم حجز رحلتك بنجاح.</span></p>

    <!-- Booking Details Card -->
    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; margin: 25px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #1a1a1a; padding: 10px 20px;">
            <h3 style="color: #d4af37; margin: 0; font-size: 16px; text-transform: uppercase;">TRIP DETAILS | تفاصيل الرحلة</h3>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
            <!-- Booking Ref -->
            <tr>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
                    <div style="font-size: 12px; text-transform: uppercase;">Reference Code</div>
                    <div style="font-family: 'Amiri', serif; font-size: 12px;">رقم الحجز</div>
                </td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; font-weight: bold; font-family: monospace; font-size: 16px; color: #1a1a1a;">
                    {{booking_id}}
                </td>
            </tr>

            <!-- Date & Time -->
            <tr>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
                    <div style="font-size: 12px; text-transform: uppercase;">Date & Time</div>
                    <div style="font-family: 'Amiri', serif; font-size: 12px;">الموعد</div>
                </td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a1a;">
                    {{date}}<br>
                    <span style="color: #d4af37;">{{time}}</span>
                </td>
            </tr>

            <!-- Locations -->
            <tr>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
                    <div style="font-size: 12px; text-transform: uppercase;">From & To</div>
                    <div style="font-family: 'Amiri', serif; font-size: 12px;">المسار</div>
                </td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: #1a1a1a;">
                    <div style="margin-bottom: 4px;">🟢 <strong>{{pickup}}</strong></div>
                    <div>🔴 <strong>{{dropoff}}</strong></div>
                </td>
            </tr>

            <!-- Vehicle -->
            <tr>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
                    <div style="font-size: 12px; text-transform: uppercase;">Vehicle</div>
                    <div style="font-family: 'Amiri', serif; font-size: 12px;">السيارة</div>
                </td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: #1a1a1a;">
                    {{vehicle_details}}
                </td>
            </tr>

             <!-- Passengers -->
             <tr>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
                    <div style="font-size: 12px; text-transform: uppercase;">Count</div>
                    <div style="font-family: 'Amiri', serif; font-size: 12px;">العدد</div>
                </td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: #1a1a1a;">
                    <strong>{{passengers}}</strong> Passengers | <strong>{{luggage}}</strong> Bags
                </td>
            </tr>

            <!-- Price -->
            {{price_row}}
        </table>
    </div>

    <!-- Spiritual Note -->
    <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37; margin: 25px 0; text-align: center;">
        <p style="margin: 0; font-size: 18px; font-family: 'Amiri', serif; color: #1a1a1a;">"الْعُمْرَةُ إِلَى الْعُمْرَةِ كَفَّارَةٌ لِمَا بَيْنَهُمَا"</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;"><em>"The reward of Umrah is expiation for the sins committed between it and the next Umrah."</em></p>
    </div>

    <!-- Need Help -->
    <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        <p>Need to make changes? Call/WhatsApp us anytime.</p>
        <a href="https://wa.me/${WHATSAPP_NUMBER}" style="display: inline-block; background-color: #25D366; color: white; text-decoration: none; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin-top: 10px;">
            WhatsApp Support
        </a>
    </div>

    <p style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        &copy; {{year}} Al Aqsa Umrah Transport. All rights reserved.
    </p>
</div>
`;

export const DEFAULT_ADMIN_NOTIFICATION_TEMPLATE = `
<div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #d4af37;">New Booking Received</h1>
    <p><strong>Booking Reference:</strong> {{booking_id}}</p>
    <p><strong>Submission Time:</strong> {{submission_time}}</p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">Customer Details</h3>
        <p><strong>Name:</strong> {{name}}</p>
        <p><strong>Status:</strong> {{status}}</p>
        {{phone_row}}
        {{country_row}}
        {{flight_row}}
        {{arrival_date_row}}

        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 20px;">Service Details</h3>
        <div><strong>Vehicle(s):</strong> {{vehicle_details}}</div>
        <p><strong>Pickup:</strong> {{pickup}}</p>
        <p><strong>Dropoff:</strong> {{dropoff}}</p>
        <p><strong>Date & Time:</strong> {{date}} at {{time}}</p>
        <p><strong>Passengers:</strong> {{passengers}}</p>
        <p><strong>Luggage:</strong> {{luggage}}</p>
        {{notes_row}}
        {{price_row}}
    </div>

    <p style="font-size: 12px; color: #666;">This is an automated notification from the Al Aqsa Transport booking system.</p>
</div>
`;


// Template variable replacer
export const replaceTemplateVariables = (template: string, variables: Record<string, string | number | undefined>) => {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        // Replace {{key}} case-insensitive
        const regex = new RegExp(`{{${key}}}`, 'gi');
        result = result.replace(regex, value !== undefined && value !== null ? String(value) : '');
    }
    return result;
};
