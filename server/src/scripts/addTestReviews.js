require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

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

const addTestReviews = async () => {
    try {
        await connectDB();

        // Get users and vehicles
        const users = await User.find({ role: 'user' });
        const vehicles = await Vehicle.find();

        if (users.length === 0) {
            console.error('No users found. Please run addTestUsers.js first.');
            process.exit(1);
        }

        if (vehicles.length === 0) {
            console.error('No vehicles found. Please run addTestVehicles.js first.');
            process.exit(1);
        }

        // Delete existing reviews
        await Review.deleteMany({});

        // Sample review comments for different ratings
        const reviewTemplates = {
            5: [
                "Absolutely fantastic vehicle! The performance and comfort exceeded my expectations.",
                "Best car I've ever driven. The technology and features are cutting edge.",
                "Outstanding quality and value. Would highly recommend to anyone.",
            ],
            4: [
                "Great car overall, just a few minor things that could be improved.",
                "Very satisfied with the purchase, good balance of features and price.",
                "Solid performance and reliability, though fuel economy could be better.",
            ],
            3: [
                "Decent vehicle but nothing exceptional. Gets the job done.",
                "Average performance and features for the price point.",
                "Some nice features but also some disappointments.",
            ],
            2: [
                "Below average experience, several issues need addressing.",
                "Not worth the price, expected much better quality.",
                "Disappointing performance and comfort levels.",
            ],
            1: [
                "Multiple problems since purchase, would not recommend.",
                "Poor quality and service, very disappointed.",
                "Far below expectations in every aspect.",
            ]
        };

        // Generate reviews
        const reviews = [];
        const usedCombinations = new Set(); // Track user-vehicle combinations

        for (const vehicle of vehicles) {
            // Determine number of reviews for this vehicle (3-5)
            const numReviews = Math.floor(Math.random() * 3) + 3;
            const availableUsers = [...users]; // Copy users array for shuffling

            // Shuffle users array
            for (let i = availableUsers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableUsers[i], availableUsers[j]] = [availableUsers[j], availableUsers[i]];
            }

            // Take only the first numReviews users
            const selectedUsers = availableUsers.slice(0, numReviews);

            for (const user of selectedUsers) {
                const combinationKey = `${vehicle._id}-${user._id}`;
                if (usedCombinations.has(combinationKey)) {
                    continue; // Skip if this combination already exists
                }

                // Random rating (weighted towards positive)
                const rating = Math.floor(Math.random() * 5) + 1;
                const comments = reviewTemplates[rating];
                const randomComment = comments[Math.floor(Math.random() * comments.length)];

                // Random date within last 6 months
                const date = new Date();
                date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));

                reviews.push({
                    vehicleId: vehicle._id,
                    userId: user._id,
                    rating,
                    comment: randomComment,
                    createdAt: date,
                    status: 'approved'
                });

                usedCombinations.add(combinationKey);
            }
        }

        // Insert reviews
        const insertedReviews = await Review.insertMany(reviews);

        console.log('Test reviews added successfully!');
        console.log('Number of reviews added:', insertedReviews.length);
        console.log('Average reviews per vehicle:', (insertedReviews.length / vehicles.length).toFixed(2));

        // Update vehicle ratings
        for (const vehicle of vehicles) {
            await Review.calculateAverageRating(vehicle._id);
        }

        console.log('Vehicle ratings updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error adding test reviews:', error);
        process.exit(1);
    }
};

addTestReviews(); 