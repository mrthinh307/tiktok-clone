/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import VideoPlayer from './components/VideoPlayer';
import { fetchVideos } from '~/services/apiServices/videoService';
import { useVideoNavigation } from '~/hooks';

const cx = classNames.bind(styles);

function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadedMap, setLoadedMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const containerRef = useRef(null);

    const {
        currentIndex: currentVideoIndex,
        navigateToNext,
        navigateToPrev,
        cleanup: cleanupNavigation,
    } = useVideoNavigation({
        initialIndex: 0,
        totalItems: videos.length,
        isEnabled: !loading,
        containerRef,
        classNameFormatter: cx,
        onIndexChange: (newIndex) => {
            // Gọi loadMoreIfNeeded sau khi index thay đổi
            // Đặt trong setTimeout để đảm bảo state đã cập nhật
            setTimeout(() => loadMoreIfNeeded(newIndex), 0);
        },
    });

    useEffect(() => {
        return () => {
            cleanupNavigation();
        };
    }, [cleanupNavigation]);

    // Fetch videos from Pexels API

    const loadVideos = async (isInitial = true) => {
        try {
            if (isInitial) setLoading(true);
            else setIsFetchingMore(true);

            // Use currentPage instead of calculating from cursor
            const page = isInitial ? 1 : currentPage + 1;

            console.log(`Fetching page ${page} videos...`);
            const pexelsVideos = await fetchVideos('trending', 10, page);

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
                    avatar: item.user?.url || 'https://via.placeholder.com/100',
                    verified: true,
                },
                description: item.url || 'Pexels Video',
                music: 'Original sound',
                video: {
                    cover: item.image,
                    playAddr: item.video_files.find((v) => v.quality === 'hd')
                        ?.link,
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

                // Mark videos that need preloading in the new batch
                const updatedLoadedMap = { ...loadedMap };

                // If we're near the end of current list, mark first few new videos as loaded
                if (currentVideoIndex >= videos.length - 3) {
                    const videosToPreload = mappedVideos.slice(0, 3);
                    videosToPreload.forEach((video) => {
                        updatedLoadedMap[video.id] = true;
                    });
                    setLoadedMap(updatedLoadedMap);
                }
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
    };

    // Load more videos when approaching the end with improved threshold
    const loadMoreIfNeeded = () => {
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

    // Load videos on initial mount
    useEffect(() => {
        loadVideos();
    }, []);

    // Check if need to load more videos
    useEffect(() => {
        loadMoreIfNeeded();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideoIndex]);

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

        if (hasChanges) {
            console.log(
                `Marking videos for preload: indices ${indicesToLoad.join(
                    ', ',
                )}`,
            );
            setLoadedMap(updatedLoadedMap);
        }
    };

    // Update preloaded videos when current index changes
    useEffect(() => {
        preloadVideos(currentVideoIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideoIndex, videos]);

    // Get videos to render (current and adjacent videos)
    const videosToRender = videos.filter((_, index) => {
        return Math.abs(index - currentVideoIndex) <= 1;
    });

    const VideoContainer = memo(({ video, shouldPlay, ...props }) => (
        <div
            key={video.id}
            style={{
                display: shouldPlay ? 'block' : 'none',
                height: '100%',
            }}
        >
            <VideoPlayer video={video} {...props} />
        </div>
    ));

    // Debug info for development
    useEffect(() => {
        console.log(
            `Current video index: ${currentVideoIndex}, Total videos: ${videos.length}`,
        );
        console.log(`Videos in loadedMap: ${Object.keys(loadedMap).length}`);
    }, [currentVideoIndex, videos.length, loadedMap]);

    return (
        <div className={cx('wrapper')} ref={containerRef}>
            {loading ? (
                <div className={cx('loading')}>Loading</div>
            ) : (
                <>
                    {videos.length > 0 && (
                        <div className={cx('video-wrapper')}>
                            {videosToRender.map((video) => (
                                <div
                                    key={video.id}
                                    style={{
                                        display:
                                            currentVideoIndex ===
                                            videos.indexOf(video)
                                                ? 'block'
                                                : 'none',
                                        height: '100%',
                                    }}
                                >
                                    <VideoPlayer
                                        video={video}
                                        onNext={navigateToNext}
                                        onPrev={navigateToPrev}
                                        hasNext={
                                            videos.indexOf(video) <
                                            videos.length - 1
                                        }
                                        hasPrev={videos.indexOf(video) > 0}
                                        isLoaded={!!loadedMap[video.id]}
                                        shouldPlay={
                                            currentVideoIndex ===
                                            videos.indexOf(video)
                                        }
                                        shouldPreload={
                                            Math.abs(
                                                currentVideoIndex -
                                                    videos.indexOf(video),
                                            ) <= 1
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;
