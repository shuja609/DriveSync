require('dotenv').config();
const mongoose = require('mongoose');
const Quotation = require('../models/Quotation');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const ADDITIONAL_FEATURES_LIST = [
    { name: 'Extended Warranty', price: 1500 },
    { name: 'Premium Sound System', price: 800 },
    { name: 'Navigation System', price: 1200 },
    { name: 'Leather Seats', price: 2000 },
    { name: 'Sunroof', price: 1800 },
    { name: 'Sport Package', price: 3500 },
    { name: 'Winter Tires Package', price: 1200 },
    { name: 'Paint Protection', price: 500 },
    { name: 'Towing Package', price: 1000 },
    { name: 'Security System', price: 700 }
];

const DISCOUNTS_LIST = [
    { description: 'Early Payment Discount', amount: 1000 },
    { description: 'First-Time Buyer Discount', amount: 1500 },
    { description: 'Seasonal Promotion', amount: 2000 },
    { description: 'Loyalty Program Discount', amount: 1200 },
    { description: 'Trade-In Bonus', amount: 2500 },
    { description: 'End of Year Clearance', amount: 3000 },
    { description: 'Military Discount', amount: 1000 },
    { description: 'Student Discount', amount: 800 },
    { description: 'Corporate Partnership Discount', amount: 1500 }
];

const getRandomItems = (array, min = 1, max = 3) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const addTestQuotations = async () => {
    try {
        await connectDB();

        // Get all sales reps
        const salesReps = await User.find({ role: 'sales' });
        if (salesReps.length === 0) {
            console.error('No sales representatives found. Please create one first.');
            process.exit(1);
        }

        // Get all regular users
        const customers = await User.find({ role: 'user' });
        if (customers.length === 0) {
            console.error('No customers found. Please create some users first.');
            process.exit(1);
        }

        // Get all vehicles
        const vehicles = await Vehicle.find();
        if (vehicles.length === 0) {
            console.error('No vehicles found. Please add vehicles first.');
            process.exit(1);
        }

        // Delete existing test quotations
        await Quotation.deleteMany({});

        // Create test quotations
        const quotations = [];
        const statuses = ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'];
        const currentDate = new Date();

        // Create 30 quotations
        for (let i = 0; i < 30; i++) {
            const customer = customers[Math.floor(Math.random() * customers.length)];
            const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
            const salesRep = salesReps[Math.floor(Math.random() * salesReps.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Ensure basePrice is a valid number
            const basePrice = Number(vehicle.price) || 50000;

            // Get random additional features
            const additionalFeatures = getRandomItems(ADDITIONAL_FEATURES_LIST, 1, 4);
            const additionalFeaturesTotal = additionalFeatures.reduce((sum, feature) => sum + feature.price, 0);

            // Get random discounts
            const discounts = getRandomItems(DISCOUNTS_LIST, 1, 2);
            const discountsTotal = discounts.reduce((sum, discount) => sum + discount.amount, 0);

            // Calculate total price
            const totalPrice = basePrice + additionalFeaturesTotal - discountsTotal;

            // Calculate financing options with proper number handling
            const downPaymentPercent = 0.15 + (Math.random() * 0.15); // Random between 15-30%
            const downPayment = totalPrice * downPaymentPercent;
            const financingAmount = totalPrice - downPayment;
            const termMonths = [36, 48, 60, 72][Math.floor(Math.random() * 4)]; // Random term
            const annualInterestRate = 3.99 + (Math.random() * 3); // Random between 3.99-6.99%
            const monthlyInterestRate = annualInterestRate / 12 / 100;
            
            // Calculate monthly payment using loan amortization formula
            const monthlyInstallment = (
                financingAmount * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths)) / 
                (Math.pow(1 + monthlyInterestRate, termMonths) - 1)
            );

            // Calculate validity date based on status
            let validUntil = new Date(currentDate);
            let createdAt = new Date(currentDate);
            
            // Set random dates within the last 30 days
            const daysAgo = Math.floor(Math.random() * 30);
            createdAt.setDate(createdAt.getDate() - daysAgo);
            
            if (status === 'expired') {
                validUntil = new Date(createdAt);
                validUntil.setDate(validUntil.getDate() + 5); // Expired after 5 days
            } else {
                validUntil = new Date(createdAt);
                validUntil.setDate(validUntil.getDate() + 14); // Valid for 14 days
            }

            const quotation = {
                customerId: customer._id,
                vehicleId: vehicle._id,
                salesRepId: salesRep._id,
                basePrice,
                additionalFeatures,
                discounts,
                totalPrice,
                financingOptions: [
                    {
                        downPayment: Math.round(downPayment * 100) / 100,
                        monthlyInstallment: Math.round(monthlyInstallment * 100) / 100,
                        term: termMonths,
                        interestRate: Math.round(annualInterestRate * 100) / 100
                    }
                ],
                status,
                createdAt,
                validUntil,
                notes: `Quotation for ${customer.firstName} ${customer.lastName} - ${vehicle.make} ${vehicle.model} ${vehicle.year}`,
                emailNotifications: []
            };

            // Add email notifications based on status
            if (status !== 'draft') {
                quotation.emailNotifications.push({
                    type: 'created',
                    sentAt: new Date(createdAt.getTime() + 1000 * 60 * 30), // 30 minutes after creation
                    status: 'success'
                });

                if (status === 'viewed') {
                    quotation.emailNotifications.push({
                        type: 'reminder',
                        sentAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24), // 1 day after
                        status: 'success'
                    });
                }

                if (status === 'accepted' || status === 'rejected') {
                    quotation.emailNotifications.push({
                        type: 'reminder',
                        sentAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24), // 1 day after
                        status: 'success'
                    }, {
                        type: status === 'accepted' ? 'accepted' : 'rejected',
                        sentAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 2), // 2 days after
                        status: 'success'
                    });
                }
            }

            quotations.push(quotation);
        }

        // Insert test quotations
        const insertedQuotations = await Quotation.insertMany(quotations);

        console.log('Test quotations added successfully!');
        console.log('Added quotations:', insertedQuotations.length);
        console.log('Status distribution:', 
            statuses.map(status => `${status}: ${insertedQuotations.filter(q => q.status === status).length}`).join(', ')
        );
        process.exit(0);
    } catch (error) {
        console.error('Error adding test quotations:', error);
        process.exit(1);
    }
};

addTestQuotations(); 