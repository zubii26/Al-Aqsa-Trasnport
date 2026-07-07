import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing');
    process.exit(1);
}

const BlogPostSchema = new mongoose.Schema({
    slug: String,
    title: String,
    date: Date,
    createdAt: Date
}, { collection: 'blogposts' });

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

async function analyze() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to DB');

        const posts = await BlogPost.find({}).lean();
        console.log(`Found ${posts.length} posts in database`);

        const dateCounts: Record<string, number> = {};

        posts.forEach((post: any) => {
            const dateStr = (post.date || post.createdAt);
            if (dateStr) {
                const date = new Date(dateStr);
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                dateCounts[monthYear] = (dateCounts[monthYear] || 0) + 1;
            }
        });

        console.log('Publishing Timeline (DB):');
        const sortedMonths = Object.keys(dateCounts).sort();
        sortedMonths.forEach(month => {
            console.log(`${month}: ${dateCounts[month]} posts`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

analyze();
