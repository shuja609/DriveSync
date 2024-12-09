const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');
const { protect, salesOnly } = require('../middleware/authMiddleware');

// Get all discounts (with filters)
router.get('/', protect, salesOnly, async (req, res) => {
    try {
        const { status, type } = req.query;
        const filters = {};

        if (status) filters.status = status;
        if (type) filters.type = type;

        const discounts = await Discount.find(filters)
            .populate('applicableVehicles', 'make model year')
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name')
            .sort({ createdAt: -1 });

        res.json({ discounts });
    } catch (error) {
        console.error('Error fetching discounts:', error);
        res.status(500).json({ message: 'Error fetching discounts' });
    }
});

// Get discount statistics
router.get('/stats', protect, salesOnly, async (req, res) => {
    try {
        const stats = await Discount.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalUsed: { $sum: '$usedCount' }
                }
            }
        ]);

        const activeDiscounts = await Discount.countDocuments({ status: 'active' });
        const expiredDiscounts = await Discount.countDocuments({ status: 'expired' });
        const inactiveDiscounts = await Discount.countDocuments({ status: 'inactive' });

        res.json({
            stats,
            summary: {
                active: activeDiscounts,
                expired: expiredDiscounts,
                inactive: inactiveDiscounts,
                total: activeDiscounts + expiredDiscounts + inactiveDiscounts
            }
        });
    } catch (error) {
        console.error('Error fetching discount statistics:', error);
        res.status(500).json({ message: 'Error fetching discount statistics' });
    }
});

// Get a single discount
router.get('/:id', protect, salesOnly, async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id)
            .populate('applicableVehicles', 'make model year')
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name');

        if (!discount) {
            return res.status(404).json({ message: 'Discount not found' });
        }

        res.json(discount);
    } catch (error) {
        console.error('Error fetching discount:', error);
        res.status(500).json({ message: 'Error fetching discount' });
    }
});

// Create a new discount
router.post('/', protect, salesOnly, async (req, res) => {
    try {
        const discountData = {
            ...req.body,
            createdBy: req.user.id
        };

        const discount = new Discount(discountData);
        await discount.save();

        const populatedDiscount = await Discount.findById(discount._id)
            .populate('applicableVehicles', 'make model year')
            .populate('createdBy', 'name');

        res.status(201).json(populatedDiscount);
    } catch (error) {
        console.error('Error creating discount:', error);
        res.status(500).json({ message: 'Error creating discount' });
    }
});

// Update a discount
router.put('/:id', protect, salesOnly, async (req, res) => {
    try {
        const discountData = {
            ...req.body,
            updatedBy: req.user.id
        };

        const discount = await Discount.findByIdAndUpdate(
            req.params.id,
            discountData,
            { new: true }
        )
        .populate('applicableVehicles', 'make model year')
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name');

        if (!discount) {
            return res.status(404).json({ message: 'Discount not found' });
        }

        res.json(discount);
    } catch (error) {
        console.error('Error updating discount:', error);
        res.status(500).json({ message: 'Error updating discount' });
    }
});

// Update discount status
router.patch('/:id/status', protect, salesOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const discount = await Discount.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                updatedBy: req.user.id
            },
            { new: true }
        )
        .populate('applicableVehicles', 'make model year')
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name');

        if (!discount) {
            return res.status(404).json({ message: 'Discount not found' });
        }

        res.json(discount);
    } catch (error) {
        console.error('Error updating discount status:', error);
        res.status(500).json({ message: 'Error updating discount status' });
    }
});

// Delete a discount
router.delete('/:id', protect, salesOnly, async (req, res) => {
    try {
        const discount = await Discount.findByIdAndDelete(req.params.id);

        if (!discount) {
            return res.status(404).json({ message: 'Discount not found' });
        }

        res.json({ message: 'Discount deleted successfully' });
    } catch (error) {
        console.error('Error deleting discount:', error);
        res.status(500).json({ message: 'Error deleting discount' });
    }
});

module.exports = router; 