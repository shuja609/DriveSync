const User = require('../models/User');
const Order = require('../models/Order');
const Vehicle = require('../models/Vehicle');
const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// Helper function to calculate age percentage
const calculateAgePercentage = (ages, minAge, maxAge) => {
    const inRange = ages.filter(age => age >= minAge && age <= maxAge).length;
    return ages.length > 0 ? ((inRange / ages.length) * 100).toFixed(1) : 0;
};

// Helper function to get date range
const getDateRange = (timeRange) => {
    const now = new Date();
    const start = new Date(now);
    const currentPeriodStart = new Date(now);
    const previousPeriodStart = new Date(now);
    const previousPeriodEnd = new Date(now);

    switch (timeRange) {
        case 'week':
            start.setDate(now.getDate() - 7);
            currentPeriodStart.setDate(now.getDate() - 7);
            previousPeriodStart.setDate(now.getDate() - 14);
            previousPeriodEnd.setDate(now.getDate() - 7);
            break;
        case 'month':
            start.setMonth(now.getMonth() - 1);
            currentPeriodStart.setMonth(now.getMonth() - 1);
            previousPeriodStart.setMonth(now.getMonth() - 2);
            previousPeriodEnd.setMonth(now.getMonth() - 1);
            break;
        case 'quarter':
            start.setMonth(now.getMonth() - 3);
            currentPeriodStart.setMonth(now.getMonth() - 3);
            previousPeriodStart.setMonth(now.getMonth() - 6);
            previousPeriodEnd.setMonth(now.getMonth() - 3);
            break;
        case 'year':
            start.setFullYear(now.getFullYear() - 1);
            currentPeriodStart.setFullYear(now.getFullYear() - 1);
            previousPeriodStart.setFullYear(now.getFullYear() - 2);
            previousPeriodEnd.setFullYear(now.getFullYear() - 1);
            break;
        default:
            start.setMonth(now.getMonth() - 1);
            currentPeriodStart.setMonth(now.getMonth() - 1);
            previousPeriodStart.setMonth(now.getMonth() - 2);
            previousPeriodEnd.setMonth(now.getMonth() - 1);
    }

    return {
        now,
        start,
        currentPeriodStart,
        previousPeriodStart,
        previousPeriodEnd
    };
};

// Calculate sales trend
const calculateSalesTrend = (currentPeriodOrders, previousPeriodOrders) => {
    const currentSales = currentPeriodOrders.length;
    const previousSales = previousPeriodOrders.length;
    return previousSales === 0 
        ? 100 
        : ((currentSales - previousSales) / previousSales * 100).toFixed(2);
};

// Generate monthly data for charts
const generateMonthlyData = async (startDate, endDate) => {
    const monthlyOrders = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                status: 'completed'
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 },
                revenue: { $sum: "$amount" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // Get last 6 months
    const labels = [];
    const salesValues = [];
    const revenueValues = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
        
        const monthData = monthlyOrders.find(m => m._id === monthKey) || { count: 0, revenue: 0 };
        
        labels.push(date.toLocaleString('default', { month: 'short' }));
        salesValues.push(monthData.count);
        revenueValues.push(monthData.revenue);
    }

    return {
        labels,
        salesValues,
        revenueValues
    };
};

