const { GoogleGenerativeAI } = require('@google/generative-ai');
const keys = require('../config/keys');

// Initialize Gemini API with key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || keys.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Context for vehicle-related queries
const VEHICLE_CONTEXT = `
You are an AI assistant for a car dealership website. You can help users with:
- Vehicle information and specifications
- Booking test drives
- General inquiries about cars and services
- Pricing and financing options
- Maintenance and service information
Please provide accurate, helpful responses based on general automotive knowledge.
`;

// Handle user queries
const handleQuery = async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.user.id; // From auth middleware
        
        // Combine context with user query
        const fullPrompt = `${VEHICLE_CONTEXT}\n\nUser Query: ${query}`;
        
        // Generate response from Gemini
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Log the interaction for analytics (optional)
        console.log(`User ${userId} query: ${query}`);

        res.json({
            success: true,
            message: text
        });
    } catch (error) {
        console.error('Error in Gemini query:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing your request',
            error: error.message
        });
    }
};

// Get model capabilities
const getCapabilities = async (req, res) => {
    try {
        const capabilities = {
            features: [
                'Vehicle information and specifications lookup',
                'Test drive booking assistance',
                'Pricing and financing information',
                'Maintenance and service guidance',
                'General automotive knowledge',
                'Real-time query responses'
            ],
            limitations: [
                'Cannot process real-time inventory updates',
                'Cannot make actual bookings or purchases',
                'Cannot access user-specific data',
                'Limited to text-based responses'
            ]
        };

        res.json({
            success: true,
            capabilities
        });
    } catch (error) {
        console.error('Error fetching capabilities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching capabilities',
            error: error.message
        });
    }
};

module.exports = {
    handleQuery,
    getCapabilities
}; 