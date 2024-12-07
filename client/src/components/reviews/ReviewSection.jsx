import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    StarBorder,
    StarHalf,
    Sort as SortIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import reviewService from '../../services/reviewService';

const sortOptions = [
    { label: 'Most Recent', value: '-createdAt' },
    { label: 'Highest Rating', value: '-rating' },
    { label: 'Lowest Rating', value: 'rating' }
];

const ReviewSection = ({ vehicleId }) => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratings, setRatings] = useState({ average: 0, count: 0 });
    const [sortBy, setSortBy] = useState('-createdAt');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({
        rating: 0,
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);

    // Helper function to safely get user initial
    const getUserInitial = (review) => {
        try {
            if (!review?.userId) return 'U';
            const name = review.userId.name;
            if (typeof name !== 'string' || !name) return 'U';
            return name.charAt(0).toUpperCase();
        } catch (error) {
            return 'U';
        }
    };

    // Helper function to safely get user name
    const getUserName = (review) => {
        try {
            if (!review?.userId?.name?.first || !review?.userId?.name?.last) return 'Anonymous User';
            return `${review.userId.name.first} ${review.userId.name.last}`;
        } catch (error) {
            return 'Anonymous User';
        }
    };

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await reviewService.getVehicleReviews(vehicleId, currentPage, sortBy);

                if (response.success) {
                    setReviews(response.reviews);
                    setRatings(response.ratings);
                    setTotalPages(response.pagination.pages);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [vehicleId, currentPage, sortBy]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please log in to submit a review');
            return;
        }

        try {
            setSubmitting(true);
            const response = editingReviewId
                ? await reviewService.updateReview(editingReviewId, reviewFormData)
                : await reviewService.createReview(vehicleId, reviewFormData);

            if (response.success) {
                setReviews(prev => {
                    if (editingReviewId) {
                        return prev.map(review => 
                            review._id === editingReviewId ? response.review : review
                        );
                    }
                    return [response.review, ...prev];
                });
                setShowReviewForm(false);
                setReviewFormData({ rating: 0, comment: '' });
                setEditingReviewId(null);
                toast.success(editingReviewId ? 'Review updated successfully' : 'Review submitted successfully');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message || 'Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const response = await reviewService.deleteReview(reviewId);
            if (response.success) {
                setReviews(prev => prev.filter(review => review._id !== reviewId));
                toast.success('Review deleted successfully');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message || 'Error deleting review');
        }
    };

    const handleEditReview = (review) => {
        setReviewFormData({
            rating: review.rating,
            comment: review.comment
        });
        setEditingReviewId(review._id);
        setShowReviewForm(true);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Star key={i} className="text-yellow-500" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<StarHalf key={i} className="text-yellow-500" />);
            } else {
                stars.push(<StarBorder key={i} className="text-yellow-500" />);
            }
        }

        return stars;
    };

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Customer Reviews</h2>
            
            {/* Rating Summary */}
            <div className="bg-background-light rounded-lg p-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        {renderStars(ratings.average)}
                        <span className="ml-2 text-2xl font-bold text-text-primary">
                            {ratings.average.toFixed(1)}
                        </span>
                    </div>
                    <div className="text-text-primary/70">
                        Based on {ratings.count} {ratings.count === 1 ? 'review' : 'reviews'}
                    </div>
                </div>
            </div>

            {/* Review Form */}
            {isAuthenticated && (
                <div className="mb-8">
                    <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                    </button>

                    <AnimatePresence>
                        {showReviewForm && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleSubmitReview}
                                className="mt-4 bg-background-light rounded-lg p-6"
                            >
                                <div className="mb-4">
                                    <label className="block text-text-primary mb-2">Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewFormData(prev => ({ ...prev, rating: star }))}
                                                className="text-2xl focus:outline-none"
                                            >
                                                {star <= reviewFormData.rating ? (
                                                    <Star className="text-yellow-500" />
                                                ) : (
                                                    <StarBorder className="text-yellow-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-text-primary mb-2">Review</label>
                                    <textarea
                                        value={reviewFormData.comment}
                                        onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                                        maxLength={500}
                                        rows={4}
                                        className="w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary-light"
                                        placeholder="Share your experience with this vehicle..."
                                    />
                                    <div className="text-sm text-text-primary/70 mt-1">
                                        {reviewFormData.comment.length}/500 characters
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || !reviewFormData.rating || !reviewFormData.comment.trim()}
                                    className={`px-6 py-2 rounded-lg ${
                                        submitting || !reviewFormData.rating || !reviewFormData.comment.trim()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary-light hover:bg-primary-dark'
                                    } text-white transition-colors`}
                                >
                                    {submitting ? 'Submitting...' : editingReviewId ? 'Update Review' : 'Submit Review'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-text-primary">
                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </h3>
                <div className="flex items-center gap-2">
                    <SortIcon className="text-text-primary/50" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-background-light text-text-primary rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-light"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-light border-t-transparent"></div>
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-text-primary/70">
                    No reviews yet. Be the first to review this vehicle!
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <motion.div
                            key={review._id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-background-light rounded-lg p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white font-bold">
                                        {getUserInitial(review)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-text-primary">
                                            {getUserName(review)}
                                        </div>
                                        <div className="text-sm text-text-primary/70">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                            {review.isEdited && (
                                                <span className="ml-2 text-text-primary/50">(edited)</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {user?.id === review.userId?._id && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditReview(review)}
                                            className="p-1 hover:bg-background-dark rounded-full transition-colors"
                                        >
                                            <EditIcon className="text-text-primary/70" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="p-1 hover:bg-background-dark rounded-full transition-colors"
                                        >
                                            <DeleteIcon className="text-text-primary/70" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center mb-2">
                                {renderStars(review.rating)}
                            </div>
                            <p className="text-text-primary whitespace-pre-line">
                                {review.comment}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-full ${
                                    currentPage === page
                                        ? 'bg-primary-light text-white'
                                        : 'bg-background-light text-text-primary hover:bg-primary-light/20'
                                } transition-colors`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewSection; 