exports.getAnalytics = async (req, res) => {
    try {
        const { timeRange } = req.query;
        const dates = getDateRange(timeRange);
        const { now, start, currentPeriodStart, previousPeriodStart, previousPeriodEnd } = dates;

        // Get user metrics
        const totalUsers = await User.countDocuments();
        const newUsers = await User.countDocuments({
            createdAt: { $gte: start, $lte: now }
        });
        const activeUsers = await User.countDocuments({
            lastLoginAt: { $gte: start, $lte: now }
        });

        // Get vehicle metrics
        const totalVehicles = await Vehicle.countDocuments();
        const vehicles = await Vehicle.find();
        const averagePrice = totalVehicles > 0 
            ? vehicles.reduce((acc, curr) => acc + (curr.price || 0), 0) / totalVehicles 
            : 0;
        const soldVehicles = await Vehicle.countDocuments({
            status: 'sold',
            updatedAt: { $gte: start, $lte: now }
        });

        // Get all orders for the entire period
        const orders = await Order.find({
            createdAt: { $gte: previousPeriodStart, $lte: now },
            status: 'completed'
        }).populate('vehicle customer');

        // Split orders into current and previous periods
        const currentPeriodOrders = orders.filter(order => 
            order.createdAt >= currentPeriodStart && order.createdAt <= now
        );
        const previousPeriodOrders = orders.filter(order => 
            order.createdAt >= previousPeriodStart && order.createdAt <= previousPeriodEnd
        );

        // Calculate revenue metrics
        const totalRevenue = currentPeriodOrders.reduce((acc, curr) => acc + curr.amount, 0);
        const previousRevenue = previousPeriodOrders.reduce((acc, curr) => acc + curr.amount, 0);
        const averageOrderValue = currentPeriodOrders.length > 0 ? totalRevenue / currentPeriodOrders.length : 0;
        const revenueChange = previousRevenue === 0 
            ? 100 
            : ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(2);

        // Calculate sales trend
        const salesTrend = calculateSalesTrend(currentPeriodOrders, previousPeriodOrders);

        // Calculate top selling vehicles
        const vehicleSales = {};
        currentPeriodOrders.forEach(order => {
            if (order.vehicle) {
                const vehicleId = order.vehicle._id.toString();
                if (!vehicleSales[vehicleId]) {
                    vehicleSales[vehicleId] = {
                        name: `${order.vehicle.brand} ${order.vehicle.model} ${order.vehicle.year}`,
                        sales: 0,
                        revenue: 0
                    };
                }
                vehicleSales[vehicleId].sales++;
                vehicleSales[vehicleId].revenue += order.amount;
            }
        });

        const topVehicles = Object.values(vehicleSales)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        // Calculate customer demographics
        const customerAges = currentPeriodOrders
            .filter(order => order.customer && order.customer.dob)
            .map(order => {
                const dob = new Date(order.customer.dob);
                const age = new Date().getFullYear() - dob.getFullYear();
                return age;
            });

        const demographics = [
            {
                category: '18-24',
                percentage: calculateAgePercentage(customerAges, 18, 24)
            },
            {
                category: '25-34',
                percentage: calculateAgePercentage(customerAges, 25, 34)
            },
            {
                category: '35-44',
                percentage: calculateAgePercentage(customerAges, 35, 44)
            },
            {
                category: '45-54',
                percentage: calculateAgePercentage(customerAges, 45, 54)
            },
            {
                category: '55+',
                percentage: calculateAgePercentage(customerAges, 55, 150)
            }
        ];

        // Calculate sales by region
        const regionalSales = {};
        currentPeriodOrders.forEach(order => {
            if (order.customer && order.customer.address && order.customer.address.region) {
                const region = order.customer.address.region;
                if (!regionalSales[region]) {
                    regionalSales[region] = 0;
                }
                regionalSales[region] += order.amount;
            }
        });

        const formattedRegionalSales = Object.entries(regionalSales)
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales);

        // Get performance metrics
        const transactions = await Transaction.find({
            createdAt: { $gte: start, $lte: now }
        });
        const successfulTransactions = transactions.filter(t => t.status === 'successful');
        const successRate = (successfulTransactions.length / transactions.length) * 100 || 0;

        // Calculate system health based on successful transactions
        const systemHealth = Math.min(100, (successRate + 100) / 2);

        // Calculate average response time from transactions (assuming there's a responseTime field)
        const avgResponseTime = transactions.length > 0
            ? transactions.reduce((acc, curr) => acc + (curr.responseTime || 250), 0) / transactions.length
            : 250;

        // Generate chart data
        const chartData = await generateMonthlyData(
            new Date(now.getFullYear(), now.getMonth() - 5, 1), // Start from 6 months ago
            now
        );

        // Prepare response data
        const analyticsData = {
            userMetrics: {
                totalUsers,
                newUsers,
                activeUsers,
                growthRate: ((newUsers / totalUsers) * 100 || 0).toFixed(2),
                engagementRate: ((activeUsers / totalUsers) * 100 || 0).toFixed(2)
            },
            vehicleMetrics: {
                totalVehicles,
                averagePrice: averagePrice || 0,
                salesRate: ((soldVehicles / totalVehicles) * 100 || 0).toFixed(2),
                salesTrend,
                inventoryLevel: (((totalVehicles - soldVehicles) / totalVehicles) * 100 || 0).toFixed(2)
            },
            revenueMetrics: {
                totalRevenue,
                averageOrderValue,
                revenueChange,
                targetProgress: (totalRevenue / (previousRevenue * 2) * 100).toFixed(2) // Dynamic target based on previous period
            },
            performanceMetrics: {
                successRate: successRate.toFixed(2),
                errorRate: (100 - successRate).toFixed(2),
                avgResponseTime,
                systemHealth,
                services: [
                    { 
                        name: 'API', 
                        status: successRate > 90 ? 'operational' : successRate > 70 ? 'degraded' : 'down'
                    },
                    { 
                        name: 'Database', 
                        status: systemHealth > 90 ? 'operational' : systemHealth > 70 ? 'degraded' : 'down'
                    },
                    { 
                        name: 'Storage', 
                        status: 'operational'
                    },
                    { 
                        name: 'Email', 
                        status: 'operational'
                    }
                ]
            },
            salesData: {
                labels: chartData.labels,
                values: chartData.salesValues
            },
            revenueData: {
                labels: chartData.labels,
                values: chartData.revenueValues
            },
            topVehicles: topVehicles || [],
            demographics: demographics || [],
            regionalSales: formattedRegionalSales || []
        };

        res.json(analyticsData);
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics data' });
    }
};

