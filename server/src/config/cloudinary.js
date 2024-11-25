const cloudinary = require('cloudinary').v2;
const keys = require('./keys');

// Cloudinary configuration
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
};

// Initialize Cloudinary with configuration
cloudinary.config(cloudinaryConfig);
console.log('Cloudinary initialized');

// Cloudinary settings
const settings = {
    folders: {
        profilePictures: 'drivesync/profile-pictures',
        carImages: 'drivesync/car-images',
        documents: 'drivesync/documents'
    },
    defaults: {
        quality: 'auto',
        fetch_format: 'auto',
        secure: true
    }
};

module.exports = {
    cloudinary,
    settings
}; 