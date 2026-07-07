import { staticBlogPosts } from './src/data/blog-posts';

console.log(`Total static posts: ${staticBlogPosts.length}`);

const dateCounts: Record<string, number> = {};

staticBlogPosts.forEach((post) => {
    const dateStr = post.date;
    if (dateStr) {
        const date = new Date(dateStr);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        dateCounts[monthYear] = (dateCounts[monthYear] || 0) + 1;
    }
});

console.log('Publishing Timeline (Static):');
const sortedMonths = Object.keys(dateCounts).sort();
sortedMonths.forEach(month => {
    console.log(`${month}: ${dateCounts[month]} posts`);
});
