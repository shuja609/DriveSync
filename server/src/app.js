// Import routes
const orderRoute = require('./routes/orderRoute');
const transactionRoute = require('./routes/transactionRoute');

// Use routes
app.use('/api/orders', orderRoute);
app.use('/api/transactions', transactionRoute); 