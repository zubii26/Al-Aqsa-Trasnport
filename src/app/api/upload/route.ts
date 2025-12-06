import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { validateRequest } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
    const user = await validateRequest();
    if (!user || (user.role !== 'admin' && !user.role.toLowerCase().includes('manager'))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Debug: Check env vars
    const missingVars = [];
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) missingVars.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    if (!process.env.CLOUDINARY_API_KEY) missingVars.push('CLOUDINARY_API_KEY');
    if (!process.env.CLOUDINARY_API_SECRET) missingVars.push('CLOUDINARY_API_SECRET');

    if (missingVars.length > 0) {
        console.error('Missing Cloudinary environment variables:', missingVars);
        return NextResponse.json(
            { error: `Server configuration error: Missing environment variables: ${missingVars.join(', ')}` },
            { status: 500 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file received' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary using a stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'transport_uploads',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        reject(error);
                    }
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const secureUrl = (result as any).secure_url;

        return NextResponse.json({
            url: secureUrl,
            success: true
        });

    } catch (error) {
        console.error('Upload error details:', error);
        return NextResponse.json(
            { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
