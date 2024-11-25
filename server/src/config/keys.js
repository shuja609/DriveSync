/**
 * Configuration file for API keys and sensitive credentials
 * All values should be set in environment variables
 */

const keys = {
    app: {
        name: process.env.APP_NAME || 'DriveSync',
        env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000,
        apiUrl: process.env.API_URL || 'http://localhost:3000/api',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },

    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/DriveSync'
    },

    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/social/google/callback'
    },

    facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/auth/social/facebook/callback'
    },

    twitter: {
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL || '/auth/social/twitter/callback'
    },

    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER // Default to EMAIL_USER if FROM not specified
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },

    // Validate required environment variables
    validate() {
        const required = [
            'JWT_SECRET',
            'MONGODB_URI', 
            'EMAIL_USER',
            'EMAIL_PASSWORD',
            'EMAIL_FROM',
            'CLOUDINARY_CLOUD_NAME',
            'CLOUDINARY_API_KEY', 
            'CLOUDINARY_API_SECRET'
        ];

        const missing = required.filter(key => !process.env[key]);

        if (missing.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missing.join(', ')}`
            );
        }
    }
};

// Prevent modification of configuration object
Object.freeze(keys);

module.exports = keys;