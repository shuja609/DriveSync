require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const addTestUsers = async () => {
    try {
        await connectDB();

        // Delete existing users
        //   await User.deleteMany({});

        // Hash password for both users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Test@123', salt);

        // Test users data
        const testUsers = [
            {
                name: {
                    first: 'Admin',
                    last: 'User'
                },
                email: 'admin@drivesync.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true,
                isActive: true,
                phoneNumber: '+1234567890',
                gender: 'male',
                dob: new Date('1990-01-01'),
                profilePicture: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
                address: {
                    street: '123 Admin Street',
                    city: 'San Francisco',
                    state: 'CA',
                    zipCode: '94105',
                    country: 'USA'
                },
                preferences: {
                    carTypes: ['luxury', 'electric'],
                    budgetRange: {
                        min: 50000,
                        max: 200000
                    },
                    favoriteBrands: ['Tesla', 'BMW', 'Mercedes'],
                    notifications: {
                        email: true,
                        push: true,
                        carAlerts: true,
                        priceDrops: true,
                        newListings: true,
                        messages: true
                    },
                    privacy: {
                        showProfile: true,
                        showActivity: true,
                        showSavedCars: true
                    }
                },
                isProfileComplete: true,
                lastLogin: new Date()
            },
            {
                name: {
                    first: 'Regular',
                    last: 'User'
                },
                email: 'user@drivesync.com',
                password: hashedPassword,
                role: 'user',
                isVerified: true,
                isActive: true,
                phoneNumber: '+1987654321',
                gender: 'female',
                dob: new Date('1995-05-15'),
                profilePicture: 'https://ui-avatars.com/api/?name=Regular+User&background=0D8ABC&color=fff',
                address: {
                    street: '456 User Avenue',
                    city: 'Los Angeles',
                    state: 'CA',
                    zipCode: '90001',
                    country: 'USA'
                },
                preferences: {
                    carTypes: ['sedan', 'suv'],
                    budgetRange: {
                        min: 30000,
                        max: 80000
                    },
                    favoriteBrands: ['Honda', 'Toyota', 'Hyundai'],
                    notifications: {
                        email: true,
                        push: true,
                        carAlerts: true,
                        priceDrops: true,
                        newListings: true,
                        messages: true
                    },
                    privacy: {
                        showProfile: true,
                        showActivity: false,
                        showSavedCars: false
                    }
                },
                isProfileComplete: true,
                lastLogin: new Date()
            }
        ];

        // Insert test users
        const insertedUsers = await User.insertMany(testUsers);

        console.log('Test users data added successfully!');
        console.log('Added users:', insertedUsers.length);
        console.log('\nAdmin User Credentials:');
        console.log('Email:', testUsers[0].email);
        console.log('Password: Test@123');
        console.log('\nRegular User Credentials:');
        console.log('Email:', testUsers[1].email);
        console.log('Password: Test@123');
        process.exit(0);
    } catch (error) {
        console.error('Error adding test users:', error);
        process.exit(1);
    }
};

addTestUsers();
