const User = require('../models/User');

// Get account settings
const getAccountSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching account settings', error: error.message });
    }
};

// Update personal information
const updatePersonalInfo = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, dateOfBirth, gender } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name.first = firstName;
        user.name.last = lastName;
        user.phoneNumber = phoneNumber;
        user.dateOfBirth = dateOfBirth;
        user.gender = gender;

        await user.save();
        
        const updatedUser = await User.findById(user.id).select('-password');
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating personal information', error: error.message });
    }
};


// Update address
const updateAddress = async (req, res) => {
    try {
        const { street, city, state, zipCode, country } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.address = {
            street,
            city,
            state,
            zipCode,
            country
        };

        await user.save();
        
        const updatedUser = await User.findById(user.id).select('-password');
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
};

// Update preferences
const updatePreferences = async (req, res) => {
    try {
        const { language, currency, notifications } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.preferences = {
            language,
            currency,
            notifications
        };

        await user.save();
        
        const updatedUser = await User.findById(user.id).select('-password');
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating preferences', error: error.message });
    }
};

module.exports = {
    getAccountSettings,
    updatePersonalInfo,
    updateAddress,
    updatePreferences
}; 