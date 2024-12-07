const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    orderNumber: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDetails: {
        method: {
            type: String,
            enum: ['bank_transfer', 'cash', 'financing'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: {
            type: String
        }
    },
    shippingDetails: {
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        deliveryDate: Date,
        deliveryStatus: {
            type: String,
            enum: ['pending', 'in_transit', 'delivered'],
            default: 'pending'
        }
    },
    financingDetails: {
        isFinanced: {
            type: Boolean,
            default: false
        },
        loanAmount: Number,
        downPayment: Number,
        interestRate: Number,
        termLength: Number, // in months
        monthlyPayment: Number,
        approvalStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    documents: [{
        type: {
            type: String,
            enum: ['purchase_agreement', 'invoice', 'insurance', 'registration', 'financing_agreement'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    notes: [{
        content: {
            type: String,
            required: true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    timeline: [{
        status: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        description: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
});

// Generate unique order number before saving
orderSchema.pre('save', async function(next) {
    if (this.isNew && !this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await this.constructor.countDocuments() + 1;
        this.orderNumber = `ORD-${year}${month}-${count.toString().padStart(4, '0')}`;
    }
    next();
});

// Indexes for faster queries
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ 'paymentDetails.status': 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 