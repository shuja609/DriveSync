import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search as SearchIcon,
    Sort as SortIcon,
    FilterList as FilterIcon,
    DirectionsCar,
    Speed,
    LocalGasStation,
    Settings,
    Close as CloseIcon
} from '@mui/icons-material';
import vehicleService from '../../services/vehicleService';

const initialFilters = {
    search: '',
    brand: '',
    category: '',
    priceRange: [0, 1000000],
    year: '',
    transmission: '',
    fuelType: '',
};

const sortOptions = [
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Year: Newest First', value: 'year_desc' },
    { label: 'Year: Oldest First', value: 'year_asc' },
];

const ShowroomPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Fetch vehicles from API
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                setError(null);
                const params = {
                    search: filters.search,
                    brand: filters.brand,
                    category: filters.category,
                    year: filters.year,
                    minPrice: filters.priceRange[0],
                    maxPrice: filters.priceRange[1],
                    sort: sortBy
                };
                const response = await vehicleService.getVehicles(params);
                // Ensure we're working with an array
                const vehiclesArray = Array.isArray(response) ? response : 
                                    Array.isArray(response.data) ? response.data : 
                                    Array.isArray(response.vehicles) ? response.vehicles : [];
                setVehicles(vehiclesArray);
            } catch (err) {
                setError('Failed to fetch vehicles. Please try again later.');
                console.error('Error fetching vehicles:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [filters, sortBy]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const resetFilters = () => {
        setFilters(initialFilters);
        setSortBy('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-primary">Loading vehicles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center text-text-primary">
                    <h2 className="text-2xl font-bold mb-4">Oops!</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark">
            {/* Header Section */}
            <div className="bg-background-default py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light to-secondary-light text-transparent bg-clip-text text-center">
                        Our Vehicle Collection
                    </h1>
                    <p className="text-text-primary/80 text-center text-lg max-w-2xl mx-auto">
                        Explore our extensive collection of premium vehicles
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Search and Filter Bar */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/50" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search vehicles..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="w-full pl-10 pr-4 py-2 bg-background-light rounded-lg text-text-primary placeholder-text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary-light"
                            />
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="min-w-[200px]">
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
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

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-lg text-white hover:bg-primary-dark transition-colors"
                    >
                        <FilterIcon /> Filters
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
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
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {/* Brand Filter */}
                            <select
                                name="brand"
                                value={filters.brand}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary"
                            >
                                <option value="">All Brands</option>
                                <option value="Tesla">Tesla</option>
                                <option value="BMW">BMW</option>
                                <option value="Mercedes">Mercedes</option>
                                <option value="Audi">Audi</option>
                            </select>

                            {/* Category Filter */}
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary"
                            >
                                <option value="">All Categories</option>
                                <option value="Electric">Electric</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Sports">Sports</option>
                                <option value="SUV">SUV</option>
                            </select>

                            {/* Year Filter */}
                            <select
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary"
                            >
                                <option value="">All Years</option>
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>

                            {/* Reset Filters Button */}
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-background-dark rounded-lg text-text-primary hover:bg-background-default transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Vehicle Grid - Update to handle empty state */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {vehicles.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <DirectionsCar className="w-16 h-16 text-text-primary/30 mx-auto mb-4" />
                            <p className="text-text-primary/70">
                                No vehicles found matching your criteria.
                            </p>
                        </div>
                    ) : (
                        vehicles.map(vehicle => (
                            <motion.div
                                key={vehicle._id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-background-light rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                            >
                                {/* Vehicle Image */}
                                <div className="relative aspect-[16/9]">
                                    <img
                                        src={vehicle.media?.[0]?.url || '/images/placeholder-car.jpg'}
                                        alt={vehicle.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-primary-light rounded-full text-white text-sm">
                                            {vehicle.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Vehicle Details */}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                                        {vehicle.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-text-primary/70 mb-4">
                                        <DirectionsCar />
                                        <span>{vehicle.brand}</span>
                                        <span>•</span>
                                        <span>{vehicle.year}</span>
                                    </div>

                                    {/* Specs */}
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <div className="flex flex-col items-center text-center p-2 bg-background-dark rounded-lg">
                                            <Speed className="text-primary-light mb-1" />
                                            <span className="text-sm text-text-primary/70">{vehicle.specifications?.performance?.acceleration || 'N/A'}</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center p-2 bg-background-dark rounded-lg">
                                            <LocalGasStation className="text-primary-light mb-1" />
                                            <span className="text-sm text-text-primary/70">{vehicle.specifications?.performance?.fuelEconomy?.combined || 'N/A'}</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center p-2 bg-background-dark rounded-lg">
                                            <Settings className="text-primary-light mb-1" />
                                            <span className="text-sm text-text-primary/70">{vehicle.specifications?.engine?.power || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Price and Action */}
                                    <div className="flex justify-between items-center">
                                        <div className="text-2xl font-bold text-primary-light">
                                            ${vehicle.pricing?.basePrice?.toLocaleString() || 'N/A'}
                                        </div>
                                        <button className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowroomPage; 