import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search as SearchIcon,
    Sort as SortIcon,
    FilterList as FilterIcon,
    Favorite,
    DirectionsCar,
    LocalGasStation,
    Speed,
    Settings,
    Delete as DeleteIcon,
    NavigateNext as NextIcon,
    NavigateBefore as PrevIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import ProfileLayout from './ProfileLayout';

const ITEMS_PER_PAGE = 3;

const sortOptions = [
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Year: Newest First', value: 'year_desc' },
    { label: 'Year: Oldest First', value: 'year_asc' },
];

const SavedCars = () => {
    const navigate = useNavigate();
    const [savedCars, setSavedCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        availability: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState(null);

    // Fetch saved cars
    useEffect(() => {
        const fetchSavedCars = async () => {
            try {
                setLoading(true);
                const response = await userService.getSavedCars();
                if (response.success) {
                    setSavedCars(response.savedCars || []);
                }
            } catch (error) {
                setError('Failed to fetch saved cars');
                console.error('Error fetching saved cars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedCars();
    }, []);

    // Filter and sort cars
    const filteredCars = savedCars
        .filter(car => {
            const searchMatch = car.carId.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              car.carId.brand?.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = !filters.category || car.carId.category?.includes(filters.category);
            const brandMatch = !filters.brand || car.carId.brand === filters.brand;
            const availabilityMatch = !filters.availability || car.carId.status === filters.availability;
            
            return searchMatch && categoryMatch && brandMatch && availabilityMatch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price_asc':
                    return (a.carId.pricing?.basePrice || 0) - (b.carId.pricing?.basePrice || 0);
                case 'price_desc':
                    return (b.carId.pricing?.basePrice || 0) - (a.carId.pricing?.basePrice || 0);
                case 'year_desc':
                    return (b.carId.year || 0) - (a.carId.year || 0);
                case 'year_asc':
                    return (a.carId.year || 0) - (b.carId.year || 0);
                default:
                    return 0;
            }
        });

    // Pagination
    const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
    const paginatedCars = filteredCars.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleRemoveCar = async (carId) => {
        try {
            const response = await userService.removeSavedCar(carId);
            if (response.success) {
                setSavedCars(prev => prev.filter(car => car.carId._id !== carId));
                toast.success('Car removed from saved list');
            }
        } catch (error) {
            toast.error('Failed to remove car');
            console.error('Error removing car:', error);
        }
        setShowConfirmDialog(false);
        setSelectedCarId(null);
    };

    if (loading) {
        return (
            <ProfileLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
                </div>
            </ProfileLayout>
        );
    }

    if (error) {
        return (
            <ProfileLayout>
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </ProfileLayout>
        );
    }

    if (savedCars.length === 0) {
        return (
            <ProfileLayout>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <DirectionsCar className="w-24 h-24 text-text-primary/30 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                        No cars saved yet
                    </h2>
                    <p className="text-text-primary/70 mb-8">
                        Start exploring and add your favorite cars to your collection
                    </p>
                    <button
                        onClick={() => navigate('/showroom')}
                        className="px-8 py-3 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Browse Cars
                    </button>
                </motion.div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header with total count */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">
                            Saved Cars
                        </h1>
                        <p className="text-text-primary/70">
                            {savedCars.length} {savedCars.length === 1 ? 'car' : 'cars'} saved
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-background-light rounded-lg hover:bg-background-dark transition-colors"
                        >
                            <FilterIcon /> Filters
                        </button>
                    </div>
                </div>

                {/* Search and filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/50" />
                            <input
                                type="text"
                                placeholder="Search saved cars..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background-light rounded-lg text-text-primary placeholder-text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary-light"
                            />
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="min-w-[200px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 bg-background-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                        >
                            <option value="">Sort By</option>
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-background-light rounded-lg p-6 mb-8"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-text-primary">Filters</h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-text-primary/50 hover:text-text-primary"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Luxury">Luxury</option>
                                    <option value="Sports">Sports</option>
                                    <option value="SUV">SUV</option>
                                </select>

                                <select
                                    value={filters.brand}
                                    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                                    className="w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary"
                                >
                                    <option value="">All Brands</option>
                                    <option value="Tesla">Tesla</option>
                                    <option value="BMW">BMW</option>
                                    <option value="Mercedes">Mercedes</option>
                                    <option value="Audi">Audi</option>
                                </select>

                                <select
                                    value={filters.availability}
                                    onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                                    className="w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary"
                                >
                                    <option value="">All Availability</option>
                                    <option value="In Stock">In Stock</option>
                                    <option value="Reserved">Reserved</option>
                                    <option value="In Transit">In Transit</option>
                                </select>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Car Grid - Updated to show 3 cards in a row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedCars.map(({ carId: car, notes, savedAt }) => (
                        <motion.div
                            key={car._id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-background-light rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {/* Car Image */}
                            <div className="relative aspect-[16/9]">
                                <img
                                    src={car.media?.find(m => m.isPrimary)?.url || car.media?.[0]?.url || `https://ui-avatars.com/api/?name=${car.brand}+${car.model}&background=5d9adf&color=000000`}
                                    alt={car.title || 'Car Image'}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedCarId(car._id);
                                            setShowConfirmDialog(true);
                                        }}
                                        className="p-2 bg-background-dark/50 rounded-full hover:bg-background-dark transition-colors"
                                    >
                                        <DeleteIcon className="text-white" />
                                    </button>
                                </div>
                                {car.status && (
                                    <div className="absolute bottom-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            car.status === 'In Stock' 
                                                ? 'bg-green-500' 
                                                : car.status === 'Reserved'
                                                ? 'bg-yellow-500'
                                                : 'bg-blue-500'
                                        } text-white`}>
                                            {car.status}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Car Details */}
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-text-primary mb-2">
                                    {car.title || 'Untitled Vehicle'}
                                </h3>
                                <div className="flex items-center gap-2 text-text-primary/70 mb-4">
                                    <DirectionsCar />
                                    <span>{car.brand || 'Unknown Brand'}</span>
                                    <span>•</span>
                                    <span>{car.year || 'N/A'}</span>
                                </div>

                                {/* Specs */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="flex flex-col items-center text-center p-2 bg-background-dark rounded-lg">
                                        <Speed className="text-primary-light mb-1" />
                                        <span className="text-sm text-text-primary/70">
                                            {car.specifications?.performance?.acceleration || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-2 bg-background-dark rounded-lg">
                                        <LocalGasStation className="text-primary-light mb-1" />
                                        <span className="text-sm text-text-primary/70">
                                            {car.specifications?.performance?.fuelEconomy?.combined || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-2 bg-background-dark rounded-lg">
                                        <Settings className="text-primary-light mb-1" />
                                        <span className="text-sm text-text-primary/70">
                                            {car.specifications?.engine?.power || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-2xl font-bold text-primary-light">
                                            ${(car.pricing?.basePrice || 0).toLocaleString()}
                                        </div>
                                        {car.pricing?.discountedPrice && (
                                            <div className="text-sm">
                                                <span className="line-through text-text-primary/50">
                                                    ${car.pricing.basePrice.toLocaleString()}
                                                </span>
                                                <span className="ml-2 text-green-500">
                                                    Save ${(car.pricing.basePrice - car.pricing.discountedPrice).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/vehicles/${car._id}`)}
                                        className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>

                                {/* Saved Date */}
                                <div className="mt-4 text-sm text-text-primary/50">
                                    Saved {new Date(savedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination with page info */}
                {totalPages > 1 && (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <div className="text-sm text-text-primary/70">
                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCars.length)} of {filteredCars.length} cars
                        </div>
                        <div className="flex justify-center items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-full ${
                                    currentPage === 1
                                        ? 'bg-background-light/50 text-text-primary/30'
                                        : 'bg-background-light text-text-primary hover:bg-primary-light hover:text-white'
                                } transition-colors`}
                            >
                                <PrevIcon />
                            </button>
                            
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 rounded-full ${
                                            currentPage === page
                                                ? 'bg-primary-light text-white'
                                                : 'bg-background-light text-text-primary hover:bg-primary-light/20'
                                        } transition-colors`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-full ${
                                    currentPage === totalPages
                                        ? 'bg-background-light/50 text-text-primary/30'
                                        : 'bg-background-light text-text-primary hover:bg-primary-light hover:text-white'
                                } transition-colors`}
                            >
                                <NextIcon />
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirmation Dialog */}
                <AnimatePresence>
                    {showConfirmDialog && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-background-light rounded-lg p-6 max-w-md mx-4"
                            >
                                <h3 className="text-xl font-semibold text-text-primary mb-4">
                                    Remove from Saved Cars?
                                </h3>
                                <p className="text-text-primary/70 mb-6">
                                    Are you sure you want to remove this car from your saved list?
                                </p>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setShowConfirmDialog(false);
                                            setSelectedCarId(null);
                                        }}
                                        className="px-4 py-2 text-text-primary hover:bg-background-dark rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleRemoveCar(selectedCarId)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ProfileLayout>
    );
};

export default SavedCars; 