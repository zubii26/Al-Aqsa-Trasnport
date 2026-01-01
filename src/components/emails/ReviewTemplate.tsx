
import * as React from 'react';

interface ReviewTemplateProps {
    customerName: string;
    bookingId: string;
    reviewLink: string;
}

export const ReviewTemplate: React.FC<ReviewTemplateProps> = ({
    customerName,
    bookingId,
    reviewLink,
}) => (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1e293b', padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#0f172a', fontSize: '24px', margin: '0 0 10px 0' }}>How was your trip?</h1>
            <p style={{ color: '#64748b', fontSize: '16px', margin: '0' }}>Booking ID: #{bookingId.slice(0, 8)}</p>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
                Dear <strong>{customerName}</strong>,<br /><br />
                Thank you for choosing Al Aqsa Transport for your recent journey.
                We hope you had a comfortable and spiritual experience.
            </p>

            <p style={{ fontSize: '16px', marginBottom: '32px' }}>
                Your feedback helps us provide the best service to pilgrims and travelers.
                Please take a moment to rate your driver and vehicle.
            </p>

            <a
                href={reviewLink}
                style={{
                    display: 'inline-block',
                    backgroundColor: '#D4AF37', // Gold
                    color: '#ffffff',
                    padding: '14px 28px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '16px'
                }}
            >
                Rate Your Trip
            </a>

            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '32px' }}>
                It only takes 1 minute!
            </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#94a3b8' }}>
            <p>&copy; {new Date().getFullYear()} Al Aqsa Transport. All rights reserved.</p>
        </div>
    </div>
);
