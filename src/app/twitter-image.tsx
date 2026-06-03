import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Al Aqsa Umrah Transport - Premium VIP Taxi Services';
export const size = {
  width: 1200,
  height: 600, // Twitter prefers 1200x600 for large summary cards
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0A1F44, #020617)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          borderTop: '20px solid #D4AF37'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '90px',
              fontWeight: 'bolder',
              color: '#D4AF37', // Gold
              letterSpacing: '-0.05em',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Al Aqsa
            <span style={{ color: 'white', marginLeft: '20px', fontWeight: 'normal', fontSize: '70px' }}>Transport</span>
          </div>
        </div>
        
        <div
          style={{
            fontSize: '50px',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.4,
            fontWeight: 'bold',
            marginBottom: '30px',
            maxWidth: '900px',
          }}
        >
          Reliable Jeddah & Madinah Airport Transfers
        </div>

        <div
          style={{
            fontSize: '30px',
            color: '#cbd5e1',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          GMC Yukon & Luxury Fleet Available
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
