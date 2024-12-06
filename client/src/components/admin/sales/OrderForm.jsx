import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    MenuItem,
    Box
} from '@mui/material';
import orderService from '../../../services/orderService';
import vehicleService from '../../../services/vehicleService';
import userService from '../../../services/userService';

const OrderForm = ({ orderId, onSubmit }) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        customer: '',
        vehicle: '',
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        notes: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load available vehicles
                const vehiclesData = await vehicleService.getVehicles({ status: 'available' });
                setVehicles(vehiclesData);

                // Load users for admin selection
                const usersData = await userService.getUsers();
                setUsers(usersData);

                // If editing, load order data
                if (orderId) {
                    const orderData = await orderService.getOrder(orderId);
                    setFormData({
                        customer: orderData.customer._id,
                        vehicle: orderData.vehicle._id,
                        shippingAddress: orderData.shippingAddress,
                        notes: orderData.notes
                    });
                }
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to load data', { variant: 'error' });
            }
        };

        loadData();
    }, [orderId, enqueueSnackbar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let result;
            if (orderId) {
                // Update existing order
                result = await orderService.updateOrderStatus(orderId, formData);
            } else {
                // Create new order
                result = await orderService.createOrder(formData);
            }

            enqueueSnackbar(
                `Order ${orderId ? 'updated' : 'created'} successfully`, 
                { variant: 'success' }
            );
            
            if (onSubmit) {
                onSubmit(result);
            } else {
                navigate('/admin/orders');
            }
        } catch (error) {
            enqueueSnackbar(
                error.message || `Failed to ${orderId ? 'update' : 'create'} order`, 
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {orderId ? 'Edit Order' : 'Create New Order'}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Customer Selection */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Customer"
                                name="customer"
                                value={formData.customer}
                                onChange={handleChange}
                                required
                            >
                                {users.map(user => (
                                    <MenuItem key={user._id} value={user._id}>
                                        {user.name.first} {user.name.last}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Vehicle Selection */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Vehicle"
                                name="vehicle"
                                value={formData.vehicle}
                                onChange={handleChange}
                                required
                            >
                                {vehicles.map(vehicle => (
                                    <MenuItem key={vehicle._id} value={vehicle._id}>
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Shipping Address */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Shipping Address
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Street Address"
                                name="shippingAddress.street"
                                value={formData.shippingAddress.street}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="shippingAddress.city"
                                value={formData.shippingAddress.city}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="State/Province"
                                name="shippingAddress.state"
                                value={formData.shippingAddress.state}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="ZIP/Postal Code"
                                name="shippingAddress.zipCode"
                                value={formData.shippingAddress.zipCode}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Country"
                                name="shippingAddress.country"
                                value={formData.shippingAddress.country}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Notes */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/admin/orders')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (orderId ? 'Update Order' : 'Create Order')}
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );
};

export default OrderForm; 