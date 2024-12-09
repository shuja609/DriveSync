# DriveSync - Vehicle Management System

## Project Overview

DriveSync is a comprehensive vehicle management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a robust platform for managing vehicle inventory, sales, customer interactions, and business operations.

### Core Features
- Vehicle Inventory Management
- Sales and Order Processing
- Customer Relationship Management
- Discount and Offer Management
- Seller Inquiry Management
- Feedback and Review System
- Advanced Analytics Dashboard
- User Authentication and Authorization
- Profile Management System

### Technologies Used
- **Frontend**:
  - React.js
  - Tailwind CSS
  - Material-UI Components
  - Chart.js for Analytics
  - Framer Motion for Animations
  - React Router for Navigation
  - Axios for API Communication

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT Authentication
  - Multer for File Uploads
  - Passport.js for Social Auth

## Directory Structure

```
project-root/
├── client/                 # Frontend React Application
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       │   ├── admin/    # Admin dashboard components
│       │   ├── auth/     # Authentication components
│       │   ├── common/   # Reusable components
│       │   ├── layout/   # Layout components
│       │   ├── profile/  # Profile management
│       │   └── seller/   # Seller dashboard components
│       ├── context/      # React context providers
│       ├── services/     # API service integrations
│       └── utils/        # Utility functions
│
├── server/                # Backend Node.js Application
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utility functions
│   └── uploads/         # File upload directory
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/shuja609/DriveSync
cd DriveSync
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Create environment variables:
   - Create `.env` file in server directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```
   - Create `.env` file in client directory with:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

5. Start the development servers:
   - For backend:
```bash
cd server
npm run dev
```
   - For frontend:
```bash
cd client
npm start
```

## Server Environment Variables Guide

The server requires several environment variables to be set up properly. Create a `.env` file in the server directory with the following variables:

### Required Variables

```env
# Application
NODE_ENV=development
PORT=5000
APP_NAME=DriveSync
API_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/drivesync
MONGODB_TEST_URI=mongodb://localhost:27017/drivesync_test

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
EMAIL_FROM=noreply@drivesync.com
EMAIL_FROM_NAME=DriveSync

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# Payment Gateway (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Variable Descriptions

#### Application Settings
- `NODE_ENV`: Application environment (development/production)
- `PORT`: Server port number
- `APP_NAME`: Application name
- `API_URL`: Backend API URL
- `FRONTEND_URL`: Frontend application URL

#### Database Configuration
- `MONGODB_URI`: Main database connection string
- `MONGODB_TEST_URI`: Test database connection string (for running tests)

#### Authentication
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRE`: JWT token expiration time
- `REFRESH_TOKEN_SECRET`: Secret for refresh token generation
- `REFRESH_TOKEN_EXPIRE`: Refresh token expiration time

#### Email Settings
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP server username
- `SMTP_PASS`: SMTP server password
- `EMAIL_FROM`: Default sender email address
- `EMAIL_FROM_NAME`: Default sender name

#### Cloud Storage
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

#### OAuth Configuration
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_CALLBACK_URL`: Google OAuth callback URL

#### AI Services
- `GEMINI_API_KEY`: Google Gemini AI API key for AI chat features

#### Payment Integration (Optional)
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret for payment notifications

### Security Notes

1. Never commit the `.env` file to version control
2. Use strong, unique values for secret keys
3. In production, use secure, randomly generated strings for JWT secrets
4. Rotate API keys and secrets periodically
5. Use environment-specific values for different deployments

### Obtaining API Keys

1. **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com) and get credentials from your dashboard
2. **Google OAuth**: Create a project in [Google Cloud Console](https://console.cloud.google.com) and configure OAuth credentials
3. **Stripe**: Register at [stripe.com](https://stripe.com) and get API keys from your dashboard
4. **Gemini AI**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/auth/verify-email/:token` - Email verification

### Vehicle Management
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle (Admin)
- `PUT /api/vehicles/:id` - Update vehicle (Admin)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin)

### Order Management
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status (Admin)

### Sales Management
- `GET /api/seller/inquiries` - Get all inquiries
- `POST /api/seller/discounts` - Create new discount
- `GET /api/seller/orders` - Get all orders
- `GET /api/seller/feedback` - Get all feedback

## Frontend Details

### Key Components
- `AdminLayout` - Admin dashboard layout
- `SalesLayout` - Sales dashboard layout
- `SellerDiscountManagement` - Discount management interface
- `SellerInquiryManagement` - Inquiry handling interface
- `SellerFeedbackManagement` - Feedback management system
- `SellerSettings` - Seller profile settings

### State Management
- React Context API for global state
- Local state with useState for component-level state
- Custom hooks for reusable logic

## Backend Details

### Database Schema
- User Model
- Vehicle Model
- Order Model
- Discount Model
- Inquiry Model
- Feedback Model
- Transaction Model

### Middleware
- Authentication middleware
- Role-based authorization
- Request validation
- Error handling
- File upload handling

## Testing

### Frontend Testing
```bash
cd client
npm test
```
- Uses Jest and React Testing Library
- Component testing
- Integration testing
- Snapshot testing

### Backend Testing
```bash
cd server
npm test
```
- Uses Mocha and Chai
- API endpoint testing
- Model validation testing
- Middleware testing

## Deployment Guide

### Backend Deployment (Railway)
1. Create a Railway account
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy the backend service

### Frontend Deployment (Vercel)
1. Create a Vercel account
2. Import your project from GitHub
3. Configure build settings
4. Set environment variables
5. Deploy the frontend application

## Future Enhancements

1. Real-time notifications system
2. Advanced reporting and analytics
3. Integration with additional payment gateways
4. Mobile application development
5. AI-powered vehicle recommendations
6. Enhanced search functionality
7. Multi-language support
8. Inventory forecasting system

## Acknowledgments

- Material-UI for component library
- Tailwind CSS for styling
- Chart.js for data visualization
- React Icons for icon library
- Framer Motion for animations
- Express.js community
- MongoDB Atlas for database hosting 