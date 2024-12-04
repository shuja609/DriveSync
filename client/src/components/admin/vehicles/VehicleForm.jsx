import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiUpload, FiX } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import vehicleService from '../../../services/vehicleService';
import { toast } from 'react-toastify';
import { useCloudinary } from '../../../hooks/useCloudinary';

const VehicleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
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
            leaseOptions: [],
            financingOptions: []
        },
        category: [],
        tags: [],
        highlights: [],
        warranty: {
            type: 'Basic',
            duration: '',
            coverage: ''
        },
        availability: {
            status: 'In Stock',
            expectedDate: null
        }
    });

    const [media, setMedia] = useState([]);
    const [uploadingMedia, setUploadingMedia] = useState(false);

    const { uploadToCloudinary, deleteFromCloudinary } = useCloudinary();

    // Fetch vehicle data if editing
    useEffect(() => {
        if (isEditing) {
            fetchVehicle();
        }
    }, [id]);

    const fetchVehicle = async () => {
        try {
            setLoading(true);
            const response = await vehicleService.getVehicle(id);
            setVehicle(response.vehicle);
            setMedia(response.vehicle.media || []);
        } catch (error) {
            toast.error('Failed to load vehicle');
            console.error('Error fetching vehicle:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const vehicleData = {
                ...vehicle,
                media // Include the media array in the submission
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
            toast.error(isEditing ? 'Failed to update vehicle' : 'Failed to create vehicle');
            console.error('Error saving vehicle:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setVehicle(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: value
                }
            }));
        } else {
            setVehicle(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle media upload
    const handleMediaUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            setUploadingMedia(true);
            
            const uploadPromises = files.map(async (file) => {
                const result = await uploadToCloudinary(file, 'vehicles');
                return {
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    url: result.secure_url,
                    publicId: result.public_id,
                    order: media.length + 1
                };
            });

            const uploadedMedia = await Promise.all(uploadPromises);
            
            // If editing, save to backend
            if (isEditing) {
                const response = await vehicleService.updateVehicle(id, {
                    ...vehicle,
                    media: [...media, ...uploadedMedia]
                });
                setVehicle(response.vehicle);
                setMedia(response.vehicle.media);
            } else {
                // If creating new, just update local state
                setMedia(prev => [...prev, ...uploadedMedia]);
            }
            
            toast.success('Media uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload media');
            console.error('Error uploading media:', error);
        } finally {
            setUploadingMedia(false);
        }
    };

    // Handle media reorder
    const handleMediaReorder = async (result) => {
        if (!result.destination) return;

        const items = Array.from(media);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setMedia(items);

        try {
            await vehicleService.updateMediaOrder(id, items.map(item => item._id));
        } catch (error) {
            toast.error('Failed to update media order');
            console.error('Error updating media order:', error);
        }
    };

    // Handle media delete
    const handleMediaDelete = async (mediaItem) => {
        try {
            // Delete from Cloudinary
            await deleteFromCloudinary(mediaItem.publicId);

            // If editing, update backend
            if (isEditing) {
                const updatedMedia = media.filter(item => item._id !== mediaItem._id);
                const response = await vehicleService.updateVehicle(id, {
                    ...vehicle,
                    media: updatedMedia
                });
                setVehicle(response.vehicle);
                setMedia(response.vehicle.media);
            } else {
                // If creating new, just update local state
                setMedia(prev => prev.filter(item => item.publicId !== mediaItem.publicId));
            }

            toast.success('Media deleted successfully');
        } catch (error) {
            toast.error('Failed to delete media');
            console.error('Error deleting media:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">
                    {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h1>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <FiSave /> {loading ? 'Saving...' : 'Save Vehicle'}
                </button>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={vehicle.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={vehicle.brand}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <input
                            type="text"
                            name="model"
                            value={vehicle.model}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Year</label>
                        <input
                            type="number"
                            name="year"
                            value={vehicle.year}
                            onChange={handleChange}
                            required
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">VIN</label>
                        <input
                            type="text"
                            name="vin"
                            value={vehicle.vin}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock Number</label>
                        <input
                            type="text"
                            name="stockNumber"
                            value={vehicle.stockNumber}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Media Upload */}
            {isEditing && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Media</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Images/Videos
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleMediaUpload}
                            disabled={uploadingMedia}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <DragDropContext onDragEnd={handleMediaReorder}>
                        <Droppable droppableId="media" direction="horizontal">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex flex-wrap gap-4"
                                >
                                    {media.map((item, index) => (
                                        <Draggable
                                            key={item._id}
                                            draggableId={item._id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="relative group"
                                                >
                                                    <img
                                                        src={item.url}
                                                        alt=""
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMediaDelete(item)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Description</label>
                        <input
                            type="text"
                            name="short"
                            value={vehicle.description.short}
                            onChange={(e) => handleChange(e, 'description')}
                            maxLength={200}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Description</label>
                        <textarea
                            name="full"
                            value={vehicle.description.full}
                            onChange={(e) => handleChange(e, 'description')}
                            required
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Base Price</label>
                        <input
                            type="number"
                            name="basePrice"
                            value={vehicle.pricing.basePrice}
                            onChange={(e) => handleChange(e, 'pricing')}
                            required
                            min="0"
                            step="0.01"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discounted Price</label>
                        <input
                            type="number"
                            name="discountedPrice"
                            value={vehicle.pricing.discountedPrice}
                            onChange={(e) => handleChange(e, 'pricing')}
                            min="0"
                            step="0.01"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Availability</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={vehicle.availability.status}
                            onChange={(e) => handleChange(e, 'availability')}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="In Stock">In Stock</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Sold">Sold</option>
                            <option value="Reserved">Reserved</option>
                        </select>
                    </div>
                    {vehicle.availability.status === 'In Transit' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expected Date</label>
                            <input
                                type="date"
                                name="expectedDate"
                                value={vehicle.availability.expectedDate || ''}
                                onChange={(e) => handleChange(e, 'availability')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default VehicleForm; 