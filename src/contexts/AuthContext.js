import { createContext, useState, useContext, useEffect } from 'react';
import { DEFAULT_AVATAR } from '~/constants/common';
import * as authService from '~/services/apiServices/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status when the app loads
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                setIsLoading(true);
                const userData = await authService.checkAuth();

                if (userData) {
                    setUser(userData.user_metadata);
                    console.log('User authenticated on startup');
                } else {
                    setUser(null);
                    console.log('No valid authentication found');
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    const toggleLoginForm = () => {
        setShowLoginForm((prev) => !prev);
        setIsRegistering(false);
    };

    const toggleRegisterMode = () => {
        setIsRegistering((prev) => !prev);
    };

    const login = async (email, password) => {
        try {
            const success = await authService.login(email, password);

            if (success) {
                // After successful login, fetch the user data
                const userData = await authService.checkAuth();
                if (userData) {
                    window.location.href = '/';
                    setUser(userData.user_metadata);
                } else {
                    // Fallback in case user data fetch fails
                    setUser({
                        email,
                        avatar: DEFAULT_AVATAR,
                    });
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const res = await authService.register(
                firstName,
                lastName,
                email,
                password,
            );

            if (res.success) {
                console.log(res.user)
                // After successful registration, fetch the user data
                const userData = res.user.user_metadata;
                if (userData) {
                    // window.location.href = '/';
                    setUser(userData);
                } else {
                    // Fallback in case user data fetch fails
                    setUser({
                        firstName,
                        lastName,
                        email,
                        avatar: DEFAULT_AVATAR,
                    });
                }
                setIsRegistering(false);
                return { success: true };
            }
            return {
                success: false,
                message: 'Registration failed. Please try again.',
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'An error occurred during registration',
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        showLoginForm,
        isRegistering,
        isLoading,
        toggleLoginForm,
        toggleRegisterMode,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
