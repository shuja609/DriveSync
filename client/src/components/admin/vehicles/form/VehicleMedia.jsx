import React from 'react';
import { FiImage, FiStar, FiX } from 'react-icons/fi';

const VehicleMedia = ({ 
    images, 
    uploadingImages, 
    handleImageUpload, 
    handleSetPrimaryImage, 
    removeImage 
}) => {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Vehicle Images</h3>
                
                {/* Image Upload */}
                <div className="border-2 border-dashed border-primary-light rounded-lg p-8 text-center">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImages}
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        <FiImage className="w-12 h-12 text-primary-light mb-2" />
                        <span className="text-text-primary">
                            {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                        </span>
                        <span className="text-text-primary/70 text-sm mt-1">
                            Supports: JPG, PNG (Max 5MB each)
                        </span>
                    </label>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image.url}
                                alt={`Vehicle ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                <button
                                    type="button"
                                    onClick={() => handleSetPrimaryImage(index)}
                                    className={`p-2 rounded-full ${
                                        image.isPrimary
                                            ? 'bg-primary-light text-white'
                                            : 'bg-white text-gray-800 hover:bg-primary-light hover:text-white'
                                    }`}
                                    title={image.isPrimary ? 'Primary Image' : 'Set as Primary'}
                                >
                                    <FiStar />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    title="Remove Image"
                                >
                                    <FiX />
                                </button>
                            </div>
                            {image.isPrimary && (
                                <div className="absolute top-2 left-2 bg-primary-light text-white px-2 py-1 rounded-md text-sm">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VehicleMedia; 