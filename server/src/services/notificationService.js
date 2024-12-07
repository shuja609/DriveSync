const nodemailer = require('nodemailer');
// const twilio = require('twilio'); // Uncomment when adding SMS functionality

class NotificationService {
    constructor() {
        // Initialize email transporter
        this.emailTransporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE, // 'gmail' or 'SendGrid'
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD // App specific password for Gmail or API key for SendGrid
            }
        });

        // Initialize SMS client (Twilio example)
        // this.smsClient = twilio(
        //     process.env.TWILIO_ACCOUNT_SID,
        //     process.env.TWILIO_AUTH_TOKEN
        // );
    }

    async sendEmail(to, subject, html) {
        try {
            const info = await this.emailTransporter.sendMail({
                from: process.env.EMAIL_FROM,
                to,
                subject,
                html
            });
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Email sending failed:', error);
            return { success: false, error: error.message };
        }
    }

    // async sendSMS(to, message) {
    //     try {
    //         const result = await this.smsClient.messages.create({
    //             body: message,
    //             to,
    //             from: process.env.TWILIO_PHONE_NUMBER
    //         });
    //         return { success: true, messageId: result.sid };
    //     } catch (error) {
    //         console.error('SMS sending failed:', error);
    //         return { success: false, error: error.message };
    //     }
    // }

    // Booking notification templates
    async sendBookingConfirmation(booking) {
        const subject = `Booking Confirmation - ${booking.type === 'reservation' ? 'Vehicle Reservation' : 'Test Drive'}`;
        const html = `
            <h2>Booking Confirmation</h2>
            <p>Dear ${booking.contactInfo.name},</p>
            <p>Your ${booking.type === 'reservation' ? 'vehicle reservation' : 'test drive'} has been confirmed.</p>
            <h3>Details:</h3>
            <ul>
                <li>Date: ${new Date(booking.date).toLocaleDateString()}</li>
                <li>Time: ${booking.time}</li>
                ${booking.location ? `<li>Location: ${booking.location}</li>` : ''}
                ${booking.duration ? `<li>Duration: ${booking.duration} days</li>` : ''}
            </ul>
            <p>Status: ${booking.status}</p>
            <p>If you need to make any changes, please contact us.</p>
        `;

        return await this.sendEmail(booking.contactInfo.email, subject, html);
    }

    // Inquiry notification templates
    async sendInquiryConfirmation(inquiry) {
        const subject = 'Inquiry Received - DriveSync';
        const html = `
            <h2>Inquiry Confirmation</h2>
            <p>Dear ${inquiry.contactInfo.name},</p>
            <p>We have received your inquiry regarding ${inquiry.subject}.</p>
            <p>Our team will review your message and get back to you shortly.</p>
            <h3>Your Message:</h3>
            <p>${inquiry.message}</p>
            <p>Reference Number: ${inquiry._id}</p>
        `;

        return await this.sendEmail(inquiry.contactInfo.email, subject, html);
    }

    async sendInquiryResponse(inquiry, response) {
        const subject = 'Response to Your Inquiry - DriveSync';
        const html = `
            <h2>Response to Your Inquiry</h2>
            <p>Dear ${inquiry.contactInfo.name},</p>
            <p>We have an update regarding your inquiry about ${inquiry.subject}.</p>
            <h3>Our Response:</h3>
            <p>${response.message}</p>
            <p>If you have any further questions, please don't hesitate to contact us.</p>
        `;

        return await this.sendEmail(inquiry.contactInfo.email, subject, html);
    }

    // Status update notifications
    async sendStatusUpdate(booking) {
        const subject = `Booking Status Update - ${booking.type === 'reservation' ? 'Vehicle Reservation' : 'Test Drive'}`;
        const html = `
            <h2>Status Update</h2>
            <p>Dear ${booking.contactInfo.name},</p>
            <p>The status of your ${booking.type} has been updated to: ${booking.status}</p>
            <h3>Booking Details:</h3>
            <ul>
                <li>Date: ${new Date(booking.date).toLocaleDateString()}</li>
                <li>Time: ${booking.time}</li>
                ${booking.location ? `<li>Location: ${booking.location}</li>` : ''}
            </ul>
            <p>If you have any questions, please contact us.</p>
        `;

        return await this.sendEmail(booking.contactInfo.email, subject, html);
    }
}

module.exports = new NotificationService(); 