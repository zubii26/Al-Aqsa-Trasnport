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
        const url = new URL(request.url);
        const type = url.searchParams.get('type');
        const contentType = request.headers.get('content-type') || '';

        // Mode 1: Generate Signature (for Client-Side Upload)
        // Trigger if explicit param exists OR if content-type is not multipart (legacy/cached client support)
        if (type === 'signature' || !contentType.includes('multipart/form-data')) {
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
        }

        // Mode 2: Server-Side Upload (Fallback)
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) return NextResponse.json({ error: 'No file received' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'transport_uploads', resource_type: 'auto' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const secureUrl = (result as any).secure_url;

        return NextResponse.json({ url: secureUrl, success: true });

    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
