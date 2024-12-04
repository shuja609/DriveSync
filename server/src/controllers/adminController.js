const User = require('../models/User');
const { validateUser } = require('../utils/validators');
const bcrypt = require('bcryptjs');

const adminController = {
    // Get all users with filters
    async getUsers(req, res) {
        try {
            const { search, role, status } = req.query;
            let query = {};

            // Apply filters
            if (search) {
                query.$or = [
                    { 'name.first': new RegExp(search, 'i') },
                    { 'name.last': new RegExp(search, 'i') },
                    { email: new RegExp(search, 'i') }
                ];
            }
            if (role && role !== 'all') {
                query.role = role;
            }
            if (status && status !== 'all') {
                query.isActive = status === 'active';
            }

            const users = await User.find(query)
                .select('-password')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                users: users.map(user => ({
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    role: user.role,
                    status: user.isActive ? 'active' : 'inactive',
                    lastLogin: user.lastLogin || user.createdAt,
                    createdAt: user.createdAt
                }))
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching users'
            });
        }
    },

    // Create new user
    async createUser(req, res) {
        try {
            const { name, email, password, role } = req.body;

            // Validate required fields
            if (!name || !name.first || !name.last) {
                return res.status(400).json({
                    success: false,
                    message: 'First and last name are required'
                });
            }

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
            }

            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: 'Password is required'
                });
            }

            // Check if email exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = new User({
                name: {
                    first: name.first,
                    last: name.last
                },
                email,
                password: hashedPassword,
                role: role || 'user',
                isVerified: true // Admin-created users are auto-verified
            });

            await user.save();

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user: {
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: error.message
            });
        }
    },

    // Update user
    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const updates = req.body;

            // Remove sensitive fields
            delete updates.password;
            delete updates.email; // Email changes should be handled separately

            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User updated successfully',
                user: {
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    role: user.role,
                    status: user.isActive ? 'active' : 'inactive'
                }
            });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating user'
            });
        }
    },

    // Delete user
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            // Prevent deleting self
            if (userId === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete your own account'
                });
            }

            const user = await User.findByIdAndDelete(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting user'
            });
        }
    },

    // Update user role
    async updateUserRole(req, res) {
        try {
            const { userId } = req.params;
            const { role } = req.body;

            // Validate role
            if (!['admin', 'sales', 'user'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role'
                });
            }

            const user = await User.findByIdAndUpdate(
                userId,
                { role },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User role updated successfully',
                user
            });
        } catch (error) {
            console.error('Update user role error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating user role'
            });
        }
    },

    // Update user status
    async updateUserStatus(req, res) {
        try {
            const { userId } = req.params;
            const { status } = req.body;

            const user = await User.findByIdAndUpdate(
                userId,
                { isActive: status === 'active' },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User status updated successfully',
                user
            });
        } catch (error) {
            console.error('Update user status error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating user status'
            });
        }
    }
};

module.exports = adminController; 