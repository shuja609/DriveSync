require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Video = require('../models/Video');

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
const videoTitles = {
    tutorial: [
        'How to Use Advanced Driver Assistance Systems',
        'Basic Car Maintenance Tips Every Owner Should Know',
        'Understanding Your Vehicle\'s Infotainment System',
        'Guide to Electric Vehicle Charging',
        'Tips for Winter Driving Safety'
    ],
    demo: [
        'Test Drive Experience: Latest Models',
        'Performance Testing on the Track',
        'Off-Road Capabilities Demonstration',
        'Smart Parking Features in Action',
        'Autonomous Driving Features Overview'
    ],
    review: [
        'In-Depth Review: Latest Models Comparison',
        'Expert Analysis: Luxury vs Sport Trim',
        'Family SUV Comparison',
        'Electric Vehicle Range Test',
        'Performance Cars Head-to-Head'
    ],
    maintenance: [
        'DIY Oil Change Guide',
        'Tire Maintenance and Rotation Tips',
        'Battery Care and Replacement',
        'Brake System Maintenance',
        'Air Filter Replacement Guide'
    ],
    feature_showcase: [
        'Advanced Safety Features Explained',
        'Premium Sound System Overview',
        'Interior Comfort Features Tour',
        'Latest Tech Features Walkthrough',
        'Performance Package Highlights'
    ]
};

const descriptions = {
    tutorial: [
        'Learn how to make the most of your vehicle\'s advanced features with our comprehensive tutorial.',
        'Step-by-step guide to help you understand and maintain your vehicle properly.',
        'Detailed walkthrough of essential features and functions for optimal vehicle operation.'
    ],
    demo: [
        'Watch our professional drivers put these vehicles through their paces.',
        'Real-world demonstration of vehicle capabilities and performance.',
        'See how these vehicles perform in various conditions and scenarios.'
    ],
    review: [
        'Comprehensive review covering all aspects from performance to practicality.',
        'Detailed analysis of features, comfort, and value for money.',
        'Expert insights into the strengths and weaknesses of each model.'
    ],
    maintenance: [
        'Professional maintenance tips to keep your vehicle in top condition.',
        'Easy-to-follow maintenance procedures for DIY enthusiasts.',
        'Essential maintenance knowledge for every vehicle owner.'
    ],
    feature_showcase: [
        'Explore the cutting-edge features that set this vehicle apart.',
        'In-depth look at the technology and innovations in modern vehicles.',
        'Showcase of premium features and their real-world benefits.'
    ]
};

const videoUrls = [
    // Tutorials
    'https://www.youtube.com/watch?v=BjX79GsALd8', // Car maintenance basics
    'https://www.youtube.com/watch?v=3aiAxE53yhA', // How to drive a car
    'https://www.youtube.com/watch?v=pwQUpLdCQ6g', // Car dashboard symbols
    // Reviews
    'https://www.youtube.com/watch?v=F8KUdvmW2EQ', // Tesla Model 3 review
    'https://www.youtube.com/watch?v=B4Q_dlfQFyg', // BMW review
    'https://www.youtube.com/watch?v=t6KoEJWLe78', // Mercedes review
    // Maintenance
    'https://www.youtube.com/watch?v=cUzj5JIwvqs', // Oil change guide
    'https://www.youtube.com/watch?v=51Vh9xM79Oo', // Tire maintenance
    'https://www.youtube.com/watch?v=V7EFAvFPOhw', // Battery maintenance
    // Feature Showcases
    'https://www.youtube.com/watch?v=Q7b0GDrku-E', // Safety features
    'https://www.youtube.com/watch?v=q7D1SaQF1T8', // Tech features
    'https://www.youtube.com/watch?v=7GbDem2XWIE', // Performance features
    // Demo Videos
    'https://www.youtube.com/watch?v=jm59QQoQH3o', // Test drive
    'https://www.youtube.com/watch?v=V7VTR1_7ljY', // Track test
    'https://www.youtube.com/watch?v=Vq_eKbPlF7U'  // Off-road test
];

const thumbnailUrls = [
    // Professional car photos
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd',
    // Maintenance and service photos
    'https://images.unsplash.com/photo-1632823471565-1ecdf5c6d7da',
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
    'https://images.unsplash.com/photo-1487754180451-c456f719a1fc',
    // Interior shots
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
    'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb',
    // Technology and features
    'https://images.unsplash.com/photo-1553260168-69b041873e65',
    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7',
    'https://images.unsplash.com/photo-1542046272227-d247df21628c'
];

const categories = ['sedan', 'suv', 'truck', 'sports', 'luxury', 'electric', 'hybrid', 'general'];
const videoTypes = ['tutorial', 'demo', 'review', 'maintenance', 'feature_showcase'];

const tags = {
    tutorial: ['how-to', 'tips', 'guide', 'learning', 'basics'],
    demo: ['test-drive', 'performance', 'features', 'showcase', 'experience'],
    review: ['comparison', 'analysis', 'expert-review', 'detailed', 'verdict'],
    maintenance: ['diy', 'service', 'repair', 'care', 'upkeep'],
    feature_showcase: ['technology', 'innovation', 'features', 'modern', 'advanced']
};

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomTags = (type, category) => {
    const typeTags = tags[type];
    const allTags = [...typeTags, category];
    const numTags = getRandomNumber(3, 5);
    const selectedTags = [];
    
    while (selectedTags.length < numTags && allTags.length > 0) {
        const randomIndex = Math.floor(Math.random() * allTags.length);
        selectedTags.push(allTags.splice(randomIndex, 1)[0]);
    }
    
    return selectedTags;
};

const generateTestVideos = async () => {
    try {
        await connectDB();

        // Find an admin user to set as creator
        const adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            console.error('No admin user found. Please create an admin user first.');
            process.exit(1);
        }

        // Clear existing videos
        await Video.deleteMany({});
        console.log('Cleared existing videos');

        const videos = [];
        const numVideos = 30; // Generate 30 test videos

        for (let i = 0; i < numVideos; i++) {
            const type = getRandomElement(videoTypes);
            const category = getRandomElement(categories);
            
            videos.push({
                title: getRandomElement(videoTitles[type]),
                description: getRandomElement(descriptions[type]),
                url: getRandomElement(videoUrls),
                thumbnailUrl: getRandomElement(thumbnailUrls),
                type,
                category,
                duration: getRandomNumber(180, 900), // 3-15 minutes in seconds
                views: getRandomNumber(100, 10000),
                isPublished: Math.random() > 0.1, // 90% chance of being published
                tags: getRandomTags(type, category),
                createdBy: adminUser._id
            });
        }

        await Video.insertMany(videos);
        console.log(`Added ${videos.length} test videos`);
        console.log('Test videos generation completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error generating test videos:', error);
        process.exit(1);
    }
};

generateTestVideos(); 