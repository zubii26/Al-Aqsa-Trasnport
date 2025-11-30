const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blogPosts = [
    {
        id: "honoring-the-messenger-of-allah",
        title: "Honoring the Messenger of Allah (S.A.W.W)",
        excerpt: "Reflecting on the life, legacy, and teachings of the Prophet Muhammad (S.A.W.W) and how we can embody his wisdom in our daily lives.",
        content: `
            <h2>The Mercy to the Worlds</h2>
            <p>Prophet Muhammad (S.A.W.W) was sent as a mercy not just to Muslims, but to all of creation. His life is a testament to compassion, justice, and unwavering faith. As we walk in his footsteps during Umrah and Hajj, visiting the city of Madinah, we are reminded of his profound impact on humanity.</p>

            <h3>A Model of Character</h3>
            <p>The Prophet's character was the Quran walking. He treated everyone with dignity, from the noblest leaders to the poorest orphans. His patience in the face of adversity and his forgiveness of those who wronged him serve as timeless lessons for us all.</p>

            <h3>Visiting the Rawdah</h3>
            <p>One of the most spiritual moments for any pilgrim is standing before the Rawdah in Masjid an-Nabawi. It is here that we convey our Salams to the Best of Creation. Remember to approach with humility, lower your voice, and fill your heart with love and reverence.</p>

            <blockquote>
                "Indeed, Allah confers blessing upon the Prophet, and His angels [ask Him to do so]. O you who have believed, ask [ Allah to confer] blessing upon him and ask [ Allah to grant him] peace." – Qur'an (33:56)
            </blockquote>

            <h3>Carrying His Legacy</h3>
            <p>Honoring the Prophet (S.A.W.W) goes beyond words; it requires action. It means reviving his Sunnah, spreading peace, and serving our communities with the same love and dedication he showed to his Ummah.</p>
        `,
        category: "Spiritual",
        readTime: "8 min read",
        image: "/images/blog/masjid-nabawi-view.jpg",
        alt: "Masjid an-Nabawi in Madinah - The Prophet's Mosque",
        author: "Sheikh Abdullah",
        tags: ["Prophet Muhammad", "Seerah", "Madinah", "Spirituality"]
    },
    {
        id: "choose-best-umrah-transport-service-saudi-arabia",
        title: "How to Choose the Best Umrah Transport Service in Saudi Arabia",
        excerpt: "Discover the ultimate guide to selecting the best Umrah transport service in Saudi Arabia. Learn about safety, reliability, and affordable options for your spiritual journey.",
        content: `
            <h2>Planning Your Spiritual Journey</h2>
            <p>Embarking on Umrah is a sacred milestone for every Muslim. While spiritual preparation is paramount, the logistics of your journey play a crucial role in ensuring a peaceful experience. Choosing the <strong>best Umrah transport service in Saudi Arabia</strong> is one of the most important decisions you will make.</p>

            <h3>Key Factors to Consider</h3>
            
            <h4>1. Safety and Licensing</h4>
            <p>Your safety is non-negotiable. Always ensure you choose a <strong>trusted Umrah transport provider</strong> that is fully licensed by the Saudi Ministry of Transport. Licensed vehicles are regularly inspected, insured, and tracked for your peace of mind.</p>

            <h4>2. Comfort and Fleet Quality</h4>
            <p>The journey between Jeddah, Makkah, and Madinah can be long. Look for a company that offers modern, air-conditioned vehicles. Whether you need a luxury GMC Yukon for a VIP experience or a spacious bus for a group, comfort is essential for maintaining your energy for worship.</p>

            <h4>3. Reliability and Punctuality</h4>
            <p>Time is precious during Umrah. The <strong>best Umrah travel company</strong> will guarantee punctual pickups and drop-offs, ensuring you never miss a prayer or a flight.</p>

            <h3>Al Aqsa Umrah Transport: Your Trusted Partner</h3>
            <p>At Al Aqsa Umrah Transport, we are committed to serving the Guests of Allah with the highest standards of care. Our professional drivers are trained to provide not just a ride, but a hospitable experience rooted in Islamic values.</p>

            <blockquote>
                “And proclaim to the people the Hajj; they will come to you on foot and on every lean camel; they will come from every distant pass.” – Qur’an (22:27)
            </blockquote>

            <p>We understand the sanctity of your journey and strive to make it as smooth as possible.</p>

            <p><strong>Ready to book?</strong> <a href="/booking">Book your Umrah transport today</a> with Al Aqsa Umrah Transport and travel with confidence.</p>
        `,
        category: "Guide",
        readTime: "6 min read",
        image: "/images/blog/highway-journey.png",
        alt: "Best Umrah transport service in Saudi Arabia - Luxury bus and taxi fleet",
        author: "Ahmed Al-Sayed",
        tags: ["Umrah Transport", "Saudi Arabia", "Travel Guide", "Safety"]
    },
    {
        id: "top-5-travel-tips-pilgrims-makkah-madinah",
        title: "Top 5 Travel Tips for Pilgrims Using Umrah Transport in Makkah and Madinah",
        excerpt: "Essential advice for a hassle-free journey. Discover tips on booking, family travel, and safety for pilgrims visiting the Holy Cities.",
        content: `
            <h2>Making the Most of Your Journey</h2>
            <p>Traveling between the Holy Cities requires planning and patience. Here are our top 5 tips for <strong>pilgrim transport in Makkah and Madinah</strong> to ensure a smooth experience.</p>

            <h3>1. Book Your Transport in Advance</h3>
            <p>Last-minute arrangements can be stressful and expensive. Secure your ride early, especially during Ramadan and Hajj seasons, to guarantee availability and better rates.</p>

            <h3>2. Choose Group Packages for Value</h3>
            <p>If you are traveling with a large family or group, look for <strong>affordable Umrah transport packages</strong>. Renting a dedicated bus (like a Toyota Coaster) is often more economical and convenient than taking multiple taxis.</p>

            <h3>3. Prioritize Comfort for Families</h3>
            <p>Traveling with children or elders? Opt for <strong>family Umrah travel services</strong> that offer spacious vehicles like the Hyundai Staria or Toyota Hiace. Ample legroom and luggage space make a huge difference.</p>

            <h3>4. Verify Your Driver and Vehicle</h3>
            <p>Always confirm that your driver knows the routes to your hotel and the Haram. At Al Aqsa Umrah Transport, our drivers are experienced locals who know the best routes to avoid traffic.</p>

            <h3>5. Stay Connected</h3>
            <p>Ensure you have a working phone and internet connection to communicate with your driver. We provide 24/7 support to assist you at any time.</p>

            <p>Experience the difference with our modern fleet. <a href="/fleet">Explore our vehicles</a> and choose the one that fits your needs.</p>
        `,
        category: "Travel Tips",
        readTime: "5 min read",
        image: "/images/blog/mobile-booking.jpg",
        alt: "Travel tips for pilgrims in Makkah and Madinah - Family Umrah transport",
        author: "Sarah Khan",
        tags: ["Travel Tips", "Makkah", "Madinah", "Family Travel"]
    }
];

async function main() {
    console.log('Seeding blog posts...');
    for (const post of blogPosts) {
        await prisma.blogPost.upsert({
            where: { id: post.id },
            update: {},
            create: post,
        });
    }
    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
