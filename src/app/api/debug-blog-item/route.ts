import { NextResponse } from 'next/server';
import { blogService } from '@/services/blogService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) return NextResponse.json({ error: 'Slug required' });

    try {
        const post = await blogService.getPostBySlug(slug);

        // Also fetch directly from model just to be sure service isn't masking
        const { BlogPost } = await import('@/models');
        const dbRaw = await BlogPost.findOne({ slug }).lean();

        return NextResponse.json({
            serviceResult: post,
            dbRawResult: dbRaw,
            match: JSON.stringify(post) === JSON.stringify(dbRaw)
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) });
    }
}
