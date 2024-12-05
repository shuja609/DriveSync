import React from 'react';

const VEHICLE_CATEGORIES = ['Luxury', 'Sports', 'SUV', 'Sedan', 'Truck', 'Van', 'Compact', 'Electric'];
const VEHICLE_CONDITIONS = ['New', 'Used', 'Certified Pre-Owned'];

const VehicleBasicInfo = ({ vehicle, handleChange, handleNestedChange, handleMultiSelect, handleTagsChange, errors }) => {
    // Handle VIN input with auto-formatting
    const handleVinChange = (e) => {
        let value = e.target.value;
        
        // Remove any invalid characters and convert to uppercase
        value = value.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase();
        
        // Limit to 17 characters
        value = value.slice(0, 17);
        
        // Create a synthetic event
        const syntheticEvent = {
            target: {
                name: 'vin',
                value
            }
        };
        
        handleChange(syntheticEvent);
    };

    // Handle stock number input with auto-formatting
    const handleStockNumberChange = (e) => {
        let value = e.target.value;
        // Remove spaces and special characters, allow only letters and numbers
        value = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        
        const syntheticEvent = {
            target: {
                name: 'stockNumber',
                value
            }
        };
        
        handleChange(syntheticEvent);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={vehicle.title}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                            errors?.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        minLength={3}
                    />
                    {errors?.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Brand <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="brand"
                            value={vehicle.brand}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                                errors?.brand ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                            minLength={2}
                        />
                        {errors?.brand && (
                            <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Model <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="model"
                            value={vehicle.model}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                                errors?.model ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                            minLength={1}
                        />
                        {errors?.model && (
                            <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Year <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="year"
                            value={vehicle.year}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                                errors?.year ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                            min={1900}
                            max={new Date().getFullYear() + 1}
                        />
                        {errors?.year && (
                            <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Condition <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="condition"
                            value={vehicle.condition}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                                errors?.condition ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        >
                            {VEHICLE_CONDITIONS.map(condition => (
                                <option key={condition} value={condition}>
                                    {condition}
                                </option>
                            ))}
                        </select>
                        {errors?.condition && (
                            <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
                        )}
                    </div>
                </div>

                {vehicle.condition !== 'New' && (
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Mileage <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="mileage"
                            value={vehicle.mileage}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                                errors?.mileage ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                            min={0}
                        />
                        {errors?.mileage && (
                            <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            VIN <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="vin"
                            value={vehicle.vin}
                            onChange={handleVinChange}
                            className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                                errors?.vin ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                            maxLength={17}
                            placeholder="e.g., 1HGCM82633A123456"
                        />
                        {errors?.vin ? (
                            <p className="text-red-500 text-sm mt-1">{errors.vin}</p>
                        ) : (
                            <p className="text-gray-500 text-sm mt-1">
                                {vehicle.vin.length}/17 characters - Letters (except I,O,Q) and numbers
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Stock Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="stockNumber"
                            value={vehicle.stockNumber}
                            onChange={handleStockNumberChange}
                            className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                                errors?.stockNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                            placeholder="e.g., ABC123"
                        />
                        {errors?.stockNumber ? (
                            <p className="text-red-500 text-sm mt-1">{errors.stockNumber}</p>
                        ) : (
                            <p className="text-gray-500 text-sm mt-1">
                                Letters and numbers only, must be unique
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="short"
                        value={vehicle.description.short}
                        onChange={(e) => handleNestedChange(e, 'description')}
                        className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                            errors?.['description.short'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows="2"
                        maxLength="200"
                        required
                    />
                    {errors?.['description.short'] ? (
                        <p className="text-red-500 text-sm mt-1">{errors['description.short']}</p>
                    ) : (
                        <p className="text-gray-500 text-sm mt-1">
                            {200 - (vehicle.description.short?.length || 0)} characters remaining
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Full Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="full"
                        value={vehicle.description.full}
                        onChange={(e) => handleNestedChange(e, 'description')}
                        className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                            errors?.['description.full'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows="4"
                        required
                        minLength={50}
                    />
                    {errors?.['description.full'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['description.full']}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Categories <span className="text-red-500">*</span>
                    </label>
                    <select
                        multiple
                        name="category"
                        value={vehicle.category}
                        onChange={(e) => handleMultiSelect(e, 'category')}
                        className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                            errors?.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    >
                        {VEHICLE_CATEGORIES.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    {errors?.category ? (
                        <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    ) : (
                        <p className="text-gray-500 text-sm mt-1">Hold Ctrl/Cmd to select multiple</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Tags
                    </label>
                    <input
                        type="text"
                        value={vehicle.tags.join(', ')}
                        onChange={handleTagsChange}
                        className={`w-full px-3 py-2 bg-background-light text-text-primary rounded-lg border ${
                            errors?.tags ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="luxury, leather, sunroof"
                    />
                    {errors?.tags ? (
                        <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
                    ) : (
                        <p className="text-gray-500 text-sm mt-1">Separate tags with commas</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleBasicInfo; 