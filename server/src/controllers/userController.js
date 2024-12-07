const User = require('../models/User');

const userController = {
    // Get saved cars for a user
    async getSavedCars(req, res) {
        try {
            const user = await User.findById(req.user.id)
                .populate({
                    path: 'savedCars.carId',
                    model: 'Vehicle',
                    select: '-__v'  // Exclude version key
                });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                savedCars: user.savedCars
            });
        } catch (error) {
            console.error('Get saved cars error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching saved cars'
            });
        }
    },

    // Save a car
    async saveCar(req, res) {
        try {
            const { carId, notes } = req.body;

            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if car is already saved
            if (user.savedCars.some(car => car.carId.toString() === carId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Car is already saved'
                });
            }

            user.savedCars.push({ carId, notes });
            await user.save();

            res.json({
                success: true,
                message: 'Car saved successfully'
            });
        } catch (error) {
            console.error('Save car error:', error);
            res.status(500).json({
                success: false,
                message: 'Error saving car'
            });
        }
    },

    // Remove a saved car
    async removeSavedCar(req, res) {
        try {
            const { carId } = req.params;

            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Remove car from savedCars array
            user.savedCars = user.savedCars.filter(car => car.carId.toString() !== carId);
            await user.save();

            res.json({
                success: true,
                message: 'Car removed from saved cars'
            });
        } catch (error) {
            console.error('Remove saved car error:', error);
            res.status(500).json({
                success: false,
                message: 'Error removing saved car'
            });
        }
    },

    // Update saved car notes
    async updateSavedCarNotes(req, res) {
        try {
            const { carId } = req.params;
            const { notes } = req.body;

            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const savedCar = user.savedCars.find(car => car.carId.toString() === carId);
            
            if (!savedCar) {
                return res.status(404).json({
                    success: false,
                    message: 'Saved car not found'
                });
            }

            savedCar.notes = notes;
            await user.save();

            res.json({
                success: true,
                message: 'Notes updated successfully'
            });
        } catch (error) {
            console.error('Update saved car notes error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating notes'
            });
        }
    }
};

module.exports = userController; 