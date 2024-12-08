const User = require('../models/User');

// Get all customers (users with role 'user')
const getCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: customers
        });
    } catch (error) {
        console.error('Get Customers Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching customers'
        });
    }
};

// Get single customer
const getCustomer = async (req, res) => {
    try {
        const customer = await User.findOne({
            _id: req.params.id,
            role: 'user'
        }).select('-password');

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Get Customer Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching customer'
        });
    }
};

// Create new customer
const createCustomer = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create customer with role 'user'
        const customer = await User.create({
            ...req.body,
            role: 'user',
            // Generate a random password that they can reset later
            password: Math.random().toString(36).slice(-8)
        });

        // Remove password from response
        const customerResponse = customer.toObject();
        delete customerResponse.password;

        res.status(201).json({
            success: true,
            data: customerResponse
        });
    } catch (error) {
        console.error('Create Customer Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating customer'
        });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email exists for other users
        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.params.id }
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
        }

        const customer = await User.findOneAndUpdate(
            { _id: req.params.id, role: 'user' },
            { $set: req.body },
            { new: true }
        ).select('-password');

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Update Customer Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating customer'
        });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const customer = await User.findOneAndDelete({
            _id: req.params.id,
            role: 'user'
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        console.error('Delete Customer Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting customer'
        });
    }
};

module.exports = {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
}; 