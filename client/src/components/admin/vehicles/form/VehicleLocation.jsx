import React from 'react';

const AVAILABILITY_STATUS = ['In Stock', 'In Transit', 'Sold', 'Reserved'];

const VehicleLocation = ({ vehicle, handleNestedChange }) => {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Location Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Street Address
                        </label>
                        <input
                            type="text"
                            name="street"
                            value={vehicle.location.address.street}
                            onChange={(e) => handleNestedChange(e, 'location.address')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={vehicle.location.address.city}
                            onChange={(e) => handleNestedChange(e, 'location.address')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            State
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={vehicle.location.address.state}
                            onChange={(e) => handleNestedChange(e, 'location.address')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            ZIP Code
                        </label>
                        <input
                            type="text"
                            name="zipCode"
                            value={vehicle.location.address.zipCode}
                            onChange={(e) => handleNestedChange(e, 'location.address')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            pattern="[0-9]{5}"
                            title="Five digit ZIP code"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Country
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={vehicle.location.address.country}
                            onChange={(e) => handleNestedChange(e, 'location.address')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Latitude
                        </label>
                        <input
                            type="number"
                            name="latitude"
                            value={vehicle.location.address.coordinates.latitude}
                            onChange={(e) => handleNestedChange(e, 'location.address.coordinates')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            step="0.000001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Longitude
                        </label>
                        <input
                            type="number"
                            name="longitude"
                            value={vehicle.location.address.coordinates.longitude}
                            onChange={(e) => handleNestedChange(e, 'location.address.coordinates')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            step="0.000001"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Availability Status
                    </label>
                    <select
                        name="status"
                        value={vehicle.availability.status}
                        onChange={(e) => handleNestedChange(e, 'availability')}
                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                    >
                        {AVAILABILITY_STATUS.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {vehicle.availability.status === 'In Transit' && (
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Expected Arrival Date
                        </label>
                        <input
                            type="date"
                            name="expectedDate"
                            value={vehicle.availability.expectedDate ? new Date(vehicle.availability.expectedDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleNestedChange(e, 'availability')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleLocation; 