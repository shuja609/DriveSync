const Feedback = require('../models/Feedback');
const { validationResult } = require('express-validator');

const feedbackController = {
    // Get all feedback items (with pagination and filters)
    getAllFeedback: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const type = req.query.type;
            const priority = req.query.priority;

            let query = {};
            if (status) query.status = status;
            if (type) query.type = type;
            if (priority) query.priority = priority;

            const feedback = await Feedback.find(query)
                .populate('userId', 'name email')
                .populate('respondedBy', 'name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const total = await Feedback.countDocuments(query);

            res.json({
                feedback,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching feedback', error: error.message });
        }
    },

    // Get single feedback by ID
    getFeedbackById: async (req, res) => {
        try {
            const feedback = await Feedback.findById(req.params.id)
                .populate('userId', 'name email')
                .populate('respondedBy', 'name');

            if (!feedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }

            res.json(feedback);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching feedback', error: error.message });
        }
    },

    // Create new feedback
    createFeedback: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const feedback = new Feedback({
                userId: req.user.id,
                ...req.body
            });

            await feedback.save();
            res.status(201).json(feedback);
        } catch (error) {
            res.status(500).json({ message: 'Error creating feedback', error: error.message });
        }
    },

    // Update feedback status
    updateFeedbackStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const feedback = await Feedback.findById(req.params.id);

            if (!feedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }

            feedback.status = status;
            await feedback.save();

            res.json(feedback);
        } catch (error) {
            res.status(500).json({ message: 'Error updating feedback status', error: error.message });
        }
    },

    // Respond to feedback
    respondToFeedback: async (req, res) => {
        try {
            const { response } = req.body;
            const feedback = await Feedback.findById(req.params.id);

            if (!feedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }

            feedback.response = response;
            feedback.respondedBy = req.user.id;
            feedback.respondedAt = new Date();
            feedback.status = 'Closed';

            await feedback.save();

            res.json(feedback);
        } catch (error) {
            res.status(500).json({ message: 'Error responding to feedback', error: error.message });
        }
    },

    // Update feedback priority
    updateFeedbackPriority: async (req, res) => {
        try {
            const { priority } = req.body;
            const feedback = await Feedback.findById(req.params.id);

            if (!feedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }

            feedback.priority = priority;
            await feedback.save();

            res.json(feedback);
        } catch (error) {
            res.status(500).json({ message: 'Error updating feedback priority', error: error.message });
        }
    }
};

module.exports = feedbackController; 