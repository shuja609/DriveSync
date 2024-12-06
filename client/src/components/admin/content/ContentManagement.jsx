import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Paper
} from '@mui/material';
import {
    VideoLibrary as VideoIcon,
    BarChart as AnalyticsIcon
} from '@mui/icons-material';
import VideosList from './VideosList';
import VideoAnalytics from './VideoAnalytics';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`content-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const ContentManagement = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Content Management
            </Typography>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab 
                        icon={<VideoIcon />} 
                        label="Videos" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<AnalyticsIcon />} 
                        label="Analytics" 
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            <TabPanel value={currentTab} index={0}>
                <VideosList />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <VideoAnalytics />
            </TabPanel>
        </Box>
    );
};

export default ContentManagement;
