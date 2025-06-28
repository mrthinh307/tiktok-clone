import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import supabase from '~/config/supabaseClient';

const SocialInteractionContext = createContext();

export const useSocialInteraction = () => useContext(SocialInteractionContext);

export const SocialInteractionProvider = ({ children }) => {
    const { user } = useAuth();
    const [followingIds, setFollowingIds] = useState([]);

    useEffect(() => {
        if (user) {
            fetchFollowingData();
        } else {
            setFollowingIds([]);
        }
    }, [user]);

    const fetchFollowingData = async () => {
        try {
            // Lấy danh sách IDs
            const { data: allIds, error } = await supabase.rpc(
                'get_following_ids',
            );
            if (error) {
                throw error;
            }
            setFollowingIds(allIds);
        } catch (error) {
            console.error('Error loading following data:', error);
        }
    };

    const handleToggleFollow = async (targetUserId) => {
        const { data, error } = await supabase.rpc('toggle_follow', {
            _following_id: targetUserId,
        });

        if (error) {
            console.error('Error:', error.message);
            throw error;
        } else {
            console.log(data.status); // "followed" or "unfollowed"
        }

        if (data.status === 'followed') {
            setFollowingIds((prev) => [...prev, targetUserId]);
        } else if (data.status === 'unfollowed') {
            setFollowingIds((prev) => prev.filter((id) => id !== targetUserId));
        }
    };

    const handleToggleLikeVideo = async (targetVideoId) => {
        const { data, error } = await supabase.rpc('toggle_like', {
            _video_id: targetVideoId,
        });

        if (error) {
            console.error('Error:', error.message);
            throw error;
        } else {
            console.log(data.status); // "liked" or "unliked"
        }
    };

    const isFollowing = (targetUserId) => {
        return followingIds.includes(targetUserId);
    }

    const value = {
        isFollowing,
        followingIds,
        handleToggleFollow,
        handleToggleLikeVideo,
    };

    return (
        <SocialInteractionContext.Provider value={value}>
            {children}
        </SocialInteractionContext.Provider>
    );
};
