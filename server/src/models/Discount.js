const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed_amount'],
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    minPurchaseAmount: {
        type: Number,
        default: 0
    },
    maxDiscountAmount: {
        type: Number
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    },
    applicableVehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }],
    conditions: {
        vehicleTypes: [{
            type: String,
            enum: ['sedan', 'suv', 'truck', 'van', 'sports', 'luxury']
        }],
        brands: [String],
        minYear: Number,
        maxYear: Number
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for faster queries
discountSchema.index({ code: 1 }, { unique: true });
discountSchema.index({ status: 1, startDate: 1, endDate: 1 });
discountSchema.index({ 'conditions.vehicleTypes': 1 });
discountSchema.index({ 'conditions.brands': 1 });

// Pre-save middleware to update status based on dates
discountSchema.pre('save', function(next) {
    const now = new Date();
    if (now < this.startDate) {
        this.status = 'inactive';
    } else if (now > this.endDate) {
        this.status = 'expired';
    } else if (this.usageLimit && this.usedCount >= this.usageLimit) {
        this.status = 'expired';
    } else {
        this.status = 'active';
    }
    next();
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount; 