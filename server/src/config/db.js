const mongoose = require('mongoose');

// Database connection URL - replace with your actual MongoDB URL
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/DriveSync2';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;