exports.exportData = async (req, res) => {
    try {
        const { timeRange, format } = req.query;
        const dates = getDateRange(timeRange);
        const { now, start, currentPeriodStart, previousPeriodStart, previousPeriodEnd } = dates;

        // Fetch all necessary data
        const [users, orders, vehicles, transactions] = await Promise.all([
            User.find({ createdAt: { $gte: start, $lte: now } })
                .select('name email createdAt lastLoginAt'),
            Order.find({ createdAt: { $gte: start, $lte: now } })
                .populate('customer', 'name email')
                .populate('vehicle', 'brand model year price'),
            Vehicle.find({ createdAt: { $gte: start, $lte: now } })
                .select('brand model year price status'),
            Transaction.find({ createdAt: { $gte: start, $lte: now } })
                .select('amount status createdAt')
        ]);

        // Calculate metrics
        const metrics = {
            users: {
                total: users.length,
                active: users.filter(u => u.lastLoginAt >= start).length
            },
            orders: {
                total: orders.length,
                revenue: orders.reduce((acc, curr) => acc + curr.amount, 0),
                averageValue: orders.length > 0 ? orders.reduce((acc, curr) => acc + curr.amount, 0) / orders.length : 0
            },
            vehicles: {
                total: vehicles.length,
                available: vehicles.filter(v => v.status === 'available').length,
                sold: vehicles.filter(v => v.status === 'sold').length,
                averagePrice: vehicles.length > 0 ? vehicles.reduce((acc, curr) => acc + curr.price, 0) / vehicles.length : 0
            },
            transactions: {
                total: transactions.length,
                successful: transactions.filter(t => t.status === 'successful').length,
                failed: transactions.filter(t => t.status === 'failed').length,
                totalAmount: transactions.reduce((acc, curr) => acc + curr.amount, 0)
            }
        };

        // Get monthly data for charts
        const chartData = await generateMonthlyData(start, now);

        if (format === 'csv') {
            // Prepare CSV data
            const csvData = [];

            // Add summary section
            csvData.push(['Analytics Report Summary', `Period: ${timeRange}`]);
            csvData.push(['Generated At', new Date().toISOString()]);
            csvData.push([]);

            // Add metrics section
            csvData.push(['Metrics Summary']);
            csvData.push(['Category', 'Metric', 'Value']);
            csvData.push(
                ['Users', 'Total Users', metrics.users.total],
                ['Users', 'Active Users', metrics.users.active],
                ['Orders', 'Total Orders', metrics.orders.total],
                ['Orders', 'Total Revenue', `$${metrics.orders.revenue.toFixed(2)}`],
                ['Orders', 'Average Order Value', `$${metrics.orders.averageValue.toFixed(2)}`],
                ['Vehicles', 'Total Vehicles', metrics.vehicles.total],
                ['Vehicles', 'Available Vehicles', metrics.vehicles.available],
                ['Vehicles', 'Sold Vehicles', metrics.vehicles.sold],
                ['Vehicles', 'Average Price', `$${metrics.vehicles.averagePrice.toFixed(2)}`],
                ['Transactions', 'Total Transactions', metrics.transactions.total],
                ['Transactions', 'Successful Transactions', metrics.transactions.successful],
                ['Transactions', 'Failed Transactions', metrics.transactions.failed],
                ['Transactions', 'Total Transaction Amount', `$${metrics.transactions.totalAmount.toFixed(2)}`]
            );
            csvData.push([]);

            // Add monthly trends
            csvData.push(['Monthly Trends']);
            csvData.push(['Month', 'Sales Count', 'Revenue']);
            chartData.labels.forEach((month, index) => {
                csvData.push([
                    month,
                    chartData.salesValues[index],
                    `$${chartData.revenueValues[index].toFixed(2)}`
                ]);
            });
            csvData.push([]);

            // Add recent orders
            csvData.push(['Recent Orders']);
            csvData.push(['Date', 'Customer', 'Vehicle', 'Amount']);
            orders.slice(0, 10).forEach(order => {
                csvData.push([
                    order.createdAt.toISOString(),
                    `${order.customer.name.first} ${order.customer.name.last}`,
                    `${order.vehicle.brand} ${order.vehicle.model} ${order.vehicle.year}`,
                    `$${order.amount.toFixed(2)}`
                ]);
            });

            // Generate CSV
            const parser = new Parser();
            const csv = parser.parse(csvData);
            
            res.header('Content-Type', 'text/csv');
            res.attachment(`analytics_${timeRange}_${new Date().toISOString()}.csv`);
            return res.send(csv);

        } else if (format === 'pdf') {
            // Generate PDF
            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.attachment(`analytics_${timeRange}_${new Date().toISOString()}.pdf`);
            
            doc.pipe(res);

            // Title
            doc.fontSize(25).text('Analytics Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Period: ${timeRange}`, { align: 'center' });
            doc.moveDown();

            // Metrics Summary
            doc.fontSize(16).text('Metrics Summary', { underline: true });
            doc.moveDown();

            // Users Section
            doc.fontSize(14).text('Users');
            doc.fontSize(10)
                .text(`Total Users: ${metrics.users.total}`)
                .text(`Active Users: ${metrics.users.active}`);
            doc.moveDown();

            // Orders Section
            doc.fontSize(14).text('Orders');
            doc.fontSize(10)
                .text(`Total Orders: ${metrics.orders.total}`)
                .text(`Total Revenue: $${metrics.orders.revenue.toFixed(2)}`)
                .text(`Average Order Value: $${metrics.orders.averageValue.toFixed(2)}`);
            doc.moveDown();

            // Vehicles Section
            doc.fontSize(14).text('Vehicles');
            doc.fontSize(10)
                .text(`Total Vehicles: ${metrics.vehicles.total}`)
                .text(`Available Vehicles: ${metrics.vehicles.available}`)
                .text(`Sold Vehicles: ${metrics.vehicles.sold}`)
                .text(`Average Price: $${metrics.vehicles.averagePrice.toFixed(2)}`);
            doc.moveDown();

            // Transactions Section
            doc.fontSize(14).text('Transactions');
            doc.fontSize(10)
                .text(`Total Transactions: ${metrics.transactions.total}`)
                .text(`Successful Transactions: ${metrics.transactions.successful}`)
                .text(`Failed Transactions: ${metrics.transactions.failed}`)
                .text(`Total Transaction Amount: $${metrics.transactions.totalAmount.toFixed(2)}`);
            doc.moveDown();

            // Monthly Trends
            doc.fontSize(16).text('Monthly Trends', { underline: true });
            doc.moveDown();
            
            const tableData = [['Month', 'Sales', 'Revenue']];
            chartData.labels.forEach((month, index) => {
                tableData.push([
                    month,
                    chartData.salesValues[index].toString(),
                    `$${chartData.revenueValues[index].toFixed(2)}`
                ]);
            });

            // Draw table
            let yPosition = doc.y;
            const cellPadding = 5;
            const columnWidth = 150;

            tableData.forEach((row, rowIndex) => {
                row.forEach((cell, columnIndex) => {
                    doc.text(cell, 
                        doc.x + (columnWidth * columnIndex) + cellPadding,
                        yPosition,
                        { width: columnWidth - (cellPadding * 2) }
                    );
                });
                yPosition += 20;
                if (rowIndex === 0) {
                    doc.moveTo(doc.x, yPosition)
                       .lineTo(doc.x + (columnWidth * 3), yPosition)
                       .stroke();
                    yPosition += 10;
                }
            });

            // Recent Orders
            doc.addPage();
            doc.fontSize(16).text('Recent Orders', { underline: true });
            doc.moveDown();

            orders.slice(0, 10).forEach((order, index) => {
                doc.fontSize(10)
                    .text(`${index + 1}. ${order.createdAt.toLocaleDateString()}`)
                    .text(`   Customer: ${order.customer.name.first} ${order.customer.name.last}`)
                    .text(`   Vehicle: ${order.vehicle.brand} ${order.vehicle.model} ${order.vehicle.year}`)
                    .text(`   Amount: $${order.amount.toFixed(2)}`)
                    .moveDown(0.5);
            });

            doc.end();
        } else {
            throw new Error('Unsupported format');
        }
    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ message: 'Failed to export data' });
    }
};

