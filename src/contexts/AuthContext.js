import { createContext, useState, useContext, useEffect } from 'react';
import { DEFAULT_AVATAR } from '~/constants/common';
import * as authService from '~/services/apiServices/authService';
import * as followServices from '~/services/apiServices/followServices';

const AuthContext = createContext();
const FOLLOWING_PER_PAGE = 5;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [totalFollowingPages, setTotalFollowingPages] = useState(0);
    const [followingIds, setFollowingIds] = useState([]);

    // Check authentication status when the app loads
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                setIsLoading(true);
                const userData = await authService.checkAuth();

                if (userData) {
                    setUser(userData);
                    console.log('User authenticated on startup');
                    fetchFollowingData();
                } else {
                    setUser(null);
                    setFollowingIds([]);
                    setTotalFollowingPages(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    setUser(userData);
                    fetchFollowingData();
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
            const success = await authService.register(
                firstName,
                lastName,
                email,
                password,
            );

            if (success) {
                // After successful registration, fetch the user data
                const userData = await authService.checkAuth();
                if (userData) {
                    setUser(userData);
                    setFollowingIds([]);
                    setTotalFollowingPages(0);
                } else {
                    // Fallback in case user data fetch fails
                    setUser({
                        firstName,
                        lastName,
                        email,
                        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&s',
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

    const fetchFollowingData = async () => {
        if (!user) return;

        try {
            // Lấy tổng số trang
            const totalPages = await followServices.getTotalFollowingPages();
            setTotalFollowingPages(totalPages);

            // Lấy danh sách IDs
            const allIds = await followServices.getAllFollowingIds(totalPages);
            setFollowingIds(allIds);
        } catch (error) {
            console.error('Error loading following data:', error);
        }
    };

    const handleFollow = async (userId) => {
        try {
            await followServices.followUser(userId);
            // Cập nhật state
            setFollowingIds((prev) => [...prev, userId]);
            setTotalFollowingPages(Math.ceil(followingIds.length / FOLLOWING_PER_PAGE));
        } catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await followServices.unfollowUser(userId);
            // Cập nhật state
            setFollowingIds((prev) => prev.filter((id) => id !== userId));
            setTotalFollowingPages(Math.ceil(followingIds.length / FOLLOWING_PER_PAGE));
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    };

    const isFollowing = (userId) => {
        return followingIds.includes(userId);
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
        followingIds,
        totalFollowingPages,
        handleFollow,
        handleUnfollow,
        isFollowing,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
