import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import vehicleService from '../../../services/vehicleService';
import Spinner from '../../common/Spinner';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../common/ConfirmationModal';

const VehiclesList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        brand: '',
        category: '',
        condition: '',
        availability: '',
        priceRange: '',
        page: 1
    });
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 1,
        page: 1,
        limit: 10
    });
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        vehicleId: null,
        vehicleTitle: ''
    });

    // Debounced fetch function
    const debouncedFetch = useCallback(
        debounce((filters) => {
            fetchVehicles(filters);
        }, 500),
        []
    );

    // Fetch vehicles with current filters
    const fetchVehicles = async (currentFilters = filters) => {
        try {
            setLoading(true);
            const response = await vehicleService.getVehicles(currentFilters);
            setVehicles(response.vehicles);
            setPagination(response.pagination);
        } catch (error) {
            toast.error('Failed to load vehicles');
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = {
            ...filters,
            [name]: value,
            page: 1 // Reset page when filters change
        };
        setFilters(newFilters);

        // Use debounced fetch for search, immediate fetch for other filters
        if (name === 'search') {
            debouncedFetch(newFilters);
        } else {
            fetchVehicles(newFilters);
        }
    };

    // Debounce helper function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Effect to fetch vehicles on initial load
    useEffect(() => {
        fetchVehicles();
    }, []); // Only run on mount

    // Handle delete
    const handleDelete = async () => {
        try {
            await vehicleService.deleteVehicle(deleteModal.vehicleId);
            toast.success('Vehicle deleted successfully');
            fetchVehicles(); // Refresh list
            setDeleteModal({ isOpen: false, vehicleId: null, vehicleTitle: '' });
        } catch (error) {
            toast.error('Failed to delete vehicle');
            console.error('Error deleting vehicle:', error);
        }
    };

    const openDeleteModal = (vehicle) => {
        setDeleteModal({
            isOpen: true,
            vehicleId: vehicle._id,
            vehicleTitle: vehicle.title
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            vehicleId: null,
            vehicleTitle: ''
        });
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Vehicle Inventory</h1>
                <Link
                    to="/admin/vehicles/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <FiPlus /> Add Vehicle
                </Link>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search vehicles..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="pl-10 pr-4 py-2 border rounded-lg w-full text-gray-700"
                    />
                </div>
                
                <select
                    name="brand"
                    value={filters.brand}
                    onChange={handleFilterChange}
                    className="border rounded-lg px-4 py-2 text-gray-700"
                >
                    <option value="">All Brands</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Ford">Ford</option>
                    <option value="Chevrolet">Chevrolet</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Kia">Kia</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Audi">Audi</option>
                    <option value="Volkswagen">Volkswagen</option>
                </select>

                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="border rounded-lg px-4 py-2 text-gray-700"
                >
                    <option value="">All Categories</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Sports">Sports</option>
                    <option value="Luxury">Luxury</option>
                </select>

                <select
                    name="condition"
                    value={filters.condition}
                    onChange={handleFilterChange}
                    className="border rounded-lg px-4 py-2 text-gray-700"
                >
                    <option value="">All Conditions</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                </select>

                <select
                    name="availability"
                    value={filters.availability}
                    onChange={handleFilterChange}
                    className="border rounded-lg px-4 py-2 text-gray-700"
                >
                    <option value="">All Availability</option>
                    <option value="In Stock">In Stock</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Sold">Sold</option>
                    <option value="Reserved">Reserved</option>
                </select>

                <select
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                    className="border rounded-lg px-4 py-2 text-gray-700"
                >
                    <option value="">All Prices</option>
                    <option value="0-20000">Under $20,000</option>
                    <option value="20000-40000">$20,000 - $40,000</option>
                    <option value="40000-60000">$40,000 - $60,000</option>
                    <option value="60000">$60,000+</option>
                </select>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehicle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Views
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={vehicle.media.find(media => media.isPrimary)?.url || `https://ui-avatars.com/api/?name=${vehicle.brand}+${vehicle.model}&background=0D8ABC&color=fff`}
                                                alt={vehicle.title}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {vehicle.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {vehicle.brand} {vehicle.model} ({vehicle.year})
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        ${vehicle.pricing.basePrice.toLocaleString()}
                                    </div>
                                    {vehicle.pricing.discountedPrice && (
                                        <div className="text-sm text-green-600">
                                            ${vehicle.pricing.discountedPrice.toLocaleString()}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${vehicle.availability.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                                        vehicle.availability.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                                        vehicle.availability.status === 'Sold' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'}`}
                                    >
                                        {vehicle.availability.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {vehicle.views.total}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/admin/vehicles/${vehicle._id}/edit`}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <FiEdit2 className="inline-block" />
                                    </Link>
                                    <button
                                        onClick={() => openDeleteModal(vehicle)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FiTrash2 className="inline-block" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} vehicles
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.pages}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Delete Vehicle"
                message={`Are you sure you want to delete "${deleteModal.vehicleTitle}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default VehiclesList; 