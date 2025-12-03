import { reviewService } from '@/services/reviewService';

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
    try {
        // const allReviews = await reviewService.getReviews('approved'); 
        // actually we don't need to fetch here if we are just checking cache logic which is commented out
        // Actually, let's fetch all google reviews and filter by date/source
        // Since getReviews filters by status, we might need a better way to get cached google reviews.
        // For now, let's just get all reviews and filter in memory as Firestore filtering is limited without composite indexes.

        // Re-fetching all reviews might be expensive if there are many. 
        // But for now, let's assume the service returns what we need or we modify it.
        // The original code filtered by updatedAt > 24h ago.

        // Let's just fetch from API and upsert, then return from DB.
        // Or check DB first.

        // Simplified logic: Always try to fetch from Google if keys exist, then upsert.
        // If keys don't exist, return mock.
        // If Google fetch fails, return DB cache.

        // Let's stick to the original logic structure but adapted.

        // We can't easily query by updatedAt > date in our simple service without an index.
        // So let's skip the "recent cache check" optimization for now or do it client side?
        // No, server side.

        // Let's just fetch from Google and update DB.
    } catch (error) {
        console.warn('Database access failed:', error);
    }

    // 2. Fetch from Google API
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

    // 3. If API failed or no keys, use mock data (if DB is empty? or always?)
    // Original logic: if reviews.length === 0 && no keys -> mock.
    if (reviews.length === 0 && (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID)) {
        console.log('Using mock reviews (missing API credentials)');
        reviews = MOCK_REVIEWS;
    }

    // 4. Update Database
    if (reviews.length > 0) {
        try {
            for (const review of reviews) {
                const googleId = `${review.author_name}-${review.time}`;

                await reviewService.upsertGoogleReview(googleId, {
                    name: review.author_name,
                    rating: review.rating,
                    comment: review.text,
                    date: new Date(review.time * 1000).toISOString(),
                    avatar: review.profile_photo_url,
                    source: 'google',
                    isVisible: true,
                    status: 'approved'
                });
            }
        } catch (error) {
            console.error('Failed to cache reviews in DB:', error);
        }
    }

    // Return all google reviews from DB (or just the ones we fetched?)
    // Original code returned all google reviews from DB.
    const dbReviews = await reviewService.getReviews();
    return dbReviews.filter(r => r.source === 'google').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
