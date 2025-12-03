import dbConnect from '@/lib/mongodb';
import { Review, IReview } from '@/models';

export const reviewService = {
    async getReviews() {
        await dbConnect();
        const reviews = await Review.find({}).sort({ date: -1 }).lean();
        return reviews.map(r => ({ ...r, id: r._id.toString() }));
    },

    async createReview(data: Partial<IReview>) {
        await dbConnect();
        const newReview = await Review.create(data);
        return { ...newReview.toObject(), id: newReview._id.toString() };
    },

    async updateReview(id: string, data: Partial<IReview>) {
        await dbConnect();
        const updatedReview = await Review.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!updatedReview) return null;
        return { ...updatedReview, id: updatedReview._id.toString() };
    },

    async deleteReview(id: string) {
        await dbConnect();
        await Review.findByIdAndDelete(id);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async upsertGoogleReview(googleId: string, data: any) {
        await dbConnect();
        // googleId is composite of name-time, but we use name+date+source for uniqueness
        const filter = {
            name: data.name,
            date: data.date,
            source: 'google'
        };

        const review = await Review.findOneAndUpdate(
            filter,
            data,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();

        return { ...review, id: review._id.toString() };
    },
};
