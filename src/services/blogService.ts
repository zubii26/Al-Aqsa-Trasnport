import dbConnect from '@/lib/mongodb';
import { BlogPost, type IBlogPost } from '@/models';
import { staticBlogPosts } from '@/data/blog-posts';

export const blogService = {
    async getPosts() {
        await dbConnect();
        const dbPosts = await BlogPost.find({}).sort({ date: -1 }).lean();

        // Map DB posts to standard format
        const mappedDbPosts = dbPosts.map(post => ({
            ...post,
            id: post.slug,
            date: post.date,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));

        // Map static posts to match the interface
        const dbSlugs = new Set(mappedDbPosts.map(p => p.slug));
        const mappedStaticPosts = staticBlogPosts
            .filter(post => !dbSlugs.has(post.slug))
            .map(post => ({
                ...post,
                id: post.slug,
                // Ensure dates are Date objects if they aren't already (though they are in the file)
            }));

        // Merge and sort by date descending
        const allPosts = [...mappedDbPosts, ...mappedStaticPosts].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return allPosts;
    },

    async getPostBySlug(slug: string) {
        await dbConnect();
        const post = await BlogPost.findOne({ slug }).lean();

        if (post) {
            return {
                ...post,
                id: post.slug,
                date: post.date,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        }

        // Check static posts if not found in DB
        const staticPost = staticBlogPosts.find(p => p.slug === slug);
        if (staticPost) {
            return {
                ...staticPost,
                id: staticPost.slug,
            };
        }

        return null;
    },

    async createPost(data: Partial<IBlogPost>, user?: { name: string, id: string }) {
        await dbConnect();
        // Ensure slug is unique
        const existing = await BlogPost.findOne({ slug: data.slug });
        if (existing) {
            throw new Error('Slug already exists');
        }
        const newPost = await BlogPost.create(data);

        if (user) {
            const { auditLogService } = await import('./auditLogService');
            await auditLogService.log({
                action: 'CREATE',
                entity: 'BlogPost',
                entityId: newPost.slug,
                details: `Created blog post: ${newPost.title}`,
                user: user.name
            });
        }

        return { ...newPost.toObject(), id: newPost.slug };
    },

    async updatePost(slug: string, data: Partial<IBlogPost>, user?: { name: string, id: string }) {
        await dbConnect();

        let updatedPost = await BlogPost.findOneAndUpdate(
            { slug },
            data,
            { new: true }
        ).lean();

        // If not found in DB, check static posts and promote to DB
        if (!updatedPost) {
            const staticPost = staticBlogPosts.find(p => p.slug === slug);

            if (staticPost) {
                try {
                    // Create a new document using static data + updates
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { _id, ...staticContent } = staticPost; // Remove static ID

                    const newPostData = {
                        ...staticContent,
                        ...data,
                        // Ensure dates are valid Date objects
                        date: data.date ? new Date(data.date) : new Date(staticContent.date),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const newPost = await BlogPost.create(newPostData);
                    updatedPost = newPost.toObject();
                } catch (error) {
                    console.error('[BlogService] Failed to promote static post to database:', error);
                    // Check for duplicate key error (if slug collision happened somehow)
                    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
                        throw new Error('Slug already exists');
                    }
                    throw error;
                }
            }
        }

        if (!updatedPost) return null;

        if (user) {
            const { auditLogService } = await import('./auditLogService');
            await auditLogService.log({
                action: 'UPDATE',
                entity: 'BlogPost',
                entityId: updatedPost.slug,
                details: `Updated blog post: ${updatedPost.title}`,
                user: user.name
            });
        }

        return { ...updatedPost, id: updatedPost.slug };
    },

    async deletePost(slug: string, user?: { name: string, id: string }) {
        await dbConnect();
        await BlogPost.findOneAndDelete({ slug });

        if (user) {
            const { auditLogService } = await import('./auditLogService');
            await auditLogService.log({
                action: 'DELETE',
                entity: 'BlogPost',
                entityId: slug,
                details: `Deleted blog post: ${slug}`,
                user: user.name
            });
        }
    },
};
