import { useState, useCallback, useRef } from 'react';
import supabase from '~/config/supabaseClient';
import { useAuth } from '~/contexts/AuthContext';

function useVideoData(queryPage) {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loadedMap, setLoadedMap] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // For the very first load
  const [isFetchingMore, setIsFetchingMore] = useState(false); // For subsequent "load more" actions
  const excludedVideoIdsRef = useRef(new Set()); // To keep track of already fetched user IDs

  // Fetch videos from Supabase
  const loadVideos = useCallback(
    async (isInitial = true) => {
      try {
        if (isInitial) setLoading(true);
        else setIsFetchingMore(true);

        let functionName = 'get_random_videos';
        let params = {
          limit_videos: 10,
          excluded_video_ids: Array.from(excludedVideoIdsRef.current),
        };

        if (queryPage === 'following') {
          functionName = 'get_following_videos';
          params = {
            current_user_id: user?.sub,
            ...params,
          };
        }

        const {
          data: { videos: videoList, has_more },
          error,
        } = await supabase.rpc(functionName, params);

        if (error) {
          throw error;
        }

        videoList.forEach((item) => excludedVideoIdsRef.current.add(item.id));

        if (!has_more) setHasMore(false);

        // Update videos storage and loadedMap
        if (isInitial) {
          setVideos(videoList);

          // Initialize loadedMap for the first 3 videos
          const initialLoadedMap = {};
          videoList.slice(0, 3).forEach((video) => {
            initialLoadedMap[video.id] = true;
          });
          setLoadedMap(initialLoadedMap);
        } else {
          const newVideos = [...videos, ...videoList];
          setVideos(newVideos);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        if (isInitial) setLoading(false);
        else setIsFetchingMore(false);
      }
    },
    [queryPage, user?.sub, videos],
  );

  // Check if need to load more videos
  const loadMoreIfNeeded = useCallback(
    (currentVideoIndex) => {
      if (
        !loading &&
        !isFetchingMore &&
        hasMore &&
        videos.length > 0 &&
        currentVideoIndex >= videos.length - 5 // Increased threshold to load earlier
      ) {
        // isInitial is false to indicate loading more videos
        loadVideos(false);
      }
    },
    [loading, isFetchingMore, hasMore, videos, loadVideos],
  );

  // Preload videos (mark them as should be loaded)
  const preloadVideos = useCallback(
    (index) => {
      if (!videos.length) return;

      // Consider more videos for preloading (up to 2 in each direction)
      const indicesToLoad = [
        index - 2,
        index - 1,
        index,
        index + 1,
        index + 2,
      ].filter((idx) => idx >= 0 && idx < videos.length);

      // Update loadedMap for these indices
      const updatedLoadedMap = { ...loadedMap };
      let hasChanges = false;

      indicesToLoad.forEach((idx) => {
        const videoId = videos[idx]?.id;
        if (videoId && !updatedLoadedMap[videoId]) {
          updatedLoadedMap[videoId] = true;
          hasChanges = true;
        }
      });

      // Thêm logic giới hạn số lượng video cache
      const MAX_CACHED_VIDEOS = 20;
      const totalCachedVideos = Object.keys(updatedLoadedMap).length;

      if (totalCachedVideos > MAX_CACHED_VIDEOS) {
        // Xác định range videos cần giữ lại (ưu tiên videos gần với vị trí hiện tại)
        const startIdx = Math.max(0, index - 10);
        const endIdx = Math.min(videos.length, index + 10);

        const videosToKeep = videos.slice(startIdx, endIdx).map((v) => v.id);

        // Tạo loadedMap mới chỉ chứa các videos cần giữ lại
        const newLoadedMap = {};
        videosToKeep.forEach((id) => {
          if (updatedLoadedMap[id]) newLoadedMap[id] = true;
        });

        // Đảm bảo video hiện tại và các video lân cận luôn được giữ lại
        indicesToLoad.forEach((idx) => {
          const videoId = videos[idx]?.id;
          if (videoId) newLoadedMap[videoId] = true;
        });

        setLoadedMap(newLoadedMap);
        return;
      }

      if (hasChanges) {
        setLoadedMap(updatedLoadedMap);
      }
    },
    [videos, loadedMap],
  );

  // Hàm để reset lại trạng thái và fetch videos từ đầu
  const resetAndReload = useCallback(() => {
    // Reset states
    setVideos([]);
    setLoadedMap({});
    setHasMore(true);

    // Load videos mới
    loadVideos(true);
  }, [loadVideos]);

  return {
    videos,
    loadedMap,
    loading,
    isFetchingMore,
    hasMore,
    loadVideos,
    loadMoreIfNeeded,
    preloadVideos,
    resetAndReload,
  };
}

export default useVideoData;
