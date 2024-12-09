const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    quotationNumber: {
        type: String,
        unique: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    salesRepId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    additionalFeatures: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    discounts: [{
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    financingOptions: [{
        downPayment: {
            type: Number,
            required: true
        },
        monthlyInstallment: {
            type: Number,
            required: true
        },
        term: {
            type: Number,
            required: true
        },
        interestRate: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'],
        default: 'draft'
    },
    validUntil: {
        type: Date,
        required: true
    },
    notes: String,
    emailNotifications: [{
        type: {
            type: String,
            enum: ['created', 'sent', 'reminder', 'accepted', 'rejected']
        },
        sentAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['success', 'failed']
        }
    }]
}, {
    timestamps: true
});

// Generate unique quotation number before saving
quotationSchema.pre('save', async function(next) {
    if (this.isNew && !this.quotationNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await this.constructor.countDocuments() + 1;
        this.quotationNumber = `QT-${year}${month}-${count.toString().padStart(4, '0')}`;
    }
    next();
});

// Calculate total price before saving
quotationSchema.pre('save', function(next) {
    const additionalFeaturesTotal = this.additionalFeatures.reduce((sum, feature) => sum + feature.price, 0);
    const discountsTotal = this.discounts.reduce((sum, discount) => sum + discount.amount, 0);
    this.totalPrice = this.basePrice + additionalFeaturesTotal - discountsTotal;
    next();
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation; 