const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    notes: String
}, {
    timestamps: true
});

// Update vehicle status when order is completed
orderSchema.post('save', async function(doc) {
    if (doc.status === 'completed') {
        const Vehicle = mongoose.model('Vehicle');
        await Vehicle.findByIdAndUpdate(doc.vehicle, { status: 'sold' });
    }
});

module.exports = mongoose.model('Order', orderSchema); 