exports.getMetricData = async (req, res) => {
    try {
        const { metricType, timeRange } = req.query;
        const { start, now } = getDateRange(timeRange);

        let data;
        switch (metricType) {
            case 'users':
                data = await User.aggregate([
                    { $match: { createdAt: { $gte: start, $lte: now } } },
                    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
                    { $sort: { '_id': 1 } }
                ]);
                break;
            case 'revenue':
                data = await Order.aggregate([
                    { $match: { createdAt: { $gte: start, $lte: now }, status: 'completed' } },
                    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$amount' } } },
                    { $sort: { '_id': 1 } }
                ]);
                break;
            default:
                throw new Error('Invalid metric type');
        }

        res.json(data);
    } catch (error) {
        console.error('Metric Error:', error);
        res.status(500).json({ message: 'Failed to fetch metric data' });
    }
};

exports.generateReport = async (req, res) => {
    try {
        const { reportConfig } = req.body;
        const { start, now } = getDateRange(reportConfig.timeRange);

        // Generate report based on config
        const reportData = {
            timeRange: reportConfig.timeRange,
            generatedAt: new Date(),
            metrics: {}
        };

        // Add requested metrics
        if (reportConfig.includeUsers) {
            reportData.metrics.users = {
                total: await User.countDocuments(),
                new: await User.countDocuments({ createdAt: { $gte: start, $lte: now } })
            };
        }

        if (reportConfig.includeOrders) {
            const orders = await Order.find({ createdAt: { $gte: start, $lte: now } });
            reportData.metrics.orders = {
                total: orders.length,
                revenue: orders.reduce((acc, curr) => acc + curr.amount, 0)
            };
        }

        if (reportConfig.includeVehicles) {
            reportData.metrics.vehicles = {
                total: await Vehicle.countDocuments(),
                sold: await Vehicle.countDocuments({ status: 'sold', updatedAt: { $gte: start, $lte: now } })
            };
        }

        res.json(reportData);
    } catch (error) {
        console.error('Report Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
}; 