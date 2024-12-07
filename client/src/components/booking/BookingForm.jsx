import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import bookingService from '../../services/bookingService';
import {
    CalendarToday,
    DirectionsCar,
    LocationOn,
    Payment,
    AccessTime
} from '@mui/icons-material';

const BookingForm = ({ vehicleId, onClose }) => {
    const { isAuthenticated, user } = useAuth();
    const [bookingType, setBookingType] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: '',
        paymentMethod: '',
        duration: 1,
        contactInfo: {
            name: '',
            email: '',
            phone: ''
        }
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                contactInfo: {
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phoneNumber || ''
                }
            }));
        }
    }, [isAuthenticated, user]);

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const validateForm = () => {
        const newErrors = {};

        // Common validations
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        
        // Time validation (9 AM to 6 PM)
        const hour = parseInt(formData.time.split(':')[0]);
        if (hour < 9 || hour >= 18) {
            newErrors.time = 'Please select a time between 9 AM and 6 PM';
        }

        // Contact info validations
        if (!formData.contactInfo.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.contactInfo.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.contactInfo.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.contactInfo.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        // Type-specific validations
        if (bookingType === 'test_drive') {
            if (!formData.location) {
                newErrors.location = 'Please select a location';
            }
        } else if (bookingType === 'reservation') {
            if (!formData.paymentMethod) {
                newErrors.paymentMethod = 'Please select a payment method';
            }
            if (formData.duration < 1) {
                newErrors.duration = 'Duration must be at least 1 day';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please log in to make a booking');
            return;
        }

        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        setIsSubmitting(true);
        try {
            const bookingData = {
                vehicleId,
                type: bookingType,
                date: formData.date,
                time: formData.time,
                contactInfo: formData.contactInfo,
                ...(bookingType === 'test_drive' && { location: formData.location }),
                ...(bookingType === 'reservation' && { 
                    paymentMethod: formData.paymentMethod,
                    duration: parseInt(formData.duration)
                })
            };

            const response = await bookingService.createBooking(bookingData);
            
            if (response.success) {
                toast.success('Booking created successfully!');
                onClose();
            } else {
                toast.error(response.message || 'Error creating booking');
            }
        } catch (error) {
            toast.error(error.message || 'Error creating booking');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-text-primary mb-4">Book This Vehicle</h3>
            <div className="space-y-4">
                <button
                    onClick={() => {
                        setBookingType('test_drive');
                        setShowForm(true);
                        setErrors({});
                    }}
                    className="w-full px-6 py-3 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                    disabled={isSubmitting}
                >
                    Schedule Test Drive
                </button>
                <button
                    onClick={() => {
                        setBookingType('reservation');
                        setShowForm(true);
                        setErrors({});
                    }}
                    className="w-full px-6 py-3 bg-secondary-light text-white rounded-lg hover:bg-secondary-dark transition-colors"
                    disabled={isSubmitting}
                >
                    Reserve Now
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-4"
                    >
                        <div>
                            <label className="block text-text-primary mb-2">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, date: e.target.value }));
                                    setErrors(prev => ({ ...prev, date: '' }));
                                }}
                                min={getTomorrowDate()}
                                className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                    errors.date ? 'border-2 border-red-500' : ''
                                }`}
                                required
                            />
                            {errors.date && (
                                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-text-primary mb-2">Time</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, time: e.target.value }));
                                    setErrors(prev => ({ ...prev, time: '' }));
                                }}
                                className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                    errors.time ? 'border-2 border-red-500' : ''
                                }`}
                                required
                            />
                            <p className="text-sm text-text-primary/70 mt-1">
                                Business hours: 9:00 AM - 6:00 PM
                            </p>
                            {errors.time && (
                                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                            )}
                        </div>

                        {bookingType === 'test_drive' && (
                            <div>
                                <label className="block text-text-primary mb-2">Location</label>
                                <select
                                    value={formData.location}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, location: e.target.value }));
                                        setErrors(prev => ({ ...prev, location: '' }));
                                    }}
                                    className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                        errors.location ? 'border-2 border-red-500' : ''
                                    }`}
                                    required
                                >
                                    <option value="">Select location</option>
                                    <option value="Main Showroom">Main Showroom</option>
                                    <option value="Downtown Branch">Downtown Branch</option>
                                    <option value="North Branch">North Branch</option>
                                </select>
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                                )}
                            </div>
                        )}

                        {bookingType === 'reservation' && (
                            <>
                                <div>
                                    <label className="block text-text-primary mb-2">Duration (days)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.duration}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, duration: e.target.value }));
                                            setErrors(prev => ({ ...prev, duration: '' }));
                                        }}
                                        className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                            errors.duration ? 'border-2 border-red-500' : ''
                                        }`}
                                        required
                                    />
                                    {errors.duration && (
                                        <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-text-primary mb-2">Payment Method</label>
                                    <select
                                        value={formData.paymentMethod}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
                                            setErrors(prev => ({ ...prev, paymentMethod: '' }));
                                        }}
                                        className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                            errors.paymentMethod ? 'border-2 border-red-500' : ''
                                        }`}
                                        required
                                    >
                                        <option value="">Select payment method</option>
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                    </select>
                                    {errors.paymentMethod && (
                                        <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
                                    )}
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-text-primary mb-2">Contact Information</label>
                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={formData.contactInfo.name}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                contactInfo: { ...prev.contactInfo, name: e.target.value }
                                            }));
                                            setErrors(prev => ({ ...prev, name: '' }));
                                        }}
                                        className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                            errors.name ? 'border-2 border-red-500' : ''
                                        }`}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.contactInfo.email}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                contactInfo: { ...prev.contactInfo, email: e.target.value }
                                            }));
                                            setErrors(prev => ({ ...prev, email: '' }));
                                        }}
                                        className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                            errors.email ? 'border-2 border-red-500' : ''
                                        }`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        value={formData.contactInfo.phone}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                contactInfo: { ...prev.contactInfo, phone: e.target.value }
                                            }));
                                            setErrors(prev => ({ ...prev, phone: '' }));
                                        }}
                                        className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                            errors.phone ? 'border-2 border-red-500' : ''
                                        }`}
                                        required
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setErrors({});
                                    onClose();
                                }}
                                className="flex-1 px-6 py-2 bg-background-dark text-text-primary rounded-lg hover:bg-opacity-80 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookingForm; 