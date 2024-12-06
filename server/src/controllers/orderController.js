const Order = require('../models/Order');
const Vehicle = require('../models/Vehicle');

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'name email')
            .populate('vehicle', 'make model year price')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('vehicle', 'make model year price')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email')
            .populate('vehicle', 'make model year price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is admin or order owner
        if (!req.user.isAdmin && order.customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create order
exports.createOrder = async (req, res) => {
    try {
        const { vehicleId, shippingAddress } = req.body;

        // Check if vehicle exists and is available
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        if (vehicle.status !== 'available') {
            return res.status(400).json({ message: 'Vehicle is not available' });
        }

        const order = new Order({
            customer: req.user._id,
            vehicle: vehicleId,
            amount: vehicle.price,
            shippingAddress,
            status: 'pending',
            paymentStatus: 'pending'
        });

        // Update vehicle status to reserved
        vehicle.status = 'reserved';
        await vehicle.save();

        const savedOrder = await order.save();
        await savedOrder.populate('vehicle', 'make model year price');

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();
        await updatedOrder.populate('customer', 'name email');
        await updatedOrder.populate('vehicle', 'make model year price');

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to cancel
        if (!req.user.isAdmin && order.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if order can be cancelled
        if (order.status === 'completed' || order.status === 'refunded') {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        order.status = 'cancelled';
        
        // Make vehicle available again
        await Vehicle.findByIdAndUpdate(order.vehicle, { status: 'available' });

        const updatedOrder = await order.save();
        await updatedOrder.populate('customer', 'name email');
        await updatedOrder.populate('vehicle', 'make model year price');

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 