export const DEFAULT_BOOKING_CONFIRMATION_TEMPLATE = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 30px;">
        <p style="font-size: 18px; color: #d4af37; font-weight: bold; margin-bottom: 5px;">﷽</p>
        <h1 style="color: #d4af37; margin: 0; font-size: 24px;">Booking Confirmation</h1>
    </div>

    <p>Dear {{name}},</p>

    <p style="font-size: 16px;"><strong>Assalamu Alaikum wa Rahmatullahi wa Barakatuh,</strong></p>

    <p>We are honored to serve you on your sacred journey. Your Umrah cab booking has been successfully confirmed with Al Aqsa Umrah Transport.</p>

    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #d4af37; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">📌 Booking Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 5px 0; color: #666;">Booking ID:</td>
                <td style="padding: 5px 0; font-weight: bold;">{{booking_id}}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0; color: #666;">Date & Time:</td>
                <td style="padding: 5px 0; font-weight: bold;">{{date}} at {{time}}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0; color: #666;">Pickup:</td>
                <td style="padding: 5px 0; font-weight: bold;">{{pickup}}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0; color: #666;">Destination:</td>
                <td style="padding: 5px 0; font-weight: bold;">{{dropoff}}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0; color: #666; vertical-align: top;">Vehicle(s):</td>
                <td style="padding: 5px 0; font-weight: bold;">{{vehicle_details}}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0; color: #666;">Passengers:</td>
                <td style="padding: 5px 0; font-weight: bold;">{{passengers}}</td>
            </tr>
             <tr>
                <td style="padding: 5px 0; color: #666;">Luggage:</td>
                <td style="padding: 5px 0; font-weight: bold;">{{luggage}}</td>
            </tr>
            {{price_row}}
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

export const DEFAULT_ADMIN_NOTIFICATION_TEMPLATE = `
<div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #d4af37;">New Booking Received</h1>
    <p><strong>Booking Reference:</strong> {{booking_id}}</p>
    <p><strong>Submission Time:</strong> {{submission_time}}</p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">Customer Details</h3>
        <p><strong>Name:</strong> {{name}}</p>
        <p><strong>Status:</strong> {{status}}</p>
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

export const replaceTemplateVariables = (template: string, variables: Record<string, string | number | undefined>) => {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        // Replace {{key}} case-insensitive
        const regex = new RegExp(`{{${key}}}`, 'gi');
        result = result.replace(regex, value !== undefined && value !== null ? String(value) : '');
    }
    return result;
};
