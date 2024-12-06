const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['payment', 'refund'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'bank_transfer'],
        required: function() {
            return this.type === 'payment';
        }
    },
    cardDetails: {
        lastFourDigits: String,
        expiryMonth: String,
        expiryYear: String,
        cardholderName: String
    },
    refundReason: {
        type: String,
        required: function() {
            return this.type === 'refund';
        }
    },
    originalTransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: function() {
            return this.type === 'refund';
        }
    }
}, {
    timestamps: true
});

// Mask card number before saving
transactionSchema.pre('save', function(next) {
    if (this.cardDetails && this.cardDetails.cardNumber) {
        this.cardDetails.lastFourDigits = this.cardDetails.cardNumber.slice(-4);
        delete this.cardDetails.cardNumber;
    }
    next();
});

// Update order status when transaction is completed
transactionSchema.post('save', async function(doc) {
    if (doc.status === 'successful') {
        const Order = mongoose.model('Order');
        const order = await Order.findById(doc.order);
        
        if (doc.type === 'payment') {
            order.paymentStatus = 'paid';
            order.status = 'completed';
        } else if (doc.type === 'refund') {
            order.paymentStatus = 'refunded';
            order.status = 'refunded';
        }
        
        await order.save();
    }
});

module.exports = mongoose.model('Transaction', transactionSchema); 