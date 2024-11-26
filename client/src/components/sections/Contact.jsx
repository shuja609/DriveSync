import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TextField, 
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Email,
  Phone,
  LocationOn,
  Send,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram
} from '@mui/icons-material';
import Button from '../common/Button';

const contactInfo = [
  {
    icon: <Email className="w-6 h-6" />,
    title: "Email Us",
    content: "contact@drivesync.com",
    link: "mailto:contact@drivesync.com"
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    content: "(123) 456-7890",
    link: "tel:+11234567890"
  },
  {
    icon: <LocationOn className="w-6 h-6" />,
    title: "Visit Us",
    content: "123 Business Avenue, Tech City, TC 12345",
    link: "https://maps.google.com"
  }
];

const socialLinks = [
  { icon: <LinkedIn />, url: "https://linkedin.com/company/drivesync" },
  { icon: <Twitter />, url: "https://twitter.com/drivesync" },
  { icon: <Facebook />, url: "https://facebook.com/drivesync" },
  { icon: <Instagram />, url: "https://instagram.com/drivesync" }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNotification({
        open: true,
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setNotification({
        open: true,
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-background-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-default to-background-dark opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary-light/10 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light to-secondary-light text-transparent bg-clip-text">
            Get in Touch
          </h2>
          <p className="text-text-primary/80 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background-light/30 backdrop-blur-lg rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
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
                    color: 'rgba(224, 224, 224, 0.7)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'rgb(224, 224, 224)',
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ /* Same styles as above */ }}
              />
              
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ /* Same styles as above */ }}
              />
              
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                multiline
                rows={4}
                variant="outlined"
                sx={{ /* Same styles as above */ }}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                className="flex items-center justify-center gap-2"
              >
                {loading ? (
                  <CircularProgress size={24} className="text-white" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="block bg-background-light/30 backdrop-blur-lg rounded-xl p-6 hover:bg-background-light/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-primary-light">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {info.title}
                    </h3>
                    <p className="text-text-primary/70">
                      {info.content}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Social Links */}
            <div className="pt-8 border-t border-text-primary/10">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-background-light/30 text-primary-light hover:bg-background-light/50 transition-colors"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={notification.type}
          variant="filled"
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Contact; 