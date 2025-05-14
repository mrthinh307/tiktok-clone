import * as request from '~/utils/httpRequest';

export const login = async (email, password) => {
    try {
        const response = await request.post('auth/login', {
            email,
            password,
        });

        const token = response.meta.token;
        localStorage.setItem('token', token);

        return true;
    } catch (error) {
        console.error(
            'Failed to login:',
            error.response?.data || error.message,
        );
        return false;
    }
};

export const register = async (firstName, lastName, email, password) => {
    try {
        const response = await request.post('auth/register', {
            type: 'email',
            email,
            password,
        });

        const token = response.meta.token;
        localStorage.setItem('token', token);

        return true;
    } catch (error) {
        console.error(
            'Failed to register:',
            error.response?.data || error.message,
        );
        return false;
    }
};

export const checkAuth = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('No token found');
            return null;
        }

        // Call API to validate token and get user info
        const response = await request.get('auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response && response.data) {
            console.log('Token valid, user authenticated');
            return response.data;
        } else {
            console.log('Invalid response from auth/me');
            localStorage.removeItem('token');
            return null;
        }
    } catch (error) {
        console.error(
            'Failed to authenticate token:',
            error.response?.data || error.message,
        );
        // Clear invalid token
        localStorage.removeItem('token');
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    return true;
};

export const checkEmailExists = async (email) => {
    // try {
    //     const response = await request.post('auth/check-email', {
    //         email,
    //     });

    //     // If the response indicates the email exists
    //     return response.exists;
    // } catch (error) {
    //     // If the API returns a 409 Conflict status, it means the email exists
    //     if (error.response && error.response.status === 409) {
    //         return true;
    //     }

    //     throw new Error('Unable to check email. Please try again later.');
    // }

    return false;
};
