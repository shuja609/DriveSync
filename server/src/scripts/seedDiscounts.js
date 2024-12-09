const mongoose = require('mongoose');
const Discount = require('../models/Discount');
const User = require('../models/User');
require('dotenv').config();

const createSalesUser = async () => {
    try {
        // First try to find an existing sales user
        let salesUser = await User.findOne({ role: 'sales' });
        
        // If no sales user exists, create one
        if (!salesUser) {
            salesUser = await User.create({
                name: {
                    first: 'Sales',
                    last: 'Manager'
                },
                email: 'sales@drivesync.com',
                password: 'Sales@123',
                role: 'sales',
                status: 'active'
            });
            console.log('Created new sales user');
        } else {
            console.log('Found existing sales user');
        }
        
        return salesUser._id;
    } catch (error) {
        console.error('Error creating/finding sales user:', error);
        throw error;
    }
};

const seedDiscounts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get or create sales user
        const salesUserId = await createSalesUser();
        console.log('Sales user ID:', salesUserId);

        // Clear existing discounts
       // await Discount.deleteMany({});
        console.log('Cleared existing discounts');

        // Add createdBy to all test discounts
        const discountsWithCreator = testDiscounts.map(discount => ({
            ...discount,
            createdBy: salesUserId
        }));

        // Insert test discounts
        const createdDiscounts = await Discount.insertMany(discountsWithCreator);
        console.log(`Created ${createdDiscounts.length} test discounts`);

        console.log('Test discounts created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding discounts:', error);
        process.exit(1);
    }
};

const testDiscounts = [
    {
        code: 'SUMMER2024',
        type: 'percentage',
        value: 15,
        description: 'Summer special discount on all luxury vehicles',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        minPurchaseAmount: 50000,
        maxDiscountAmount: 5000,
        usageLimit: 100,
        usedCount: 0,
        status: 'inactive',
        conditions: {
            vehicleTypes: ['luxury', 'sports'],
            brands: ['BMW', 'Mercedes', 'Audi'],
            minYear: 2020,
            maxYear: 2024
        }
    },
    {
        code: 'FAMILY25',
        type: 'percentage',
        value: 25,
        description: 'Family discount on SUVs and Vans',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        minPurchaseAmount: 30000,
        maxDiscountAmount: 7500,
        usageLimit: 50,
        usedCount: 0,
        status: 'active',
        conditions: {
            vehicleTypes: ['suv', 'van'],
            brands: ['Toyota', 'Honda', 'Hyundai'],
            minYear: 2019,
            maxYear: 2024
        }
    },
    {
        code: 'FIRST500',
        type: 'fixed_amount',
        value: 500,
        description: 'First-time buyer discount on any vehicle',
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days from now
        minPurchaseAmount: 10000,
        usageLimit: 200,
        usedCount: 0,
        status: 'active',
        conditions: {
            vehicleTypes: ['sedan', 'suv', 'truck', 'van', 'sports', 'luxury'],
            brands: [],
            minYear: 2015
        }
    },
    {
        code: 'TRUCK2024',
        type: 'percentage',
        value: 10,
        description: 'Special discount on all trucks',
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        minPurchaseAmount: 25000,
        maxDiscountAmount: 3000,
        usageLimit: 75,
        usedCount: 0,
        status: 'active',
        conditions: {
            vehicleTypes: ['truck'],
            brands: ['Ford', 'Chevrolet', 'RAM', 'Toyota'],
            minYear: 2018,
            maxYear: 2024
        }
    },
    {
        code: 'FLASH1000',
        type: 'fixed_amount',
        value: 1000,
        description: 'Flash sale on luxury sedans',
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Started yesterday
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        minPurchaseAmount: 40000,
        usageLimit: 25,
        usedCount: 5,
        status: 'active',
        conditions: {
            vehicleTypes: ['sedan', 'luxury'],
            brands: ['Lexus', 'Infiniti', 'Acura'],
            minYear: 2021,
            maxYear: 2024
        }
    }
];

seedDiscounts(); 