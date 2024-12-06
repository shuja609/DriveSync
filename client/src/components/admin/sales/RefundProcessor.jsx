import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useSnackbar } from 'notistack';
import transactionService from '../../../services/transactionService';

const RefundProcessor = ({ transactionId, orderAmount, onRefundComplete, onClose }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: orderAmount,
        reason: '',
        refundType: 'full'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // If refund type changes to full, set amount to order amount
            ...(name === 'refundType' && value === 'full' ? { amount: orderAmount } : {})
        }));
    };

    const validateForm = () => {
        if (!formData.reason.trim()) {
            enqueueSnackbar('Please provide a reason for the refund', { variant: 'error' });
            return false;
        }

        if (formData.refundType === 'partial') {
            if (!formData.amount || formData.amount <= 0) {
                enqueueSnackbar('Please enter a valid refund amount', { variant: 'error' });
                return false;
            }
            if (formData.amount > orderAmount) {
                enqueueSnackbar('Refund amount cannot exceed the order amount', { variant: 'error' });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const refundData = {
                transactionId,
                amount: formData.refundType === 'full' ? orderAmount : formData.amount,
                reason: formData.reason
            };

            const result = await transactionService.processRefund(refundData);
            enqueueSnackbar('Refund processed successfully', { variant: 'success' });
            if (onRefundComplete) {
                onRefundComplete(result);
            }
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to process refund', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Process Refund
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                    Original Transaction Amount: ${orderAmount.toFixed(2)}
                </Alert>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Refund Type */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Refund Type</InputLabel>
                                <Select
                                    name="refundType"
                                    value={formData.refundType}
                                    onChange={handleChange}
                                    label="Refund Type"
                                >
                                    <MenuItem value="full">Full Refund</MenuItem>
                                    <MenuItem value="partial">Partial Refund</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Refund Amount (for partial refunds) */}
                        {formData.refundType === 'partial' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Refund Amount"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        max: orderAmount,
                                        step: 0.01
                                    }}
                                    required
                                />
                            </Grid>
                        )}

                        {/* Refund Reason */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Reason for Refund"
                                name="reason"
                                multiline
                                rows={3}
                                value={formData.reason}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

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
                                    {loading ? 'Processing...' : 'Process Refund'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default RefundProcessor; 