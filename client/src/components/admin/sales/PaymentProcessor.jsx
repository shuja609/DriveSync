import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Typography,
    Box,
    MenuItem,
    FormHelperText
} from '@mui/material';
import { useSnackbar } from 'notistack';
import transactionService from '../../../services/transactionService';

const PaymentProcessor = ({ orderId, orderAmount, onPaymentComplete, onClose }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        paymentMethod: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Payment method validation
        if (!formData.paymentMethod) {
            newErrors.paymentMethod = 'Payment method is required';
        }

        // Card number validation (basic)
        if (formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') {
            if (!formData.cardNumber) {
                newErrors.cardNumber = 'Card number is required';
            } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
                newErrors.cardNumber = 'Invalid card number';
            }

            // Expiry date validation (MM/YY format)
            if (!formData.expiryDate) {
                newErrors.expiryDate = 'Expiry date is required';
            } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
                newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
            }

            // CVV validation
            if (!formData.cvv) {
                newErrors.cvv = 'CVV is required';
            } else if (!/^\d{3,4}$/.test(formData.cvv)) {
                newErrors.cvv = 'Invalid CVV';
            }

            // Cardholder name validation
            if (!formData.cardholderName) {
                newErrors.cardholderName = 'Cardholder name is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const paymentData = {
                orderId,
                amount: orderAmount,
                paymentMethod: formData.paymentMethod,
                cardDetails: formData.paymentMethod === 'bank_transfer' ? null : {
                    cardNumber: formData.cardNumber.replace(/\s/g, ''),
                    expiryDate: formData.expiryDate,
                    cvv: formData.cvv,
                    cardholderName: formData.cardholderName
                }
            };

            const result = await transactionService.processPayment(paymentData);
            enqueueSnackbar('Payment processed successfully', { variant: 'success' });
            if (onPaymentComplete) {
                onPaymentComplete(result);
            }
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to process payment', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Process Payment
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Amount to Pay: ${orderAmount.toFixed(2)}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Payment Method */}
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Payment Method"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                error={!!errors.paymentMethod}
                                helperText={errors.paymentMethod}
                                required
                            >
                                <MenuItem value="credit_card">Credit Card</MenuItem>
                                <MenuItem value="debit_card">Debit Card</MenuItem>
                                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                            </TextField>
                        </Grid>

                        {/* Card Details */}
                        {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Card Number"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={(e) => {
                                            const formatted = formatCardNumber(e.target.value);
                                            handleChange({ target: { name: 'cardNumber', value: formatted } });
                                        }}
                                        error={!!errors.cardNumber}
                                        helperText={errors.cardNumber}
                                        required
                                        inputProps={{ maxLength: 19 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Expiry Date"
                                        name="expiryDate"
                                        placeholder="MM/YY"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        error={!!errors.expiryDate}
                                        helperText={errors.expiryDate}
                                        required
                                        inputProps={{ maxLength: 5 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="CVV"
                                        name="cvv"
                                        type="password"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        error={!!errors.cvv}
                                        helperText={errors.cvv}
                                        required
                                        inputProps={{ maxLength: 4 }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Cardholder Name"
                                        name="cardholderName"
                                        value={formData.cardholderName}
                                        onChange={handleChange}
                                        error={!!errors.cardholderName}
                                        helperText={errors.cardholderName}
                                        required
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Bank Transfer Info */}
                        {formData.paymentMethod === 'bank_transfer' && (
                            <Grid item xs={12}>
                                <FormHelperText>
                                    Please use the following bank details for transfer:
                                    <br />
                                    Bank: Example Bank
                                    <br />
                                    Account Number: XXXX-XXXX-XXXX
                                    <br />
                                    Reference: Order #{orderId}
                                </FormHelperText>
                            </Grid>
                        )}

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Process Payment'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default PaymentProcessor; 