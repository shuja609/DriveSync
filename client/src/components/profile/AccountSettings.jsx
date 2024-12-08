import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { FiUser, FiMapPin, FiPhone, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import accountService from '../../services/accountService';
import ProfileLayout from './ProfileLayout';

const AccountSettings = () => {
    const { user, setUser } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        preferences: {
            language: 'en',
            currency: 'USD',
            notifications: {
                email: true,
                sms: true,
                marketing: false
            }
        }
    });

    useEffect(() => {
        fetchAccountSettings();
    }, []);

    const fetchAccountSettings = async () => {
        try {
            const response = await accountService.getAccountSettings();
            const userData = response.data;
            setFormData({
                firstName: userData.name.first || '',
                lastName: userData.name.last || '',
                phoneNumber: userData.phoneNumber || '',
                dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '',
                gender: userData.gender || '',
                address: {
                    street: userData.address?.street || '',
                    city: userData.address?.city || '',
                    state: userData.address?.state || '',
                    zipCode: userData.address?.zipCode || '',
                    country: userData.address?.country || ''
                },
                preferences: {
                    language: userData.preferences?.language || 'en',
                    currency: userData.preferences?.currency || 'USD',
                    notifications: {
                        email: userData.preferences?.notifications?.email ?? true,
                        sms: userData.preferences?.notifications?.sms ?? true,
                        marketing: userData.preferences?.notifications?.marketing ?? false
                    }
                }
            });
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to fetch account settings', { variant: 'error' });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else if (name.startsWith('preferences.')) {
            const [, category, field] = name.split('.');
            if (category === 'notifications') {
                setFormData(prev => ({
                    ...prev,
                    preferences: {
                        ...prev.preferences,
                        notifications: {
                            ...prev.preferences.notifications,
                            [field]: checked
                        }
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    preferences: {
                        ...prev.preferences,
                        [category]: value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Update personal information
            const personalInfoResponse = await accountService.updatePersonalInfo({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender
            });

            // Update address
            const addressResponse = await accountService.updateAddress(formData.address);

            // Update preferences
            const preferencesResponse = await accountService.updatePreferences(formData.preferences);

            // Update user context with the latest data
            setUser({ ...user, ...personalInfoResponse.data });
            
            enqueueSnackbar('Account settings updated successfully!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to update account settings', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileLayout title="Account Settings">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-background-dark p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                            <FiUser className="mr-2" />
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-background-dark p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                            <FiMapPin className="mr-2" />
                            Address Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    ZIP/Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="address.zipCode"
                                    value={formData.address.zipCode}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-background-dark p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-text-primary mb-4">
                            Preferences
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Language
                                </label>
                                <select
                                    name="preferences.language"
                                    value={formData.preferences.language}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Currency
                                </label>
                                <select
                                    name="preferences.currency"
                                    value={formData.preferences.currency}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <h3 className="text-sm font-medium text-text-primary">Notification Preferences</h3>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="preferences.notifications.email"
                                        checked={formData.preferences.notifications.email}
                                        onChange={handleChange}
                                        className="rounded text-primary-light focus:ring-primary-light"
                                    />
                                    <span className="text-sm text-text-primary">Email Notifications</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="preferences.notifications.sms"
                                        checked={formData.preferences.notifications.sms}
                                        onChange={handleChange}
                                        className="rounded text-primary-light focus:ring-primary-light"
                                    />
                                    <span className="text-sm text-text-primary">SMS Notifications</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="preferences.notifications.marketing"
                                        checked={formData.preferences.notifications.marketing}
                                        onChange={handleChange}
                                        className="rounded text-primary-light focus:ring-primary-light"
                                    />
                                    <span className="text-sm text-text-primary">Marketing Communications</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            <FiSave className="mr-2" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </ProfileLayout>
    );
};

export default AccountSettings; 