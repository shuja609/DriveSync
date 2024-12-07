const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        maxlength: [500, 'Review cannot be more than 500 characters']
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index to ensure one review per user per vehicle
reviewSchema.index({ vehicleId: 1, userId: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(vehicleId) {
    const stats = await this.aggregate([
        {
            $match: { 
                vehicleId: new mongoose.Types.ObjectId(vehicleId),
                status: 'approved'
            }
        },
        {
            $group: {
                _id: '$vehicleId',
                averageRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Vehicle').findByIdAndUpdate(vehicleId, {
            'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
            'ratings.count': stats[0].numReviews
        });
    } else {
        await mongoose.model('Vehicle').findByIdAndUpdate(vehicleId, {
            'ratings.average': 0,
            'ratings.count': 0
        });
    }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.vehicleId);
});

// Call calculateAverageRating before remove
reviewSchema.pre('remove', function() {
    this.constructor.calculateAverageRating(this.vehicleId);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 