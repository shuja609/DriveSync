const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
        // Not required as inquiries can be general
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved', 'closed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    contactInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String
        }
    },
    responses: [{
        responderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    notificationsSent: [{
        type: {
            type: String,
            enum: ['email', 'sms']
        },
        status: {
            type: String,
            enum: ['success', 'failed']
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Indexes for faster queries
inquirySchema.index({ userId: 1, status: 1 });
inquirySchema.index({ vehicleId: 1, status: 1 });
inquirySchema.index({ status: 1, priority: 1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry; 