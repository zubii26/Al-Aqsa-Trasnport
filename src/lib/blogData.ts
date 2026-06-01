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
        id: "makkah-to-madinah-transport-guide-arabic",
        title: "دليل النقل من مكة إلى المدينة المنورة: أفضل الخيارات للمعتمرين",
        excerpt: "تعرف على أفضل وسائل المواصلات من مكة للمدينة. مقارنة شاملة بين قطار الحرمين، التاكسي الخاص، والباصات VIP. الأسعار والمميزات لرحلة عمرة مريحة.",
        content: `
            <h2>خيارات التنقل بين المدن المقدسة</h2>
            <p>يعتبر الطريق بين مكة المكرمة والمدينة المنورة (طريق الهجرة) من أهم المسارات لضيوف الرحمن. ومع تنوع الخيارات، يقع الكثير من المعتمرين في حيرة: <strong>ما هي أفضل وسيلة تنقل تناسب احتياجاتي وميزانيتي؟</strong></p>

            <h3>1. التاكسي الخاص (الخيار الأفضل للعائلات)</h3>
            <p>يعتبر <strong>حجز تاكسي من مكة للمدينة</strong> الخيار الأكثر راحة وخصوصية، خاصة للعائلات وكبار السن.</p>
            <ul>
                <li><strong>المميزات:</strong> خدمة من الباب للباب (من فندقك بمكة إلى فندقك بالمدينة)، حرية التوقف في الميقات (ميقات السيل الكبير أو غيره)، ومساحة واسعة للحقائب.</li>
                <li><strong>السيارات المتوفرة:</strong> جمس يوكن (GMC Yukon) للفخامة، هيونداي ستاريا (Hyundai Staria) للعائلات الكبيرة، وتويوتا كامري للاقتصاد.</li>
            </ul>

            <h3>2. قطار الحرمين السريع</h3>
            <p>خيار ممتاز للسرعة، حيث يقطع المسافة في حوالي ساعتين ونصف.</p>
            <ul>
                <li><strong>التحديات:</strong> يتطلب الحجز المسبق بوقت طويل، والالتزام بمواعيد صارمة. كما ستحتاج إلى مواصلات إضافية للوصول من وإلى المحطات، مما قد يكون متعباً مع الحقائب.</li>
            </ul>

            <h3>3. باصات النقل الجماعي VIP</h3>
            <p>خيار اقتصادي للمجموعات الكبيرة، لكنه يستغرق وقتاً أطول (حوالي 5-6 ساعات) ولا يوفر الخصوصية التي يوفرها التاكسي الخاص.</p>

            <h3>لماذا يختار المعتمرون "الأقصى للنقل"؟</h3>
            <p>نحن نوفر خدمة <strong>توصيل من مكة للمدينة</strong> بأحدث السيارات موديل 2024/2025 وسائقين محترفين يعرفون الطريق جيداً. نضمن لك:</p>
            <ul>
                <li>سعر ثابت وشامل (بدون رسوم خفية).</li>
                <li>تأكيد فوري للحجز.</li>
                <li>خدمة عملاء 24 ساعة.</li>
            </ul>

            <blockquote>
                "رحلة مريحة وآمنة هي بداية مقبولة لعمرتك. اختر وسيلة النقل التي تضمن لك الخشوع والراحة."
            </blockquote>

            <p><strong>هل تخطط للسفر قريباً؟</strong> <a href="/booking">احجز رحلتك الآن</a> واستمتع بخصومات الحجز المبكر.</p>
        `,
        category: "دليل المعتمر",
        date: "Jan 01, 2025",
        readTime: "5 دقائق للقراءة",
        image: "/images/routes/makkah-madinah-route-hero.webp",
        alt: "Makkah to Madinah Transport - GMC Yukon on Highway",
        author: "فريق الأقصى",
        tags: ["نقل معتمرين", "مكة المدينة", "حجز تاكسي", "نصائح العمرة"]
    },
    {
        id: "private-taxi-vs-haramain-train-umrah",
        title: "Private Taxi vs. Haramain Train: Which is Better for Umrah?",
        excerpt: "Compare the speed of the train with the convenience of a private taxi. Find out which option offers the best peace of mind for your Umrah journey with family and luggage.",
        content: `
            <h2>The Great Debate: Comfort vs. Speed</h2>
            <p>When planning your Umrah trip, one of the biggest questions is: <strong>Should I take the Haramain High-Speed Train or book a private taxi?</strong> Both are excellent options, but the right choice depends on your specific needs, especially if you are traveling with family or heavy luggage.</p>

            <h3>The Haramain Train: Fast but Rigid</h3>
            <p>The <strong>Haramain High-Speed Train</strong> is a marvel of modern engineering. It connects Jeddah Airport, Makkah, and Madinah at speeds of up to 300 km/h.</p>
            <ul>
                <li><strong>Pros:</strong> It is incredibly fast and comfortable.</li>
                <li><strong>Cons:</strong> The stations are often located far from the main hotels. You will still need to find a taxi from the station to your hotel. Also, there are strict luggage limits and fixed schedules that might not match your flight arrival.</li>
            </ul>

            <h3>Private Taxi: Door-to-Door Peace of Mind</h3>
            <p>For most pilgrims, a <strong>private taxi</strong> (like our GMC Yukon or Hyundai Staria) offers unmatched convenience.</p>
            
            <h4>1. Door-to-Door Service</h4>
            <p>Unlike the train, a private car picks you up right outside the airport terminal and drops you off at your hotel lobby. No walking with bags, no waiting for connections.</p>

            <h4>2. 24/7 Availability</h4>
            <p>Flights land at all times. While trains stop running at night, our <strong>24/7 Umrah taxi service</strong> is always ready. We track your flight and wait for you, even if you are delayed.</p>

            <h4>3. Unlimited Luggage & Privacy</h4>
            <p>Traveling with family? You need space. Our vehicles accommodate all your suitcases with ease, and you enjoy the privacy of your own vehicle without sharing with strangers.</p>

            <h3>Conclusion: Choose What Fits You</h3>
            <p>If you are a solo traveler with a backpack, the train is great. But for families, elderly pilgrims, or anyone who values stress-free, direct transport, a <strong>private taxi from Jeddah to Makkah</strong> is the clear winner.</p>

            <p>Experience the difference yourself. <a href="/booking">Book your private ride now</a> and start your Umrah with ease.</p>
        `,
        category: "Travel Guide",
        date: "Dec 30, 2024",
        readTime: "6 min read",
        image: "/images/fleet/gmc-yukon-hero-professional.webp",
        alt: "Private GMC Yukon Taxi vs Haramain Train for Umrah Transport",
        author: "Al Aqsa Team",
        tags: ["Haramain Train", "Private Taxi", "Makkah Transport", "Family Travel"]
    },
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
        image: "/images/blog/masjid-nabawi-view-new.webp",
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
        image: "/images/blog/highway-journey-new.webp",
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
        image: "/images/blog/mobile-booking-new.webp",
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
        image: "/images/blog/faq-new.webp",
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
        image: "/images/blog/luxury-interior-new.webp",
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
        image: "/images/blog/makkah-haram-view-new.webp",
        alt: "Affordable Umrah transport packages - Group travel bus",
        author: "Fatima Hassan",
        tags: ["Affordable", "Packages", "Deals", "Group Travel"]
    },
    {
        id: "taxi-cost-jeddah-airport-to-makkah",
        title: "How Much Does a Taxi Cost from Jeddah Airport to Makkah? [2024 Pricing Guide]",
        excerpt: "Wondering about the taxi cost from Jeddah Airport to Makkah? Get 2024 pricing, vehicle options & tips. Book your airport transfer with Al Aqsa Umrah Transport today.",
        content: `
            <h2>What Is the Average Taxi Cost from Jeddah Airport to Makkah?</h2>
            <p>Planning your Umrah journey comes with many questions — and one of the first is: how much does a taxi cost from Jeddah Airport to Makkah? Getting this right means no surprises when you land, no scrambling for cash, and no stress after a long flight.</p>

            <p>The distance from King Abdulaziz International Airport (KAIA) to Makkah is approximately 80–90 km, and the journey typically takes 60 to 90 minutes depending on traffic and the time of day.</p>

            <p>For most pilgrims, the taxi cost from Jeddah Airport to Makkah falls between SAR 150 and SAR 450 (approximately USD 40–120), depending on the type of vehicle and whether you book in advance or arrange a ride on arrival.</p>

            <p>Below is a general pricing guide for 2024:</p>

            <div class="overflow-x-auto my-6">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-100 dark:bg-slate-800">
                            <th class="p-3 border">Vehicle Type</th>
                            <th class="p-3 border">Passengers</th>
                            <th class="p-3 border">Approx. Price (SAR)</th>
                            <th class="p-3 border">Approx. Price (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="p-3 border">Economy Sedan</td>
                            <td class="p-3 border">1–3</td>
                            <td class="p-3 border">SAR 150 – 200</td>
                            <td class="p-3 border">USD 40 – 55</td>
                        </tr>
                        <tr>
                            <td class="p-3 border">Standard Sedan</td>
                            <td class="p-3 border">1–4</td>
                            <td class="p-3 border">SAR 200 – 280</td>
                            <td class="p-3 border">USD 55 – 75</td>
                        </tr>
                        <tr>
                            <td class="p-3 border">Premium MPV / Minivan</td>
                            <td class="p-3 border">1–7</td>
                            <td class="p-3 border">SAR 280 – 380</td>
                            <td class="p-3 border">USD 75 – 100</td>
                        </tr>
                        <tr>
                            <td class="p-3 border">VIP / Luxury SUV</td>
                            <td class="p-3 border">1–6</td>
                            <td class="p-3 border">SAR 380 – 450+</td>
                            <td class="p-3 border">USD 100 – 120+</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>Note: Prices may increase during peak Umrah and Hajj seasons. All fares with Al Aqsa Umrah Transport are fixed — what you see when you book is what you pay.</p>

            <h2>Factors That Affect the Taxi Price</h2>

            <p>No two journeys are exactly the same. Here are the key factors that influence how much you will pay for your KAIA to Makkah taxi.</p>

            <h3>Type of Vehicle</h3>
            <p>The vehicle you choose is the biggest factor in your final fare. A basic economy sedan suits solo travellers or couples travelling light. Families or groups with multiple suitcases will need a minivan or MPV, which naturally costs more. VIP and luxury SUVs are ideal for those who want extra comfort after a long international flight.</p>

            <h3>Time of Day</h3>
            <p>Travelling during peak hours — particularly between 6am and 10am, or evening rush periods — can add time to your journey and, with some operators, a surcharge to your fare. Late-night or early-morning transfers can also carry a premium with on-demand taxis. Pre-booked transfers with Al Aqsa Umrah Transport are priced the same regardless of the hour.</p>

            <h3>Umrah Season vs Regular Travel</h3>
            <p>During Ramadan, Dhul Hijja, and major Umrah travel periods, demand for airport transfers skyrockets. On-the-spot taxis and ride-hailing apps often apply surge pricing at these times, with fares sometimes doubling or tripling the standard rate. Booking early locks in a fair, fixed price before demand peaks.</p>

            <h3>Number of Passengers and Luggage</h3>
            <p>A larger group or extra luggage may require upgrading to a larger vehicle. If you are travelling with 5 or more people, or carrying multiple large suitcases, factor in the cost of an MPV or minivan rather than a standard sedan. Always declare your group size and luggage count when booking to avoid issues on the day.</p>

            <h3>Pre-Booked vs On-the-Spot</h3>
            <p>This is perhaps the most significant variable of all. Taxis hired at the airport kerbside or through unofficial channels often charge inflated rates, particularly when they sense you are unfamiliar with local prices. Pre-booking through a licensed operator like Al Aqsa Umrah Transport guarantees a fixed fare, a professional driver, and no unpleasant surprises.</p>

            <h2>Why Pre-Booking Your Taxi Is the Smarter Choice</h2>

            <p>For Umrah pilgrims especially, arriving at Jeddah Airport can be overwhelming. Thousands of fellow travellers, unfamiliar surroundings, and the excitement — and fatigue — of a long journey all combine at once. Pre-booking your airport transfer removes one major source of stress before you even land.</p>

            <h4>FIXED PRICE GUARANTEE</h4>
            <p>Pre-booked transfers come with a confirmed price. There is no negotiating at the kerbside, no watching the meter climb, and no worry about surge pricing during peak season. You agree the fare before you travel, and that is the price you pay.</p>

            <h4>MEET-AND-GREET AT ARRIVALS</h4>
            <p>Your driver will be waiting in the arrivals hall with a name board, ready to assist with your luggage and guide you directly to the vehicle. For pilgrims unfamiliar with KAIA, this is invaluable.</p>

            <h4>24/7 AVAILABILITY FOR LATE-NIGHT FLIGHTS</h4>
            <p>Flights arrive at all hours. Whether your plane touches down at 2am or 2pm, your pre-booked transfer will be ready and waiting. There is no risk of arriving to find no taxis available.</p>

            <h2>What's Included in Al Aqsa Umrah Transport's Price?</h2>

            <p>When you book your Umrah transport from Jeddah with Al Aqsa Umrah Transport, the price you see is a complete, all-inclusive fare. Here is what comes with every booking:</p>

            <ul>
                <li><strong>FLIGHT TRACKING:</strong> We monitor your flight in real time. If your arrival is early or delayed, your driver adjusts accordingly. You will never be charged for waiting caused by flight changes.</li>
                <li><strong>FREE WAITING TIME:</strong> A generous waiting period is included in your booking at no extra cost, giving you time to clear immigration, collect your luggage, and make your way to arrivals without rushing.</li>
                <li><strong>LUGGAGE ASSISTANCE:</strong> Your driver will help load and unload your luggage. No struggling with heavy bags after a long journey.</li>
                <li><strong>LICENSED, VETTED DRIVERS:</strong> Every driver in our fleet is fully licensed, background-checked, and experienced in the Jeddah–Makkah route. Your safety and comfort are our first priority.</li>
                <li><strong>DOOR-TO-DOOR SERVICE:</strong> We take you directly from the airport arrivals hall to the entrance of your hotel or accommodation in Makkah. No connections, no confusion, no additional transfers.</li>
            </ul>

            <p>For pilgrims also planning onward travel, we also offer <a href="/routes/makkah-to-madinah-taxi">Jeddah to Madinah transfer</a> services and a range of <a href="/services">Umrah transport packages</a> to cover your entire journey.</p>
            <p>For official guidance on travel to the Kingdom of Saudi Arabia, you can visit the Saudi Tourism Authority at: <a href="https://www.visitsaudi.com" target="_blank" rel="noopener noreferrer">https://www.visitsaudi.com</a></p>

            <h2>How to Book Your Jeddah Airport to Makkah Taxi</h2>

            <p>Securing your airport transfer with Al Aqsa Umrah Transport is straightforward. Follow these three steps:</p>

            <p><strong>STEP 1 — CHOOSE YOUR VEHICLE</strong><br/>
            Visit our website and select the vehicle type that suits your group size, luggage needs, and budget. Economy, Standard, Premium, and VIP options are all available.</p>

            <p><strong>STEP 2 — ENTER YOUR FLIGHT DETAILS</strong><br/>
            Provide your flight number, arrival date, and time. This allows us to track your flight and ensure your driver is ready when you land — inshallah, right on time.</p>

            <p><strong>STEP 3 — CONFIRM AND PAY SECURELY</strong><br/>
            Complete your booking with a secure online payment. You will receive an instant confirmation by email, along with your driver's contact details before travel.</p>

            <blockquote>
                <p>Book your transfer now at <a href="/booking">www.alaqsaumrahtransport.com</a></p>
            </blockquote>

            <h2>Frequently Asked Questions</h2>

            <h4>Q: Is the taxi from Jeddah Airport to Makkah safe?</h4>
            <p>A: Yes. When you book through a licensed operator such as Al Aqsa Umrah Transport, you travel with fully vetted, professional drivers in well-maintained, insured vehicles. We strongly recommend avoiding unofficial taxis or unverified ride-hailing services, particularly during busy Umrah seasons.</p>

            <h4>Q: How far is King Abdulaziz Airport from Makkah?</h4>
            <p>A: King Abdulaziz International Airport (KAIA) is located approximately 80 to 90 km from the centre of Makkah. Under normal traffic conditions, the drive takes between 60 and 90 minutes.</p>

            <h4>Q: What if my flight is delayed?</h4>
            <p>A: We track all flights in real time. If your arrival is delayed for any reason, your driver will wait — at no extra cost to you. Your booking is not affected by flight schedule changes.</p>

            <h2>Conclusion</h2>

            <p>Your Umrah journey begins the moment you step off the plane. Knowing the taxi cost from Jeddah Airport to Makkah in advance, and booking a trusted, licensed transfer, means you can focus entirely on your spiritual journey — not logistics.</p>

            <p>Al Aqsa Umrah Transport has been serving pilgrims with safe, reliable, and fairly priced airport transfers for years. From economy options for solo travellers to VIP vehicles for families, we have a solution for every pilgrim and every budget.</p>

            <p>Book your Jeddah Airport to Makkah transfer today and arrive at the Holy City with peace of mind.</p>
        `,
        category: "Guide",
        date: "Jun 01, 2026",
        readTime: "6 min read",
        image: "/images/blog/highway-journey-new.webp",
        alt: "Taxi transfer from Jeddah Airport to Makkah — Al Aqsa Umrah Transport vehicle at KAIA arrivals terminal",
        author: "Al Aqsa Team",
        tags: ["Jeddah Airport", "Makkah Transport", "Taxi Prices", "Umrah Guide"]
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
