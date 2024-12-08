import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiUserPlus, FiGrid, FiList } from 'react-icons/fi';
import CustomerCard from './CustomerCard';
import AddCustomerModal from './AddCustomerModal';
import customerService from '../../../services/customerService';

const CustomerList = () => {
    // console.log('CustomerList component rendered');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        // console.log('CustomerList useEffect triggered');
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            // console.log('Fetching customers...');
            setLoading(true);
            const response = await customerService.getCustomers();
            // console.log('Customers response:', response);
            if (response.success) {
                setCustomers(response.data);
                setError(null);
            } else {
                setError(response.message || 'Failed to fetch customers');
            }
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError(err.message || 'Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = (
            customer.name?.first?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.name?.last?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    if (loading) {
        // console.log('Rendering loading state');
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        // console.log('Rendering error state:', error);
        return (
            <div className="text-center text-red-500 p-4">
                <p>Error: {error}</p>
            </div>
        );
    }

    // console.log('Rendering customer list, count:', filteredCustomers.length);

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-text-primary mb-4 sm:mb-0">
                    Customer Management
                </h1>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-primary-light text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors"
                >
                    <FiUserPlus className="mr-2" />
                    Add New Customer
                </motion.button>
            </div>

            {/* Search and Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Search */}
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-light bg-background-light text-text-primary"
                    />
                </div>

                {/* Filter */}
                <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-light bg-background-light text-text-primary appearance-none"
                    >
                        <option value="all">All Customers</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                {/* View Toggle */}
                <div className="flex justify-end space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-light text-white' : 'bg-background-light text-text-primary'}`}
                    >
                        <FiGrid className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-light text-white' : 'bg-background-light text-text-primary'}`}
                    >
                        <FiList className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Customers Grid/List */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                    viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                        : 'grid-cols-1'
                }`}
            >
                <AnimatePresence>
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                            <CustomerCard
                                key={customer._id}
                                customer={customer}
                                viewMode={viewMode}
                                onRefresh={fetchCustomers}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-text-primary/70 py-8">
                            No customers found
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Add Customer Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <AddCustomerModal
                        onClose={() => setShowAddModal(false)}
                        onSuccess={fetchCustomers}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerList; 