import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import supabase from '~/config/supabaseClient';

const SocialInteractionContext = createContext();

export const useSocialInteraction = () => useContext(SocialInteractionContext);

export const SocialInteractionProvider = ({ children }) => {
  const { user } = useAuth();
  const [followingIds, setFollowingIds] = useState([]);
  const [followersIds, setFollowersIds] = useState([]);
  const [followingUsers, setFollowingUsers] = useState({});
  const [followersUsers, setFollowersUsers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFollowingData();
    } else {
      setFollowingIds([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchFollowingData = async () => {
    try {
      // Lấy danh sách IDs
      const { data: allIds, error } = await supabase.rpc('get_following_ids');
      if (error) {
        throw error;
      }
      setFollowingIds(allIds);
    } catch (error) {
      console.error('Error loading following data:', error);
    }
  };

  const fetchFollowersData = async () => {
    try {
      const { data: allIds, error } = await supabase.rpc('get_followers_ids');
      if (error) {
        throw error;
      }
      setFollowersIds(allIds);
    } catch (error) {
      console.error('Error loading followers data:', error);
    }
  };

  const fetchFollowingUsers = async (userId) => {
    // Check if data already exists for this user
    if (followingUsers[userId]) {
      return followingUsers[userId];
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_following_users', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error fetching following users:', error);
        throw error;
      }

      // Cache the data
      setFollowingUsers(prev => ({
        ...prev,
        [userId]: data || []
      }));

      return data || [];
    } catch (error) {
      console.error('Error calling get_following_users RPC:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowersUsers = async (userId) => {
    // Check if data already exists for this user
    if (followersUsers[userId]) {
      return followersUsers[userId];
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_follower_users', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error fetching followers users:', error);
        throw error;
      }

      // Cache the data
      setFollowersUsers(prev => ({
        ...prev,
        [userId]: data || []
      }));

      return data || [];
    } catch (error) {
      console.error('Error calling get_followers_users RPC:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
      if (followingIds) {
        setFollowingIds((prev) => [...prev, targetUserId]);
      } else {
        setFollowingIds([targetUserId]);
      }
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
    if (!targetUserId || !followingIds) return false;
    return followingIds.includes(targetUserId);
  };

  const value = {
    isLoading,
    isFollowing,
    followingIds,
    followersIds,
    followingUsers,
    followersUsers,
    fetchFollowersData,
    fetchFollowingUsers,
    fetchFollowersUsers,
    handleToggleFollow,
    handleToggleLikeVideo,
  };

  return (
    <SocialInteractionContext.Provider value={value}>
      {children}
    </SocialInteractionContext.Provider>
  );
};
