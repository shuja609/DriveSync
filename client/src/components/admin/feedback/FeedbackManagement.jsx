import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    IconButton,
    Typography,
    Box,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Flag as FlagIcon,
    Message as MessageIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import * as feedbackService from '../../../services/feedbackService';

const FeedbackManagement = () => {
    const [feedback, setFeedback] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        priority: ''
    });

    const { enqueueSnackbar } = useSnackbar();

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const data = await feedbackService.getAllFeedback(page, 10, filters);
            setFeedback(data.feedback);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to fetch feedback');
            enqueueSnackbar('Error loading feedback', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [page, filters]);

    const handleOpenDialog = (feedbackItem) => {
        setSelectedFeedback(feedbackItem);
        setResponse(feedbackItem.response);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFeedback(null);
        setResponse("");
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await feedbackService.updateFeedbackStatus(id, newStatus);
            fetchFeedback();
            enqueueSnackbar('Status updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update status', { variant: 'error' });
        }
    };

    const handleResponseSubmit = async () => {
        try {
            await feedbackService.respondToFeedback(selectedFeedback._id, response);
            fetchFeedback();
            handleCloseDialog();
            enqueueSnackbar('Response sent successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to send response', { variant: 'error' });
        }
    };

    const handlePriorityChange = async (id, newPriority) => {
        try {
            await feedbackService.updateFeedbackPriority(id, newPriority);
            fetchFeedback();
            enqueueSnackbar('Priority updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update priority', { variant: 'error' });
        }
    };

    const handleFilterChange = (field) => (event) => {
        setFilters(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        setPage(1);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'open': return 'error';
            case 'in progress': return 'warning';
            case 'closed': return 'success';
            default: return 'default';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return <FlagIcon color="error" />;
            case 'medium': return <FlagIcon color="warning" />;
            case 'low': return <FlagIcon color="success" />;
            default: return null;
        }
    };

    const getUserFullName = (user) => {
        if (!user) return 'Unknown';
        if (typeof user.name === 'object') {
            return `${user.name.first} ${user.name.last}`.trim();
        }
        return user.name || 'Unknown';
    };

    if (loading && page === 1) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" gutterBottom>
                Feedback Management
            </Typography>

            {/* Filters */}
            <Box display="flex" gap={2} mb={3}>
                <FormControl size="small" style={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        onChange={handleFilterChange('status')}
                        label="Status"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" style={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={filters.type}
                        onChange={handleFilterChange('type')}
                        label="Type"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Bug Report">Bug Report</MenuItem>
                        <MenuItem value="Feature Request">Feature Request</MenuItem>
                        <MenuItem value="General">General</MenuItem>
                        <MenuItem value="Support">Support</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" style={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={filters.priority}
                        onChange={handleFilterChange('priority')}
                        label="Priority"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedback.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>{item.subject}</TableCell>
                                <TableCell>{getUserFullName(item.userId)}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {getPriorityIcon(item.priority)}
                                        <Select
                                            size="small"
                                            value={item.priority}
                                            onChange={(e) => handlePriorityChange(item._id, e.target.value)}
                                        >
                                            <MenuItem value="High">High</MenuItem>
                                            <MenuItem value="Medium">Medium</MenuItem>
                                            <MenuItem value="Low">Low</MenuItem>
                                        </Select>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        size="small"
                                        value={item.status}
                                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                        renderValue={(value) => (
                                            <Chip
                                                label={value}
                                                color={getStatusColor(value)}
                                                size="small"
                                            />
                                        )}
                                    >
                                        <MenuItem value="Open">Open</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Closed">Closed</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(item)}
                                        size="small"
                                    >
                                        <MessageIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedFeedback && (
                    <>
                        <DialogTitle>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">
                                    Feedback Details
                                </Typography>
                                <IconButton onClick={handleCloseDialog} size="small">
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box className="space-y-4 mt-2">
                                <div>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Type
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedFeedback.type}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Subject
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedFeedback.subject}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Message
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedFeedback.message}
                                    </Typography>
                                </div>
                                <TextField
                                    label="Response"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    variant="outlined"
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button
                                onClick={handleResponseSubmit}
                                variant="contained"
                                color="primary"
                                disabled={!response.trim()}
                            >
                                Send Response
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default FeedbackManagement; 