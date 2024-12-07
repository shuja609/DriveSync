const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

// Process payment
exports.processPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentMethod, amount } = req.body;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock payment success (90% success rate)
        const isSuccessful = Math.random() < 0.9;

        if (!isSuccessful) {
            return res.status(400).json({ message: 'Payment failed. Please try again.' });
        }

        // Create transaction record
        const transaction = new Transaction({
            orderId,
            userId: req.user.id,
            amount,
            type: 'payment',
            status: 'completed',
            method: paymentMethod,
            description: `Payment for order ${order.orderNumber}`,
            paymentDetails: {
                bankTransfer: paymentMethod === 'bank_transfer' ? {
                    bankName: 'Test Bank',
                    accountNumber: '****1234',
                    referenceNumber: `REF-${Date.now()}`
                } : undefined,
                cash: paymentMethod === 'cash' ? {
                    receiptNumber: `RCP-${Date.now()}`,
                    collectedBy: req.user.id
                } : undefined,
                financing: paymentMethod === 'financing' ? {
                    loanNumber: `LN-${Date.now()}`,
                    lender: 'Test Lender',
                    termLength: 48,
                    interestRate: 4.99
                } : undefined
            },
            metadata: {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                location: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            }
        });

        await transaction.save();

        // Update order payment status
        order.paymentDetails = {
            method: paymentMethod,
            status: 'completed',
            transactionId: transaction.transactionNumber
        };
        order.status = 'processing';

        // Add timeline entry
        order.timeline.push({
            status: 'processing',
            description: 'Payment received',
            updatedBy: req.user.id
        });

        await order.save();

        res.json({
            success: true,
            message: 'Payment processed successfully',
            data: {
                transactionId: transaction.transactionNumber,
                status: 'completed',
                orderId: order._id
            }
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({
            message: 'Error processing payment',
            error: error.message
        });
    }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized
        if (req.user.role !== 'admin' && order.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this payment' });
        }

        const transaction = await Transaction.findOne({
            orderId,
            type: 'payment'
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                status: order.paymentDetails?.status || 'pending',
                method: order.paymentDetails?.method,
                transactionId: transaction?.transactionNumber,
                lastUpdated: transaction?.createdAt
            }
        });
    } catch (error) {
        console.error('Error getting payment status:', error);
        res.status(500).json({
            message: 'Error getting payment status',
            error: error.message
        });
    }
}; 