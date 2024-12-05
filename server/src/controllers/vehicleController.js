const Vehicle = require('../models/Vehicle');

const vehicleController = {
    // Create new vehicle
    async createVehicle(req, res) {
        try {
            const vehicleData = req.body;
            
            // Convert checkbox "on" value to boolean
            if (vehicleData.history && vehicleData.history.serviceRecords === 'on') {
                vehicleData.history.serviceRecords = true;
            }
            
            // Add metadata
            vehicleData.metadata = {
                createdBy: req.user.id
            };

            // Create vehicle
            const vehicle = new Vehicle(vehicleData);
            
            // Validate the vehicle data
            const validationError = vehicle.validateSync();
            if (validationError) {
                console.error('Validation error:', validationError);
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: Object.values(validationError.errors).map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }

            await vehicle.save();

            res.status(201).json({
                success: true,
                message: 'Vehicle created successfully',
                vehicle
            });
        } catch (error) {
            console.error('Create vehicle error:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: Object.values(error.errors).map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error creating vehicle',
                error: error.message
            });
        }
    },

    // Get all vehicles with advanced filtering
    async getVehicles(req, res) {
        try {
            const {
                search,
                brand,
                model,
                year,
                category,
                condition,
                priceRange,
                availability,
                sort,
                page = 1,
                limit = 10
            } = req.query;

            // Build query
            let query = {};

            // Text search across multiple fields
            if (search) {
                query.$or = [
                    { title: new RegExp(search, 'i') },
                    { brand: new RegExp(search, 'i') },
                    { model: new RegExp(search, 'i') },
                    { 'description.full': new RegExp(search, 'i') }
                ];
            }

            // Apply filters
            if (brand) query.brand = brand;
            if (model) query.model = model;
            if (year) query.year = year;
            if (category) query.category = category;
            if (condition) query.condition = condition;
            if (availability) query['availability.status'] = availability;

            // Price range filter
            if (priceRange) {
                const [min, max] = priceRange.split('-');
                query['pricing.basePrice'] = {
                    $gte: parseInt(min),
                    ...(max && { $lte: parseInt(max) })
                };
            }

            // Build sort options
            let sortOptions = {};
            if (sort) {
                const [field, order] = sort.split(':');
                sortOptions[field] = order === 'desc' ? -1 : 1;
            } else {
                sortOptions = { createdAt: -1 }; // Default sort
            }

            // Execute query with pagination
            const skip = (page - 1) * limit;
            
            const [vehicles, total] = await Promise.all([
                Vehicle.find(query)
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(parseInt(limit))
                    .populate('metadata.createdBy', 'name email')
                    .populate('location.dealership'),
                Vehicle.countDocuments(query)
            ]);

            res.json({
                success: true,
                vehicles,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Get vehicles error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching vehicles',
                error: error.message
            });
        }
    },

    // Get single vehicle by ID
    async getVehicle(req, res) {
        try {
            const vehicle = await Vehicle.findById(req.params.id)
                .populate('metadata.createdBy', 'name email')
                .populate('location.dealership');

            if (!vehicle) {
                return res.status(404).json({
                    success: false,
                    message: 'Vehicle not found'
                });
            }

            // Increment view count
            vehicle.views.total += 1;
            await vehicle.save();

            res.json({
                success: true,
                vehicle
            });
        } catch (error) {
            console.error('Get vehicle error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching vehicle',
                error: error.message
            });
        }
    },

    // Update vehicle
    async updateVehicle(req, res) {
        try {
            const updates = req.body;
            
            // Add last updated metadata
            updates.metadata = {
                ...updates.metadata,
                lastUpdatedBy: req.user.id
            };

            const vehicle = await Vehicle.findByIdAndUpdate(
                req.params.id,
                updates,
                { new: true, runValidators: true }
            );

            if (!vehicle) {
                return res.status(404).json({
                    success: false,
                    message: 'Vehicle not found'
                });
            }

            res.json({
                success: true,
                message: 'Vehicle updated successfully',
                vehicle
            });
        } catch (error) {
            console.error('Update vehicle error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating vehicle',
                error: error.message
            });
        }
    },

    // Delete vehicle
    async deleteVehicle(req, res) {
        try {
            const vehicle = await Vehicle.findById(req.params.id);

            if (!vehicle) {
                return res.status(404).json({
                    success: false,
                    message: 'Vehicle not found'
                });
            }

            await vehicle.deleteOne();

            res.json({
                success: true,
                message: 'Vehicle deleted successfully'
            });
        } catch (error) {
            console.error('Delete vehicle error:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting vehicle',
                error: error.message
            });
        }
    }
};

module.exports = vehicleController; 