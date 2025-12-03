import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { validateRequest } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
    const user = await validateRequest();
    if (!user || (user.role !== 'admin' && !user.role.toLowerCase().includes('manager'))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Debug: Check env vars
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Missing Cloudinary Env Vars');
        return NextResponse.json(
            { error: 'Server Configuration Error: Missing Cloudinary Keys' },
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
