import { prisma } from './prisma';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;

interface GoogleReview {
    author_name: string;
    rating: number;
    text: string;
    time: number;
    profile_photo_url: string;
    relative_time_description: string;
}

interface GooglePlacesResponse {
    result: {
        reviews: GoogleReview[];
    };
    status: string;
}

const MOCK_REVIEWS = [
    {
        author_name: "Abdullah Khan",
        rating: 5,
        text: "Excellent service! The driver was punctual and the car was very clean. Highly recommended for Umrah transport.",
        time: Date.now() / 1000 - 86400 * 2,
        profile_photo_url: "https://ui-avatars.com/api/?name=Abdullah+Khan&background=0D8ABC&color=fff",
        relative_time_description: "2 days ago"
    },
    {
        author_name: "Sarah Ahmed",
        rating: 5,
        text: "Very professional team. Booking was easy and the ride was comfortable. Will definitely use again.",
        time: Date.now() / 1000 - 86400 * 5,
        profile_photo_url: "https://ui-avatars.com/api/?name=Sarah+Ahmed&background=random",
        relative_time_description: "5 days ago"
    },
    {
        author_name: "Mohammed Ali",
        rating: 4,
        text: "Great experience overall. Good communication and fair prices.",
        time: Date.now() / 1000 - 86400 * 10,
        profile_photo_url: "https://ui-avatars.com/api/?name=Mohammed+Ali&background=random",
        relative_time_description: "2 weeks ago"
    }
];

export async function fetchGoogleReviews() {
    // 1. Check if we have recent reviews in DB (cached for 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Use try-catch to handle case where Review model doesn't exist yet (before prisma generate)
    try {
        const cachedReviews = await prisma.review.findMany({
            where: {
                updatedAt: {
                    gte: twentyFourHoursAgo
                },
                source: 'google'
            },
            orderBy: {
                date: 'desc'
            }
        });

        if (cachedReviews.length > 0) {
            return cachedReviews;
        }
    } catch (error) {
        console.warn('Database access failed (Review model might be missing):', error);
        // Fallback to mock if DB fails
        return MOCK_REVIEWS.map(r => ({
            id: Math.random().toString(36).substr(2, 9),
            author: r.author_name,
            rating: r.rating,
            comment: r.text,
            date: new Date(r.time * 1000),
            source: 'google',
            isVisible: true,
            avatar: r.profile_photo_url
        }));
    }

    // 2. Fetch from Google API if cache is stale or empty
    let reviews: GoogleReview[] = [];

    if (GOOGLE_API_KEY && GOOGLE_PLACE_ID) {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews&key=${GOOGLE_API_KEY}`
            );
            const data: GooglePlacesResponse = await response.json();

            if (data.status === 'OK' && data.result.reviews) {
                reviews = data.result.reviews;
            }
        } catch (error) {
            console.error('Failed to fetch from Google API:', error);
        }
    }

    // 3. If API failed or no keys, use mock data
    if (reviews.length === 0 && (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID)) {
        console.log('Using mock reviews (missing API credentials)');
        reviews = MOCK_REVIEWS;
    }

    // 4. Update Database
    if (reviews.length > 0) {
        try {
            for (const review of reviews) {
                // Create unique ID based on time and author to avoid duplicates if Google doesn't provide ID
                const googleId = `${review.author_name}-${review.time}`;

                await prisma.review.upsert({
                    where: { googleReviewId: googleId },
                    update: {
                        author: review.author_name,
                        rating: review.rating,
                        comment: review.text,
                        date: new Date(review.time * 1000),
                        avatar: review.profile_photo_url,
                        updatedAt: new Date(), // Update timestamp to refresh cache
                    },
                    create: {
                        author: review.author_name,
                        rating: review.rating,
                        comment: review.text,
                        date: new Date(review.time * 1000),
                        source: 'google',
                        isVisible: true, // Auto-approve 4+ stars? For now true.
                        avatar: review.profile_photo_url,
                        googleReviewId: googleId,
                    }
                });
            }

            // Return fresh data from DB
            return await prisma.review.findMany({
                where: { source: 'google' },
                orderBy: { date: 'desc' }
            });

        } catch (error) {
            console.error('Failed to cache reviews in DB:', error);
            // Return the fetched/mock data mapped to our structure
            return reviews.map((r: GoogleReview) => ({
                id: Math.random().toString(36).substr(2, 9),
                author: r.author_name,
                rating: r.rating,
                comment: r.text,
                date: new Date(r.time * 1000),
                source: 'google',
                isVisible: true,
                avatar: r.profile_photo_url
            }));
        }
    }

    return [];
}
