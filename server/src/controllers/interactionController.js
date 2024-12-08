const User = require('../models/User');
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');

const getCustomerInteractions = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Get customer details
        const customer = await User.findOne({ _id: customerId, role: 'user' });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        // Get all interactions (orders, bookings, inquiries) for this customer
        const [orders, bookings, inquiries] = await Promise.all([
            Order.find({ userId: customerId })
                .sort({ createdAt: -1 })
                .populate('vehicleId', 'make model year price'),
            Booking.find({ userId: customerId })
                .sort({ createdAt: -1 })
                .populate('vehicleId', 'make model year price'),
            Inquiry.find({ userId: customerId })
                .sort({ createdAt: -1 })
                .populate('vehicleId', 'make model year price')
        ]);

        // Format interactions
        const formatInteractions = (items, type) => {
            return items.map(item => ({
                id: item._id,
                type,
                date: item.createdAt,
                vehicle: item.vehicleId ? {
                    id: item.vehicleId._id,
                    name: `${item.vehicleId.make} ${item.vehicleId.model} ${item.vehicleId.year}`,
                    price: item.vehicleId.price
                } : null,
                status: item.status,
                notes: type === 'order' 
                    ? `Order placed for ${item.vehicleId?.make} ${item.vehicleId?.model}`
                    : type === 'booking' 
                    ? `Test drive scheduled for ${item.vehicleId?.make} ${item.vehicleId?.model}`
                    : `Inquiry about ${item.vehicleId?.make} ${item.vehicleId?.model}`,
                outcome: type === 'order' 
                    ? item.status
                    : type === 'booking'
                    ? item.status
                    : item.status,
                nextAction: type === 'order'
                    ? item.status === 'pending' ? 'Process payment' : 'Complete delivery'
                    : type === 'booking'
                    ? item.status === 'pending' ? 'Confirm appointment' : 'Follow up'
                    : 'Respond to inquiry'
            }));
        };

        // Combine all interactions and sort by date
        const allInteractions = [
            ...formatInteractions(orders, 'order'),
            ...formatInteractions(bookings, 'booking'),
            ...formatInteractions(inquiries, 'inquiry')
        ].sort((a, b) => b.date - a.date);

        res.json({
            success: true,
            data: {
                customer: {
                    id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone
                },
                interactions: allInteractions,
                stats: {
                    totalOrders: orders.length,
                    totalBookings: bookings.length,
                    totalInquiries: inquiries.length
                }
            }
        });
    } catch (error) {
        console.error('Get Customer Interactions Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching customer interactions'
        });
    }
};

module.exports = {
    getCustomerInteractions
}; 