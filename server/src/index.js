const adminRoutes = require('./routes/adminRoute');
const vehicleRoutes = require('./routes/vehicleRoute');

// Add this with other route middleware
app.use('/api/admin', adminRoutes);
app.use('/api/vehicles', vehicleRoutes); 