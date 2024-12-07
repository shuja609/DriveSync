const Inquiry = require('../models/Inquiry');
const notificationService = require('../services/notificationService');

// Create a new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const { vehicleId, subject, message, contactInfo } = req.body;

        const inquiry = new Inquiry({
            userId: req.user.id,
            vehicleId,
            subject,
            message,
            contactInfo
        });

        await inquiry.save();

        // Send confirmation notification
        const notification = await notificationService.sendInquiryConfirmation(inquiry);
        
        if (notification.success) {
            inquiry.notificationsSent.push({
                type: 'email',
                status: 'success',
                timestamp: new Date()
            });
            await inquiry.save();
        }

        res.status(201).json({
            success: true,
            message: 'Inquiry submitted successfully',
            data: inquiry
        });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting inquiry',
            error: error.message
        });
    }
};

// Get user's inquiries
exports.getUserInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ userId: req.user.id })
            .populate('vehicleId', 'make model year images')
            .sort('-createdAt');

        res.json({
            success: true,
            data: inquiries
        });
    } catch (error) {
        console.error('Error fetching user inquiries:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching inquiries',
            error: error.message
        });
    }
};

// Add response to inquiry (admin only)
exports.addResponse = async (req, res) => {
    try {
        const { message } = req.body;
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        inquiry.responses.push({
            responderId: req.user.id,
            message
        });

        inquiry.status = 'in_progress';
        await inquiry.save();

        // Send response notification
        const notification = await notificationService.sendInquiryResponse(inquiry, {
            message
        });
        
        if (notification.success) {
            inquiry.notificationsSent.push({
                type: 'email',
                status: 'success',
                timestamp: new Date()
            });
            await inquiry.save();
        }

        res.json({
            success: true,
            message: 'Response added successfully',
            data: inquiry
        });
    } catch (error) {
        console.error('Error adding response:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding response',
            error: error.message
        });
    }
};

// Update inquiry status (admin only)
exports.updateStatus = async (req, res) => {
    try {
        const { status, priority } = req.body;
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        if (status) inquiry.status = status;
        if (priority) inquiry.priority = priority;

        await inquiry.save();

        res.json({
            success: true,
            message: 'Inquiry updated successfully',
            data: inquiry
        });
    } catch (error) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating inquiry',
            error: error.message
        });
    }
};

// Get all inquiries (admin only)
exports.getAllInquiries = async (req, res) => {
    try {
        const { status, priority, vehicleId } = req.query;
        const query = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (vehicleId) query.vehicleId = vehicleId;

        const inquiries = await Inquiry.find(query)
            .populate('userId', 'name email')
            .populate('vehicleId', 'make model year images')
            .sort('-createdAt');

        res.json({
            success: true,
            data: inquiries
        });
    } catch (error) {
        console.error('Error fetching all inquiries:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching inquiries',
            error: error.message
        });
    }
}; 