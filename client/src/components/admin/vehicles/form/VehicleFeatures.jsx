import React from 'react';

const VehicleFeatures = ({ vehicle, setVehicle }) => {
    const handleFeatureChange = (featureType, value) => {
        const features = value.split('\n').filter(f => f.trim());
        setVehicle(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                features: {
                    ...prev.specifications.features,
                    [featureType]: features
                }
            }
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.keys(vehicle.specifications.features).map((featureType) => (
                <div key={featureType} className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary capitalize">
                        {featureType} Features
                    </h3>
                    <div>
                        <textarea
                            name={featureType}
                            value={vehicle.specifications.features[featureType].join('\n')}
                            onChange={(e) => handleFeatureChange(featureType, e.target.value)}
                            placeholder={`Enter ${featureType} features (one per line)`}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            rows={6}
                        />
                        <p className="mt-1 text-sm text-text-primary/70">
                            Enter one feature per line
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VehicleFeatures; 