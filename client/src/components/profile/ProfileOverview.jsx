import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ProfileLayout from './ProfileLayout';
import { Edit, LocationOn, Phone, Email } from '@mui/icons-material';

const ProfileOverview = () => {
    const { user } = useAuth();

    return (
        <ProfileLayout title="Profile Overview">
            <div className="space-y-8">
                {/* Profile Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-6"
                >
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                            <img
                                src={user.profilePicture || '/default-avatar.png'}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 p-1 bg-primary-light rounded-full text-white hover:bg-primary-dark">
                            <Edit className="w-4 h-4" />
                        </button>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-text-primary">
                            {user.name}
                        </h2>
                        <p className="text-text-primary/70">
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-primary">
                            Contact Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-text-primary/70">
                                <Email className="w-5 h-5" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-text-primary/70">
                                <Phone className="w-5 h-5" />
                                <span>{user.phoneNumber || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-text-primary/70">
                                <LocationOn className="w-5 h-5" />
                                <span>
                                    {user.address?.city && user.address?.country
                                        ? `${user.address.city}, ${user.address.country}`
                                        : 'Not provided'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-primary">
                            Account Status
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-text-primary/70">
                                <span>Email Verified</span>
                                <span className={user.isVerified ? 'text-green-500' : 'text-red-500'}>
                                    {user.isVerified ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="flex justify-between text-text-primary/70">
                                <span>Profile Completed</span>
                                <span className={user.isProfileComplete ? 'text-green-500' : 'text-yellow-500'}>
                                    {user.isProfileComplete ? 'Yes' : 'Incomplete'}
                                </span>
                            </div>
                            <div className="flex justify-between text-text-primary/70">
                                <span>Last Login</span>
                                <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Recent Activity
                    </h3>
                    {/* Add recent activity component here */}
                </motion.div>
            </div>
        </ProfileLayout>
    );
};

export default ProfileOverview; 