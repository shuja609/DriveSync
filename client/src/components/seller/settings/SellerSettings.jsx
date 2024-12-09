import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiBell, FiGlobe, FiDollarSign } from 'react-icons/fi';

const SellerSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: FiUser },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'payment', label: 'Payment Settings', icon: FiDollarSign },
        { id: 'security', label: 'Security', icon: FiLock },
    ];

    return (
        <div className="p-4 sm:p-6 max-w-full overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-xl sm:text-2xl font-bold text-primary mb-6">Settings</h1>

                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Tabs */}
                    <div className="w-full sm:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow p-4">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <tab.icon className="flex-shrink-0" />
                                        <span className="truncate">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Profile Settings</h2>
                                    <div className="grid gap-6 max-w-2xl">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
                                    <div className="space-y-4 max-w-2xl">
                                        {['New Orders', 'Order Updates', 'Customer Messages', 'System Updates'].map((item) => (
                                            <div key={item} className="flex items-center justify-between">
                                                <span className="text-gray-700">{item}</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'payment' && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Payment Settings</h2>
                                    <div className="grid gap-6 max-w-2xl">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Routing Number</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Security Settings</h2>
                                    <div className="grid gap-6 max-w-2xl">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                            <input
                                                type="password"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                                            <input
                                                type="password"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark w-full sm:w-auto"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerSettings; 