import dbConnect from '@/lib/mongodb';
import { BlogPost, type IBlogPost } from '@/models';

export const blogService = {
    async getPosts() {
        await dbConnect();
        const posts = await BlogPost.find({}).sort({ date: -1 }).lean();
        return posts.map(post => ({
            ...post,
            id: post.slug, // Use slug as ID for frontend compatibility if needed, or post._id.toString()
            // The frontend seems to expect 'id' which might be slug or DB ID. 
            // The previous implementation used doc.id which was the slug.
            // So we should map slug to id.
            date: post.date,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));
    },

    async getPostBySlug(slug: string) {
        await dbConnect();
        const post = await BlogPost.findOne({ slug }).lean();
        if (!post) return null;
        return {
            ...post,
            id: post.slug,
            date: post.date,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
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
        const updatedPost = await BlogPost.findOneAndUpdate(
            { slug },
            data,
            { new: true }
        ).lean();
        if (!updatedPost) return null;

        if (user) {
            const { auditLogService } = await import('./auditLogService');
            await auditLogService.log({
                action: 'UPDATE',
                entity: 'BlogPost',
                entityId: slug,
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
