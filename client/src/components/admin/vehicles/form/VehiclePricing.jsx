import React from 'react';

const VehiclePricing = ({ 
    vehicle, 
    handleNestedChange, 
    handleFinancingOptionChange, 
    handleLeaseOptionChange,
    addFinancingOption,
    removeFinancingOption,
    addLeaseOption,
    removeLeaseOption
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Base Pricing */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Base Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Base Price (USD)
                        </label>
                        <input
                            type="number"
                            name="basePrice"
                            value={vehicle.pricing.basePrice}
                            onChange={(e) => handleNestedChange(e, 'pricing')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Discounted Price (USD)
                        </label>
                        <input
                            type="number"
                            name="discountedPrice"
                            value={vehicle.pricing.discountedPrice}
                            onChange={(e) => handleNestedChange(e, 'pricing')}
                            className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        Discount Expiry
                    </label>
                    <input
                        type="datetime-local"
                        name="discountExpiry"
                        value={vehicle.pricing.discountExpiry}
                        onChange={(e) => handleNestedChange(e, 'pricing')}
                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                    />
                </div>
            </div>

            {/* Financing Options */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">Financing Options</h3>
                    {vehicle.pricing.financingOptions.map((option, index) => (
                        <div key={index} className="mt-4 p-4 bg-background-dark rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Duration (months)
                                    </label>
                                    <input
                                        type="number"
                                        value={option.duration}
                                        onChange={(e) => handleFinancingOptionChange(index, 'duration', e.target.value)}
                                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                        min="12"
                                        max="84"
                                        step="12"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        APR (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={option.apr}
                                        onChange={(e) => handleFinancingOptionChange(index, 'apr', e.target.value)}
                                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Monthly Payment
                                    </label>
                                    <input
                                        type="number"
                                        value={option.monthlyPayment}
                                        onChange={(e) => handleFinancingOptionChange(index, 'monthlyPayment', e.target.value)}
                                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Down Payment
                                    </label>
                                    <input
                                        type="number"
                                        value={option.downPayment}
                                        onChange={(e) => handleFinancingOptionChange(index, 'downPayment', e.target.value)}
                                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFinancingOption(index)}
                                className="mt-2 text-red-500 text-sm hover:text-red-400"
                            >
                                Remove Option
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFinancingOption}
                        className="mt-4 text-primary-light hover:text-primary-dark"
                    >
                        + Add Financing Option
                    </button>
                </div>

                {/* Lease Options */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-text-primary">Lease Options</h3>
                    {vehicle.pricing.leaseOptions.map((option, index) => (
                        <div key={index} className="mt-4 p-4 bg-background-dark rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Duration (months)
                                    </label>
                                    <input
                                        type="number"
                                        value={option.duration}
                                        onChange={(e) => handleLeaseOptionChange(index, 'duration', e.target.value)}
                                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                        min="12"
                                        max="48"
                                        step="12"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Monthly Payment
                                    </label>
                                    <input
                                        type="number"
                                        value={option.monthlyPayment}
                                        onChange={(e) => handleLeaseOptionChange(index, 'monthlyPayment', e.target.value)}
                                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Down Payment
                                    </label>
                                    <input
                                        type="number"
                                        value={option.downPayment}
                                        onChange={(e) => handleLeaseOptionChange(index, 'downPayment', e.target.value)}
                                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        Mileage Limit (per year)
                                    </label>
                                    <input
                                        type="number"
                                        value={option.mileageLimit}
                                        onChange={(e) => handleLeaseOptionChange(index, 'mileageLimit', e.target.value)}
                                        className="w-full px-3 py-2 bg-background-light text-text-primary rounded-lg"
                                        min="5000"
                                        step="1000"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeLeaseOption(index)}
                                className="mt-2 text-red-500 text-sm hover:text-red-400"
                            >
                                Remove Option
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addLeaseOption}
                        className="mt-4 text-primary-light hover:text-primary-dark"
                    >
                        + Add Lease Option
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehiclePricing; 