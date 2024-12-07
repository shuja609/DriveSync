import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../header/Header';
import PublicHeader from '../layout/Header';
import Footer from '../layout/Footer';
import {
    Home,
    ChevronRight,
    DirectionsCar,
    Speed,
    LocalGasStation,
    Settings,
    
    LocationOn,
    CalendarToday,
   
    Favorite,
    FavoriteBorder,
    Share,
    Build,
    Info,
  
    History,
    AttachMoney,
    
   
    Garage,
   
    EmojiEvents,
    Visibility
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import vehicleService from '../../services/vehicleService';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import ReviewSection from '../reviews/ReviewSection';
import BookingForm from '../booking/BookingForm';
import InquiryForm from '../inquiry/InquiryForm';
import OrderForm from '../order/OrderForm';

const VehicleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savingInProgress, setSavingInProgress] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await vehicleService.getVehicle(id);
                if (response.success) {
                    setVehicle(response.vehicle);
                    // Set first primary image as active, fallback to first image
                    const primaryIndex = response.vehicle.media.findIndex(m => m.isPrimary);
                    setActiveImage(primaryIndex !== -1 ? primaryIndex : 0);
                } else {
                    setError('Vehicle not found');
                }
            } catch (err) {
                setError('Failed to fetch vehicle details');
                console.error('Error fetching vehicle:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    useEffect(() => {
        const checkIfSaved = async () => {
            if (isAuthenticated && vehicle) {
                try {
                    const { savedCars } = await userService.getSavedCars();
                    setIsSaved(savedCars.some(car => car.carId._id === id));
                } catch (error) {
                    console.error('Error checking saved status:', error);
                }
            }
        };

        checkIfSaved();
    }, [isAuthenticated, vehicle, id]);

    const handleSaveToggle = async () => {
        if (!isAuthenticated) {
            toast.info('Please log in to save vehicles', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            // You might want to redirect to login page or show login modal
            return;
        }

        if (savingInProgress) return;

        setSavingInProgress(true);
        try {
            if (isSaved) {
                await userService.removeSavedCar(id);
                toast.success('Vehicle removed from saved cars', {
                    position: 'top-right',
                    autoClose: 2000
                });
                setIsSaved(false);
            } else {
                await userService.saveCar(id);
                toast.success('Vehicle saved successfully', {
                    position: 'top-right',
                    autoClose: 2000
                });
                setIsSaved(true);
            }
        } catch (error) {
            toast.error(error.message || 'Error saving vehicle', {
                position: 'top-right',
                autoClose: 3000
            });
        } finally {
            setSavingInProgress(false);
        }
    };

    const renderWarrantyBadge = (type) => {
        const colors = {
            Basic: 'bg-blue-500',
            Powertrain: 'bg-green-500',
            Extended: 'bg-purple-500'
        };

        return (
            <span className={`${colors[type]} text-white text-sm px-3 py-1 rounded-full`}>
                {type}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark">
                {isAuthenticated ? <Header /> : <PublicHeader />}
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-primary">Loading vehicle details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-background-dark">
                {isAuthenticated ? <Header /> : <PublicHeader />}
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="text-center text-text-primary">
                        <h2 className="text-2xl font-bold mb-4">Oops!</h2>
                        <p>{error || 'Vehicle not found'}</p>
                        <button 
                            onClick={() => navigate('/showroom')}
                            className="mt-4 px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Back to Showroom
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark">
            {isAuthenticated ? <Header /> : <PublicHeader />}
            
            {/* Breadcrumb */}
            <div className="bg-background-light py-4 mt-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-text-primary/70">
                        <Link to="/" className="hover:text-primary-light flex items-center">
                            <Home className="w-4 h-4 mr-1" />
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <Link to="/showroom" className="hover:text-primary-light">
                            Vehicles
                        </Link>
                        {vehicle.category?.[0] && (
                            <>
                                <ChevronRight className="w-4 h-4 mx-1" />
                                <Link to={`/showroom?category=${vehicle.category[0]}`} className="hover:text-primary-light">
                                    {vehicle.category[0]}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <Link to={`/showroom?brand=${vehicle.brand}`} className="hover:text-primary-light">
                            {vehicle.brand}
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span className="text-text-primary">{vehicle.model}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Top Section - Images and Key Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {showBookingForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-background-light rounded-lg max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                <BookingForm 
                                    vehicleId={id} 
                                    onClose={() => setShowBookingForm(false)} 
                                />
                            </div>
                        </div>
                    )}

                    {showInquiryForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-background-light rounded-lg max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                <InquiryForm 
                                    vehicleId={id} 
                                    onClose={() => setShowInquiryForm(false)} 
                                />
                            </div>
                        </div>
                    )}

                    {/* Left Column - Image Gallery */}
                    <div>
                        {/* Main Image */}
                        <motion.div 
                            className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer mb-4"
                            onClick={() => setShowGallery(true)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <img
                                src={vehicle?.media?.[activeImage]?.url || `https://ui-avatars.com/api/?name=${vehicle.brand}+${vehicle.model}&background=5d9adf&color=000000`}
                                alt={vehicle?.title || 'Vehicle Image'}
                                className="w-full h-full object-cover"
                            />
                            <motion.div 
                                className="absolute top-4 right-4 flex space-x-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveToggle();
                                    }}
                                    className={`p-2 rounded-full transition-all duration-300 ${
                                        savingInProgress 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-background-dark/50 hover:bg-background-dark hover:scale-110'
                                    }`}
                                    disabled={savingInProgress}
                                    whileHover={!savingInProgress ? { scale: 1.1 } : {}}
                                    whileTap={!savingInProgress ? { scale: 0.9 } : {}}
                                >
                                    <AnimatePresence mode="wait">
                                        {savingInProgress ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0, rotate: 0 }}
                                                animate={{ opacity: 1, rotate: 360 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                            />
                                        ) : isSaved ? (
                                            <motion.div
                                                key="saved"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                            >
                                                <Favorite className="text-primary-light text-2xl" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="unsaved"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                            >
                                                <FavoriteBorder className="text-white text-2xl" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Add share functionality
                                    }}
                                    className="p-2 bg-background-dark/50 rounded-full hover:bg-background-dark transition-colors"
                                >
                                    <Share className="text-white" />
                                </button>
                            </motion.div>
                        </motion.div>

                        {/* Thumbnail Navigation */}
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {vehicle?.media?.map((media, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                                        activeImage === index ? 'ring-2 ring-primary-light' : ''
                                    }`}
                                >
                                    <img
                                        src={media?.url || `https://ui-avatars.com/api/?name=${vehicle.brand}+${vehicle.model}&background=5d9adf&color=000000`}
                                        alt={`${vehicle?.title || 'Vehicle'} - View ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Vehicle Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            {vehicle?.title || 'Loading...'}
                        </h1>
                        
                        <div className="mb-6">
                            <p className="text-text-primary/70 text-lg mb-2">
                                {vehicle?.description?.short || 'Description not available'}
                            </p>
                            <div className="flex items-center space-x-4 text-text-primary/60">
                                <span className="flex items-center">
                                    <CalendarToday className="w-4 h-4 mr-1" />
                                    {vehicle?.year || 'N/A'}
                                </span>
                                <span className="flex items-center">
                                    <DirectionsCar className="w-4 h-4 mr-1" />
                                    {vehicle?.condition || 'N/A'}
                                </span>
                                <span className="flex items-center">
                                    <LocationOn className="w-4 h-4 mr-1" />
                                    {vehicle?.location?.address?.city || 'N/A'}, {vehicle?.location?.address?.state || 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-background-light rounded-lg p-6 mb-6">
                            <div className="flex items-baseline mb-4">
                                <span className="text-3xl font-bold text-primary-light">
                                    ${vehicle.pricing.basePrice.toLocaleString()}
                                </span>
                                {vehicle.pricing.discountedPrice && (
                                    <>
                                        <span className="ml-2 text-xl text-text-primary/50 line-through">
                                            ${vehicle.pricing.basePrice.toLocaleString()}
                                        </span>
                                        <span className="ml-2 text-green-500">
                                            Save ${(vehicle.pricing.basePrice - vehicle.pricing.discountedPrice).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Lease/Finance Options */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {vehicle.pricing.leaseOptions?.[0] && (
                                    <div className="p-4 bg-background-dark rounded-lg">
                                        <h3 className="text-lg font-semibold text-text-primary mb-2">Lease</h3>
                                        <p className="text-2xl font-bold text-primary-light">
                                            ${vehicle.pricing.leaseOptions[0].monthlyPayment}/mo
                                        </p>
                                        <p className="text-sm text-text-primary/70">
                                            for {vehicle.pricing.leaseOptions[0].duration} months
                                        </p>
                                    </div>
                                )}
                                {vehicle.pricing.financingOptions?.[0] && (
                                    <div className="p-4 bg-background-dark rounded-lg">
                                        <h3 className="text-lg font-semibold text-text-primary mb-2">Finance</h3>
                                        <p className="text-2xl font-bold text-primary-light">
                                            ${vehicle.pricing.financingOptions[0].monthlyPayment}/mo
                                        </p>
                                        <p className="text-sm text-text-primary/70">
                                            {vehicle.pricing.financingOptions[0].apr}% APR for {vehicle.pricing.financingOptions[0].duration} months
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <button 
                                    onClick={() => setShowBookingForm(true)}
                                    className="w-full py-3 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Book Now
                                </button>
                                <button 
                                    onClick={() => setShowInquiryForm(true)}
                                    className="w-full py-3 border-2 border-primary-light text-primary-light rounded-lg hover:bg-primary-light hover:text-white transition-colors"
                                >
                                    Ask a Question
                                </button>
                            </div>
                        </div>

                        {/* Quick Specs */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-background-light rounded-lg p-4 text-center">
                                <Speed className="text-primary-light mb-2" />
                                <p className="text-sm text-text-primary/70">0-60 mph</p>
                                <p className="text-lg font-semibold text-text-primary">
                                    {vehicle.specifications.performance.acceleration}
                                </p>
                            </div>
                            <div className="bg-background-light rounded-lg p-4 text-center">
                                <LocalGasStation className="text-primary-light mb-2" />
                                <p className="text-sm text-text-primary/70">Range</p>
                                <p className="text-lg font-semibold text-text-primary">
                                    {vehicle.specifications.performance.fuelEconomy.combined}
                                </p>
                            </div>
                            <div className="bg-background-light rounded-lg p-4 text-center">
                                <Settings className="text-primary-light mb-2" />
                                <p className="text-sm text-text-primary/70">Power</p>
                                <p className="text-lg font-semibold text-text-primary">
                                    {vehicle.specifications.engine.power}
                                </p>
                            </div>
                        </div>

                        {/* Reference Numbers */}
                        <div className="flex justify-between text-sm text-text-primary/50">
                            <span>VIN: {vehicle.vin}</span>
                            <span>Stock #: {vehicle.stockNumber}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Stats Bar */}
                <section className="mb-16 bg-background-light rounded-lg p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <Visibility className="text-primary-light mb-2" />
                            <p className="text-sm text-text-primary/70">Total Views</p>
                            <p className="text-xl font-semibold text-text-primary">
                                {vehicle.views?.total?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <History className="text-primary-light mb-2" />
                            <p className="text-sm text-text-primary/70">Previous Owners</p>
                            <p className="text-xl font-semibold text-text-primary">
                                {vehicle.history?.owners || 'New'}
                            </p>
                        </div>
                        <div className="text-center">
                            <Build className="text-primary-light mb-2" />
                            <p className="text-sm text-text-primary/70">Condition</p>
                            <p className="text-xl font-semibold text-text-primary">
                                {vehicle.condition}
                            </p>
                        </div>
                        <div className="text-center">
                            <EmojiEvents className="text-primary-light mb-2" />
                            <p className="text-sm text-text-primary/70">Rating</p>
                            <p className="text-xl font-semibold text-text-primary">
                                {vehicle.ratings?.average?.toFixed(1) || 'N/A'} 
                                {vehicle.ratings?.count ? `(${vehicle.ratings.count} reviews)` : ''}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Overview Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                        <Info className="mr-2" />
                        Overview
                    </h2>
                    <p className="text-text-primary/80 whitespace-pre-line mb-8">
                        {vehicle.description.full}
                    </p>
                    
                    {/* Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {vehicle.highlights.map((highlight, index) => (
                            <div
                                key={index}
                                className="bg-background-light rounded-lg p-4 text-center"
                            >
                                <p className="text-text-primary">{highlight}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Vehicle History */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                        <History className="mr-2" />
                        Vehicle History
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-background-light rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-text-primary mb-4">History Overview</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-text-primary/70">Previous Owners</span>
                                    <span className="text-text-primary">{vehicle.history?.owners || 'None'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-text-primary/70">Accidents Reported</span>
                                    <span className="text-text-primary">{vehicle.history?.accidents || 'None'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-text-primary/70">Service Records</span>
                                    <span className="text-text-primary">
                                        {vehicle.history?.serviceRecords ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                                {vehicle.history?.carfaxReport && (
                                    <a
                                        href={vehicle.history.carfaxReport}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-center mt-4 px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        View Carfax Report
                                    </a>
                                )}
                            </div>
                        </div>
                        {vehicle.warranty && (
                            <div className="bg-background-light rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-text-primary mb-4">Warranty Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        {vehicle.warranty.type && renderWarrantyBadge(vehicle.warranty.type)}
                                        {vehicle.warranty.duration && (
                                            <p className="mt-2 text-text-primary">{vehicle.warranty.duration}</p>
                                        )}
                                        {vehicle.warranty.coverage && (
                                            <p className="text-text-primary/70 text-sm mt-1">{vehicle.warranty.coverage}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Pricing Details */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                        <AttachMoney className="mr-2" />
                        Detailed Pricing
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lease Options */}
                        <div className="bg-background-light rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Lease Options</h3>
                            <div className="space-y-4">
                                {vehicle.pricing.leaseOptions.map((option, index) => (
                                    <div key={index} className="p-4 bg-background-dark rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-text-primary/70">Monthly Payment</span>
                                            <span className="text-xl font-bold text-primary-light">
                                                ${option.monthlyPayment}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-text-primary/70">Duration</span>
                                                <p className="text-text-primary">{option.duration} months</p>
                                            </div>
                                            <div>
                                                <span className="text-text-primary/70">Down Payment</span>
                                                <p className="text-text-primary">${option.downPayment}</p>
                                            </div>
                                            <div>
                                                <span className="text-text-primary/70">Mileage Limit</span>
                                                <p className="text-text-primary">{option.mileageLimit}/year</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Finance Options */}
                        <div className="bg-background-light rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Finance Options</h3>
                            <div className="space-y-4">
                                {vehicle.pricing.financingOptions.map((option, index) => (
                                    <div key={index} className="p-4 bg-background-dark rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-text-primary/70">Monthly Payment</span>
                                            <span className="text-xl font-bold text-primary-light">
                                                ${option.monthlyPayment}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-text-primary/70">Duration</span>
                                                <p className="text-text-primary">{option.duration} months</p>
                                            </div>
                                            <div>
                                                <span className="text-text-primary/70">APR</span>
                                                <p className="text-text-primary">{option.apr}%</p>
                                            </div>
                                            <div>
                                                <span className="text-text-primary/70">Down Payment</span>
                                                <p className="text-text-primary">${option.downPayment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Specifications Section - Enhanced */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                        <Build className="mr-2" />
                        Detailed Specifications
                    </h2>
                    
                    {/* Engine & Performance */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-primary mb-4">Engine & Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Engine Type</p>
                                <p className="text-text-primary">{vehicle.specifications.engine.type}</p>
                            </div>
                            {vehicle.specifications.engine.displacement && (
                                <div className="bg-background-light rounded-lg p-4">
                                    <p className="text-text-primary/70 mb-1">Displacement</p>
                                    <p className="text-text-primary">{vehicle.specifications.engine.displacement}</p>
                                </div>
                            )}
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Power Output</p>
                                <p className="text-text-primary">{vehicle.specifications.engine.power}</p>
                            </div>
                            {vehicle.specifications.engine.torque && (
                                <div className="bg-background-light rounded-lg p-4">
                                    <p className="text-text-primary/70 mb-1">Torque</p>
                                    <p className="text-text-primary">{vehicle.specifications.engine.torque}</p>
                                </div>
                            )}
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Transmission</p>
                                <p className="text-text-primary">{vehicle.specifications.engine.transmission}</p>
                            </div>
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Drivetrain</p>
                                <p className="text-text-primary">{vehicle.specifications.engine.drivetrain}</p>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-primary mb-4">Performance Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Acceleration</p>
                                <p className="text-text-primary">{vehicle.specifications.performance.acceleration}</p>
                            </div>
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Top Speed</p>
                                <p className="text-text-primary">{vehicle.specifications.performance.topSpeed}</p>
                            </div>
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Fuel Economy</p>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        <p className="text-text-primary/70">City</p>
                                        <p className="text-text-primary">{vehicle.specifications.performance.fuelEconomy.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-text-primary/70">Highway</p>
                                        <p className="text-text-primary">{vehicle.specifications.performance.fuelEconomy.highway}</p>
                                    </div>
                                    <div>
                                        <p className="text-text-primary/70">Combined</p>
                                        <p className="text-text-primary">{vehicle.specifications.performance.fuelEconomy.combined}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dimensions & Capacity */}
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-4">Dimensions & Capacity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Length</p>
                                <p className="text-text-primary">{vehicle.specifications.dimensions.length} mm</p>
                            </div>
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Width</p>
                                <p className="text-text-primary">{vehicle.specifications.dimensions.width} mm</p>
                            </div>
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Height</p>
                                <p className="text-text-primary">{vehicle.specifications.dimensions.height} mm</p>
                            </div>
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Wheelbase</p>
                                <p className="text-text-primary">{vehicle.specifications.dimensions.wheelbase} mm</p>
                            </div>
                            {vehicle.specifications.dimensions.groundClearance && (
                                <div className="bg-background-light rounded-lg p-4">
                                    <p className="text-text-primary/70 mb-1">Ground Clearance</p>
                                    <p className="text-text-primary">{vehicle.specifications.dimensions.groundClearance} mm</p>
                                </div>
                            )}
                            {vehicle.specifications.dimensions.cargoVolume && (
                                <div className="bg-background-light rounded-lg p-4">
                                    <p className="text-text-primary/70 mb-1">Cargo Volume</p>
                                    <p className="text-text-primary">{vehicle.specifications.dimensions.cargoVolume} L</p>
                                </div>
                            )}
                            <div className="bg-background-light rounded-lg p-4">
                                <p className="text-text-primary/70 mb-1">Seating Capacity</p>
                                <p className="text-text-primary">{vehicle.specifications.dimensions.seatingCapacity} passengers</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - keep existing but with icon */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                        <Garage className="mr-2" />
                        Features & Equipment
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Exterior Features */}
                        <div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Exterior</h3>
                            <ul className="space-y-2">
                                {vehicle.specifications.features.exterior.map((feature, index) => (
                                    <li key={index} className="flex items-center text-text-primary">
                                        <span className="w-2 h-2 bg-primary-light rounded-full mr-2"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Interior Features */}
                        <div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Interior</h3>
                            <ul className="space-y-2">
                                {vehicle.specifications.features.interior.map((feature, index) => (
                                    <li key={index} className="flex items-center text-text-primary">
                                        <span className="w-2 h-2 bg-primary-light rounded-full mr-2"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Safety Features */}
                        <div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Safety</h3>
                            <ul className="space-y-2">
                                {vehicle.specifications.features.safety.map((feature, index) => (
                                    <li key={index} className="flex items-center text-text-primary">
                                        <span className="w-2 h-2 bg-primary-light rounded-full mr-2"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Location Section - keep existing but with icon */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                        <LocationOn className="mr-2" />
                        Dealership Location
                    </h2>
                    <div className="bg-background-light rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-text-primary mb-2">
                                    {vehicle.location.dealership?.name || 'DriveSync Dealership'}
                                </h3>
                                <p className="text-text-primary/70">
                                    {vehicle.location.address.street}<br />
                                    {vehicle.location.address.city}, {vehicle.location.address.state} {vehicle.location.address.zipCode}
                                </p>
                            </div>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    `${vehicle.location.address.street} ${vehicle.location.address.city} ${vehicle.location.address.state}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>
                </section>

                {/* Reviews Section */}
                <ReviewSection vehicleId={id} />
            </div>

            {/* Purchase Section */}
            <div className="fixed bottom-0 left-0 right-0 bg-background-dark p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-text-primary text-2xl font-bold">
                            ${vehicle?.pricing?.basePrice?.toLocaleString() || 'Price on request'}
                        </p>
                        {vehicle?.pricing?.leaseOptions && (
                            <p className="text-text-secondary text-sm">
                                Lease from ${vehicle.pricing.leaseOptions[0]?.monthlyPayment}/mo
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowOrderForm(true)}
                        className="px-8 py-3 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                        disabled={!vehicle || vehicle.availability.status !== 'In Stock'}
                    >
                        {vehicle?.availability.status === 'In Stock' ? 'Purchase Now' : 'Not Available'}
                    </button>
                </div>
            </div>

            {/* Order Form Modal */}
            <AnimatePresence>
                {showOrderForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background-light rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <OrderForm
                                vehicle={vehicle}
                                onClose={() => setShowOrderForm(false)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default VehicleDetailPage; 