import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    TextField,
    Alert
} from '@mui/material';
import { 
    ExpandMore,
    Help,
    Email,
    Phone,
    Chat,
    Article
} from '@mui/icons-material';
import ProfileLayout from './ProfileLayout';
import Button from '../common/Button';
import profileService from '../../services/profileService';

const faqs = [
    {
        question: "How do I save a car to my favorites?",
        answer: "To save a car, simply click the heart icon on any car listing. You can view all your saved cars in the 'Saved Cars' section of your profile."
    },
    {
        question: "How can I compare different cars?",
        answer: "Use our comparison tool by selecting the 'Compare' option on car listings. You can compare up to 3 cars at once to help make your decision."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, bank transfers, and digital payment methods. Payment details are securely processed through our trusted payment partners."
    },
    {
        question: "How do I schedule a test drive?",
        answer: "You can schedule a test drive by clicking the 'Schedule Test Drive' button on any car listing page. Choose your preferred date and time, and we'll confirm your appointment."
    }
];

const Support = () => {
    const [contactForm, setContactForm] = useState({
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await profileService.submitSupportTicket(contactForm);
            setSuccess('Your message has been sent. We will respond shortly.');
            setContactForm({ subject: '', message: '' });
        } catch (err) {
            setError(err.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileLayout title="Help & Support">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-background-dark p-6 rounded-lg text-center">
                        <Email className="w-8 h-8 text-primary-light mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Email Support</h3>
                        <p className="text-text-primary/70">support@drivesync.com</p>
                    </div>
                    <div className="bg-background-dark p-6 rounded-lg text-center">
                        <Phone className="w-8 h-8 text-primary-light mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Phone Support</h3>
                        <p className="text-text-primary/70">1-800-DRIVESYNC</p>
                    </div>
                    <div className="bg-background-dark p-6 rounded-lg text-center">
                        <Chat className="w-8 h-8 text-primary-light mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Live Chat</h3>
                        <button className="text-primary-light hover:text-primary-dark">
                            Start Chat
                        </button>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-background-dark p-6 rounded-lg">
                    <div className="flex items-center mb-6">
                        <Help className="w-6 h-6 text-primary-light mr-2" />
                        <h2 className="text-xl font-semibold text-text-primary">
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <Accordion 
                                key={index}
                                className="bg-background-light"
                            >
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <span className="text-text-primary font-medium">
                                        {faq.question}
                                    </span>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <p className="text-text-primary/70">
                                        {faq.answer}
                                    </p>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-background-dark p-6 rounded-lg">
                    <div className="flex items-center mb-6">
                        <Article className="w-6 h-6 text-primary-light mr-2" />
                        <h2 className="text-xl font-semibold text-text-primary">
                            Contact Support
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <TextField
                            label="Subject"
                            name="subject"
                            value={contactForm.subject}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            className="bg-background-light/30"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(224, 224, 224, 0.2)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(224, 224, 224, 0.4)',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                            }}
                        />

                        <TextField
                            label="Message"
                            name="message"
                            value={contactForm.message}
                            onChange={handleChange}
                            required
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            className="bg-background-light/30"
                            sx={{ /* Same styles as above */ }}
                        />

                        {error && (
                            <Alert severity="error" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" className="mb-4">
                                {success}
                            </Alert>
                        )}

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="w-32"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </ProfileLayout>
    );
};

export default Support; 