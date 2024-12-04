import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
    NotificationsNone, 
    Settings, 
    ExitToApp 
} from '@mui/icons-material';

const AdminHeader = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-background-light shadow-md">
            <div className="px-4 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary-light">
                    DriveSync Admin
                </h1>

                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-background-dark rounded-full">
                        <NotificationsNone className="text-text-primary" />
                    </button>
                    <button className="p-2 hover:bg-background-dark rounded-full">
                        <Settings className="text-text-primary" />
                    </button>
                    
                    <div className="flex items-center space-x-3">
                        <div>
                            <p className="text-sm text-text-primary">{user?.name}</p>
                            <p className="text-xs text-text-primary/70">Admin</p>
                        </div>
                        <button 
                            onClick={logout}
                            className="p-2 hover:bg-background-dark rounded-full"
                        >
                            <ExitToApp className="text-text-primary" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader; 