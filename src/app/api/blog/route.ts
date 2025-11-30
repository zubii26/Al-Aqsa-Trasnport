import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateRequest } from '@/lib/server-auth';

export async function GET() {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const isAuth = await validateRequest();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        // Basic validation
        if (!body.title || !body.content || !body.id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const post = await prisma.blogPost.create({
            data: {
                id: body.id, // Slug
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
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Failed to create blog post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
