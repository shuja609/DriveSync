const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { orderId, amount, method, paymentDetails } = req.body;
        const userId = req.user._id;

        // Check if order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify user is authorized to make payment
        if (!req.user.isAdmin && order.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to make payment for this order' });
        }

        // Verify amount matches order amount
        if (amount !== order.amount) {
            return res.status(400).json({ message: 'Payment amount does not match order amount' });
        }

        // Create transaction
        const transaction = new Transaction({
            orderId,
            userId,
            type: 'payment',
            amount,
            method,
            paymentDetails,
            metadata: {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                location: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            }
        });

        // Process payment based on method
        let isPaymentSuccessful = false;
        switch (method) {
            case 'bank_transfer':
                // Simulate bank transfer verification
                isPaymentSuccessful = await verifyBankTransfer(paymentDetails.bankTransfer);
                break;
            case 'cash':
                // Simulate cash payment verification
                isPaymentSuccessful = await verifyCashPayment(paymentDetails.cash);
                break;
            case 'financing':
                // Simulate financing approval
                isPaymentSuccessful = await verifyFinancing(paymentDetails.financing);
                break;
            default:
                return res.status(400).json({ message: 'Invalid payment method' });
        }

        if (isPaymentSuccessful) {
            transaction.status = 'completed';
            await transaction.save();

            // Update order status
            order.status = 'processing';
            order.timeline.push({
                status: 'processing',
                description: 'Payment received',
                updatedBy: userId
            });
            await order.save();

            res.status(201).json({
                success: true,
                message: 'Payment processed successfully',
                data: transaction
            });
        } else {
            transaction.status = 'failed';
            await transaction.save();

            res.status(400).json({
                success: false,
                message: 'Payment processing failed'
            });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({
            message: 'Error processing payment',
            error: error.message
        });
    }
};

// Get all transactions (admin)
exports.getAllTransactions = async (req, res) => {
    try {
        const { status, method, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) query.status = status;
        if (method) query.method = method;

        const transactions = await Transaction.find(query)
            .populate('userId', 'name email')
            .populate({
                path: 'orderId',
                populate: {
                    path: 'vehicleId',
                    select: 'title brand model year'
                }
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Transaction.countDocuments(query);

        res.json({
            success: true,
            data: transactions,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting transactions:', error);
        res.status(500).json({
            message: 'Error getting transactions',
            error: error.message
        });
    }
};

// Get user's transactions
exports.getUserTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const query = { userId: req.user._id };

        const transactions = await Transaction.find(query)
            .populate({
                path: 'orderId',
                populate: {
                    path: 'vehicleId',
                    select: 'title brand model year media'
                }
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Transaction.countDocuments(query);

        res.json({
            success: true,
            data: transactions,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting user transactions:', error);
        res.status(500).json({
            message: 'Error getting user transactions',
            error: error.message
        });
    }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('userId', 'name email')
            .populate({
                path: 'orderId',
                populate: {
                    path: 'vehicleId',
                    select: 'title brand model year pricing'
                }
            });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check if user is authorized to view this transaction
        if (!req.user.isAdmin && transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this transaction' });
        }

        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({
            message: 'Error getting transaction',
            error: error.message
        });
    }
};

// Simulated payment verification functions
const verifyBankTransfer = async (details) => {
    // Simulate bank transfer verification process
    return new Promise(resolve => {
        setTimeout(() => {
            // For development, approve if reference number exists
            resolve(!!details.referenceNumber);
        }, 1000);
    });
};

const verifyCashPayment = async (details) => {
    // Simulate cash payment verification
    return new Promise(resolve => {
        setTimeout(() => {
            // For development, approve if receipt number exists
            resolve(!!details.receiptNumber);
        }, 1000);
    });
};

const verifyFinancing = async (details) => {
    // Simulate financing approval process
    return new Promise(resolve => {
        setTimeout(() => {
            // For development, approve if loan number exists
            resolve(!!details.loanNumber);
        }, 1000);
    });
}; 