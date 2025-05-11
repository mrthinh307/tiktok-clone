// filepath: c:\FrontendCourse\ReactJs\tiktok-ui\src\hooks\useVideoData.js
import { useState, useCallback, useRef } from 'react';
import * as videoService from '~/services/apiServices/videoService';

function useVideoData() {
    const [videos, setVideos] = useState([]);
    const [loadedMap, setLoadedMap] = useState({});
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true); // For the very first load
    const [isFetchingMore, setIsFetchingMore] = useState(false); // For subsequent "load more" actions

    // Sử dụng useRef để lưu trữ danh sách các page đã fetch
    const fetchedPagesRef = useRef(new Set());
    const totalPagesRef = useRef(0);
    const lastFetchedPageRef = useRef(null);

    // Hàm lựa chọn page ngẫu nhiên
    const getRandomPage = useCallback(() => {
        console.log('Fetching random page...');
        const totalPages = totalPagesRef.current;
        const fetchedPages = fetchedPagesRef.current;

        // Nếu đã fetch tất cả các trang, reset lại danh sách
        if (fetchedPages.size >= totalPages) {
            console.log(
                'All pages have been fetched. Resetting fetched pages list.',
            );
            fetchedPages.clear();
            // Có thể giữ lại trang cuối cùng để tránh trùng lặp ngay lập tức
            if (lastFetchedPageRef > 0) {
                fetchedPages.add(lastFetchedPageRef);
            }
        }

        // Tạo mảng các trang chưa fetch
        const availablePages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (!fetchedPages.has(i)) {
                availablePages.push(i);
            }
        }

        // Chọn ngẫu nhiên một trang từ các trang chưa fetch
        const randomIndex = Math.floor(Math.random() * availablePages.length);
        const selectedPage = availablePages[randomIndex] || 1;

        // Thêm trang đã chọn vào danh sách đã fetch
        fetchedPages.add(selectedPage);
        lastFetchedPageRef.current = selectedPage;

        console.log(
            `Randomly selected page ${selectedPage} from ${availablePages.length} available pages`,
        );
        return selectedPage;
    }, []);

    // Fetch videos from API
    const loadVideos = useCallback(
        async (isInitial = true) => {
            try {
                if (isInitial) setLoading(true);
                else setIsFetchingMore(true);

                if (totalPagesRef.current === 0) {
                    totalPagesRef.current = await videoService.fetchTotalPages(
                        'for-you',
                    );
                }

                // Xác định page cần load
                const page = getRandomPage();

                console.log(`Fetching page ${page} videos...`);
                const response = await videoService.fetchVideos(
                    'for-you',
                    page,
                );

                // Lấy videos từ response và cập nhật meta
                const videosList = response.data || [];

                if (!videosList || videosList.length === 0) {
                    console.log('No videos available on this page');

                    // Nếu không có videos, thử load một trang khác
                    if (fetchedPagesRef.current.size < totalPagesRef.current) {
                        console.log('Trying another page...');
                        return loadVideos(isInitial);
                    } else {
                        setHasMore(false);
                        console.log('No more videos available');
                        return;
                    }
                }

                const verticalVideos = videosList.filter(
                    (v) =>
                        v.meta.video.resolution_y > v.meta.video.resolution_x,
                );

                if (verticalVideos.length === 0) {
                    console.log('No vertical videos on this page');

                    // Nếu không có vertical videos, thử load một trang khác
                    if (fetchedPagesRef.current.size < totalPagesRef.current) {
                        console.log(
                            'Trying another page for vertical videos...',
                        );
                        return loadVideos(isInitial);
                    } else {
                        setHasMore(false);
                        return;
                    }
                }

                // Update videos storage and loadedMap
                if (isInitial) {
                    setVideos(verticalVideos);

                    // Initialize loadedMap for the first 3 videos
                    const initialLoadedMap = {};
                    verticalVideos.slice(0, 3).forEach((video) => {
                        initialLoadedMap[video.id] = true;
                    });
                    setLoadedMap(initialLoadedMap);
                } else {
                    const newVideos = [...videos, ...verticalVideos];
                    setVideos(newVideos);
                }

                console.log(
                    `Successfully loaded page ${page}, got ${verticalVideos.length} videos`,
                );

                // Reset hasMore nếu chúng ta đã load hết số trang
                if (fetchedPagesRef.current.size >= totalPagesRef.current) {
                    console.log('All pages have been loaded at least once.');
                    // Không set hasMore = false để người dùng vẫn có thể load lại các trang
                }
            } catch (error) {
                console.error('Failed to fetch videos:', error);
            } finally {
                if (isInitial) setLoading(false);
                else setIsFetchingMore(false);
            }
        },
        [videos, getRandomPage],
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
                console.log(
                    `Near the end (index ${currentVideoIndex} of ${videos.length}), loading more videos...`,
                );
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
        },
        [videos, loadedMap],
    );

    // Hàm để reset lại trạng thái và fetch videos từ đầu
    const resetAndReload = useCallback(() => {
        // Clear fetchedPages
        fetchedPagesRef.current.clear();
        lastFetchedPageRef.current = null;
        totalPagesRef.current = 0;

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
