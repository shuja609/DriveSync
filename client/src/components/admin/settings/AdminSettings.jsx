import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Grid,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Save as SaveIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const AdminSettings = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        general: {
            siteName: 'DriveSync',
            siteDescription: 'Car Dealership Management System',
            maintenanceMode: false,
            allowRegistration: true,
            defaultUserRole: 'user'
        },
        email: {
            smtpHost: 'smtp.gmail.com',
            smtpPort: '587',
            smtpUser: 'admin@drivesync.com',
            smtpPassword: '********',
            senderEmail: 'admin@drivesync.com',
            senderName: 'DriveSync Admin'
        },
        security: {
            passwordMinLength: 8,
            requireEmailVerification: true,
            sessionTimeout: 24,
            maxLoginAttempts: 5,
            twoFactorAuth: false
        },
        notifications: {
            emailNotifications: true,
            adminAlerts: true,
            userRegistrationNotice: true,
            orderNotifications: true
        },
        storage: {
            maxUploadSize: 10,
            allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx',
            useCloudStorage: false,
            cloudProvider: 'local'
        }
    });

    const handleChange = (section, field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (section) => {
        try {
            setLoading(true);
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            enqueueSnackbar(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`, { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update settings', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const renderGeneralSettings = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    General Settings
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Site Name"
                            value={settings.general.siteName}
                            onChange={handleChange('general', 'siteName')}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Site Description"
                            value={settings.general.siteDescription}
                            onChange={handleChange('general', 'siteDescription')}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.general.maintenanceMode}
                                    onChange={handleChange('general', 'maintenanceMode')}
                                />
                            }
                            label="Maintenance Mode"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.general.allowRegistration}
                                    onChange={handleChange('general', 'allowRegistration')}
                                />
                            }
                            label="Allow Registration"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit('general')}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={loading}
                        >
                            Save General Settings
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    const renderEmailSettings = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Email Settings
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="SMTP Host"
                            value={settings.email.smtpHost}
                            onChange={handleChange('email', 'smtpHost')}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="SMTP Port"
                            value={settings.email.smtpPort}
                            onChange={handleChange('email', 'smtpPort')}
                            margin="normal"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="SMTP User"
                            value={settings.email.smtpUser}
                            onChange={handleChange('email', 'smtpUser')}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="SMTP Password"
                            value={settings.email.smtpPassword}
                            onChange={handleChange('email', 'smtpPassword')}
                            margin="normal"
                            type="password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit('email')}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={loading}
                        >
                            Save Email Settings
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    const renderSecuritySettings = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Security Settings
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Minimum Password Length"
                            value={settings.security.passwordMinLength}
                            onChange={handleChange('security', 'passwordMinLength')}
                            margin="normal"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Session Timeout (hours)"
                            value={settings.security.sessionTimeout}
                            onChange={handleChange('security', 'sessionTimeout')}
                            margin="normal"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.security.requireEmailVerification}
                                    onChange={handleChange('security', 'requireEmailVerification')}
                                />
                            }
                            label="Require Email Verification"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.security.twoFactorAuth}
                                    onChange={handleChange('security', 'twoFactorAuth')}
                                />
                            }
                            label="Enable Two-Factor Authentication"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit('security')}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={loading}
                        >
                            Save Security Settings
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    const renderNotificationSettings = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Notification Settings
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.notifications.emailNotifications}
                                    onChange={handleChange('notifications', 'emailNotifications')}
                                />
                            }
                            label="Email Notifications"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.notifications.adminAlerts}
                                    onChange={handleChange('notifications', 'adminAlerts')}
                                />
                            }
                            label="Admin Alerts"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.notifications.userRegistrationNotice}
                                    onChange={handleChange('notifications', 'userRegistrationNotice')}
                                />
                            }
                            label="User Registration Notifications"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.notifications.orderNotifications}
                                    onChange={handleChange('notifications', 'orderNotifications')}
                                />
                            }
                            label="Order Notifications"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit('notifications')}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={loading}
                        >
                            Save Notification Settings
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    const renderStorageSettings = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Storage Settings
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Max Upload Size (MB)"
                            value={settings.storage.maxUploadSize}
                            onChange={handleChange('storage', 'maxUploadSize')}
                            margin="normal"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Allowed File Types (comma-separated)"
                            value={settings.storage.allowedFileTypes}
                            onChange={handleChange('storage', 'allowedFileTypes')}
                            margin="normal"
                            helperText="e.g., jpg,png,pdf"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.storage.useCloudStorage}
                                    onChange={handleChange('storage', 'useCloudStorage')}
                                />
                            }
                            label="Use Cloud Storage"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Cloud Storage Provider</InputLabel>
                            <Select
                                value={settings.storage.cloudProvider}
                                onChange={handleChange('storage', 'cloudProvider')}
                                disabled={!settings.storage.useCloudStorage}
                            >
                                <MenuItem value="local">Local Storage</MenuItem>
                                <MenuItem value="aws">Amazon S3</MenuItem>
                                <MenuItem value="gcp">Google Cloud Storage</MenuItem>
                                <MenuItem value="azure">Azure Blob Storage</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit('storage')}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={loading}
                        >
                            Save Storage Settings
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Admin Settings
            </Typography>
            {renderGeneralSettings()}
            {renderEmailSettings()}
            {renderSecuritySettings()}
            {renderNotificationSettings()}
            {renderStorageSettings()}
        </Box>
    );
};

export default AdminSettings; 