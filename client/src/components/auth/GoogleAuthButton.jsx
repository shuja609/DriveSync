import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

const GoogleAuthButton = () => {
    const { googleLogin } = useAuth();

    const handleSuccess = async (response) => {
        try {
            await googleLogin(response.credential);
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    const handleError = () => {
        console.error('Google login failed');
    };

    return (
        <div className="w-full">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                theme="filled_black"
                shape="rectangular"
                size="large"
                text="continue_with"
                width="100%"
            />
        </div>
    );
};

export default GoogleAuthButton; 