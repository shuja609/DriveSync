const Order = require('../models/Order');
const Vehicle = require('../models/Vehicle');
const Transaction = require('../models/Transaction');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { vehicleId, paymentMethod, shippingDetails, financingDetails } = req.body;
        const userId = req.user.id;

        // Check if vehicle exists and is available
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        if (vehicle.availability.status !== 'In Stock') {
            return res.status(400).json({ message: 'Vehicle is not available for purchase' });
        }

        // Create order
        const order = new Order({
            userId,
            vehicleId,
            amount: vehicle.pricing.basePrice,
            paymentDetails: {
                method: paymentMethod
            },
            shippingDetails,
            financingDetails: financingDetails || {}
        });

        // Add initial timeline entry
        order.timeline.push({
            status: 'pending',
            description: 'Order created',
            updatedBy: userId
        });

        await order.save();

        // Update vehicle status to 'Reserved'
        await Vehicle.findByIdAndUpdate(vehicleId, {
            'availability.status': 'Reserved'
        });

        // Populate necessary fields for response
        await order.populate([
            { path: 'userId', select: 'name email phoneNumber' },
            { path: 'vehicleId', select: 'title brand model year pricing media' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('userId', 'name email')
            .populate('vehicleId', 'title brand model year')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({
            message: 'Error getting orders',
            error: error.message
        });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = { userId: req.user.id };

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('vehicleId', 'title brand model year media')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting user orders:', error);
        res.status(500).json({
            message: 'Error getting user orders',
            error: error.message
        });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phoneNumber')
            .populate('vehicleId')
            .populate('timeline.updatedBy', 'name');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
       // console.log(order.userId._id.toString(), req.user.id.toString());
        // Check if user is authorized to view this order
        if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({
            message: 'Error getting order',
            error: error.message
        });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, description } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only admin can update order status
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update order status' });
        }

        order.status = status;
        order.timeline.push({
            status,
            description,
            updatedBy: req.user.id
        });

        // If order is completed, update vehicle status to 'Sold'
        if (status === 'completed') {
            await Vehicle.findByIdAndUpdate(order.vehicleId, {
                'availability.status': 'Sold'
            });
        }
        // If order is cancelled, update vehicle status back to 'In Stock'
        else if (status === 'cancelled') {
            await Vehicle.findByIdAndUpdate(order.vehicleId, {
                'availability.status': 'In Stock'
            });
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Add note to order
exports.addOrderNote = async (req, res) => {
    try {
        const { content } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to add notes
            if (req.user.role !== 'admin' && order.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add notes to this order' });
        }

        order.notes.push({
            content,
            addedBy: req.user.id
        });

        await order.save();

        res.json({
            success: true,
            message: 'Note added successfully',
            data: order
        });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({
            message: 'Error adding note',
            error: error.message
        });
    }
};

// Update shipping details
exports.updateShippingDetails = async (req, res) => {
    try {
        const { shippingDetails } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to update shipping details
        if (req.user.role !== 'admin' && order.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update shipping details' });
        }

        order.shippingDetails = {
            ...order.shippingDetails,
            ...shippingDetails
        };

        order.timeline.push({
            status: order.status,
            description: 'Shipping details updated',
            updatedBy: req.user.id
        });

        await order.save();

        res.json({
            success: true,
            message: 'Shipping details updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Error updating shipping details:', error);
        res.status(500).json({
            message: 'Error updating shipping details',
            error: error.message
        });
    }
}; 