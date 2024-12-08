import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { FiX, FiLogIn } from 'react-icons/fi';
import { createFeedback } from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserFeedbackForm = ({ isOpen, onClose }) => {
    const { user, isAuthenticated } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: 'General',
        subject: '',
        message: '',
        priority: 'Medium'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            enqueueSnackbar('Please login to submit feedback', { variant: 'warning' });
            onClose();
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        setLoading(true);

        try {
            await createFeedback(formData);
            enqueueSnackbar('Feedback submitted successfully!', { variant: 'success' });
            onClose();
            setFormData({
                type: 'General',
                subject: '',
                message: '',
                priority: 'Medium'
            });
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to submit feedback', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = () => {
        onClose();
        navigate('/login', { state: { from: window.location.pathname } });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-background-light rounded-lg shadow-xl p-6"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-text-primary/70 hover:text-text-primary"
                    >
                        <FiX className="w-5 h-5" />
                    </button>

                    <h2 className="text-2xl font-bold text-text-primary mb-6">Submit Feedback</h2>

                    {!isAuthenticated ? (
                        <div className="text-center py-8">
                            <FiLogIn className="w-12 h-12 mx-auto text-primary-light mb-4" />
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Login Required
                            </h3>
                            <p className="text-text-primary/70 mb-6">
                                Please login to submit your feedback. We value your input!
                            </p>
                            <button
                                onClick={handleLogin}
                                className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Login to Continue
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-dark text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                    required
                                >
                                    <option value="Bug Report">Bug Report</option>
                                    <option value="Feature Request">Feature Request</option>
                                    <option value="General">General</option>
                                    <option value="Support">Support</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-dark text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                    required
                                    maxLength={100}
                                    placeholder="Brief description of your feedback"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-dark text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light min-h-[100px]"
                                    required
                                    maxLength={1000}
                                    placeholder="Detailed description of your feedback"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background-dark text-text-primary rounded-lg focus:ring-2 focus:ring-primary-light"
                                    required
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-text-primary hover:bg-background-dark rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UserFeedbackForm; 