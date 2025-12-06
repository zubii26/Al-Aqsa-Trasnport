import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { validateRequest } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
    const user = await validateRequest();
    if (!user || (user.role !== 'admin' && !user.role.toLowerCase().includes('manager'))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sanitize env vars (remove potential whitespace from copy-paste)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    const missingVars = [];
    if (!cloudName) missingVars.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    if (!apiKey) missingVars.push('CLOUDINARY_API_KEY');
    if (!apiSecret) missingVars.push('CLOUDINARY_API_SECRET');

    if (missingVars.length > 0) {
        return NextResponse.json(
            { error: `Server configuration error: Missing environment variables: ${missingVars.join(', ')}` },
            { status: 500 }
        );
    }

    try {
        // Generate signature for client-side upload
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'transport_uploads';

        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
            folder: folder,
        }, apiSecret!);

        return NextResponse.json({
            signature,
            timestamp,
            folder,
            cloudName: cloudName,
            apiKey: apiKey,
            success: true
        });

    } catch (error) {
        console.error('Signature generation error:', error);
        return NextResponse.json(
            { error: `Failed to generate signature: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
