const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const notificationService = require('../services/notificationService');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { vehicleId, type, date, time, contactInfo, location, paymentMethod, duration, notes } = req.body;

        // Check if vehicle exists and is available
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
            vehicleId,
            date,
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        // Create booking
        const booking = new Booking({
            userId: req.user.id,
            vehicleId,
            type,
            date,
            time,
            contactInfo,
            location,
            paymentMethod,
            duration,
            notes
        });

        await booking.save();

        // Send confirmation notification
        const notification = await notificationService.sendBookingConfirmation(booking);
        
        if (notification.success) {
            booking.notificationsSent.push({
                type: 'email',
                status: 'success',
                timestamp: new Date()
            });
            await booking.save();
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('vehicleId', 'make model year images')
            .sort('-createdAt');

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user has permission
        if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this booking'
            });
        }

        booking.status = status;
        await booking.save();

        // Send status update notification
        const notification = await notificationService.sendStatusUpdate(booking);
        
        if (notification.success) {
            booking.notificationsSent.push({
                type: 'email',
                status: 'success',
                timestamp: new Date()
            });
            await booking.save();
        }

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking status',
            error: error.message
        });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user has permission
        if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        // Send cancellation notification
        const notification = await notificationService.sendStatusUpdate(booking);
        
        if (notification.success) {
            booking.notificationsSent.push({
                type: 'email',
                status: 'success',
                timestamp: new Date()
            });
            await booking.save();
        }

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const { status, type, date } = req.query;
        const query = {};

        if (status) query.status = status;
        if (type) query.type = type;
        if (date) query.date = new Date(date);

        const bookings = await Booking.find(query)
            .populate('userId', 'name email')
            .populate('vehicleId', 'make model year images')
            .sort('-createdAt');

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
}; 