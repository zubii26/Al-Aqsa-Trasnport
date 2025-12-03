import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const envKeys = Object.keys(process.env).filter(key =>
        key.startsWith('NEXT_PUBLIC_') ||
        key.startsWith('CLOUDINARY_') ||
        key === 'NODE_ENV' ||
        key === 'VERCEL'
    );

    return NextResponse.json({
        message: 'Environment Check',
        keys_present: envKeys,
        cloud_name_exists: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key_exists: !!process.env.CLOUDINARY_API_KEY,
        api_secret_exists: !!process.env.CLOUDINARY_API_SECRET,
        // Do not return actual secret values
    });
}
