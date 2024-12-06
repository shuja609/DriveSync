import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
    NotificationsNone, 
    Settings, 
    ExitToApp,
    Search as SearchIcon
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const AdminHeader = () => {
    const { user, logout } = useAuth();

    return (
        <header className="w-full">
            <div className="px-4 py-3 flex justify-between items-center">
                {/* Left Section - Title and Search */}
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-primary-light hidden sm:block">
                        DriveSync Admin
                    </h1>
                    <h1 className="text-xl font-bold text-primary-light sm:hidden">
                        DriveSync
                    </h1>
                </div>

                {/* Right Section - Actions and Profile */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    

                    {/* Notifications */}
                    <Tooltip title="Notifications">
                        <IconButton className="p-1 sm:p-2 hover:bg-background-dark rounded-full">
                            <NotificationsNone className="text-white/70 text-xl sm:text-2xl" />
                        </IconButton>
                    </Tooltip>

                    {/* Settings - Hidden on mobile */}
                    <Tooltip title="Settings">
                        <IconButton className="hidden sm:block p-1 sm:p-2 hover:bg-background-dark rounded-full">
                            <Settings className="text-white/70 text-xl sm:text-2xl" />
                        </IconButton>
                    </Tooltip>

                    {/* Profile and Logout */}
                    <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-background-dark">
                        <div className="hidden sm:block">
                            <p className="text-sm text-text-primary">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-primary/70">Admin</p>
                        </div>
                        <Tooltip title="Logout">
                            <IconButton 
                                onClick={logout}
                                className="p-1 sm:p-2 hover:bg-background-dark rounded-full"
                            >
                                <ExitToApp className="text-primary-light text-xl sm:text-2xl" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;