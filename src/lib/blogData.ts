export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    alt: string;
    author: string;
    tags: string[];
}

export interface Hadith {
    text: string;
    source: string;
    narrator?: string;
}

export const hadithCollection: Hadith[] = [
    {
        text: "The best among you are those who have the best manners and character.",
        source: "Sahih Bukhari",
        narrator: "Narrated by Abdullah bin Amr"
    },
    {
        text: "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself.",
        source: "Sahih Bukhari",
        narrator: "Narrated by Anas"
    },
    {
        text: "He who does not show mercy to our young ones or recognize the rights of our elders is not one of us.",
        source: "Sunan Abu Dawood",
        narrator: "Narrated by Abdullah ibn Amr"
    },
    {
        text: "A good word is a form of charity.",
        source: "Sahih Bukhari",
        narrator: "Narrated by Abu Huraira"
    },
    {
        text: "Cleanliness is half of faith.",
        source: "Sahih Muslim",
        narrator: "Narrated by Abu Malik Al-Ashari"
    }
];

export const blogPosts: BlogPost[] = [
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
        date: "Nov 29, 2024",
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
        date: "Nov 28, 2024",
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
        date: "Nov 27, 2024",
        readTime: "5 min read",
        image: "/images/blog/mobile-booking.jpg",
        alt: "Travel tips for pilgrims in Makkah and Madinah - Family Umrah transport",
        author: "Sarah Khan",
        tags: ["Travel Tips", "Makkah", "Madinah", "Family Travel"]
    },
    {
        id: "faq-umrah-transport-services-saudi-arabia",
        title: "Frequently Asked Questions About Umrah Transport Services in Saudi Arabia",
        excerpt: "Answers to your most common questions: booking, costs, safety, and more. Get the information you need for a worry-free trip.",
        content: `
            <h2>Everything You Need to Know</h2>
            <p>We receive many questions from pilgrims planning their trip. Here are answers to the most common queries about <strong>Umrah transport services in Saudi Arabia</strong>.</p>

            <h3>How can I book Umrah transport online?</h3>
            <p>Booking is simple and secure. You can <strong>book Umrah transport online in Saudi Arabia</strong> directly through our website. Just select your pickup location, destination, and vehicle type to get an instant quote.</p>

            <h3>What is the cost of transport from Jeddah Airport to Makkah?</h3>
            <p>Prices vary based on the vehicle. We offer competitive rates for <strong>Jeddah airport to Makkah transport</strong>. Whether you need a budget-friendly sedan or a luxury SUV, we provide transparent pricing with no hidden fees.</p>

            <h3>Is 24/7 booking available?</h3>
            <p>Yes! We understand that flights arrive at all hours. Our <strong>24/7 Umrah transport booking</strong> service ensures that a driver is ready to welcome you whenever you land.</p>

            <h3>Are your vehicles safe?</h3>
            <p>Absolutely. All our vehicles are modern, air-conditioned, and regularly maintained. Our drivers are licensed professionals committed to your safety.</p>

            <p>Have more questions? Visit our <a href="/contact">Contact Us</a> page or reach out to our support team.</p>
        `,
        category: "FAQ",
        date: "Nov 26, 2024",
        readTime: "4 min read",
        image: "/images/blog/faq.png",
        alt: "FAQ about Umrah transport services - Booking and costs",
        author: "Support Team",
        tags: ["FAQ", "Booking", "Jeddah Airport", "Online Booking"]
    },
    {
        id: "why-comfort-safety-matter-umrah-transport",
        title: "Why Comfort and Safety Matter in Umrah Transport",
        excerpt: "Umrah is physically demanding. Learn why choosing a comfortable and safe transport service is essential for your spiritual well-being.",
        content: `
            <h2>The Importance of a Stress-Free Journey</h2>
            <p>Umrah involves physical exertion, from Tawaf to Sa'i. The last thing you need is a stressful or uncomfortable journey between cities. Choosing <strong>safe and reliable Umrah transport</strong> is vital for preserving your energy for worship.</p>

            <h3>Luxury and Comfort</h3>
            <p>Our fleet includes <strong>luxury Umrah buses in Saudi Arabia</strong> and premium SUVs like the GMC Yukon. These vehicles feature plush seating, powerful air conditioning, and smooth suspension to ensure you arrive at your destination refreshed.</p>

            <h3>Professionalism You Can Trust</h3>
            <p>Safety goes beyond just the vehicle. It’s about the person behind the wheel. Our drivers are not just skilled; they are respectful and dedicated to hospitality. We provide <strong>comfortable buses for Umrah pilgrims</strong> driven by professionals who prioritize your well-being.</p>

            <h3>Voices of the Faithful</h3>
            <blockquote>
                "The journey was smooth and the car was incredibly comfortable. It made our trip so much easier." – Abdullah, UK
            </blockquote>

            <p>Don't compromise on your comfort. <a href="/booking">Book a premium ride</a> with Al Aqsa Umrah Transport today.</p>
        `,
        category: "Experience",
        date: "Nov 25, 2024",
        readTime: "5 min read",
        image: "/images/blog/luxury-interior.jpg",
        alt: "Comfortable and safe Umrah transport - Luxury GMC Yukon interior",
        author: "Mohammed Ali",
        tags: ["Comfort", "Safety", "Luxury Transport", "Testimonials"]
    },
    {
        id: "affordable-umrah-transport-packages",
        title: "Affordable Umrah Transport Packages – Travel with Peace of Mind",
        excerpt: "Quality service doesn't have to break the bank. Explore our affordable packages designed to give you the best value for your money.",
        content: `
            <h2>Value Without Compromise</h2>
            <p>We believe that every pilgrim deserves high-quality service, regardless of their budget. That’s why we offer <strong>affordable Umrah transport packages</strong> that combine reliability with competitive pricing.</p>

            <h3>Best Deals for Pilgrims</h3>
            <p>Looking for the <strong>best Umrah transport deals for pilgrims</strong>? We offer customized packages that cover your entire journey: pickup from Jeddah Airport, Ziyarat in Makkah and Madinah, and drop-off for your departure.</p>

            <h3>Group Packages</h3>
            <p>Traveling in a group is one of the best ways to save. Our <strong>group Umrah transport packages</strong> allow you to share the cost of a spacious bus while enjoying the camaraderie of your fellow travelers.</p>

            <h3>Peace of Mind</h3>
            <p>With fixed prices and no hidden charges, you can travel with peace of mind knowing exactly what you are paying for. Focus on your prayers, and let us handle the logistics.</p>

            <p>Start your journey on the right foot. <a href="/booking">Check our rates</a> and secure your affordable package now.</p>
        `,
        category: "Value",
        date: "Nov 24, 2024",
        readTime: "4 min read",
        image: "/images/blog/makkah-haram-view.jpg",
        alt: "Affordable Umrah transport packages - Group travel bus",
        author: "Fatima Hassan",
        tags: ["Affordable", "Packages", "Deals", "Group Travel"]
    }
];

export const respectSectionData = {
    title: "Respect for Prophet Muhammad (S.A.W.W)",
    verse: {
        text: "Indeed, in the Messenger of Allah (S.A.W.W) you have an excellent example for whoever has hope in Allah and the Last Day and remembers Allah often.",
        reference: "Qur’an 33:21"
    },
    intro: "At **Al Aqsa Umrah Transport**, we believe that every journey of a pilgrim is sacred. In serving the guests of Allah, we draw inspiration from the noble character of Prophet Muhammad (S.A.W.W). His life was a beacon of mercy, humility, and respect — guiding us to treat every traveler with dignity, compassion, and care.",
    commitments: [
        {
            text: "Welcoming pilgrims with kindness and sincerity",
            icon: "Heart"
        },
        {
            text: "Ensuring comfort and safety as a reflection of his mercy",
            icon: "Shield"
        },
        {
            text: "Upholding honesty and trust in every service we provide",
            icon: "Handshake"
        }
    ],
    closing: "Through this, we strive to honor his legacy and remind ourselves that true respect is not only in words, but in living by his example."
};
