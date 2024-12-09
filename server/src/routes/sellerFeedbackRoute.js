const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, salesOnly } = require('../middleware/authMiddleware');

// Get all feedback (with filters)
router.get('/', protect, salesOnly, async (req, res) => {
    try {
        const { status, type, priority } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const filters = {};
        if (status) filters.status = status;
        if (type) filters.type = type;
        if (priority) filters.priority = priority;

        const feedback = await Feedback.find(filters)
            .populate('userId', 'name email')
            .populate('respondedBy', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Feedback.countDocuments(filters);

        res.json({
            feedback,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Error fetching feedback' });
    }
});

// Get feedback statistics
router.get('/stats', protect, salesOnly, async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Feedback.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        const typeStats = await Feedback.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            status: stats,
            priority: priorityStats,
            type: typeStats
        });
    } catch (error) {
        console.error('Error fetching feedback stats:', error);
        res.status(500).json({ message: 'Error fetching feedback statistics' });
    }
});

// Get a single feedback
router.get('/:id', protect, salesOnly, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('respondedBy', 'name');

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Error fetching feedback' });
    }
});

// Update feedback status
router.patch('/:id/status', protect, salesOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                updatedBy: req.user.id
            },
            { new: true }
        )
        .populate('userId', 'name email')
        .populate('respondedBy', 'name');

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.json(feedback);
    } catch (error) {
        console.error('Error updating feedback status:', error);
        res.status(500).json({ message: 'Error updating feedback status' });
    }
});

// Update feedback priority
router.patch('/:id/priority', protect, salesOnly, async (req, res) => {
    try {
        const { priority } = req.body;
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { 
                priority,
                updatedBy: req.user.id
            },
            { new: true }
        )
        .populate('userId', 'name email')
        .populate('respondedBy', 'name');

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.json(feedback);
    } catch (error) {
        console.error('Error updating feedback priority:', error);
        res.status(500).json({ message: 'Error updating feedback priority' });
    }
});

// Respond to feedback
router.patch('/:id/respond', protect, salesOnly, async (req, res) => {
    try {
        const { response } = req.body;
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            {
                response,
                respondedBy: req.user.id,
                respondedAt: new Date(),
                status: 'Closed'
            },
            { new: true }
        )
        .populate('userId', 'name email')
        .populate('respondedBy', 'name');

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.json(feedback);
    } catch (error) {
        console.error('Error responding to feedback:', error);
        res.status(500).json({ message: 'Error responding to feedback' });
    }
});

module.exports = router; 