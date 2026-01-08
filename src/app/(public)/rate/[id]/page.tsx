'use client';

import { useState, use } from 'react';
import { Star, CheckCircle, Car } from 'lucide-react';
import Link from 'next/link';

export default function RateBookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/${id}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review }),
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Failed to submit rating', error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Thank You!</h1>
                    <p className="text-slate-500">
                        Your feedback helps us improve our service. We hope to see you again soon.
                    </p>
                    <Link href="/" className="inline-block mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Rate Your Trip</h1>
                    <p className="text-slate-500 mt-2">
                        How was your experience with Al Aqsa Transport?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                className="p-1 focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    size={40}
                                    fill={(hoveredStar || rating) >= star ? "#D4AF37" : "none"}
                                    stroke={(hoveredStar || rating) >= star ? "#D4AF37" : "#CBD5E1"}
                                    className="transition-colors"
                                />
                            </button>
                        ))}
                    </div>

                    <div className="text-center text-sm font-medium text-amber-600 min-h-[20px]">
                        {rating === 5 ? "Excellent!" :
                            rating === 4 ? "Very Good" :
                                rating === 3 ? "Good" :
                                    rating === 2 ? "Fair" :
                                        rating === 1 ? "Poor" : ""}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Write a Review (Optional)
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none min-h-[100px] resize-none"
                            placeholder="Tell us about your driver, vehicle, or overall experience..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={rating === 0 || loading}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </form>
            </div>
        </div>
    );
}
