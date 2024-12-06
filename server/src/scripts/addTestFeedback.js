require('dotenv').config();
const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
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

const addTestFeedback = async () => {
    try {
        await connectDB();

        // Find a regular user and an admin user
        const regularUser = await User.findOne({ role: 'user' });
        const adminUser = await User.findOne({ role: 'admin' });

        if (!regularUser) {
            console.error('No regular user found. Please create a regular user first.');
            process.exit(1);
        }

        if (!adminUser) {
            console.error('No admin user found. Please create an admin user first.');
            process.exit(1);
        }

        console.log('Using regular user:', regularUser.email);
        console.log('Using admin user:', adminUser.email);

        // Create test feedback entries
        const testFeedbacks = [
            {
                userId: regularUser._id,
                type: 'Bug Report',
                subject: 'Video player not working on mobile',
                message: 'When trying to play videos on my iPhone, the player shows a black screen. This happens with all videos.',
                status: 'Open',
                priority: 'High',
                createdAt: new Date('2024-03-15T10:00:00Z')
            },
            {
                userId: regularUser._id,
                type: 'Feature Request',
                subject: 'Dark mode suggestion',
                message: 'It would be great to have a dark mode option. This would help reduce eye strain when using the app at night.',
                status: 'In Progress',
                priority: 'Medium',
                response: 'Thanks for the suggestion! We are currently working on implementing this feature.',
                respondedBy: adminUser._id,
                respondedAt: new Date('2024-03-16T15:30:00Z'),
                createdAt: new Date('2024-03-14T09:00:00Z')
            },
            {
                userId: regularUser._id,
                type: 'General',
                subject: 'Great user experience',
                message: 'I really enjoy using this platform. The interface is intuitive and the features are exactly what I need.',
                status: 'Closed',
                priority: 'Low',
                response: 'Thank you for your positive feedback! We are glad you are enjoying our platform.',
                respondedBy: adminUser._id,
                respondedAt: new Date('2024-03-17T11:20:00Z'),
                createdAt: new Date('2024-03-13T14:00:00Z')
            }
        ];

        // Delete any existing test feedback
        await Feedback.deleteMany({});

        // Insert test feedback
        const insertedFeedback = await Feedback.insertMany(testFeedbacks);

        console.log('Test feedback data added successfully!');
        console.log('Added feedback items:', insertedFeedback.length);
        console.log('Feedback submitted by user:', regularUser.email);
        console.log('Responses by admin:', adminUser.email);
        process.exit(0);
    } catch (error) {
        console.error('Error adding test feedback:', error);
        process.exit(1);
    }
};

addTestFeedback(); 