const Review = require('../models/Review');
const Vehicle = require('../models/Vehicle');

const reviewController = {
    // Get reviews for a vehicle
    async getVehicleReviews(req, res) {
        try {
            const { vehicleId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const sortBy = req.query.sortBy || '-createdAt'; // Default sort by newest

            const skip = (page - 1) * limit;

            const reviews = await Review.find({ 
                vehicleId,
                status: 'approved'
            })
            .populate('userId', 'name profilePicture')
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

            const total = await Review.countDocuments({ 
                vehicleId,
                status: 'approved'
            });

            const vehicle = await Vehicle.findById(vehicleId)
                .select('ratings');

            res.json({
                success: true,
                reviews,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                },
                ratings: vehicle.ratings
            });
        } catch (error) {
            console.error('Get reviews error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching reviews'
            });
        }
    },

    // Create a review
    async createReview(req, res) {
        try {
            const { vehicleId } = req.params;
            const userId = req.user.id;
            const { rating, comment } = req.body;

            // Check if user has already reviewed this vehicle
            const existingReview = await Review.findOne({ vehicleId, userId });
            if (existingReview) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already reviewed this vehicle'
                });
            }

            // Create review
            const review = await Review.create({
                vehicleId,
                userId,
                rating,
                comment
            });

            await review.populate('userId', 'name profilePicture');

            res.status(201).json({
                success: true,
                review
            });
        } catch (error) {
            console.error('Create review error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating review'
            });
        }
    },

    // Update a review
    async updateReview(req, res) {
        try {
            const { reviewId } = req.params;
            const { rating, comment } = req.body;

            const review = await Review.findById(reviewId);

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found'
                });
            }

            // Check if user owns the review
            if (review.userId.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this review'
                });
            }

            review.rating = rating;
            review.comment = comment;
            review.isEdited = true;
            await review.save();

            await review.populate('userId', 'name profilePicture');

            res.json({
                success: true,
                review
            });
        } catch (error) {
            console.error('Update review error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating review'
            });
        }
    },

    // Delete a review
    async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;
            const review = await Review.findById(reviewId);

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found'
                });
            }

            // Check if user owns the review or is admin
            if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this review'
                });
            }

            await review.remove();

            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        } catch (error) {
            console.error('Delete review error:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting review'
            });
        }
    },

    // Admin: Moderate review
    async moderateReview(req, res) {
        try {
            const { reviewId } = req.params;
            const { status } = req.body;

            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
            }

            const review = await Review.findByIdAndUpdate(
                reviewId,
                { status },
                { new: true }
            ).populate('userId', 'name profilePicture');

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found'
                });
            }

            // Recalculate ratings if status changed
            await Review.calculateAverageRating(review.vehicleId);

            res.json({
                success: true,
                review
            });
        } catch (error) {
            console.error('Moderate review error:', error);
            res.status(500).json({
                success: false,
                message: 'Error moderating review'
            });
        }
    },

    // Get user's reviews
    async getUserReviews(req, res) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const skip = (page - 1) * limit;

            const reviews = await Review.find({ userId })
                .populate('vehicleId', 'title brand model year media')
                .sort('-createdAt')
                .skip(skip)
                .limit(limit);

            const total = await Review.countDocuments({ userId });

            res.json({
                success: true,
                reviews,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            });
        } catch (error) {
            console.error('Get user reviews error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user reviews'
            });
        }
    }
};

module.exports = reviewController; 