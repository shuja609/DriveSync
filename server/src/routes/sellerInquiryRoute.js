const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect, salesOnly } = require('../middleware/authMiddleware');

// Get all inquiries (with filters)
router.get('/', protect, salesOnly, async (req, res) => {
    try {
        const { status, priority } = req.query;
        const filters = {};

        if (status) filters.status = status;
        if (priority) filters.priority = priority;

        const inquiries = await Inquiry.find(filters)
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json({ inquiries });
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ message: 'Error fetching inquiries' });
    }
});

// Get a single inquiry
router.get('/:id', protect, salesOnly, async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id)
            .populate('userId', 'firstName lastName email')
            .populate('responses.responderId', 'firstName lastName');

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        console.error('Error fetching inquiry:', error);
        res.status(500).json({ message: 'Error fetching inquiry' });
    }
});

// Update inquiry status
router.patch('/:id/status', protect, salesOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId', 'firstName lastName email');

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        console.error('Error updating inquiry status:', error);
        res.status(500).json({ message: 'Error updating inquiry status' });
    }
});

// Update inquiry priority
router.patch('/:id/priority', protect, salesOnly, async (req, res) => {
    try {
        const { priority } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { priority },
            { new: true }
        ).populate('userId', 'firstName lastName email');

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        console.error('Error updating inquiry priority:', error);
        res.status(500).json({ message: 'Error updating inquiry priority' });
    }
});

// Add response to inquiry
router.post('/:id/respond', protect, salesOnly, async (req, res) => {
    try {
        const { message } = req.body;
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        inquiry.responses.push({
            responderId: req.user._id,
            message,
            timestamp: new Date()
        });

        // Update status to 'in_progress' if it was 'pending'
        if (inquiry.status === 'pending') {
            inquiry.status = 'in_progress';
        }

        await inquiry.save();

        // Populate the updated inquiry
        const updatedInquiry = await Inquiry.findById(req.params.id)
            .populate('userId', 'firstName lastName email')
            .populate('responses.responderId', 'firstName lastName');

        res.json(updatedInquiry);
    } catch (error) {
        console.error('Error responding to inquiry:', error);
        res.status(500).json({ message: 'Error responding to inquiry' });
    }
});

module.exports = router; 