const mongoose = require('mongoose');
const { isValidUrl } = require('../utils/validators');

// Schema for vehicle specifications
const specificationSchema = new mongoose.Schema({
    engine: {
        type: {
            type: String,
            enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
            required: true
        },
        displacement: String, // e.g., "2.0L", "1998cc"
        power: String, // e.g., "201 hp @ 5500 rpm"
        torque: String, // e.g., "195 lb-ft @ 1500-4500 rpm"
        transmission: {
            type: String,
            enum: ['Manual', 'Automatic', 'CVT', 'DCT', 'Single-Speed', '8-Speed Dual-Clutch', '10-Speed Dual-Clutch', '10-Speed Automatic', '8-Speed Automatic']
        },
        drivetrain: {
            type: String,
            enum: ['FWD', 'RWD', 'AWD', '4WD']
        }
    },
    performance: {
        acceleration: String, // 0-60 mph time
        topSpeed: String,
        fuelEconomy: {
            city: String,
            highway: String,
            combined: String
        }
    },
    dimensions: {
        length: Number, // in mm
        width: Number,
        height: Number,
        wheelbase: Number,
        groundClearance: Number,
        cargoVolume: Number, // in liters
        seatingCapacity: Number
    },
    features: {
        exterior: [String], // e.g., LED headlights, sunroof
        interior: [String], // e.g., leather seats, heated steering
        safety: [String], // e.g., ABS, airbags
        technology: [String], // e.g., navigation, bluetooth
        comfort: [String] // e.g., climate control, power seats
    }
});

// Schema for vehicle media
const mediaSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['image', 'video', '360-view'],
        required: true
    },
    url: {
        type: String,
        required: true,
        //default: 'https://ui-avatars.com/api/?name=${vehicle.brand}+${vehicle.model}&background=5d9adf&color=000000'
    },
    isPrimary: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
});

// Schema for vehicle pricing and availability
const pricingSchema = new mongoose.Schema({
    basePrice: {
        type: Number,
        required: true
    },
    discountedPrice: Number,
    discountExpiry: Date,
    leaseOptions: [{
        duration: Number, // in months
        monthlyPayment: Number,
        downPayment: Number,
        mileageLimit: Number
    }],
    financingOptions: [{
        duration: Number, // in months
        apr: Number,
        monthlyPayment: Number,
        downPayment: Number
    }]
});

// Main Vehicle Schema
const vehicleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        index: true
    },
    model: {
        type: String,
        required: true,
        index: true
    },
    year: {
        type: Number,
        required: true,
        index: true
    },
    condition: {
        type: String,
        enum: ['New', 'Used', 'Certified Pre-Owned'],
        required: true,
        index: true
    },
    mileage: {
        type: Number,
        required: function() {
            return this.condition !== 'New';
        }
    },
    exteriorColor: {
        name: String,
        hexCode: String
    },
    interiorColor: {
        name: String,
        hexCode: String
    },
    vin: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        validate: {
            validator: function(v) {
                return /^[A-HJ-NPR-Z0-9]{17}$/.test(v);
            },
            message: 'Please provide a valid VIN'
        }
    },
    stockNumber: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        short: {
            type: String,
            required: true,
            maxlength: 200
        },
        full: {
            type: String,
            required: true
        }
    },
    specifications: specificationSchema,
    media: [mediaSchema],
    pricing: pricingSchema,
    category: [{
        type: String,
        enum: ['Luxury', 'Sports', 'SUV', 'Sedan', 'Truck', 'Van', 'Compact', 'Electric'],
        required: true
    }],
    tags: [{
        type: String,
        index: true
    }],
    highlights: [String],
    warranty: {
        type: {
            type: String,
            enum: ['Basic', 'Powertrain', 'Extended']
        },
        duration: String,
        coverage: String
    },
    location: {
        dealership: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dealership'
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
            coordinates: {
                latitude: Number,
                longitude: Number
            }
        }
    },
    availability: {
        status: {
            type: String,
            enum: ['In Stock', 'In Transit', 'Sold', 'Reserved'],
            required: true,
            index: true
        },
        expectedDate: Date // for 'In Transit' vehicles
    },
    history: {
        owners: Number,
        accidents: Number,
        serviceRecords: Boolean,
        carfaxReport: String // URL to Carfax report
    },
    ratings: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    views: {
        total: {
            type: Number,
            default: 0
        },
        lastWeek: {
            type: Number,
            default: 0
        }
    },
    metadata: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for efficient querying
vehicleSchema.index({ brand: 1, model: 1, year: 1 });
vehicleSchema.index({ 'pricing.basePrice': 1 });
vehicleSchema.index({ 'availability.status': 1 });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ tags: 1 });
vehicleSchema.index({ 'location.address.city': 1, 'location.address.state': 1 });

// Virtual for full vehicle name
vehicleSchema.virtual('fullName').get(function() {
    return `${this.year} ${this.brand} ${this.model}`;
});

// Pre-save middleware to update lastUpdatedBy
vehicleSchema.pre('save', function(next) {
    this.lastUpdatedBy = this.metadata.createdBy;
    next();
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle; 