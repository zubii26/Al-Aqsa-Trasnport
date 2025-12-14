import { NextResponse } from 'next/server';
import { blogService } from '@/services/blogService';
import { validateRequest } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const post = await blogService.getPostBySlug(id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const isAuth = await validateRequest();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Pass body.id (new slug) if it exists, otherwise use existing id
        // The service needs to know if we are changing the slug or just updating content
        const updateData = {
            title: body.title,
            excerpt: body.excerpt,
            content: body.content,
            category: body.category,
            readTime: body.readTime,
            image: body.image,
            alt: body.alt,
            author: body.author,
            tags: body.tags,
            isPublished: body.isPublished,
            // Only include slug in update data if it's different/provided
            ...(body.id && body.id !== id ? { slug: body.id } : {})
        };

        const post = await blogService.updatePost(id, updateData);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/blog');
        revalidatePath(`/blog/${post.id}`); // Use new ID in case slug changed
        revalidatePath('/admin/blog');

        return NextResponse.json(post);
    } catch (error) {
        console.error('Update blog error:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const isAuth = await validateRequest();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await blogService.deletePost(id);

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/blog');
        revalidatePath('/admin/blog');

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
