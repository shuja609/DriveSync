import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    getInquiries, 
    updateInquiryStatus, 
    updateInquiryPriority, 
    respondToInquiry 
} from '../../../services/sellerInquiryService';

const SellerInquiryManagement = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [replyText, setReplyText] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    useEffect(() => {
        fetchInquiries();
    }, [selectedStatus, selectedPriority]);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (selectedStatus !== 'all') filters.status = selectedStatus;
            if (selectedPriority !== 'all') filters.priority = selectedPriority;
            
            const response = await getInquiries(filters);
            setInquiries(response.inquiries);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (inquiryId, newStatus) => {
        try {
            await updateInquiryStatus(inquiryId, newStatus);
            fetchInquiries();
        } catch (error) {
            console.error('Error updating inquiry status:', error);
        }
    };

    const handlePriorityChange = async (inquiryId, newPriority) => {
        try {
            await updateInquiryPriority(inquiryId, newPriority);
            fetchInquiries();
        } catch (error) {
            console.error('Error updating inquiry priority:', error);
        }
    };

    const handleReply = async (inquiryId) => {
        if (!replyText.trim()) return;
        
        try {
            await respondToInquiry(inquiryId, replyText);
            setReplyText('');
            setSelectedInquiry(null);
            fetchInquiries();
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return 'bg-green-500';
            case 'medium': return 'bg-yellow-500';
            case 'high': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500';
            case 'in_progress': return 'bg-blue-500';
            case 'resolved': return 'bg-green-500';
            case 'closed': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary">Inquiry Management</h1>
                <div className="flex gap-2">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="p-2 border rounded-lg focus:outline-none text-black/80 focus:ring-2 focus:ring-primary-light"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="p-2 border rounded-lg focus:outline-none text-black/80 focus:ring-2 focus:ring-primary-light"
                    >
                        <option value="all">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
                <div className="text-center py-4">No inquiries found</div>
            ) : (
                <div className="grid gap-4">
                    {inquiries.map((inquiry) => (
                        <motion.div
                            key={inquiry._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-4 rounded-lg shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg text-primary-light">{inquiry.subject}</h3>
                                        <div className="flex gap-2">
                                            <select
                                                value={inquiry.priority}
                                                onChange={(e) => handlePriorityChange(inquiry._id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-white text-sm ${getPriorityColor(inquiry.priority)}`}
                                            >
                                                <option value="low">LOW</option>
                                                <option value="medium">MEDIUM</option>
                                                <option value="high">HIGH</option>
                                            </select>
                                            <select
                                                value={inquiry.status}
                                                onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(inquiry.status)}`}
                                            >
                                                <option value="pending">PENDING</option>
                                                <option value="in_progress">IN PROGRESS</option>
                                                <option value="resolved">RESOLVED</option>
                                                <option value="closed">CLOSED</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-2">
                                        From: {inquiry.contactInfo.name} ({inquiry.contactInfo.email})
                                        {inquiry.contactInfo.phone && <span> • {inquiry.contactInfo.phone}</span>}
                                    </p>
                                    <p className="text-gray-700 mb-4">{inquiry.message}</p>

                                    {inquiry.responses && inquiry.responses.length > 0 && (
                                        <div className="mb-4 pl-4 border-l-2 border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-600 mb-2">Previous Responses:</h4>
                                            {inquiry.responses.map((response, index) => (
                                                <div key={index} className="mb-2 text-sm">
                                                    <p className="text-gray-500">
                                                        {new Date(response.timestamp).toLocaleString()}
                                                    </p>
                                                    <p className="text-gray-700">{response.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedInquiry?._id === inquiry._id ? (
                                        <div className="mt-4">
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your response..."
                                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                                                rows="3"
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    onClick={() => setSelectedInquiry(null)}
                                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleReply(inquiry._id)}
                                                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
                                                >
                                                    Send Reply
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedInquiry(inquiry)}
                                            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
                                        >
                                            Reply
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerInquiryManagement; 