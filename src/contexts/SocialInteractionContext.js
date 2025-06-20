import { createContext, useState, useContext, useEffect } from 'react';
import * as followServices from '~/services/apiServices/followServices';
import * as likeServices from '~/services/apiServices/likeServices';
import { useAuth } from './AuthContext';

const SocialInteractionContext = createContext();

export const useSocialInteraction = () => useContext(SocialInteractionContext);

export const SocialInteractionProvider = ({ children }) => {
    const { user } = useAuth();
    const [followingIds, setFollowingIds] = useState([]);
    const [likedVideoIds, setLikedVideoIds] = useState([]);

    useEffect(() => {
        if (user) {
            fetchFollowingData();
            fetchLikedVideosData();
        } else {
            setFollowingIds([]);
            setLikedVideoIds([]);
        }
    }, [user]);

    const fetchFollowingData = async () => {
        try {

            // Lấy danh sách IDs
            const allIds = await followServices.getAllFollowingIds();
            console.log('All following IDs:', allIds);
            setFollowingIds(allIds);
        } catch (error) {
            console.error('Error loading following data:', error);
        }
    };

    const handleFollow = async (userId) => {
        try {
            await followServices.followUser(userId);
            setFollowingIds((prev) => [...prev, userId]);
        } catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await followServices.unfollowUser(userId);
            setFollowingIds((prev) => prev.filter((id) => id !== userId));
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    };

    const fetchLikedVideosData = async () => {
        try {
            // Lấy danh sách IDs
            const allIds = await likeServices.getAllLikedVideoIds();
            setLikedVideoIds(allIds);
        } catch (error) {
            console.error('Error loading liked videos data:', error);
        }
    };

    const handleLikeVideo = async (videoId) => {
        try {
            await likeServices.likeVideo(videoId);
            setLikedVideoIds((prev) => [...prev, videoId]);
        } catch (error) {
            console.error('Error like video:', error);
            throw error;
        }
    };

    const handleCancelLikeVideo = async (videoId) => {
        try {
            await likeServices.cancelLikeVideo(videoId);
            setLikedVideoIds((prev) => prev.filter((id) => id !== videoId));
        } catch (error) {
            console.error('Error unlike video:', error);
            throw error;
        }
    };

    const isFollowing = (userId) => {
        return followingIds.includes(userId);
    };

    const isLikedVideo = (videoId) => {
        return likedVideoIds.includes(videoId);
    };

    const value = {
        followingIds,
        likedVideoIds,
        handleFollow,
        handleUnfollow,
        handleLikeVideo,
        handleCancelLikeVideo,
        isFollowing,
        isLikedVideo,
    };

    return (
        <SocialInteractionContext.Provider value={value}>
            {children}
        </SocialInteractionContext.Provider>
    );
};
