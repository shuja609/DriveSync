const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    type: {
        type: String,
        enum: ['reservation', 'test_drive'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
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
            type: String,
            required: true
        }
    },
    location: {
        type: String,
        required: function() {
            return this.type === 'test_drive';
        }
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'bank_transfer'],
        required: function() {
            return this.type === 'reservation';
        }
    },
    duration: {
        type: Number, // Duration in days for reservation
        required: function() {
            return this.type === 'reservation';
        }
    },
    notes: {
        type: String,
        maxlength: 500
    },
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
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ vehicleId: 1, status: 1 });
bookingSchema.index({ date: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 