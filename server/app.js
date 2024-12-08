require('dotenv').config();
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Import configurations
const keys = require('./src/config/keys');
const connectDB = require('./src/config/db');


// Import routes
const routes = require('./src/routes');


// Initialize express app
const app = express();

/**
 * Initial Configuration
 */
async function initializeApp() {
    // Validate environment variables
    try {
        keys.validate();
        console.log('Environment variables validated successfully');
    } catch (error) {
        console.error('Configuration Error:', error.message);
        process.exit(1);
    }

    // Connect to database
    try {
        await connectDB();
        console.log(`Connected to MongoDB at ${keys.database.url}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }

    // Ensure uploads directory exists
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
}

/**
 * Security Middleware
 */
app.use(helmet()); // Security headers
app.use(cors({
    origin: keys.app.frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

/**
 * General Middleware
 */
app.use(compression()); // Compress responses
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * View Engine Setup
 */
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'jade');

/**
 * Application Settings
 */
app.set('env', keys.app.env);
app.set('port', keys.app.port);
app.set('trust proxy', 1); // Trust first proxy

/**
 * Routes
 */
app.use('/api', routes);

/**
 * Error Handling
 */
// 404 handler
app.use((req, res, next) => {
    next(createError(404));
});

// Global error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = keys.app.env === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

/**
 * Initialize Application
 */
initializeApp().then(() => {
    console.log('\n=== Application Configuration ===');
    console.log(`Name: ${keys.app.name}`);
    console.log(`Environment: ${keys.app.env}`);
    console.log(`Port: ${keys.app.port}`);
    console.log(`API URL: ${keys.app.apiUrl}`);
    console.log('================================\n');
}).catch(error => {
    console.error('Application initialization failed:', error);
    process.exit(1);
});
// Export app for server
module.exports = app;

