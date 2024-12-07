const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionNumber: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        enum: ['payment', 'refund'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    method: {
        type: String,
        enum: ['bank_transfer', 'cash', 'financing'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    paymentDetails: {
        bankTransfer: {
            bankName: String,
            accountNumber: String,
            referenceNumber: String
        },
        cash: {
            receiptNumber: String,
            collectedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        },
        financing: {
            loanNumber: String,
            lender: String,
            termLength: Number,
            interestRate: Number
        }
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        location: String
    },
    notes: [{
        content: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Generate unique transaction number before saving
transactionSchema.pre('save', async function(next) {
    if (this.isNew && !this.transactionNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await this.constructor.countDocuments() + 1;
        this.transactionNumber = `TXN-${year}${month}-${count.toString().padStart(4, '0')}`;
    }
    next();
});

// Update order payment status when transaction is completed
transactionSchema.post('save', async function(doc) {
    if (doc.status === 'completed') {
        const Order = mongoose.model('Order');
        await Order.findByIdAndUpdate(doc.orderId, {
            'paymentDetails.status': 'completed',
            'paymentDetails.transactionId': doc.transactionNumber
        });
    }
});

// Indexes for faster queries
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ transactionNumber: 1 }, { unique: true });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 