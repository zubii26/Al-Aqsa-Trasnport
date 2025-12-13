import { NextResponse } from 'next/server';
import { blogService } from '@/services/blogService';
import { staticBlogPosts } from '@/data/blog-posts';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const posts = await blogService.getPosts();

        // internal check (simulating the service logic to see what's happening)
        const dbPostsraw = await (blogService as any).getPosts(); // logic is inside getPosts, so this just gets the result

        // We need to peek inside getPosts logic, but since we can't easily, 
        // let's verify assumptions by querying DB directly via blogService methods if possible
        // or just analyzing the final output for duplicates.

        const slugs = posts.map(p => p.slug);
        const titles = posts.map(p => p.title);

        const duplicateTitles = titles.filter((item, index) => titles.indexOf(item) !== index);
        const titleMap: Record<string, string[]> = {};
        posts.forEach(p => {
            if (!titleMap[p.title]) titleMap[p.title] = [];
            titleMap[p.title].push(p.slug);
        });

        const contentDuplicates = Object.keys(titleMap)
            .filter(title => titleMap[title].length > 1)
            .map(title => ({ title, slugs: titleMap[title] }));

        return NextResponse.json({
            total: posts.length,
            duplicateTitles: duplicateTitles,
            contentDuplicates: contentDuplicates, // This is what we are looking for
            allSlugs: slugs,
            titles: titles
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) });
    }
}
