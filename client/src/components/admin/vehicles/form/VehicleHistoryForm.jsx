import React from 'react';

const WARRANTY_TYPES = ['Basic', 'Powertrain', 'Extended'];

const VehicleHistoryForm = ({ vehicle, handleNestedChange }) => {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Vehicle History</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Number of Previous Owners
                        </label>
                        <input
                            type="number"
                            name="owners"
                            value={vehicle.history.owners}
                            onChange={(e) => handleNestedChange(e, 'history')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Number of Accidents
                        </label>
                        <input
                            type="number"
                            name="accidents"
                            value={vehicle.history.accidents}
                            onChange={(e) => handleNestedChange(e, 'history')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            min="0"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="serviceRecords"
                        checked={vehicle.history.serviceRecords}
                        onChange={(e) => handleNestedChange(e, 'history')}
                        className="w-4 h-4 text-primary-light bg-background-light border-gray-300 rounded focus:ring-primary-light"
                    />
                    <label className="text-sm font-medium text-text-primary">
                        Service Records Available
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Carfax Report URL
                    </label>
                    <input
                        type="url"
                        name="carfaxReport"
                        value={vehicle.history.carfaxReport}
                        onChange={(e) => handleNestedChange(e, 'history')}
                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                        placeholder="https://www.carfax.com/report/..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Warranty Type
                    </label>
                    <select
                        name="type"
                        value={vehicle.warranty.type}
                        onChange={(e) => handleNestedChange(e, 'warranty')}
                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                    >
                        <option value="">Select warranty type</option>
                        {WARRANTY_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {vehicle.warranty.type && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Warranty Duration
                            </label>
                            <input
                                type="text"
                                name="duration"
                                value={vehicle.warranty.duration}
                                onChange={(e) => handleNestedChange(e, 'warranty')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                placeholder="e.g., 3 years/36,000 miles"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Warranty Coverage Details
                            </label>
                            <textarea
                                name="coverage"
                                value={vehicle.warranty.coverage}
                                onChange={(e) => handleNestedChange(e, 'warranty')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                rows="4"
                                placeholder="Describe what is covered under the warranty..."
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VehicleHistoryForm; 