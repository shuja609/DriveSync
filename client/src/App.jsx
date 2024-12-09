import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Footer from './components/layout/Footer';
import ErrorPage from './components/error/ErrorPage';
import NotFoundPage from './components/error/NotFoundPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmail from './components/auth/VerifyEmail';
import ShowroomPage from './components/pages/ShowroomPage';
import VehicleDetailPage from './components/pages/VehicleDetailPage';
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
import AdminLayout from './components/admin/layout/AdminLayout';
import Dashboard from './components/admin/dashboard/Dashboard';
import UsersList from './components/admin/users/UsersList';
import VehiclesList from './components/admin/vehicles/VehiclesList';
import VehicleForm from './components/admin/vehicles/VehicleForm';
import AnalyticsDashboard from './components/admin/analytics/AnalyticsDashboard';
import OrdersList from './components/admin/sales/OrdersList';
import TransactionsList from './components/admin/sales/TransactionsList';
import OrderDetails from './components/admin/sales/OrderDetails';
import TransactionDetails from './components/admin/sales/TransactionDetails';
import MyOrders from './components/order/MyOrders';
import UserOrderDetails from './components/order/OrderDetails';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentManagement from './components/admin/content/ContentManagement';
import AdminSettings from './components/admin/settings/AdminSettings';
import { SnackbarProvider, useSnackbar } from 'notistack';
import FeedbackManagement from './components/admin/feedback/FeedbackManagement';
import AIChatBox from './components/chat/AIChatBox';
import SalesLayout from './components/sales/layout/SalesLayout';
import SalesDashboard from './components/sales/dashboard/SalesDashboard';
import CustomerList from './components/sales/customers/CustomerList';
import QuotationList from './components/sales/quotations/QuotationList';
import CreateQuotationModal from './components/sales/quotations/CreateQuotationModal';
import SellerInquiryManagement from './components/seller/inquiries/SellerInquiryManagement';
import SellerOrderManagement from './components/seller/orders/SellerOrderManagement';
import SellerDiscountManagement from './components/seller/discounts/SellerDiscountManagement';
import SellerFeedbackManagement from './components/seller/feedback/SellerFeedbackManagement';
import SellerSettings from './components/seller/settings/SellerSettings';

const App = () => {
    const [errors, setErrors] = useState({});
    const { enqueueSnackbar } = useSnackbar();

    const SalesRoute = ({ children }) => (
        <PrivateRoute>
            {({ user }) => {
                if (user.role !== 'sales') {
                    return <Navigate to="/" replace />;
                }
                return children;
            }}
        </PrivateRoute>
    );

    return (
        <SnackbarProvider maxSnack={3}>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/showroom" element={<ShowroomPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/vehicles/:id" element={<VehicleDetailPage />} />

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

                {/* Order Management Routes - Protected */}
                <Route path="/orders" element={
                    <PrivateRoute>
                        <MyOrders />
                    </PrivateRoute>
                } />
                <Route path="/orders/:id" element={
                    <PrivateRoute>
                        <UserOrderDetails />
                    </PrivateRoute>
                } />

                {/* Error routes */}
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />

                {/* Admin routes */}
                <Route path="/admin" element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<UsersList />} />
                    <Route path="vehicles" element={<VehiclesList />} />
                    <Route path="vehicles/new" element={<VehicleForm />} />
                    <Route path="vehicles/:id/edit" element={<VehicleForm />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    
                    {/* Sales routes */}
                    <Route path="sales">
                        <Route path="orders" element={<OrdersList />} />
                        <Route path="orders/:id" element={<OrderDetails />} />
                        <Route path="transactions" element={<TransactionsList />} />
                        <Route path="transactions/:id" element={<TransactionDetails />} />
                    </Route>
                    <Route path="content" element={<ContentManagement />} />
                    <Route path="feedback" element={<FeedbackManagement />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Sales Panel Routes */}
                <Route
                    path="/sales"
                    element={
                        <SalesRoute>
                            <SalesLayout />
                        </SalesRoute>
                    }
                >
                    <Route index element={<Navigate to="/sales/dashboard" replace />} />
                    <Route path="dashboard" element={<SalesDashboard />} />
                    <Route path="customers" element={<CustomerList />} />
                    <Route path="orders" element={<SellerOrderManagement />} />
                    <Route path="quotations" element={<QuotationList />} />
                    <Route path="inquiries" element={<SellerInquiryManagement />} />
                    <Route path="discounts" element={<SellerDiscountManagement />} />
                    <Route path="feedback" element={<SellerFeedbackManagement />} />
                    <Route path="settings" element={<SellerSettings />} />
                </Route>
            </Routes>
            <AIChatBox />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </SnackbarProvider>
    );
};

export default App; 