// Get auth config with token for API requests
export const getAuthConfig = () => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userData) {
        return {};
    }

    try {
        const { token } = JSON.parse(userData);
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    } catch (error) {
        console.error('Error parsing user data:', error);
        return {};
    }
}; 