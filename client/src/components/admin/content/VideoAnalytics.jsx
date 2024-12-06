import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress
} from '@mui/material';
import {
    VideoLibrary as VideoIcon,
    Category as CategoryIcon,
    Visibility as ViewsIcon,
    PlayCircleOutline as TypeIcon
} from '@mui/icons-material';
import * as contentService from '../../../services/contentService';

const VideoAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await contentService.getVideoAnalytics();
            setAnalytics(data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!analytics) return null;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Video Analytics
            </Typography>

            <Grid container spacing={3}>
                {/* Total Videos */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <VideoIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Total Videos</Typography>
                            </Box>
                            <Typography variant="h4">{analytics.totalVideos}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total Views */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <ViewsIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Total Views</Typography>
                            </Box>
                            <Typography variant="h4">{analytics.totalViews}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Videos by Type */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <TypeIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Videos by Type</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                {analytics.videosByType.map((item) => (
                                    <Grid item xs={6} key={item._id}>
                                        <Typography variant="body1" color="textSecondary">
                                            {item._id}
                                        </Typography>
                                        <Typography variant="h6">
                                            {item.count}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Videos by Category */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <CategoryIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Videos by Category</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                {analytics.videosByCategory.map((item) => (
                                    <Grid item xs={12} sm={6} md={3} key={item._id}>
                                        <Typography variant="body1" color="textSecondary">
                                            {item._id}
                                        </Typography>
                                        <Typography variant="h6">
                                            {item.count}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default VideoAnalytics; 