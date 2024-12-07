require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Inquiry = require('../models/Inquiry');
const Booking = require('../models/Booking');

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

// Test data
const inquirySubjects = [
    'Question about financing options',
    'Vehicle availability inquiry',
    'Test drive scheduling',
    'Price negotiation',
    'Trade-in value question',
    'Vehicle specifications',
    'Maintenance history',
    'Insurance options',
    'Warranty coverage',
    'Delivery options'
];

const inquiryMessages = [
    'I would like to know more about the financing options available for this vehicle. What are the current interest rates and term lengths?',
    'Is this vehicle still available? I would like to schedule a viewing this weekend.',
    'I am interested in taking this vehicle for a test drive. What times are available?',
    'Would you be willing to negotiate on the price? I am seriously interested in purchasing this vehicle.',
    'I have a vehicle I would like to trade in. How can I get an estimate of its value?',
    'Could you provide more detailed specifications about the engine and performance?',
    'Does this vehicle have a complete maintenance history? Are there any known issues?',
    'What insurance options do you recommend for this vehicle?',
    'What does the warranty cover and for how long?',
    'Do you offer delivery services? I live quite far from your location.'
];

const locations = [
    'Main Showroom',
    'Downtown Branch',
    'North Branch'
];

const paymentMethods = ['cash', 'card', 'bank_transfer'];

// Status enums from models
const inquiryStatuses = ['pending', 'in_progress', 'resolved', 'closed'];
const inquiryPriorities = ['low', 'medium', 'high'];
const bookingStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
const getRandomTime = () => {
    const hour = Math.floor(Math.random() * (18 - 9) + 9); // 9 AM to 6 PM
    const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const generateTestData = async () => {
    try {
        await connectDB();

        // Get all users and vehicles
        const users = await User.find({ role: 'user' });
        const vehicles = await Vehicle.find({});

        if (users.length === 0 || vehicles.length === 0) {
            console.error('No users or vehicles found. Please run addTestUsers.js and addTestVehicles.js first.');
            process.exit(1);
        }

        // Clear existing test data
        await Inquiry.deleteMany({});
        await Booking.deleteMany({});
        console.log('Cleared existing inquiries and bookings');

        // Generate inquiries
        const inquiries = [];
        for (let i = 0; i < 20; i++) {
            const user = getRandomElement(users);
            const vehicle = getRandomElement(vehicles);
            
            inquiries.push({
                userId: user._id,
                vehicleId: vehicle._id,
                subject: getRandomElement(inquirySubjects),
                message: getRandomElement(inquiryMessages),
                contactInfo: {
                    name: user.name,
                    email: user.email,
                    phone: user.phoneNumber || '1234567890'
                },
                status: getRandomElement(inquiryStatuses),
                priority: getRandomElement(inquiryPriorities),
                createdAt: getRandomDate(new Date('2023-01-01'), new Date())
            });
        }
        await Inquiry.insertMany(inquiries);
        console.log('Added test inquiries');

        // Generate bookings (both test drives and reservations)
        const bookings = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3); // Up to 3 months in the future

        for (let i = 0; i < 30; i++) {
            const user = getRandomElement(users);
            const vehicle = getRandomElement(vehicles);
            const isTestDrive = Math.random() < 0.5;
            const bookingDate = getRandomDate(startDate, endDate);
            
            const commonFields = {
                userId: user._id,
                vehicleId: vehicle._id,
                type: isTestDrive ? 'test_drive' : 'reservation',
                date: bookingDate.toISOString().split('T')[0],
                time: getRandomTime(),
                contactInfo: {
                    name: user.name,
                    email: user.email,
                    phone: user.phoneNumber || '1234567890'
                },
                status: getRandomElement(bookingStatuses),
                createdAt: new Date()
            };

            if (isTestDrive) {
                bookings.push({
                    ...commonFields,
                    location: getRandomElement(locations)
                });
            } else {
                bookings.push({
                    ...commonFields,
                    duration: Math.floor(Math.random() * 7) + 1, // 1-7 days
                    paymentMethod: getRandomElement(paymentMethods)
                });
            }
        }
        await Booking.insertMany(bookings);
        console.log('Added test bookings');

        console.log('Test data generation completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error generating test data:', error);
        process.exit(1);
    }
};

generateTestData(); 