require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

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

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const paymentMethods = ['bank_transfer', 'cash', 'financing'];
const orderStatuses = ['pending', 'processing', 'confirmed', 'completed', 'cancelled'];

const generateTestData = async () => {
    try {
        await connectDB();

        // Get users and vehicles
        const users = await User.find({ role: 'user' });
        const vehicles = await Vehicle.find({ 'availability.status': 'In Stock' });
        const admin = await User.findOne({ role: 'admin' });

        if (!users.length || !vehicles.length || !admin) {
            console.error('No users, vehicles, or admin found. Please run addTestUsers.js and addTestVehicles.js first.');
            process.exit(1);
        }

        // Clear existing data
        await Order.deleteMany({});
        await Transaction.deleteMany({});
        console.log('Cleared existing orders and transactions');

        const orders = [];
        const transactions = [];

        // Generate test orders and transactions
        for (let i = 0; i < 20; i++) {
            const user = getRandomElement(users);
            const vehicle = getRandomElement(vehicles);
            const paymentMethod = getRandomElement(paymentMethods);
            const status = getRandomElement(orderStatuses);
            const orderDate = getRandomDate(new Date('2023-01-01'), new Date());

            // Create order
            const order = new Order({
                userId: user._id,
                vehicleId: vehicle._id,
                amount: vehicle.pricing.basePrice,
                paymentDetails: {
                    method: paymentMethod,
                    status: status === 'completed' ? 'completed' : 'pending'
                },
                status,
                shippingDetails: {
                    address: {
                        street: '123 Test Street',
                        city: 'Test City',
                        state: 'Test State',
                        zipCode: '12345',
                        country: 'Test Country'
                    },
                    deliveryStatus: status === 'completed' ? 'delivered' : 'pending'
                },
                financingDetails: paymentMethod === 'financing' ? {
                    isFinanced: true,
                    loanAmount: vehicle.pricing.basePrice * 0.8,
                    downPayment: vehicle.pricing.basePrice * 0.2,
                    interestRate: getRandomNumber(3, 7),
                    termLength: getRandomElement([36, 48, 60]),
                    monthlyPayment: (vehicle.pricing.basePrice * 0.8) / 48,
                    approvalStatus: status === 'completed' ? 'approved' : 'pending'
                } : undefined,
                createdAt: orderDate
            });

            // Add timeline entries
            order.timeline.push({
                status: 'pending',
                description: 'Order created',
                timestamp: orderDate,
                updatedBy: user._id
            });

            if (status !== 'pending') {
                order.timeline.push({
                    status,
                    description: `Order ${status}`,
                    timestamp: new Date(orderDate.getTime() + 86400000), // Next day
                    updatedBy: admin._id
                });
            }

            orders.push(order);

            // Create transaction if order is not pending
            if (status !== 'pending') {
                const transaction = new Transaction({
                    orderId: order._id,
                    userId: user._id,
                    type: 'payment',
                    amount: vehicle.pricing.basePrice,
                    method: paymentMethod,
                    status: status === 'completed' ? 'completed' : 'pending',
                    paymentDetails: {
                        bankTransfer: paymentMethod === 'bank_transfer' ? {
                            bankName: 'Test Bank',
                            accountNumber: '****1234',
                            referenceNumber: `REF-${Date.now()}`
                        } : undefined,
                        cash: paymentMethod === 'cash' ? {
                            receiptNumber: `RCP-${Date.now()}`,
                            collectedBy: admin._id
                        } : undefined,
                        financing: paymentMethod === 'financing' ? {
                            loanNumber: `LN-${Date.now()}`,
                            lender: 'Test Lender',
                            termLength: 48,
                            interestRate: 4.99
                        } : undefined
                    },
                    metadata: {
                        ipAddress: '127.0.0.1',
                        userAgent: 'Test Browser',
                        location: 'Test Location'
                    },
                    createdAt: new Date(orderDate.getTime() + 3600000) // 1 hour after order
                });

                transactions.push(transaction);
            }
        }

        // Save orders and transactions
        await Order.insertMany(orders);
        console.log(`Added ${orders.length} test orders`);

        await Transaction.insertMany(transactions);
        console.log(`Added ${transactions.length} test transactions`);

        console.log('Test data generation completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error generating test data:', error);
        process.exit(1);
    }
};

generateTestData(); 