import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Publish as PublishIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import * as contentService from '../../../services/contentService';

const VideosList = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [errors, setErrors] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);
    
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        search: ''
    });
    const [sort, setSort] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        type: 'tutorial',
        category: 'general',
        duration: '',
        thumbnailUrl: ''
    });

    const videoTypes = ['tutorial', 'demo', 'review', 'maintenance', 'feature_showcase'];
    const videoCategories = ['sedan', 'suv', 'truck', 'sports', 'luxury', 'electric', 'hybrid', 'general'];

    useEffect(() => {
        fetchVideos();
    }, [filters, sort, order]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await contentService.getAllVideos({
                ...filters,
                sort,
                order
            });
            setVideos(response.videos || []);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch videos');
            enqueueSnackbar(error.response?.data?.message || 'Failed to fetch videos', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.url.trim()) {
            newErrors.url = 'URL is required';
        } else {
            try {
                new URL(formData.url);
            } catch (e) {
                newErrors.url = 'Please enter a valid URL';
            }
        }

        if (!formData.type || !videoTypes.includes(formData.type)) {
            newErrors.type = 'Please select a valid video type';
        }

        if (!formData.category || !videoCategories.includes(formData.category)) {
            newErrors.category = 'Please select a valid category';
        }

        if (!formData.duration || isNaN(formData.duration) || formData.duration <= 0) {
            newErrors.duration = 'Please enter a valid duration in seconds';
        }

        if (formData.thumbnailUrl) {
            try {
                new URL(formData.thumbnailUrl);
            } catch (e) {
                newErrors.thumbnailUrl = 'Please enter a valid thumbnail URL';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            enqueueSnackbar('Please fix the form errors', { variant: 'error' });
            return;
        }

        try {
            setLoading(true);
            if (selectedVideo) {
                await contentService.updateVideo(selectedVideo._id, formData);
                enqueueSnackbar('Video updated successfully', { variant: 'success' });
            } else {
                await contentService.createVideo(formData);
                enqueueSnackbar('Video created successfully', { variant: 'success' });
            }
            handleCloseDialog();
            fetchVideos();
        } catch (error) {
            const message = error.response?.data?.message || 'Operation failed';
            enqueueSnackbar(message, { variant: 'error' });
            
            // Handle validation errors from server
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (video = null) => {
        if (video) {
            setSelectedVideo(video);
            setFormData({
                title: video.title,
                description: video.description,
                url: video.url,
                type: video.type,
                category: video.category,
                duration: video.duration,
                thumbnailUrl: video.thumbnailUrl || ''
            });
        } else {
            setSelectedVideo(null);
            setFormData({
                title: '',
                description: '',
                url: '',
                type: 'tutorial',
                category: 'general',
                duration: '',
                thumbnailUrl: ''
            });
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedVideo(null);
        setFormData({
            title: '',
            description: '',
            url: '',
            type: 'tutorial',
            category: 'general',
            duration: '',
            thumbnailUrl: ''
        });
        setErrors({});
    };

    const handleDeleteClick = (video) => {
        setVideoToDelete(video);
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setVideoToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (!videoToDelete) return;

        try {
            setLoading(true);
            await contentService.deleteVideo(videoToDelete._id);
            enqueueSnackbar('Video deleted successfully', { variant: 'success' });
            fetchVideos();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete video';
            enqueueSnackbar(message, { variant: 'error' });
        } finally {
            setLoading(false);
            setVideoToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    const handleTogglePublish = async (id) => {
        try {
            setLoading(true);
            await contentService.toggleVideoPublish(id);
            enqueueSnackbar('Video publish status updated', { variant: 'success' });
            fetchVideos();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update publish status';
            enqueueSnackbar(message, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !videos.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={3}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    disabled={loading}
                >
                    Add New Video
                </Button>
            </Box>

            <Grid container spacing={3}>
                {videos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video._id}>
                        <Card>
                            {video.thumbnailUrl && (
                                <Box
                                    component="img"
                                    sx={{
                                        width: '100%',
                                        height: 200,
                                        objectFit: 'cover'
                                    }}
                                    src={video.thumbnailUrl}
                                    alt={video.title}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {video.description}
                                </Typography>
                                <Typography variant="caption" display="block">
                                    Duration: {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                                </Typography>
                                <Typography variant="caption" display="block">
                                    Category: {video.category}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton 
                                    onClick={() => window.open(video.url, '_blank')}
                                    color="primary"
                                    disabled={loading}
                                >
                                    <ViewIcon />
                                </IconButton>
                                <IconButton 
                                    onClick={() => handleOpenDialog(video)}
                                    color="primary"
                                    disabled={loading}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton 
                                    onClick={() => handleDeleteClick(video)}
                                    color="error"
                                    disabled={loading}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton 
                                    onClick={() => handleTogglePublish(video._id)}
                                    color={video.isPublished ? "primary" : "default"}
                                    disabled={loading}
                                >
                                    <PublishIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedVideo ? 'Edit Video' : 'Add New Video'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            error={!!errors.title}
                            helperText={errors.title}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            id="description"
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            error={!!errors.description}
                            helperText={errors.description}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="url"
                            label="Video URL"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            error={!!errors.url}
                            helperText={errors.url}
                            disabled={loading}
                        />
                        <FormControl 
                            fullWidth 
                            margin="normal"
                            error={!!errors.type}
                            disabled={loading}
                        >
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                                labelId="type-label"
                                id="type"
                                name="type"
                                value={formData.type}
                                label="Type"
                                onChange={handleInputChange}
                            >
                                {videoTypes.map(type => (
                                    <MenuItem key={type} value={type}>
                                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.type && (
                                <FormHelperText>{errors.type}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl 
                            fullWidth 
                            margin="normal"
                            error={!!errors.category}
                            disabled={loading}
                        >
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                name="category"
                                value={formData.category}
                                label="Category"
                                onChange={handleInputChange}
                            >
                                {videoCategories.map(category => (
                                    <MenuItem key={category} value={category}>
                                        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.category && (
                                <FormHelperText>{errors.category}</FormHelperText>
                            )}
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="duration"
                            label="Duration (in seconds)"
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={handleInputChange}
                            error={!!errors.duration}
                            helperText={errors.duration}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="thumbnailUrl"
                            label="Thumbnail URL"
                            name="thumbnailUrl"
                            value={formData.thumbnailUrl}
                            onChange={handleInputChange}
                            error={!!errors.thumbnailUrl}
                            helperText={errors.thumbnailUrl}
                            disabled={loading}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : (selectedVideo ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Typography id="delete-dialog-description">
                        Are you sure you want to delete the video "{videoToDelete?.title}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VideosList;