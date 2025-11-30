'use client';

import { useState, useEffect } from 'react';
import { Star, Search, Filter, CheckCircle, XCircle, MessageSquare, MoreHorizontal, Calendar, User, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import styles from '../admin.module.css';
import { Toast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    isVisible: boolean;
    status: 'pending' | 'approved' | 'rejected';
    reply?: string;
    source: string;
    avatar?: string;
}

export default function ReviewsAdminPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Filters
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterRating, setFilterRating] = useState<number | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        fetchReviews();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reviews');
            const data = await res.json();
            // Normalize data if status is missing (migration fallback)
            const normalizedData = data.map((r: any) => ({
                ...r,
                status: r.status || (r.isVisible ? 'approved' : 'pending')
            }));
            setReviews(normalizedData);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            showToast('Failed to load reviews', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (res.ok) {
                setReviews(reviews.map(r =>
                    r.id === id ? { ...r, status: newStatus as any, isVisible: newStatus === 'approved' } : r
                ));
                showToast(`Review marked as ${newStatus}`, 'success');
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Failed to update review:', error);
            showToast('Failed to update status', 'error');
        }
    };

    // Filter Logic
    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
        const matchesRating = filterRating === 'all' || review.rating === filterRating;

        return matchesSearch && matchesStatus && matchesRating;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const paginatedReviews = filteredReviews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Stats
    const averageRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
    const pendingCount = reviews.filter(r => r.status === 'pending').length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Reviews Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and moderate customer feedback</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Average Rating</div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            {averageRating}
                            <Star className="fill-amber-400 text-amber-400" size={20} />
                        </div>
                    </div>
                    <div className="h-12 w-px bg-slate-200 dark:bg-slate-700 mx-4" />
                    <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Pending</div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{pendingCount}</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-4 z-10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-amber-500" />
                </div>
            ) : filteredReviews.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    No reviews found matching your criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {paginatedReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} onUpdateStatus={updateStatus} />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2 text-slate-600 dark:text-slate-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

function ReviewCard({ review, onUpdateStatus }: { review: Review; onUpdateStatus: (id: string, status: string) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLong = review.comment && review.comment.length > 150;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
                relative overflow-hidden rounded-2xl p-6 flex flex-col h-full transition-all duration-300
                bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60
                hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 hover:-translate-y-1
                ${review.status === 'pending' ? 'ring-2 ring-amber-500/30 dark:ring-amber-500/20' : ''}
            `}
        >
            {/* Gradient Overlay for subtle depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm
                            ${review.avatar ? 'bg-transparent' : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300'}
                        `}>
                            {review.avatar ? (
                                <img src={review.avatar} alt={review.author} className="w-full h-full rounded-full object-cover ring-2 ring-white dark:ring-slate-700" />
                            ) : (
                                review.author.charAt(0)
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1 text-base tracking-tight">
                                {review.author}
                            </h3>
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <Calendar size={12} className="opacity-70" />
                                {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    <div className={`
                        px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border
                        ${review.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20'
                            : review.status === 'rejected'
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20'
                        }
                    `}>
                        {review.status}
                    </div>
                </div>

                <div className="flex mb-4 bg-slate-50 dark:bg-slate-800/50 w-fit px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={`mr-0.5 ${i < review.rating ? "fill-amber-400 text-amber-400 drop-shadow-sm" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`}
                        />
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-600 dark:text-slate-300">{review.rating}.0</span>
                </div>

                <div className="flex-1 mb-6">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
                        {isExpanded || !isLong ? review.comment : `${review.comment.substring(0, 150)}...`}
                    </p>
                    {isLong && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-amber-600 dark:text-amber-400 text-xs font-semibold mt-2 hover:underline flex items-center gap-1"
                        >
                            {isExpanded ? 'Show Less' : 'Read More'}
                        </button>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex gap-3 justify-end">
                    {review.status !== 'approved' && (
                        <button
                            onClick={() => onUpdateStatus(review.id, 'approved')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 text-xs font-bold"
                        >
                            <CheckCircle size={14} strokeWidth={3} />
                            APPROVE
                        </button>
                    )}
                    {review.status !== 'rejected' && (
                        <button
                            onClick={() => onUpdateStatus(review.id, 'rejected')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5 text-xs font-bold"
                        >
                            <XCircle size={14} strokeWidth={2.5} />
                            REJECT
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
