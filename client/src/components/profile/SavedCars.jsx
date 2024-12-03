import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconButton, Tooltip } from '@mui/material';
import { Delete, Favorite, DirectionsCar, AttachMoney } from '@mui/icons-material';
import ProfileLayout from './ProfileLayout';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';

const SavedCars = () => {
    const [loading, setLoading] = useState(true);
    const [savedCars, setSavedCars] = useState([]);
    const [error, setError] = useState('');

    // eslint-disable-next-line no-unused-vars
    const { user } = useAuth();

    useEffect(() => {
        loadSavedCars();
    }, []);

    const loadSavedCars = async () => {
        try {
            const response = await profileService.getSavedCars();
            setSavedCars(response.cars || []);
        } catch (err) {
            setError('Failed to load saved cars');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (carId) => {
        try {
            await profileService.removeSavedCar(carId);
            setSavedCars(prev => prev.filter(car => car.id !== carId));
        } catch (err) {
            setError('Failed to remove car');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <ProfileLayout title="Saved Cars">
                <div className="flex justify-center items-center h-64">
                    <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin" />
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout title="Saved Cars">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {error && (
                    <div className="text-red-500 text-center p-4">
                        {error}
                    </div>
                )}

                {savedCars.length === 0 ? (
                    <div className="text-center py-12">
                        <Favorite className="w-16 h-16 text-text-primary/30 mx-auto mb-4" />
                        <p className="text-text-primary/70">
                            No saved cars yet. Start browsing and save your favorite cars!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedCars.map(car => (
                            <motion.div
                                key={car.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-background-dark rounded-lg overflow-hidden shadow-lg"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={car.image}
                                        alt={car.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Tooltip title="Remove from saved">
                                            <IconButton
                                                onClick={() => handleRemove(car.id)}
                                                className="text-red-500 hover:text-red-600 bg-white/10 backdrop-blur-sm"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-text-primary">
                                        {car.name}
                                    </h3>
                                    
                                    <div className="mt-2 space-y-2">
                                        <div className="flex items-center text-text-primary/70">
                                            <DirectionsCar className="w-5 h-5 mr-2" />
                                            <span>{car.type}</span>
                                        </div>
                                        <div className="flex items-center text-text-primary/70">
                                            <AttachMoney className="w-5 h-5 mr-2" />
                                            <span>${car.price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            className="w-full py-2 px-4 bg-primary-light text-white rounded-md hover:bg-primary-dark transition-colors"
                                            onClick={() => window.location.href = `/cars/${car.id}`}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </ProfileLayout>
    );
};

export default SavedCars; 