import { useState, useEffect, useRef } from 'react';
import supabase from '~/config/supabaseClient';

// Custom hook to fetch videos for different tabs
function useVideosProfile(profileId, activeTab) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Cache to store data for each tab
  const cache = useRef({});
  const currentProfileId = useRef(profileId);

  useEffect(() => {
    // Don't fetch anything if no profileId
    if (!profileId) {
      setVideos([]);
      setLoading(false);
      return;
    }

    // Reset cache if profileId changes
    if (currentProfileId.current !== profileId) {
      cache.current = {};
      currentProfileId.current = profileId;
    }

    // Check if we already have data for this tab
    if (cache.current[activeTab]) {
      setVideos(cache.current[activeTab]);
      setLoading(false);
      return;
    }

    const fetchVideos = async () => {
      setLoading(true);
      
      try {
        let data, error;

        switch (activeTab) {
          case 'videos':
            ({ data, error } = await supabase
              .rpc('get_videos_by_user', { uid: profileId }));
            break;
          
          case 'liked':
            ({ data, error } = await supabase
              .rpc('get_liked_videos_by_user', { uid: profileId }));
            break;
          
          // Add more cases for other tabs when available
          case 'reposts':
          case 'favourites':
          default:
            // For now, return empty array for unimplemented tabs
            data = [];
            error = null;
            break;
        }

        if (error) {
          console.error(`Error fetching ${activeTab}:`, error);
          setVideos([]);
          cache.current[activeTab] = []; // Cache empty array
        } else {
          const videoData = data || [];
          setVideos(videoData);
          cache.current[activeTab] = videoData; // Cache the data
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
        setVideos([]);
        cache.current[activeTab] = []; // Cache empty array
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [profileId, activeTab]);

  return { videos, loading };
}

export default useVideosProfile;
