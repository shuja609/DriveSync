const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');

const getDashboardStats = async (req, res) => {
    try {
        // Get total counts
        const [
            totalUsers,
            totalVehicles,
            totalReviews,
            totalOrders,
            totalBookings,
            totalInquiries
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Vehicle.countDocuments(),
            Review.countDocuments(),
            Order.countDocuments(),
            Booking.countDocuments(),
            Inquiry.countDocuments()
        ]);

        // Get recent statistics (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            recentUsers,
            recentOrders,
            recentBookings,
            recentInquiries
        ] = await Promise.all([
            User.countDocuments({ 
                role: 'user',
                createdAt: { $gte: thirtyDaysAgo }
            }),
            Order.countDocuments({ 
                createdAt: { $gte: thirtyDaysAgo }
            }),
            Booking.countDocuments({ 
                createdAt: { $gte: thirtyDaysAgo }
            }),
            Inquiry.countDocuments({ 
                createdAt: { $gte: thirtyDaysAgo }
            })
        ]);

        // Calculate trends (percentage increase from previous 30 days)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const [
            previousUsers,
            previousOrders,
            previousBookings,
            previousInquiries
        ] = await Promise.all([
            User.countDocuments({ 
                role: 'user',
                createdAt: { 
                    $gte: sixtyDaysAgo,
                    $lt: thirtyDaysAgo
                }
            }),
            Order.countDocuments({ 
                createdAt: { 
                    $gte: sixtyDaysAgo,
                    $lt: thirtyDaysAgo
                }
            }),
            Booking.countDocuments({ 
                createdAt: { 
                    $gte: sixtyDaysAgo,
                    $lt: thirtyDaysAgo
                }
            }),
            Inquiry.countDocuments({ 
                createdAt: { 
                    $gte: sixtyDaysAgo,
                    $lt: thirtyDaysAgo
                }
            })
        ]);

        // Calculate percentage changes
        const calculateTrend = (recent, previous) => {
            if (previous === 0) return recent > 0 ? 100 : 0;
            return ((recent - previous) / previous * 100).toFixed(1);
        };

        // Get recent activities with proper field names
        const [orders, inquiries, bookings] = await Promise.all([
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate({
                    path: 'userId',
                    select: 'name'
                })
                .populate({
                    path: 'vehicleId',
                    select: 'title brand model year'
                }),
            Inquiry.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate({
                    path: 'userId',
                    select: 'name'
                })
                .populate({
                    path: 'vehicleId',
                    select: 'title brand model year'
                }),
            Booking.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate({
                    path: 'userId',
                    select: 'name'
                })
                .populate({
                    path: 'vehicleId',
                    select: 'title brand model year'
                })
        ]);

        // Format activities with null checks
        const formatActivities = (activities, type) => {
            return activities.map(activity => ({
                id: activity._id,
                type,
                userName: activity.userId?.name?.first 
                    ? `${activity.userId.name.first} ${activity.userId.name.last}` 
                    : 'Unknown User',
                vehicleName: activity.vehicleId
                    ? `${activity.vehicleId.title} ${activity.vehicleId.brand} ${activity.vehicleId.model} ${activity.vehicleId.year}`
                    : 'Unknown Vehicle',
                date: activity.createdAt
            }));
        };

        const allActivities = [
            ...formatActivities(orders, 'order'),
            ...formatActivities(inquiries, 'inquiry'),
            ...formatActivities(bookings, 'booking')
        ].sort((a, b) => b.date - a.date).slice(0, 10);

        res.json({
            success: true,
            data: {
                totals: {
                    users: totalUsers,
                    vehicles: totalVehicles,
                    reviews: totalReviews,
                    orders: totalOrders,
                    bookings: totalBookings,
                    inquiries: totalInquiries
                },
                trends: {
                    users: calculateTrend(recentUsers, previousUsers),
                    orders: calculateTrend(recentOrders, previousOrders),
                    bookings: calculateTrend(recentBookings, previousBookings),
                    inquiries: calculateTrend(recentInquiries, previousInquiries)
                },
                recentActivities: allActivities
            }
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics'
        });
    }
};

module.exports = {
    getDashboardStats
}; 