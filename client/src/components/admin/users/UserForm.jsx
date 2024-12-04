import React, { useState, useEffect } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import userService from '../../../services/userService';

const UserForm = ({ open, onClose, user = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            const [firstName, lastName] = user.name.split(' ');
            setFormData({
                firstName,
                lastName,
                email: user.email,
                role: user.role,
                password: '' // Don't populate password for editing
            });
        } else {
            // Reset form for new user
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'user'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate email and password
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            setError('Invalid email format');
            setLoading(false);
            return;
        }
        if (formData.password && formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            const userData = {
                name: {
                    first: formData.firstName,
                    last: formData.lastName
                },
                email: formData.email,
                role: formData.role,
                ...(formData.password && { password: formData.password })
            };

            if (user) {
                // Update existing user
                await userService.updateUser(user.id, userData);
            } else {
                // Create new user
                await userService.createUser(userData);
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    // Update TextField styles
    const textFieldSx = {
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
        '& .MuiSelect-select': {
            color: 'rgb(224, 224, 224)',
        },
        '& .MuiInputBase-input::placeholder': {
            color: 'rgba(224, 224, 224, 0.5)',
            opacity: 1
        },
    };

 

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "bg-background-light"
            }}
        >
            <DialogTitle className="text-text-primary">
                {user ? 'Edit User' : 'Add New User'}
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error && (
                            <Alert severity="error" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                fullWidth
                                className="bg-background-light/30"
                                sx={textFieldSx}
                            />

                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                fullWidth
                                className="bg-background-light/30"
                                sx={textFieldSx}
                            />
                        </div>

                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            fullWidth
                            disabled={!!user} // Disable email editing for existing users
                            className="bg-background-light/30"
                            sx={textFieldSx}
                        />

                        {!user && (
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!user}
                                fullWidth
                                className="bg-background-light/30"
                                sx={textFieldSx}
                            />
                        )}

                        <TextField
                            select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            fullWidth
                            className="bg-background-light/30"
                            sx={textFieldSx}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="sales">Sales Representative</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </TextField>
                    </motion.div>
                </DialogContent>

                <DialogActions className="p-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (user ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserForm; 