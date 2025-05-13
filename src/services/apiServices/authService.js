import * as request from '~/utils/httpRequest';

export const login = async (email, password) => {
    try {
        const response = await request.post(
            'auth/login',
            {
                email,
                password,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            },
        );

        const token = response.meta.token;
        localStorage.setItem('token', token);

        console.log('Successfully logged in');

        return true;
    } catch (error) {
        console.error(
            'Failed to login:',
            error.response?.data || error.message,
        );
        return false;
    }
};

export const register = async (username, name, email, password) => {
    try {
        const response = await request.post('auth/register', {
            username,
            name,
            email,
            password,
        });

        const token = response.meta.token;
        localStorage.setItem('token', token);

        console.log('Successfully registered');

        return true;
    } catch (error) {
        console.error(
            'Failed to register:',
            error.response?.data || error.message,
        );
        return false;
    }
};
