import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Section } from '@/models';
import { validateRequest } from '@/lib/server-auth';

import { mkdir } from 'fs/promises';

import path from 'path';
import sharp from 'sharp';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await validateRequest();
        if (!user || !['admin', 'manager', 'operational_manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;
        const content = formData.get('content') as string;
        const metaTitle = formData.get('metaTitle') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const customFieldsStr = formData.get('customFields') as string;

        const desktopImageFile = formData.get('desktopImage') as File | null;
        const mobileImageFile = formData.get('mobileImage') as File | null;
        const imageFile = formData.get('image') as File | null; // Fallback for old UI

        await dbConnect();
        const section = await Section.findById(id);

        if (!section) {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }

        let customFields = [];
        if (customFieldsStr) {
            try {
                customFields = JSON.parse(customFieldsStr);
            } catch (e) {
                console.error('Error parsing custom fields', e);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: any = {
            title,
            subtitle,
            content,
            metaTitle,
            metaDescription,
            lastUpdatedBy: user.id,
            updatedAt: new Date()
        };

        if (customFields.length > 0) {
            updates.customFields = customFields;
        }

        const processImage = async (file: File, type: 'desktop' | 'mobile') => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${section.name}-${type}-${Date.now()}.webp`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'sections');

            await mkdir(uploadDir, { recursive: true });

            const sharpInstance = sharp(buffer);
            if (type === 'desktop') {
                sharpInstance.resize(1920, null, { withoutEnlargement: true });
            } else {
                sharpInstance.resize(1080, null, { withoutEnlargement: true });
            }

            await sharpInstance
                .webp({ quality: 80 })
                .toFile(path.join(uploadDir, filename));

            return {
                url: `/uploads/sections/${filename}`,
                alt: title,
                type
            };
        };

        let newImages = [...section.images];

        if (desktopImageFile || imageFile) {
            const file = desktopImageFile || imageFile;
            if (file) {
                const imgData = await processImage(file, 'desktop');
                // Remove existing desktop image
                newImages = newImages.filter(img => img.type !== 'desktop');
                newImages.push(imgData);
            }
        }

        if (mobileImageFile) {
            const imgData = await processImage(mobileImageFile, 'mobile');
            // Remove existing mobile image
            newImages = newImages.filter(img => img.type !== 'mobile');
            newImages.push(imgData);
        }

        if (desktopImageFile || imageFile || mobileImageFile) {
            updates.images = newImages;
        }

        const updatedSection = await Section.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        return NextResponse.json(updatedSection);
    } catch (error) {
        console.error('Error updating section:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const section = await Section.findById(id);
        if (!section) {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }
        return NextResponse.json(section);
    } catch (error) {
        console.error('Error fetching section:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
