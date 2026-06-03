import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Al Aqsa Umrah Transport - Premium VIP Taxi Services';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0A1F44, #051024)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
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
          {/* We use an emoji or text-based logo since loading external images in edge runtime can be tricky without absolute URLs */}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bolder',
              color: '#D4AF37', // Gold
              letterSpacing: '-0.05em',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Al Aqsa
            <span style={{ color: 'white', marginLeft: '20px', fontWeight: 'normal', fontSize: '60px' }}>Transport</span>
          </div>
        </div>
        
        <div
          style={{
            fontSize: '54px',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.4,
            fontWeight: 'bold',
            marginBottom: '30px',
            maxWidth: '900px',
          }}
        >
          Premium Umrah Taxi & VIP Transport
        </div>

        <div
          style={{
            fontSize: '32px',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          Jeddah Airport • Makkah • Madinah
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '60px',
            background: '#D4AF37',
            padding: '20px 40px',
            borderRadius: '20px',
            color: '#0A1F44',
            fontSize: '32px',
            fontWeight: 'bold',
          }}
        >
          Book 24/7 via WhatsApp
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
