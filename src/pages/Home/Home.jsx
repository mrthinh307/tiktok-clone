/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import VideoPlayer from './components/VideoPlayer';
import { fetchVideos } from '~/services/apiServices/videoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Home() {
    const [videos, setVideos] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadedMap, setLoadedMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState(null);
    const [showNavigationIndicator, setShowNavigationIndicator] = useState(false);

    const containerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const navigationTimeoutRef = useRef(null);
    
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
                mappedVideos.slice(0, 3).forEach(video => {
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
                    videosToPreload.forEach(video => {
                        updatedLoadedMap[video.id] = true;
                    });
                    setLoadedMap(updatedLoadedMap);
                }
            }
            
            console.log(`Successfully loaded page ${page}, got ${mappedVideos.length} videos`);
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
            currentVideoIndex >= videos.length - 5  // Increased threshold to load earlier
        ) {
            console.log(`Near the end (index ${currentVideoIndex} of ${videos.length}), loading more videos...`);
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
        const indicesToLoad = [index - 2, index - 1, index, index + 1, index + 2].filter(
            idx => idx >= 0 && idx < videos.length
        );
        
        // Update loadedMap for these indices
        const updatedLoadedMap = { ...loadedMap };
        let hasChanges = false;
        
        indicesToLoad.forEach(idx => {
            const videoId = videos[idx]?.id;
            if (videoId && !updatedLoadedMap[videoId]) {
                updatedLoadedMap[videoId] = true;
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            console.log(`Marking videos for preload: indices ${indicesToLoad.join(', ')}`);
            setLoadedMap(updatedLoadedMap);
        }
    };

    // Update preloaded videos when current index changes
    useEffect(() => {
        preloadVideos(currentVideoIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideoIndex, videos]);

    // Handle keyboard navigation with visual feedback
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (loading || isTransitioning) return;

            // Prevent default behavior for arrow keys
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
            }

            switch (event.key) {
                case 'ArrowUp':
                    if (currentVideoIndex > 0) {
                        showNavigationCue('prev');
                        handleVideoTransition(currentVideoIndex - 1, 'prev');
                    }
                    break;
                case 'ArrowDown':
                    if (currentVideoIndex < videos.length - 1) {
                        showNavigationCue('next');
                        handleVideoTransition(currentVideoIndex + 1, 'next');
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideoIndex, loading, videos.length, isTransitioning]);

    // Handle wheel events with improved behavior
    useEffect(() => {
        const handleScroll = (event) => {
            if (loading || isTransitioning) return;

            // Clear any pending scroll timeouts
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Debounce scroll events to prevent rapid firing
            scrollTimeoutRef.current = setTimeout(() => {
                const delta = event.deltaY;
                if (delta > 20 && currentVideoIndex < videos.length - 1) {
                    // Scroll down - next video
                    showNavigationCue('next');
                    handleVideoTransition(currentVideoIndex + 1, 'next');
                } else if (delta < 20 && currentVideoIndex > 0) {
                    // Scroll up - previous video
                    showNavigationCue('prev');
                    handleVideoTransition(currentVideoIndex - 1, 'prev');
                }
            }, 50);
        };

        window.addEventListener('wheel', handleScroll, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideoIndex, loading, videos.length, isTransitioning]);

    // Show navigation indicator briefly
    const showNavigationCue = (direction) => {
        // Clear any existing timeout
        if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
        }

        setTransitionDirection(direction);
        setShowNavigationIndicator(true);

        // Hide after animation
        navigationTimeoutRef.current = setTimeout(() => {
            setShowNavigationIndicator(false);
        }, 500);
    };

    // Handle smooth scroll transition with direction parameter
    const handleVideoTransition = (newIndex, direction = null) => {
        if (isTransitioning) return;

        setIsTransitioning(true);

        // Determine direction if not provided
        if (!direction) {
            direction = newIndex > currentVideoIndex ? 'next' : 'prev';
        }

        setTransitionDirection(direction);

        // Apply transition class to container
        if (containerRef.current) {
            containerRef.current.classList.add(cx('transitioning'));
            containerRef.current.classList.add(
                cx(`transitioning-${direction}`),
            );

            // Set timeout to allow CSS transition to complete
            setTimeout(() => {
                setCurrentVideoIndex(newIndex);

                // After index is updated, remove transition classes
                setTimeout(() => {
                    if (containerRef.current) {
                        containerRef.current.classList.remove(
                            cx('transitioning'),
                        );
                        containerRef.current.classList.remove(
                            cx(`transitioning-${direction}`),
                        );
                    }
                    setIsTransitioning(false);
                    setTransitionDirection(null);
                }, 50);
            }, 200);
        } else {
            setCurrentVideoIndex(newIndex);
            setIsTransitioning(false);
        }
    };

    // Handle button navigation
    const handleNextVideo = () => {
        if (currentVideoIndex < videos.length - 1) {
            showNavigationCue('next');
            handleVideoTransition(currentVideoIndex + 1, 'next');
        }
    };

    const handlePrevVideo = () => {
        if (currentVideoIndex > 0) {
            showNavigationCue('prev');
            handleVideoTransition(currentVideoIndex - 1, 'prev');
        }
    };
    
    // Get videos to render (current and adjacent videos)
    const videosToRender = videos.filter((_, index) => {
        return Math.abs(index - currentVideoIndex) <= 1;
    });

    // Debug info for development
    useEffect(() => {
        console.log(`Current video index: ${currentVideoIndex}, Total videos: ${videos.length}`);
        console.log(`Videos in loadedMap: ${Object.keys(loadedMap).length}`);
    }, [currentVideoIndex, videos.length, loadedMap]);

    return (
        <div className={cx('wrapper')} ref={containerRef}>
            {loading ? (
                <div className={cx('loading')}></div>
            ) : (
                <>
                    {videos.length > 0 && (
                        <div className={cx('video-wrapper')}>
                            {videosToRender.map((video) => (
                                <div
                                    key={video.id}
                                    style={{
                                        display: currentVideoIndex === videos.indexOf(video) ? 'block' : 'none',
                                        height: '100%',
                                    }}
                                >
                                    <VideoPlayer
                                        video={video}
                                        onNext={handleNextVideo}
                                        onPrev={handlePrevVideo}
                                        hasNext={videos.indexOf(video) < videos.length - 1}
                                        hasPrev={videos.indexOf(video) > 0}
                                        isLoaded={!!loadedMap[video.id]}
                                        shouldPlay={currentVideoIndex === videos.indexOf(video)}
                                        shouldPreload={Math.abs(currentVideoIndex - videos.indexOf(video)) <= 1}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Navigation direction indicators */}
                    {showNavigationIndicator &&
                        transitionDirection === 'prev' && (
                            <div
                                className={cx(
                                    'navigation-indicator',
                                    'prev',
                                    'visible',
                                )}
                            >
                                <FontAwesomeIcon icon={faChevronUp} />
                            </div>
                        )}
                    {showNavigationIndicator &&
                        transitionDirection === 'next' && (
                            <div
                                className={cx(
                                    'navigation-indicator',
                                    'next',
                                    'visible',
                                )}
                            >
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        )}

                    {/* Loading indicator when fetching more videos */}
                    {isFetchingMore && (
                        <div className={cx('loading-more')}>
                            Loading more videos...
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;
