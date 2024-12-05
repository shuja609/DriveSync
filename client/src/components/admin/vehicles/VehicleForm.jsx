import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCloudinary } from '../../../hooks/useCloudinary';
import vehicleService from '../../../services/vehicleService';
import { toast } from 'react-toastify';
import Button from '../../common/Button';

// Import form components
import VehicleBasicInfo from './form/VehicleBasicInfo';
import VehicleSpecifications from './form/VehicleSpecifications';
import VehicleFeatures from './form/VehicleFeatures';
import VehiclePricing from './form/VehiclePricing';
import VehicleMedia from './form/VehicleMedia';
import VehicleLocation from './form/VehicleLocation';
import VehicleHistoryForm from './form/VehicleHistoryForm';

const VehicleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const { uploadToCloudinary } = useCloudinary();

    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [images, setImages] = useState([]);
    const [activeTab, setActiveTab] = useState('basic');
    const [vehicle, setVehicle] = useState({
        title: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        condition: 'New',
        mileage: 0,
        exteriorColor: { name: '', hexCode: '' },
        interiorColor: { name: '', hexCode: '' },
        vin: '',
        stockNumber: '',
        description: {
            short: '',
            full: ''
        },
        specifications: {
            engine: {
                type: 'Petrol',
                displacement: '',
                power: '',
                torque: '',
                transmission: 'Automatic',
                drivetrain: 'FWD'
            },
            performance: {
                acceleration: '',
                topSpeed: '',
                fuelEconomy: {
                    city: '',
                    highway: '',
                    combined: ''
                }
            },
            dimensions: {
                length: 0,
                width: 0,
                height: 0,
                wheelbase: 0,
                groundClearance: 0,
                cargoVolume: 0,
                seatingCapacity: 5
            },
            features: {
                exterior: [],
                interior: [],
                safety: [],
                technology: [],
                comfort: []
            }
        },
        pricing: {
            basePrice: 0,
            discountedPrice: 0,
            discountExpiry: '',
            leaseOptions: [{
                duration: 36,
                monthlyPayment: 0,
                downPayment: 0,
                mileageLimit: 12000
            }],
            financingOptions: [{
                duration: 60,
                apr: 3.99,
                monthlyPayment: 0,
                downPayment: 0
            }]
        },
        category: [],
        tags: [],
        highlights: [],
        warranty: {
            type: 'Basic',
            duration: '',
            coverage: ''
        },
        location: {
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                coordinates: {
                    latitude: 0,
                    longitude: 0
                }
            }
        },
        availability: {
            status: 'In Stock',
            expectedDate: null
        },
        history: {
            owners: 0,
            accidents: 0,
            serviceRecords: false,
            carfaxReport: ''
        },
        media: []
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditing) {
            fetchVehicle();
        }
    }, [id]);

    const fetchVehicle = async () => {
        setLoading(true);
        try {
            const data = await vehicleService.getVehicle(id);
            const vehicleData = data.vehicle;
            setVehicle(vehicleData);
            
            // Set images with proper structure
            if (vehicleData.media && vehicleData.media.length > 0) {
                setImages(vehicleData.media.map(m => ({
                    url: m.url,
                    isPrimary: m.isPrimary,
                    type: m.type || 'image',
                    order: m.order || 0
                })));
            }
        } catch (error) {
            toast.error('Failed to fetch vehicle details');
            console.error('Fetch vehicle error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? Number(value) : value;
        
        setVehicle(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleNestedChange = (e, path) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? Number(value) : value;
        const pathArray = path.split('.');
        
        setVehicle(prev => {
            const newVehicle = { ...prev };
            let current = newVehicle;
            
            // Navigate through the path
            for (let i = 0; i < pathArray.length; i++) {
                if (i === pathArray.length - 1) {
                    // We're at the last path segment, update the value
                    current[pathArray[i]] = {
                        ...current[pathArray[i]],
                        [name]: finalValue
                    };
                } else {
                    // Create a new reference for nested objects
                    current[pathArray[i]] = { ...current[pathArray[i]] };
                    current = current[pathArray[i]];
                }
            }
            
            return newVehicle;
        });
    };

    const handleMultiSelect = (e, field) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setVehicle(prev => ({
            ...prev,
            [field]: values
        }));
    };

    const handleTagsChange = (e) => {
        const value = e.target.value;
        const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
        setVehicle(prev => ({
            ...prev,
            tags: value.endsWith(',') ? [...tags, ''] : tags
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setUploadingImages(true);
        try {
            const uploadedImages = await Promise.all(
                files.map(async (file) => {
                    const result = await uploadToCloudinary(file);
                    return {
                        url: result.secure_url,
                        isPrimary: false,
                        type: 'image',
                        order: images.length // Add order based on current length
                    };
                })
            );

            setImages(prev => {
                const newImages = [...prev, ...uploadedImages];
                // If this is the first image, make it primary
                if (prev.length === 0 && uploadedImages.length > 0) {
                    newImages[0].isPrimary = true;
                }
                return newImages;
            });
        } catch (error) {
            toast.error('Failed to upload images');
            console.error('Image upload error:', error);
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index) => {
        setImages(prev => {
            const newImages = prev.filter((_, i) => i !== index);
            // If we removed the primary image and there are other images, make the first one primary
            if (prev[index].isPrimary && newImages.length > 0) {
                newImages[0].isPrimary = true;
            }
            // Update order after removal
            return newImages.map((img, i) => ({
                ...img,
                order: i
            }));
        });
    };

    const handleSetPrimaryImage = (index) => {
        setImages(prev => prev.map((img, i) => ({
            ...img,
            isPrimary: i === index
        })));
    };

    const handleFinancingOptionChange = (index, field, value) => {
        setVehicle(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                financingOptions: prev.pricing.financingOptions.map((option, i) =>
                    i === index ? { ...option, [field]: parseFloat(value) || 0 } : option
                )
            }
        }));
    };

    const handleLeaseOptionChange = (index, field, value) => {
        setVehicle(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                leaseOptions: prev.pricing.leaseOptions.map((option, i) =>
                    i === index ? { ...option, [field]: parseFloat(value) || 0 } : option
                )
            }
        }));
    };

    const addFinancingOption = () => {
        setVehicle(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                financingOptions: [
                    ...prev.pricing.financingOptions,
                    {
                        duration: 60,
                        apr: 3.99,
                        monthlyPayment: 0,
                        downPayment: 0
                    }
                ]
            }
        }));
    };

    const addLeaseOption = () => {
        setVehicle(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                leaseOptions: [
                    ...prev.pricing.leaseOptions,
                    {
                        duration: 36,
                        monthlyPayment: 0,
                        downPayment: 0,
                        mileageLimit: 12000
                    }
                ]
            }
        }));
    };

    const removeFinancingOption = (index) => {
        setVehicle(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                financingOptions: prev.pricing.financingOptions.filter((_, i) => i !== index)
            }
        }));
    };

    const removeLeaseOption = (index) => {
        setVehicle(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                leaseOptions: prev.pricing.leaseOptions.filter((_, i) => i !== index)
            }
        }));
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // VIN validation helper
        const isValidVin = (vin) => {
            if (!vin || vin.length !== 17) return false;
            return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
        };

        // Stock number validation helper
        const isValidStockNumber = (stockNumber) => {
            if (!stockNumber) return false;
            // Only allow letters and numbers, at least 1 character
            return /^[A-Z0-9]+$/.test(stockNumber);
        };

        // Basic Info Validation
        if (!vehicle.title || vehicle.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters long';
        }
        if (!vehicle.brand || vehicle.brand.length < 2) {
            newErrors.brand = 'Brand is required';
        }
        if (!vehicle.model) {
            newErrors.model = 'Model is required';
        }
        if (!vehicle.year || vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
            newErrors.year = 'Please enter a valid year';
        }
        if (!vehicle.condition) {
            newErrors.condition = 'Condition is required';
        }
        if (vehicle.condition !== 'New' && (!vehicle.mileage || vehicle.mileage < 0)) {
            newErrors.mileage = 'Please enter a valid mileage';
        }
        if (!isValidVin(vehicle.vin)) {
            newErrors.vin = 'VIN must be exactly 17 characters and contain only valid characters (letters except I,O,Q and numbers)';
        }
        if (!isValidStockNumber(vehicle.stockNumber)) {
            newErrors.stockNumber = 'Stock number must contain only letters and numbers';
        }
        if (!vehicle.description.short || vehicle.description.short.length < 10) {
            newErrors['description.short'] = 'Short description must be at least 10 characters';
        }
        if (!vehicle.description.full || vehicle.description.full.length < 50) {
            newErrors['description.full'] = 'Full description must be at least 50 characters';
        }
        if (!vehicle.category || vehicle.category.length === 0) {
            newErrors.category = 'Please select at least one category';
        }

        // Add more validations for other tabs as needed...

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the validation errors before submitting');
            return;
        }

        setLoading(true);

        try {
            const vehicleData = {
                ...vehicle,
                vin: vehicle.vin.toUpperCase(),
                stockNumber: vehicle.stockNumber.toUpperCase(),
                media: images.map(img => ({
                    type: 'image',
                    url: img.url,
                    isPrimary: img.isPrimary,
                    order: img.order || 0
                }))
            };

            if (isEditing) {
                await vehicleService.updateVehicle(id, vehicleData);
                toast.success('Vehicle updated successfully');
            } else {
                await vehicleService.createVehicle(vehicleData);
                toast.success('Vehicle created successfully');
            }

            navigate('/admin/vehicles');
        } catch (error) {
            let errorMessage = error.response?.data?.message || error.message || 'Failed to save vehicle';
            
            // Handle duplicate key errors
            if (error.response?.data?.code === 11000 || error.response?.status === 409) {
                const field = Object.keys(error.response?.data?.keyPattern || {})[0];
                const value = error.response?.data?.keyValue?.[field];
                
                if (field === 'stockNumber') {
                    errorMessage = `Stock number "${value}" is already in use. Please choose a different one.`;
                    setErrors(prev => ({
                        ...prev,
                        stockNumber: errorMessage
                    }));
                } else if (field === 'vin') {
                    errorMessage = `VIN "${value}" is already registered. Please check the number and try again.`;
                    setErrors(prev => ({
                        ...prev,
                        vin: errorMessage
                    }));
                }
            } else if (error.response?.data?.errors) {
                // Handle validation errors from server
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    serverErrors[err.field] = err.message;
                });
                setErrors(serverErrors);
            }
            
            toast.error(errorMessage);
            console.error('Save vehicle error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const renderTabButton = (tab, label) => (
        <button
            type="button"
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-t-lg ${
                activeTab === tab
                    ? 'bg-primary-light text-white'
                    : 'bg-background-light text-text-primary hover:bg-primary-light/10'
            }`}
        >
            {label}
        </button>
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex space-x-4 border-b border-background-light">
                    {renderTabButton('basic', 'Basic Information')}
                    {renderTabButton('specs', 'Specifications')}
                    {renderTabButton('features', 'Features')}
                    {renderTabButton('pricing', 'Pricing')}
                    {renderTabButton('media', 'Media')}
                    {renderTabButton('location', 'Location')}
                    {renderTabButton('history', 'History')}
                </div>

                <div className="mt-6">
                    {activeTab === 'basic' && (
                        <VehicleBasicInfo
                            vehicle={vehicle}
                            handleChange={handleChange}
                            handleNestedChange={handleNestedChange}
                            handleMultiSelect={handleMultiSelect}
                            handleTagsChange={handleTagsChange}
                            errors={errors}
                        />
                    )}
                    {activeTab === 'specs' && (
                        <VehicleSpecifications
                            vehicle={vehicle}
                            handleNestedChange={handleNestedChange}
                        />
                    )}
                    {activeTab === 'features' && (
                        <VehicleFeatures
                            vehicle={vehicle}
                            setVehicle={setVehicle}
                        />
                    )}
                    {activeTab === 'pricing' && (
                        <VehiclePricing
                            vehicle={vehicle}
                            handleNestedChange={handleNestedChange}
                            handleFinancingOptionChange={handleFinancingOptionChange}
                            handleLeaseOptionChange={handleLeaseOptionChange}
                            addFinancingOption={addFinancingOption}
                            removeFinancingOption={removeFinancingOption}
                            addLeaseOption={addLeaseOption}
                            removeLeaseOption={removeLeaseOption}
                        />
                    )}
                    {activeTab === 'media' && (
                        <VehicleMedia
                            images={images}
                            uploadingImages={uploadingImages}
                            handleImageUpload={handleImageUpload}
                            handleSetPrimaryImage={handleSetPrimaryImage}
                            removeImage={removeImage}
                        />
                    )}
                    {activeTab === 'location' && (
                        <VehicleLocation
                            vehicle={vehicle}
                            handleNestedChange={handleNestedChange}
                        />
                    )}
                    {activeTab === 'history' && (
                        <VehicleHistoryForm
                            vehicle={vehicle}
                            handleNestedChange={handleNestedChange}
                        />
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin/vehicles')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : isEditing ? 'Update Vehicle' : 'Create Vehicle'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VehicleForm; 