import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
    Chip,
    Button,
    Divider,
    Paper,
    Dialog
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ShoppingCart as ShoppingCartIcon,
    Payment as PaymentIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import orderService from '../../../services/orderService';
import PaymentProcessor from './PaymentProcessor';
import ConfirmationModal from '../../common/ConfirmationModal';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const data = await orderService.getOrder(id);
            setOrder(data);
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to fetch order details', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentComplete = async (result) => {
        enqueueSnackbar('Payment processed successfully', { variant: 'success' });
        setShowPaymentDialog(false);
        fetchOrderDetails();
    };

    const handleCancelOrder = async () => {
        try {
            await orderService.cancelOrder(id);
            enqueueSnackbar('Order cancelled successfully', { variant: 'success' });
            setShowCancelDialog(false);
            fetchOrderDetails();
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to cancel order', { variant: 'error' });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'processing':
                return 'info';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            case 'refunded':
                return 'default';
            default:
                return 'default';
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/orders')}
                >
                    Back to Orders
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {order.status === 'pending' && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PaymentIcon />}
                            onClick={() => setShowPaymentDialog(true)}
                        >
                            Process Payment
                        </Button>
                    )}
                    {['pending', 'processing'].includes(order.status) && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => setShowCancelDialog(true)}
                        >
                            Cancel Order
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Order Details Card */}
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <ShoppingCartIcon sx={{ fontSize: 40 }} />
                                <div>
                                    <Typography variant="h5">Order Details</Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {order._id}
                                    </Typography>
                                </div>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {/* Order Status */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Order Status</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography color="textSecondary">Status</Typography>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="textSecondary">Payment Status</Typography>
                                        <Chip
                                            label={order.paymentStatus}
                                            color={getStatusColor(order.paymentStatus)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="textSecondary">Date</Typography>
                                        <Typography>
                                            {new Date(order.createdAt).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Customer Info */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography color="textSecondary">Name</Typography>
                                        <Typography>
                                            {order.customer.name.first} {order.customer.name.last}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="textSecondary">Email</Typography>
                                        <Typography>{order.customer.email}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Vehicle Details */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Vehicle Details</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography color="textSecondary">Vehicle</Typography>
                                        <Typography>
                                            {order.vehicle.year} {order.vehicle.make} {order.vehicle.model}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography color="textSecondary">VIN</Typography>
                                        <Typography>{order.vehicle.vin}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography color="textSecondary">Price</Typography>
                                        <Typography variant="h6">${order.amount.toFixed(2)}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Shipping Address */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography>
                                            {order.shippingAddress.street}
                                            <br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                            <br />
                                            {order.shippingAddress.country}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Notes */}
                        {order.notes && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>Notes</Typography>
                                    <Typography>{order.notes}</Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {/* Payment Dialog */}
            <Dialog
                open={showPaymentDialog}
                onClose={() => setShowPaymentDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <PaymentProcessor
                    orderId={id}
                    orderAmount={order.amount}
                    onPaymentComplete={handlePaymentComplete}
                    onClose={() => setShowPaymentDialog(false)}
                />
            </Dialog>

            {/* Cancel Confirmation Dialog */}
            <ConfirmationModal
                isOpen={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                onConfirm={handleCancelOrder}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action cannot be undone."
            />
        </Box>
    );
};

export default OrderDetails; 