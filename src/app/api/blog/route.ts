import { NextResponse } from 'next/server';
import { blogService } from '@/services/blogService';
import { validateRequest } from '@/lib/server-auth';

export async function GET() {
    try {
        const posts = await blogService.getPosts();
        // Sort by date desc
        posts.sort((a, b) => b.date.getTime() - a.date.getTime());
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await validateRequest();
    if (!user || (user.role !== 'admin' && !user.role.toLowerCase().includes('manager'))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        // Basic validation
        if (!body.title || !body.content || !body.id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const post = await blogService.createPost({
            slug: body.id, // Slug
            title: body.title,
            excerpt: body.excerpt,
            content: body.content,
            category: body.category,
            date: new Date(), // Set current date
            readTime: body.readTime || '5 min read',
            image: body.image,
            alt: body.alt || body.title,
            author: body.author,
            tags: body.tags || [],
            isPublished: body.isPublished !== undefined ? body.isPublished : true,
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Failed to create blog post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
