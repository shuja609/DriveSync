const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    thumbnailUrl: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['tutorial', 'demo', 'review', 'maintenance', 'feature_showcase'],
        default: 'tutorial'
    },
    category: {
        type: String,
        required: true,
        enum: ['sedan', 'suv', 'truck', 'sports', 'luxury', 'electric', 'hybrid', 'general'],
        default: 'general'
    },
    duration: {
        type: Number, // in seconds
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Add text indexes for search
videoSchema.index({
    title: 'text',
    description: 'text',
    tags: 'text'
});

module.exports = mongoose.model('Video', videoSchema);