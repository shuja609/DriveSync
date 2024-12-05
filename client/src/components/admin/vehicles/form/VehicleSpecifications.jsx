import React from 'react';

const ENGINE_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const TRANSMISSION_TYPES = ['Manual', 'Automatic', 'CVT', 'DCT', 'Single-Speed'];
const DRIVETRAIN_TYPES = ['FWD', 'RWD', 'AWD', '4WD'];

const VehicleSpecifications = ({ vehicle, handleNestedChange }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Engine Specifications */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Engine</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Engine Type
                        </label>
                        <select
                            name="type"
                            value={vehicle.specifications.engine.type}
                            onChange={(e) => handleNestedChange(e, 'specifications.engine')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                        >
                            {ENGINE_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Displacement
                        </label>
                        <input
                            type="text"
                            name="displacement"
                            value={vehicle.specifications.engine.displacement}
                            onChange={(e) => handleNestedChange(e, 'specifications.engine')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            placeholder="e.g., 2.0L"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Power Output
                        </label>
                        <input
                            type="text"
                            name="power"
                            value={vehicle.specifications.engine.power}
                            onChange={(e) => handleNestedChange(e, 'specifications.engine')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            placeholder="e.g., 201 hp @ 5500 rpm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Torque
                        </label>
                        <input
                            type="text"
                            name="torque"
                            value={vehicle.specifications.engine.torque}
                            onChange={(e) => handleNestedChange(e, 'specifications.engine')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            placeholder="e.g., 195 lb-ft @ 1500-4500 rpm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Transmission
                        </label>
                        <select
                            name="transmission"
                            value={vehicle.specifications.engine.transmission}
                            onChange={(e) => handleNestedChange(e, 'specifications.engine')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                        >
                            {TRANSMISSION_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Drivetrain
                        </label>
                        <select
                            name="drivetrain"
                            value={vehicle.specifications.engine.drivetrain}
                            onChange={(e) => handleNestedChange(e, 'specifications.engine')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                        >
                            {DRIVETRAIN_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Performance and Dimensions */}
            <div className="space-y-8">
                {/* Performance */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Acceleration (0-60)
                            </label>
                            <input
                                type="text"
                                name="acceleration"
                                value={vehicle.specifications.performance.acceleration}
                                onChange={(e) => handleNestedChange(e, 'specifications.performance')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                placeholder="e.g., 5.5 seconds"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Top Speed
                            </label>
                            <input
                                type="text"
                                name="topSpeed"
                                value={vehicle.specifications.performance.topSpeed}
                                onChange={(e) => handleNestedChange(e, 'specifications.performance')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                placeholder="e.g., 155 mph"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-text-primary">Fuel Economy</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={vehicle.specifications.performance.fuelEconomy.city}
                                    onChange={(e) => handleNestedChange(e, 'specifications.performance.fuelEconomy')}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                    placeholder="e.g., 25 mpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Highway
                                </label>
                                <input
                                    type="text"
                                    name="highway"
                                    value={vehicle.specifications.performance.fuelEconomy.highway}
                                    onChange={(e) => handleNestedChange(e, 'specifications.performance.fuelEconomy')}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                    placeholder="e.g., 32 mpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Combined
                                </label>
                                <input
                                    type="text"
                                    name="combined"
                                    value={vehicle.specifications.performance.fuelEconomy.combined}
                                    onChange={(e) => handleNestedChange(e, 'specifications.performance.fuelEconomy')}
                                    className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                    placeholder="e.g., 28 mpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dimensions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Dimensions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Length (mm)
                            </label>
                            <input
                                type="number"
                                name="length"
                                value={vehicle.specifications.dimensions.length}
                                onChange={(e) => handleNestedChange(e, 'specifications.dimensions')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Width (mm)
                            </label>
                            <input
                                type="number"
                                name="width"
                                value={vehicle.specifications.dimensions.width}
                                onChange={(e) => handleNestedChange(e, 'specifications.dimensions')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Height (mm)
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={vehicle.specifications.dimensions.height}
                                onChange={(e) => handleNestedChange(e, 'specifications.dimensions')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Wheelbase (mm)
                            </label>
                            <input
                                type="number"
                                name="wheelbase"
                                value={vehicle.specifications.dimensions.wheelbase}
                                onChange={(e) => handleNestedChange(e, 'specifications.dimensions')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Ground Clearance (mm)
                            </label>
                            <input
                                type="number"
                                name="groundClearance"
                                value={vehicle.specifications.dimensions.groundClearance}
                                onChange={(e) => handleNestedChange(e, 'specifications.dimensions')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Cargo Volume (L)
                            </label>
                            <input
                                type="number"
                                name="cargoVolume"
                                value={vehicle.specifications.dimensions.cargoVolume}
                                onChange={(e) => handleNestedChange(e, 'specifications.dimensions')}
                                className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Seating Capacity
                        </label>
                        <input
                            type="number"
                            name="seatingCapacity"
                            value={vehicle.specifications.dimensions.seatingCapacity}
                            onChange={(e) => handleNestedChange(e, 'specifications.dimensions')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            min="1"
                            max="9"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleSpecifications; 