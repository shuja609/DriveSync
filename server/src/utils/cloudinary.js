const { cloudinary, settings } = require('../config/cloudinary');
const { unlink } = require('fs').promises;

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Path to the local file
 * @param {string} folder - Cloudinary folder to upload to
 * @returns {Promise} Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'general') => {
    try {
        // Get the appropriate folder path from settings
        const uploadFolder = settings.folders[folder] || settings.folders.documents;

        // Upload the file
        const result = await cloudinary.uploader.upload(filePath, {
            folder: uploadFolder,
            resource_type: 'auto',
            use_filename: true,
            unique_filename: true,
            ...settings.defaults
        });

        // Delete the local file after successful upload
        await unlink(filePath);

        return result;
    } catch (error) {
        // Delete the local file if upload fails
        await unlink(filePath).catch(console.error);
        throw new Error(`Error uploading to Cloudinary: ${error.message}`);
    }
};

/**
 * Remove file from Cloudinary
 * @param {string} publicIdOrUrl - Cloudinary public ID or URL of the file
 * @returns {Promise} Cloudinary deletion result
 */
const removeFromCloudinary = async (publicIdOrUrl) => {
    try {
        // If URL is provided, extract public ID
        let publicId = publicIdOrUrl;
        if (publicIdOrUrl.includes('cloudinary.com')) {
            // Extract public ID from URL
            const urlParts = publicIdOrUrl.split('/');
            publicId = urlParts[urlParts.length - 1].split('.')[0];
        }

        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Error removing from Cloudinary: ${error.message}`);
    }
};

/**
 * Get Cloudinary URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Transformed URL
 */
const getCloudinaryUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, {
        ...settings.defaults,
        ...options
    });
};

module.exports = {
    uploadToCloudinary,
    removeFromCloudinary,
    getCloudinaryUrl
}; 