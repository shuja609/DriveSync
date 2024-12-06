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
    Paper
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Receipt as ReceiptIcon
} from '@mui/icons-material';
import transactionService from '../../../services/transactionService';
import RefundProcessor from './RefundProcessor';

const TransactionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRefundForm, setShowRefundForm] = useState(false);

    useEffect(() => {
        fetchTransactionDetails();
    }, [id]);

    const fetchTransactionDetails = async () => {
        try {
            const data = await transactionService.getTransaction(id);
            setTransaction(data);
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to fetch transaction details', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'successful':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleRefund = async (refundData) => {
        try {
            await transactionService.processRefund({
                ...refundData,
                transactionId: id
            });
            enqueueSnackbar('Refund processed successfully', { variant: 'success' });
            setShowRefundForm(false);
            fetchTransactionDetails();
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to process refund', { variant: 'error' });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!transaction) {
        return <div>Transaction not found</div>;
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/transactions')}
                >
                    Back to Transactions
                </Button>
                {transaction.type === 'payment' && transaction.status === 'successful' && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setShowRefundForm(true)}
                    >
                        Process Refund
                    </Button>
                )}
            </Box>

            {/* Transaction Details Card */}
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <ReceiptIcon sx={{ fontSize: 40 }} />
                                <div>
                                    <Typography variant="h5">Transaction Details</Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {transaction._id}
                                    </Typography>
                                </div>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {/* Basic Info */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography color="textSecondary">Type</Typography>
                                        <Chip
                                            label={transaction.type}
                                            color={transaction.type === 'payment' ? 'primary' : 'secondary'}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="textSecondary">Status</Typography>
                                        <Chip
                                            label={transaction.status}
                                            color={getStatusColor(transaction.status)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="textSecondary">Amount</Typography>
                                        <Typography variant="h6">${transaction.amount.toFixed(2)}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography color="textSecondary">Date</Typography>
                                        <Typography>
                                            {new Date(transaction.createdAt).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Customer & Order Info */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Customer & Order</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography color="textSecondary">Customer</Typography>
                                        <Typography>
                                            {transaction.customer.name.first} {transaction.customer.name.last}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="textSecondary">Order ID</Typography>
                                        <Typography>{transaction.order._id}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Payment Details */}
                        {transaction.type === 'payment' && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>Payment Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography color="textSecondary">Payment Method</Typography>
                                            <Typography>{transaction.paymentMethod}</Typography>
                                        </Grid>
                                        {transaction.cardDetails && (
                                            <>
                                                <Grid item xs={12} md={4}>
                                                    <Typography color="textSecondary">Card Number</Typography>
                                                    <Typography>**** **** **** {transaction.cardDetails.lastFourDigits}</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Typography color="textSecondary">Card Holder</Typography>
                                                    <Typography>{transaction.cardDetails.cardholderName}</Typography>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </Paper>
                            </Grid>
                        )}

                        {/* Refund Details */}
                        {transaction.type === 'refund' && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>Refund Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography color="textSecondary">Original Transaction</Typography>
                                            <Typography>{transaction.originalTransaction}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography color="textSecondary">Reason</Typography>
                                            <Typography>{transaction.refundReason}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {/* Refund Form Dialog */}
            {showRefundForm && (
                <RefundProcessor
                    transactionId={id}
                    orderAmount={transaction.amount}
                    onRefundComplete={handleRefund}
                    onClose={() => setShowRefundForm(false)}
                />
            )}
        </Box>
    );
};

export default TransactionDetails; 