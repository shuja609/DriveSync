import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch, FormControlLabel, FormGroup } from '@mui/material';
import ProfileLayout from './ProfileLayout';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';

const NotificationSettings = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        email: user?.preferences?.notifications?.email ?? true,
        push: user?.preferences?.notifications?.push ?? true,
        carAlerts: user?.preferences?.notifications?.carAlerts ?? true,
        priceDrops: user?.preferences?.notifications?.priceDrops ?? true,
        newListings: user?.preferences?.notifications?.newListings ?? true,
        messages: user?.preferences?.notifications?.messages ?? true
    });

    const handleChange = async (event) => {
        const { name, checked } = event.target;
        setSettings(prev => ({
            ...prev,
            [name]: checked
        }));

        try {
            setLoading(true);
            const response = await profileService.updateNotificationSettings({
                notifications: {
                    ...settings,
                    [name]: checked
                }
            });

            if (response.success) {
                setUser(response.user);
            }
        } catch (error) {
            console.error('Error updating notification settings:', error);
            // Revert the change if there was an error
            setSettings(prev => ({
                ...prev,
                [name]: !checked
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileLayout title="Notification Settings">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl space-y-8"
            >
                <FormGroup>
                    <div className="space-y-6">
                        <div className="bg-background-dark p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                Notification Methods
                            </h3>
                            <div className="space-y-2">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.email}
                                            onChange={handleChange}
                                            name="email"
                                            disabled={loading}
                                        />
                                    }
                                    label="Email Notifications"
                                    className="text-text-primary"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.push}
                                            onChange={handleChange}
                                            name="push"
                                            disabled={loading}
                                        />
                                    }
                                    label="Push Notifications"
                                    className="text-text-primary"
                                />
                            </div>
                        </div>

                        <div className="bg-background-dark p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                Notification Types
                            </h3>
                            <div className="space-y-2">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.carAlerts}
                                            onChange={handleChange}
                                            name="carAlerts"
                                            disabled={loading}
                                        />
                                    }
                                    label="Car Alerts"
                                    className="text-text-primary"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.priceDrops}
                                            onChange={handleChange}
                                            name="priceDrops"
                                            disabled={loading}
                                        />
                                    }
                                    label="Price Drop Alerts"
                                    className="text-text-primary"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.newListings}
                                            onChange={handleChange}
                                            name="newListings"
                                            disabled={loading}
                                        />
                                    }
                                    label="New Listings"
                                    className="text-text-primary"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.messages}
                                            onChange={handleChange}
                                            name="messages"
                                            disabled={loading}
                                        />
                                    }
                                    label="Messages"
                                    className="text-text-primary"
                                />
                            </div>
                        </div>
                    </div>
                </FormGroup>
            </motion.div>
        </ProfileLayout>
    );
};

export default NotificationSettings; 