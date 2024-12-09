const Quotation = require('../models/Quotation');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const nodemailer = require('nodemailer');

// Create new quotation
const createQuotation = async (req, res) => {
    try {
        const {
            customerId,
            vehicleId,
            basePrice,
            additionalFeatures,
            discounts,
            financingOptions,
            notes
        } = req.body;

        // Set validity period (7 days from now)
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 7);

        const quotation = await Quotation.create({
            customerId,
            vehicleId,
            salesRepId: req.user.id,
            basePrice,
            additionalFeatures,
            discounts,
            financingOptions,
            notes,
            validUntil
        });

        // Send email notification
        await sendQuotationEmail(quotation._id, 'created');

        res.status(201).json({
            success: true,
            data: quotation
        });
    } catch (error) {
        console.error('Create Quotation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating quotation'
        });
    }
};

// Get all quotations for a sales rep
const getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find({ salesRepId: req.user.id })
            .populate('customerId', 'name email')
            .populate('vehicleId', 'make model year price')
            .sort('-createdAt');

        res.json({
            success: true,
            data: quotations
        });
    } catch (error) {
        console.error('Get Quotations Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quotations'
        });
    }
};

// Get single quotation
const getQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id)
            .populate('customerId', 'name email')
            .populate('vehicleId', 'make model year price')
            .populate('salesRepId', 'name email');

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        res.json({
            success: true,
            data: quotation
        });
    } catch (error) {
        console.error('Get Quotation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quotation'
        });
    }
};

// Update quotation status
const updateQuotationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        quotation.status = status;
        await quotation.save();

        // Send notification based on status change
        await sendQuotationEmail(quotation._id, status);

        res.json({
            success: true,
            data: quotation
        });
    } catch (error) {
        console.error('Update Quotation Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating quotation status'
        });
    }
};

// Send follow-up email
const sendFollowUp = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        await sendQuotationEmail(quotation._id, 'reminder');

        res.json({
            success: true,
            message: 'Follow-up email sent successfully'
        });
    } catch (error) {
        console.error('Send Follow-up Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending follow-up email'
        });
    }
};

// Helper function to send emails
const sendQuotationEmail = async (quotationId, type) => {
    try {
        const quotation = await Quotation.findById(quotationId)
            .populate('customerId', 'name email')
            .populate('vehicleId', 'make model year')
            .populate('salesRepId', 'name email');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let subject, text;
        const customerName = `${quotation.customerId.name.first} ${quotation.customerId.name.last}`;
        const vehicleDetails = `${quotation.vehicleId.year} ${quotation.vehicleId.make} ${quotation.vehicleId.model}`;
        const salesRepName = `${quotation.salesRepId.name.first} ${quotation.salesRepId.name.last}`;

        switch (type) {
            case 'created':
                subject = `New Quotation for ${vehicleDetails}`;
                text = `Dear ${customerName},

We're pleased to provide you with a quotation for the ${vehicleDetails}.

Quotation Details:
- Base Price: $${quotation.basePrice.toLocaleString()}
- Total Price: $${quotation.totalPrice.toLocaleString()}
- Valid Until: ${quotation.validUntil.toLocaleDateString()}

Your sales representative ${salesRepName} will be happy to answer any questions you may have.

Best regards,
DriveSync Team`;
                break;

            case 'reminder':
                subject = `Reminder: Quotation for ${vehicleDetails}`;
                text = `Dear ${customerName},

This is a friendly reminder about your quotation for the ${vehicleDetails}.

The offer is valid until ${quotation.validUntil.toLocaleDateString()}.
Total Price: $${quotation.totalPrice.toLocaleString()}

Please let us know if you have any questions.

Best regards,
${salesRepName}
DriveSync Team`;
                break;

            default:
                subject = `Quotation Update for ${vehicleDetails}`;
                text = `Dear ${customerName},

Your quotation for the ${vehicleDetails} has been updated.
Status: ${quotation.status}

Please contact your sales representative ${salesRepName} for more information.

Best regards,
DriveSync Team`;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: quotation.customerId.email,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);

        // Log the notification
        quotation.emailNotifications.push({
            type,
            sentAt: new Date(),
            status: 'success'
        });
        await quotation.save();

    } catch (error) {
        console.error('Send Email Error:', error);
        throw error;
    }
};

module.exports = {
    createQuotation,
    getQuotations,
    getQuotation,
    updateQuotationStatus,
    sendFollowUp
};