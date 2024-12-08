import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';
import profileService from '../../services/profileService';
import ProfileLayout from './ProfileLayout';
import { uploadToCloudinary } from '../../config/cloudinary';
import { FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiGlobe } from 'react-icons/fi';

const ProfileOverview = () => {
    const { user, setUser } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = React.useRef();

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            enqueueSnackbar('Please select an image file', { variant: 'error' });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            enqueueSnackbar('Image size should be less than 5MB', { variant: 'error' });
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload image
        try {
            setUploading(true);
            const cloudinaryUrl = await uploadToCloudinary(file);
            const response = await profileService.updateProfilePicture(cloudinaryUrl);
            
            if (response.success) {
                setUser({ ...user, profilePicture: cloudinaryUrl });
                enqueueSnackbar('Profile picture updated successfully!', { variant: 'success' });
            }
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to update profile picture', { variant: 'error' });
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    

    return (
        <ProfileLayout title="Profile Overview">
            <div className="space-y-6">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background-dark rounded-lg shadow-lg overflow-hidden"
                >
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            {/* Profile Picture Section */}
                            <div className="relative flex-shrink-0">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden cursor-pointer shadow-xl"
                                    onClick={handleImageClick}
                                >
                                    <img
                                        src={imagePreview || user?.profilePicture || '/images/default-avatar.png'}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </motion.div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button 
                                    className="absolute bottom-2 right-2 p-2 bg-primary-light rounded-full text-white hover:bg-primary-dark transition-colors shadow-lg"
                                    onClick={handleImageClick}
                                    disabled={uploading}
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Info Section */}
                            <div className="text-center sm:text-left flex-grow">
                                <div className="flex flex-col sm:justify-center h-full">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-2">
                                        {user?.name}
                                    </h2>
                                    <p className="text-primary-light">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                                    <div className="mt-2 flex items-center justify-center sm:justify-start space-x-4">
                                        <span className="text-text-primary/70 flex items-center">
                                            <FiMail className="mr-2" />
                                            {user?.email}
                                        </span>
                                        {user?.phoneNumber && (
                                            <span className="text-text-primary/70 flex items-center">
                                                <FiPhone className="mr-2" />
                                                {user.phoneNumber}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Detailed Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-background-dark rounded-lg shadow-lg p-6"
                    >
                        <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                            <FiUser className="mr-2" />
                            Personal Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <FiCalendar className="text-primary-light" />
                                <div>
                                    <p className="text-sm text-text-primary/70">Date of Birth</p>
                                    <p className="text-text-primary">{user?.dob ? new Date(user.dob).toLocaleDateString() : 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiGlobe className="text-primary-light" />
                                <div>
                                    <p className="text-sm text-text-primary/70">Language</p>
                                    <p className="text-text-primary">{user?.preferences?.language || 'English'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Information Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-background-dark rounded-lg shadow-lg p-6"
                    >
                        <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                            <FiPhone className="mr-2" />
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <FiMail className="text-primary-light" />
                                <div>
                                    <p className="text-sm text-text-primary/70">Email</p>
                                    <p className="text-text-primary">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiPhone className="text-primary-light" />
                                <div>
                                    <p className="text-sm text-text-primary/70">Phone</p>
                                    <p className="text-text-primary">{user?.phoneNumber || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Address Information Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-background-dark rounded-lg shadow-lg p-6"
                    >
                        <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                            <FiMapPin className="mr-2" />
                            Address Information
                        </h3>
                        <div className="space-y-2">
                            {user?.address ? (
                                <>
                                    <p className="text-text-primary">{user.address.street}</p>
                                    <p className="text-text-primary">
                                        {user.address.city}, {user.address.state} {user.address.zipCode}
                                    </p>
                                    <p className="text-text-primary">{user.address.country}</p>
                                </>
                            ) : (
                                <p className="text-text-primary/70">No address specified</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Activity Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-background-dark rounded-lg shadow-lg p-6"
                    >
                        <h3 className="text-xl font-semibold text-text-primary mb-4">Activity Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background-light p-4 rounded-lg">
                                <p className="text-sm text-text-primary/70">Saved Cars</p>
                                <p className="text-2xl font-semibold text-primary-light">{user?.savedCars?.length || 0}</p>
                            </div>
                            <div className="bg-background-light p-4 rounded-lg">
                                <p className="text-sm text-text-primary/70">Test Drives</p>
                                <p className="text-2xl font-semibold text-primary-light">{user?.testDrives?.length || 0}</p>
                            </div>
                            <div className="bg-background-light p-4 rounded-lg">
                                <p className="text-sm text-text-primary/70">Orders</p>
                                <p className="text-2xl font-semibold text-primary-light">{user?.orders?.length || 0}</p>
                            </div>
                            <div className="bg-background-light p-4 rounded-lg">
                                <p className="text-sm text-text-primary/70">Reviews</p>
                                <p className="text-2xl font-semibold text-primary-light">{user?.reviews?.length || 0}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-background-dark rounded-lg shadow-lg p-6"
                >
                    <h3 className="text-xl font-semibold text-text-primary mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {user?.recentActivity?.length > 0 ? (
                            user.recentActivity.map((activity, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center space-x-4 p-4 bg-background-light rounded-lg"
                                >
                                    <div className="w-3 h-3 rounded-full bg-primary-light flex-shrink-0"></div>
                                    <div className="flex-grow">
                                        <p className="text-text-primary">{activity.description}</p>
                                        <p className="text-sm text-text-primary/70 mt-1">
                                            {new Date(activity.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-text-primary/70">No recent activity</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </ProfileLayout>
    );
};

export default ProfileOverview; 