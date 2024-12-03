import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Footer from './components/layout/Footer';
import ErrorPage from './components/error/ErrorPage';
import NotFoundPage from './components/error/NotFoundPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmail from './components/auth/VerifyEmail';
import { ProfileSetupProvider } from './context/ProfileSetupContext';
import SetupBasicInfo from './components/profile/setup/SetupBasicInfo';
import SetupProfilePicture from './components/profile/setup/SetupProfilePicture';
import SetupPersonalInfo from './components/profile/setup/SetupPersonalInfo';
import SetupAddress from './components/profile/setup/SetupAddress';
import SetupPreferences from './components/profile/setup/SetupPreferences';
import PrivateRoute from './components/common/PrivateRoute';
import ProfileOverview from './components/profile/ProfileOverview';
import AccountSettings from './components/profile/AccountSettings';
import EmailSettings from './components/profile/EmailSettings';
import NotificationSettings from './components/profile/NotificationSettings';
import SavedCars from './components/profile/SavedCars';
import ActivityHistory from './components/profile/ActivityHistory';
import Support from './components/profile/Support';
import './App.css';

const App = () => {
    return (
        <>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Protected routes */}
                <Route path="/setup/*" element={
                    <PrivateRoute>
                        <ProfileSetupProvider />
                    </PrivateRoute>
                }>
                    <Route index element={<SetupBasicInfo />} />
                    <Route path="step1" element={<SetupBasicInfo />} />
                    <Route path="step2" element={<SetupProfilePicture />} />
                    <Route path="step3" element={<SetupPersonalInfo />} />
                    <Route path="step4" element={<SetupAddress />} />
                    <Route path="step5" element={<SetupPreferences />} />
                </Route>

                {/* Profile Routes - Protected */}
                <Route path="/profile" element={
                    <PrivateRoute>
                        <ProfileOverview />
                    </PrivateRoute>
                } />
                <Route path="/profile/settings" element={
                    <PrivateRoute>
                        <AccountSettings />
                    </PrivateRoute>
                } />
                <Route path="/profile/emails" element={
                    <PrivateRoute>
                        <EmailSettings />
                    </PrivateRoute>
                } />
                <Route path="/profile/notifications" element={
                    <PrivateRoute>
                        <NotificationSettings />
                    </PrivateRoute>
                } />
                <Route path="/profile/saved" element={
                    <PrivateRoute>
                        <SavedCars />
                    </PrivateRoute>
                } />
                <Route path="/profile/activity" element={
                    <PrivateRoute>
                        <ActivityHistory />
                    </PrivateRoute>
                } />
                <Route path="/profile/support" element={
                    <PrivateRoute>
                        <Support />
                    </PrivateRoute>
                } />

                {/* Error routes */}
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </>
    );
};

export default App; 