const { verifyToken } = require('../config/auth');

// Middleware to protect routes requiring authentication
const protect = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization required. Please login.'
            });
        }

        // Get token from Bearer token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.'
            });
        }

        // Add user info to request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
};

// Middleware to check if user has admin role
const adminOnly = (req, res, next) => {
    if (!req.user || !req.user.role === 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};
// Middleware to check if user has sales role
const salesOnly = (req, res, next) => {
    if (!req.user || !req.user.role === 'sales') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Sales privileges required.'
        });
    }
    next();
};


// Optional authentication middleware
const optional = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            return next();
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        
        req.user = decoded || null;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

module.exports = {
    protect,
    adminOnly,
    optional,
    salesOnly
}; 