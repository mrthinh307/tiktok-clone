import { createContext, useState, useContext, useEffect } from 'react';
import * as followServices from '~/services/apiServices/followServices';
import { useAuth } from './AuthContext';

const SocialInteractionContext = createContext();
const FOLLOWING_PER_PAGE = 5;

export const useSocialInteraction = () => useContext(SocialInteractionContext);

export const SocialInteractionProvider = ({ children }) => {
    const { user } = useAuth();
    const [followingIds, setFollowingIds] = useState([]);
    const [totalFollowingPages, setTotalFollowingPages] = useState(0);

    useEffect(() => {
        if (user) {
            fetchFollowingData();
        } else {
            setFollowingIds([]);
            setTotalFollowingPages(0);
        }
    }, [user]);

    const fetchFollowingData = async () => {
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
            setTotalFollowingPages(
                Math.ceil((followingIds.length + 1) / FOLLOWING_PER_PAGE),
            );
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
            setTotalFollowingPages(
                Math.ceil((followingIds.length - 1) / FOLLOWING_PER_PAGE),
            );
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    };

    const isFollowing = (userId) => {
        return followingIds.includes(userId);
    };

    const value = {
        followingIds,
        totalFollowingPages,
        handleFollow,
        handleUnfollow,
        isFollowing,
    };

    return (
        <SocialInteractionContext.Provider value={value}>
            {children}
        </SocialInteractionContext.Provider>
    );
};
