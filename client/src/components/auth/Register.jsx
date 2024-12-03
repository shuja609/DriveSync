import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TextField, Alert, FormHelperText } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../common/AuthLayout';
import GoogleAuthButton from './GoogleAuthButton';
import Button from '../common/Button';

const Register = () => {
    const { register, error, setError } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear password error when user types
        if (name === 'password' || name === 'confirmPassword') {
            setPasswordError('');
        }
        // Clear email error when user types
        if (name === 'email') {
            setEmailError('');
        }
        // Clear name error when user types
        if (name === 'firstName' || name === 'lastName') {
            setNameError('');
        }
    };

    const validateForm = () => {
        let isValid = true;
        if (formData.firstName.trim() === '' || formData.lastName.trim() === '') {
            setNameError('First and last names are required');
            isValid = false;
        }
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            setEmailError('Invalid email format');
            isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            isValid = false;
        }
        if (formData.password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            isValid = false;
        }
        // Additional password validation for uppercase, lowercase, number, and character
        if (!/[A-Z]/.test(formData.password)) {
            setPasswordError('Password must contain at least one uppercase letter');
            isValid = false;
        }
        if (!/[a-z]/.test(formData.password)) {
            setPasswordError('Password must contain at least one lowercase letter');
            isValid = false;
        }
        if (!/\d/.test(formData.password)) {
            setPasswordError('Password must contain at least one number');
            isValid = false;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            setPasswordError('Password must contain at least one special character');
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await register({
                name: {
                    first: formData.firstName.trim(),
                    last: formData.lastName.trim()
                },
                email: formData.email.trim(),
                password: formData.password
            });
        } catch (error) {
            console.error('Registration failed:', error);
            // Fixed the error by using the setError function from the AuthContext
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create an Account"
            subtitle="Join us today and start your journey"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 space-y-6"
            >
                {(error || passwordError || emailError || nameError) && (
                    <Alert severity="error" className="mb-4">
                        {error || passwordError || emailError || nameError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
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
                                    color: 'rgba(224, 224, 224, 0.7)',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'rgb(224, 224, 224)',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                                },
                            }}
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
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
                                    color: 'rgba(224, 224, 224, 0.7)',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'rgb(224, 224, 224)',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                                },
                            }}
                        />
                    </div>

                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
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
                                color: 'rgba(224, 224, 224, 0.7)',
                            },
                            '& .MuiInputBase-input': {
                                color: 'rgb(224, 224, 224)',
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                            },
                        }}
                    />
                    {emailError && (
                        <FormHelperText error>{emailError}</FormHelperText>
                    )}

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        className="bg-background-light/30"
                        helperText="Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character"
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
                            '& .MuiInputBase-input::placeholder': {
                                color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                            },
                            '& .MuiFormHelperText-root': {
                                color: 'rgb(255, 255, 255)', // Helper text color set to white
                            },
                        }}
                    />
                    {passwordError && (
                        <FormHelperText error>{passwordError}</FormHelperText>
                    )}

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
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
                                color: 'rgba(224, 224, 224, 0.7)',
                            },
                            '& .MuiInputBase-input': {
                                color: 'rgb(224, 224, 224)',
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                            },
                            '& .MuiFormHelperText-root': {
                                color: 'rgb(255, 255, 255)', // Helper text color set to white
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-text-primary/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-background-dark text-text-primary/70">
                            Or continue with
                        </span>
                    </div>
                </div>

                <GoogleAuthButton />

                <p className="text-center text-sm text-text-primary/70">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-primary-light hover:text-primary-dark"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </AuthLayout>
    );
};

export default Register;