const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, salesOnly } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/orders/' });

// Get all orders (with filters)
router.get('/', protect, salesOnly, async (req, res) => {
    try {
        const { status, paymentStatus, deliveryStatus } = req.query;
        const filters = {};

        if (status) filters.status = status;
        if (paymentStatus) filters['paymentDetails.status'] = paymentStatus;
        if (deliveryStatus) filters['shippingDetails.deliveryStatus'] = deliveryStatus;

        const orders = await Order.find(filters)
            .populate('userId', 'name email')
            .populate('vehicleId', 'make model year price')
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Get a single order
router.get('/:id', protect, salesOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('vehicleId', 'make model year price')
            .populate('notes.addedBy', 'name')
            .populate('timeline.updatedBy', 'name');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
});

// Update order status
router.patch('/:id/status', protect, salesOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        order.timeline.push({
            status,
            description: `Order status updated to ${status}`,
            updatedBy: req.user._id
        });

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'name email')
            .populate('vehicleId', 'make model year price')
            .populate('timeline.updatedBy', 'name');

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

// Update payment status
router.patch('/:id/payment-status', protect, salesOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentDetails.status = status;
        order.timeline.push({
            status: `payment_${status}`,
            description: `Payment status updated to ${status}`,
            updatedBy: req.user._id
        });

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'name.first name.last email')
            .populate('vehicleId', 'make model year price');

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ message: 'Error updating payment status' });
    }
});

// Update delivery status
router.patch('/:id/delivery-status', protect, salesOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.shippingDetails.deliveryStatus = status;
        order.timeline.push({
            status: `delivery_${status}`,
            description: `Delivery status updated to ${status}`,
            updatedBy: req.user._id
        });

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'name.first name.last email')
            .populate('vehicleId', 'make model year price');

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating delivery status:', error);
        res.status(500).json({ message: 'Error updating delivery status' });
    }
});

// Add note to order
router.post('/:id/notes', protect, salesOnly, async (req, res) => {
    try {
        const { content } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.notes.push({
            content,
            addedBy: req.user._id
        });

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'name.first name.last email')
            .populate('vehicleId', 'make model year price')
            .populate('notes.addedBy', 'name.first name.last');

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ message: 'Error adding note' });
    }
});

// Upload document
router.post('/:id/documents', protect, salesOnly, upload.single('document'), async (req, res) => {
    try {
        const { type } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.documents.push({
            type,
            url: file.path
        });

        order.timeline.push({
            status: 'document_uploaded',
            description: `Document ${type} uploaded`,
            updatedBy: req.user._id
        });

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'name.first name.last email')
            .populate('vehicleId', 'make model year price');

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ message: 'Error uploading document' });
    }
});

// Update financing details
router.patch('/:id/financing', protect, salesOnly, async (req, res) => {
    try {
        const financingData = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.financingDetails = {
            ...order.financingDetails,
            ...financingData
        };

        order.timeline.push({
            status: 'financing_updated',
            description: 'Financing details updated',
            updatedBy: req.user._id
        });

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'name.first name.last email')
            .populate('vehicleId', 'make model year price');

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating financing details:', error);
        res.status(500).json({ message: 'Error updating financing details' });
    }
});

module.exports = router; 