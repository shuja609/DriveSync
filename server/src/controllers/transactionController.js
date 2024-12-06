const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

// Get all transactions (admin only)
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('customer', 'name email')
            .populate('order', 'status amount')
            .sort('-createdAt');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's transactions
exports.getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ customer: req.user._id })
            .populate('order', 'status amount')
            .sort('-createdAt');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single transaction
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('customer', 'name email')
            .populate('order', 'status amount');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check if user is admin or transaction owner
        if (!req.user.isAdmin && transaction.customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Process payment
exports.processPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, cardDetails } = req.body;

        // Validate order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized
        if (order.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if order is pending payment
        if (order.paymentStatus !== 'pending') {
            return res.status(400).json({ message: 'Order is not pending payment' });
        }

        // Create payment transaction
        const transaction = new Transaction({
            order: orderId,
            customer: req.user._id,
            amount: order.amount,
            type: 'payment',
            paymentMethod,
            cardDetails,
            status: 'pending'
        });

        // TODO: Integrate with actual payment gateway
        // For now, simulate successful payment
        transaction.status = 'successful';

        const savedTransaction = await transaction.save();
        await savedTransaction.populate('order', 'status amount');

        // Update order status
        order.paymentStatus = 'paid';
        order.status = 'completed';
        await order.save();

        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Process refund (admin only)
exports.processRefund = async (req, res) => {
    try {
        const { orderId, refundReason, originalTransactionId } = req.body;

        // Validate order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order can be refunded
        if (order.status !== 'completed' || order.paymentStatus !== 'paid') {
            return res.status(400).json({ message: 'Order cannot be refunded' });
        }

        // Validate original transaction
        const originalTransaction = await Transaction.findById(originalTransactionId);
        if (!originalTransaction || originalTransaction.type !== 'payment' || originalTransaction.status !== 'successful') {
            return res.status(400).json({ message: 'Invalid original transaction' });
        }

        // Create refund transaction
        const transaction = new Transaction({
            order: orderId,
            customer: order.customer,
            amount: order.amount,
            type: 'refund',
            refundReason,
            originalTransaction: originalTransactionId,
            status: 'pending'
        });

        // TODO: Integrate with actual payment gateway
        // For now, simulate successful refund
        transaction.status = 'successful';

        const savedTransaction = await transaction.save();
        await savedTransaction.populate('order', 'status amount');

        // Update order status
        order.paymentStatus = 'refunded';
        order.status = 'refunded';
        await order.save();

        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 