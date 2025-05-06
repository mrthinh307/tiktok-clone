// filepath: c:\FrontendCourse\ReactJs\tiktok-ui\src\hooks\useVideoData.js
import { useState, useCallback } from 'react';
import { fetchVideos } from '~/services/apiServices/videoService';

function useVideoData() {
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Internal: 0 means no page fetched yet
    const [loadedMap, setLoadedMap] = useState({});
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true); // For the very first load
    const [isFetchingMore, setIsFetchingMore] = useState(false); // For subsequent "load more" actions

    // Fetch videos from Pexels API
    const loadVideos = useCallback(
        async (isInitial = true) => {
            try {
                if (isInitial) setLoading(true);
                else setIsFetchingMore(true);

                // Use currentPage instead of calculating from cursor
                const page = isInitial ? 1 : currentPage + 1;

                console.log(`Fetching page ${page} videos...`);
                const pexelsVideos = await fetchVideos('vertical', 10, page);

                if (!pexelsVideos || pexelsVideos.length === 0) {
                    setHasMore(false);
                    return;
                }

                const filtered = pexelsVideos.filter((v) => v.height > v.width);

                if (filtered.length === 0) {
                    setHasMore(false);
                    return;
                }

                const mappedVideos = filtered.map((item, index) => ({
                    id: item.id.toString(),
                    user: {
                        id: item.user?.id,
                        nickname: `Pexels User ${page}-${index + 1}`,
                        avatar:
                            item.user?.url || 'https://via.placeholder.com/100',
                        verified: true,
                    },
                    description: item.url || 'Pexels Video',
                    music: 'Original sound',
                    video: {
                        cover: item.image,
                        playAddr: item.video_files.find(
                            (v) => v.quality === 'hd',
                        )?.link,
                        width: item.width,
                        height: item.height,
                        duration: item.duration,
                    },
                    stats: {
                        likes: Math.floor(Math.random() * 10000),
                        comments: Math.floor(Math.random() * 1000),
                        saves: Math.floor(Math.random() * 5000),
                        shares: Math.floor(Math.random() * 2000),
                    },
                    caption: 'Pexels Feed',
                }));

                // Update page number for next fetch
                setCurrentPage(page);

                // Update videos storage and loadedMap
                if (isInitial) {
                    setVideos(mappedVideos);

                    // Initialize loadedMap for the first 3 videos
                    const initialLoadedMap = {};
                    mappedVideos.slice(0, 3).forEach((video) => {
                        initialLoadedMap[video.id] = true;
                    });
                    setLoadedMap(initialLoadedMap);
                } else {
                    const newVideos = [...videos, ...mappedVideos];
                    setVideos(newVideos);
                }

                console.log(
                    `Successfully loaded page ${page}, got ${mappedVideos.length} videos`,
                );
            } catch (error) {
                console.error('Failed to fetch videos:', error);
                setHasMore(false);
            } finally {
                if (isInitial) setLoading(false);
                else setIsFetchingMore(false);
            }
        },
        [currentPage, videos],
    );

    // Check if need to load more videos
    const loadMoreIfNeeded = (currentVideoIndex) => {
        if (
            !loading &&
            !isFetchingMore &&
            hasMore &&
            videos.length > 0 &&
            currentVideoIndex >= videos.length - 5 // Increased threshold to load earlier
        ) {
            console.log(
                `Near the end (index ${currentVideoIndex} of ${videos.length}), loading more videos...`,
            );
            // isInitial is false to indicate loading more videos
            loadVideos(false);
        }
    };

    // Preload videos (mark them as should be loaded)
    const preloadVideos = (index) => {
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
            console.log(
                `Cache limit reached (${totalCachedVideos}/${MAX_CACHED_VIDEOS}), cleaning up...`,
            );

            // Xác định range videos cần giữ lại (ưu tiên videos gần với vị trí hiện tại)
            const startIdx = Math.max(0, index - 10);
            const endIdx = Math.min(videos.length, index + 10);

            const videosToKeep = videos
                .slice(startIdx, endIdx)
                .map((v) => v.id);

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

            console.log(
                `Reduced cache from ${totalCachedVideos} to ${
                    Object.keys(newLoadedMap).length
                } videos`,
            );
            setLoadedMap(newLoadedMap);
            return;
        }

        if (hasChanges) {
            console.log(
                `Marking videos for preload: indices ${indicesToLoad.join(
                    ', ',
                )}`,
            );
            setLoadedMap(updatedLoadedMap);
        }
    };

    return {
        videos,
        loadedMap,
        loading,
        isFetchingMore,
        hasMore,
        loadVideos,
        loadMoreIfNeeded,
        preloadVideos,
    };
}

export default useVideoData;
