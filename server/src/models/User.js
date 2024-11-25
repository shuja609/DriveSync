const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { isValidEmail, isValidPhone } = require('../utils/validators');

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
});

const userSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minlength: [2, 'First name must be at least 2 characters long']
        },
        last: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minlength: [2, 'Last name must be at least 2 characters long']
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: isValidEmail,
            message: 'Please provide a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't include password in queries by default
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: isValidPhone,
            message: 'Please provide a valid phone number'
        }
    },
    profilePicture: {
        type: String,
        default: 'default-profile.png'
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer not to say'],
        default: 'prefer not to say'
    },
    dob: {
        type: Date,
        validate: {
            validator: function(value) {
                return value < new Date();
            },
            message: 'Date of birth cannot be in the future'
        }
    },
    address: addressSchema,
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    preferences: {
        carTypes: [{
            type: String,
            enum: ['sedan', 'suv', 'sports', 'luxury', 'electric', 'hybrid']
        }],
        budgetRange: {
            min: Number,
            max: Number
        },
        favoriteBrands: [String]
    },
    socialLogin: {
        google: {
            id: String,
            email: String
        },
        facebook: {
            id: String,
            email: String
        },
        twitter: {
            id: String,
            username: String
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    lastLogin: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.name.first} ${this.name.last}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
        
    this.passwordResetExpires = Date.now() + 3600000; // 1 hour
    
    return resetToken;
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
        
    this.emailVerificationExpires = Date.now() + 86400000; // 24 hours
    
    return verificationToken;
};

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'socialLogin.google.id': 1 });
userSchema.index({ 'socialLogin.facebook.id': 1 });
userSchema.index({ 'socialLogin.twitter.id': 1 });

const User = mongoose.model('User', userSchema);

module.exports = User; 