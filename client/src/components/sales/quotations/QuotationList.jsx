import React, { useState, useEffect } from 'react';
import { FiPlus, FiMail, FiEye, FiCheck, FiX } from 'react-icons/fi';
import quotationService from '../../../services/quotationService';
import CreateQuotationModal from './CreateQuotationModal';
import { formatDate } from '../../../utils/dateUtils';

const QuotationList = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await quotationService.getQuotations();
            if (response.success) {
                setQuotations(response.data);
            }
        } catch (error) {
            setError('Failed to fetch quotations');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendFollowUp = async (quotationId) => {
        try {
            await quotationService.sendFollowUp(quotationId);
            // Show success message or update UI
        } catch (error) {
            console.error(error);
            // Show error message
        }
    };

    const handleUpdateStatus = async (quotationId, status) => {
        try {
            await quotationService.updateQuotationStatus(quotationId, status);
            fetchQuotations(); // Refresh the list
        } catch (error) {
            console.error(error);
            // Show error message
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'sent':
                return 'bg-blue-100 text-blue-800';
            case 'viewed':
                return 'bg-purple-100 text-purple-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <FiPlus className="mr-2" />
                    New Quotation
                </button>
            </div>

            {/* Quotations List */}
            <div className="grid gap-4">
                {quotations.map((quotation) => (
                    <div
                        key={quotation._id}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">
                                        {quotation.quotationNumber}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {quotation.vehicleId.make} {quotation.vehicleId.model} {quotation.vehicleId.year}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Customer: {quotation.customerId.name.first} {quotation.customerId.name.last}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleSendFollowUp(quotation._id)}
                                    className="p-2 text-gray-600 hover:text-primary-light rounded-full hover:bg-gray-100"
                                    title="Send Follow-up"
                                >
                                    <FiMail />
                                </button>
                                <button
                                    onClick={() => {/* View details */}}
                                    className="p-2 text-gray-600 hover:text-primary-light rounded-full hover:bg-gray-100"
                                    title="View Details"
                                >
                                    <FiEye />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Total: ${quotation.totalPrice.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Valid until: {formatDate(quotation.validUntil)}
                                </p>
                            </div>
                            {quotation.status === 'sent' && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleUpdateStatus(quotation._id, 'accepted')}
                                        className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200"
                                    >
                                        <FiCheck className="mr-1" />
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(quotation._id, 'rejected')}
                                        className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
                                    >
                                        <FiX className="mr-1" />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Quotation Modal */}
            {showCreateModal && (
                <CreateQuotationModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchQuotations();
                    }}
                />
            )}
        </div>
    );
};

export default QuotationList; 