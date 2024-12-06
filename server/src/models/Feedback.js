const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Bug Report', 'Feature Request', 'General', 'Support']
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Open', 'In Progress', 'Closed'],
        default: 'Open'
    },
    priority: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    response: {
        type: String,
        trim: true,
        default: ''
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    respondedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback; 