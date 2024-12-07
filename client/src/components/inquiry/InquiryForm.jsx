import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import inquiryService from '../../services/inquiryService';
import {
    Email,
    Phone,
    Person,
    Help
} from '@mui/icons-material';

const InquiryForm = ({ vehicleId, onClose }) => {
    const { isAuthenticated, user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
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

    const validateForm = () => {
        const newErrors = {};

        // Subject validation
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        } else if (formData.subject.length > 100) {
            newErrors.subject = 'Subject must be less than 100 characters';
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.length > 1000) {
            newErrors.message = 'Message must be less than 1000 characters';
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please log in to submit an inquiry');
            return;
        }

        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        setIsSubmitting(true);
        try {
            const inquiryData = {
                vehicleId,
                subject: formData.subject.trim(),
                message: formData.message.trim(),
                contactInfo: {
                    name: formData.contactInfo.name.trim(),
                    email: formData.contactInfo.email.trim(),
                    phone: formData.contactInfo.phone.trim()
                }
            };

            const response = await inquiryService.createInquiry(inquiryData);
            
            if (response.success) {
                toast.success('Inquiry submitted successfully!');
                onClose();
            } else {
                toast.error(response.message || 'Error submitting inquiry');
            }
        } catch (error) {
            toast.error(error.message || 'Error submitting inquiry');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-text-primary mb-4">Have Questions?</h3>
            <button
                onClick={() => {
                    setShowForm(true);
                    setErrors({});
                }}
                className="w-full px-6 py-3 bg-accent-light text-white rounded-lg hover:bg-accent-dark transition-colors"
                disabled={isSubmitting}
            >
                Submit an Inquiry
            </button>

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
                            <label className="block text-text-primary mb-2">Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, subject: e.target.value }));
                                    setErrors(prev => ({ ...prev, subject: '' }));
                                }}
                                className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                    errors.subject ? 'border-2 border-red-500' : ''
                                }`}
                                maxLength={100}
                                required
                            />
                            {errors.subject && (
                                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-text-primary mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, message: e.target.value }));
                                    setErrors(prev => ({ ...prev, message: '' }));
                                }}
                                className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary resize-none ${
                                    errors.message ? 'border-2 border-red-500' : ''
                                }`}
                                rows={4}
                                maxLength={1000}
                                required
                            />
                            <div className="text-sm text-text-primary/70 mt-1">
                                {formData.message.length}/1000 characters
                            </div>
                            {errors.message && (
                                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                            )}
                        </div>

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

export default InquiryForm; 