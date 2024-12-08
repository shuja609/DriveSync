import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare } from 'react-icons/fi';
import UserFeedbackForm from '../feedback/UserFeedbackForm';

const Footer = () => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    return (
        <footer className="bg-background-dark text-text-primary py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">DriveSync</h3>
                        <p className="text-sm text-text-primary/70">
                            Your trusted partner in finding the perfect vehicle.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Media Links */}
                            <a href="#" className="text-text-primary/70 hover:text-primary-light">
                                Facebook
                            </a>
                            <a href="#" className="text-text-primary/70 hover:text-primary-light">
                                Twitter
                            </a>
                            <a href="#" className="text-text-primary/70 hover:text-primary-light">
                                Instagram
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/showroom" className="text-text-primary/70 hover:text-primary-light">
                                    Showroom
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-text-primary/70 hover:text-primary-light">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-text-primary/70 hover:text-primary-light">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/faq" className="text-text-primary/70 hover:text-primary-light">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-text-primary/70 hover:text-primary-light">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-text-primary/70 hover:text-primary-light">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-text-primary/70">
                            <li>123 Auto Drive</li>
                            <li>Los Angeles, CA 90001</li>
                            <li>Phone: (555) 123-4567</li>
                            <li>Email: info@drivesync.com</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-text-primary/10">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-text-primary/70">
                            © {new Date().getFullYear()} DriveSync. All rights reserved.
                        </p>
                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="flex items-center space-x-2 mt-4 md:mt-0 px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <FiMessageSquare className="w-5 h-5" />
                            <span>Submit Feedback</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Feedback Form Modal */}
            <UserFeedbackForm
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </footer>
    );
};

export default Footer; 