import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import sellerFeedbackService from '../../../services/sellerFeedbackService';

const SellerFeedbackManagement = () => {
    const [feedback, setFeedback] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [response, setResponse] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        priority: 'all'
    });

    useEffect(() => {
        fetchFeedback();
        fetchStats();
    }, [filters]);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const queryFilters = {};
            if (filters.status !== 'all') queryFilters.status = filters.status;
            if (filters.type !== 'all') queryFilters.type = filters.type;
            if (filters.priority !== 'all') queryFilters.priority = filters.priority;
            
            const response = await sellerFeedbackService.getFeedback(queryFilters);
            setFeedback(response.feedback);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await sellerFeedbackService.getFeedbackStats();
            setStats(response);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusChange = async (feedbackId, newStatus) => {
        try {
            await sellerFeedbackService.updateFeedbackStatus(feedbackId, newStatus);
            fetchFeedback();
            fetchStats();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePriorityChange = async (feedbackId, newPriority) => {
        try {
            await sellerFeedbackService.updateFeedbackPriority(feedbackId, newPriority);
            fetchFeedback();
            fetchStats();
        } catch (error) {
            console.error('Error updating priority:', error);
        }
    };

    const handleSubmitResponse = async (e) => {
        e.preventDefault();
        try {
            await sellerFeedbackService.respondToFeedback(selectedFeedback._id, response);
            setIsResponseModalOpen(false);
            setSelectedFeedback(null);
            setResponse('');
            fetchFeedback();
            fetchStats();
        } catch (error) {
            console.error('Error submitting response:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-yellow-500';
            case 'In Progress': return 'bg-blue-500';
            case 'Closed': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-500';
            case 'Medium': return 'text-yellow-500';
            case 'Low': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-light">Feedback Management</h1>
                    {stats && (
                        <div className="flex gap-4 mt-2">
                            <div className="text-sm">
                                <span className="text-yellow-500 font-semibold">
                                    {stats.status.find(s => s._id === 'Open')?.count || 0}
                                </span> Open
                            </div>
                            <div className="text-sm">
                                <span className="text-blue-500 font-semibold">
                                    {stats.status.find(s => s._id === 'In Progress')?.count || 0}
                                </span> In Progress
                            </div>
                            <div className="text-sm">
                                <span className="text-green-500 font-semibold">
                                    {stats.status.find(s => s._id === 'Closed')?.count || 0}
                                </span> Closed
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-4">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Types</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="General">General</option>
                        <option value="Support">Support</option>
                    </select>
                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                        className="p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading feedback...</div>
            ) : feedback.length === 0 ? (
                <div className="text-center py-4">No feedback found</div>
            ) : (
                <div className="grid gap-4">
                    {feedback.map((item) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-4 rounded-lg shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg text-primary-light">{item.subject}</h3>
                                        <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                        <span className={`text-sm ${getPriorityColor(item.priority)}`}>
                                            {item.priority} Priority
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-2">{item.message}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>From: {item.userId?.name ? `${item.userId.name.first} ${item.userId.name.last}` : 'Unknown User'}</span>
                                        <span>Type: {item.type}</span>
                                        <span>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {item.response && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-gray-700">{item.response}</p>
                                            <div className="mt-2 text-sm text-gray-500">
                                                Responded by: {item.respondedBy?.name ? 
                                                    `${item.respondedBy.name.first} ${item.respondedBy.name.last}` : 
                                                    'Unknown User'}
                                                <span className="ml-2">
                                                    {new Date(item.respondedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={item.status}
                                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                        className="p-2 border-2 border-primary focus:border-primary-light focus:ring-primary-light rounded text-sm text-primary-light"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                    <select
                                        value={item.priority}
                                        onChange={(e) => handlePriorityChange(item._id, e.target.value)}
                                        className="p-2 border-2 border-primary focus:border-primary-light focus:ring-primary-light rounded text-sm text-primary-light"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                    <button
                                        onClick={() => {
                                            setSelectedFeedback(item);
                                            setIsResponseModalOpen(true);
                                        }}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                    >
                                        <FiMessageSquare />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Response Modal */}
            {isResponseModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                        <h2 className="text-xl font-bold mb-4 text-primary-light">
                            Respond to Feedback
                        </h2>
                        <form onSubmit={handleSubmitResponse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-primary-light">Response</label>
                                <textarea
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-2 border-primary focus:border-primary-light focus:ring-primary-light text-primary-light"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsResponseModalOpen(false);
                                        setSelectedFeedback(null);
                                        setResponse('');
                                    }}
                                    className="px-4 py-2 text-sm text-primary-light hover:text-primary-dark"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
                                >
                                    Submit Response
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerFeedbackManagement; 