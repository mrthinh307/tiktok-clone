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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState(null);
    const [showNavigationIndicator, setShowNavigationIndicator] =
        useState(false);
    const containerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const navigationTimeoutRef = useRef(null);

    // Load videos from API
    useEffect(() => {
        const loadVideos = async () => {
            try {
                setLoading(true);

                const data = await fetchVideos();
                setVideos(data);
            } catch (error) {
                console.error('Failed to fetch videos:', error);
                // mock api
                setVideos(MOCK_VIDEOS);
            } finally {
                setLoading(false);
            }
        };

        loadVideos();
    }, []);

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

    return (
        <div className={cx('wrapper')} ref={containerRef}>
            {loading ? (
                <div className={cx('loading')}></div>
            ) : (
                <>
                    {videos.length > 0 && (
                        <div className={cx('video-wrapper')}>
                            <VideoPlayer
                                video={videos[currentVideoIndex]}
                                onNext={handleNextVideo}
                                onPrev={handlePrevVideo}
                                hasNext={currentVideoIndex < videos.length - 1}
                                hasPrev={currentVideoIndex > 0}
                            />
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
                </>
            )}
        </div>
    );
}

// Mock data
const MOCK_VIDEOS = [
    {
        id: '1',
        user: {
            id: 'viralworld',
            nickname: 'beatvn_viralworld',
            avatar: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/651f773def2501f5f2d6c1390499e8b9~c5_100x100.jpeg?x-expires=1714608000&x-signature=CZcYTJOvVJIl9uGq0NvkNVzDM8U%3D',
            verified: true,
        },
        description:
            "watching designers discover what's possible with new tools... #design #testing #ui #productivity",
        music: 'original sound',
        video: {
            cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-useast5-p-0068-tx/470e7757182144b189c308dc60705e9f_1714356490?x-expires=1714608000&x-signature=cyC%2BDerhviDKJpE30KZbSbuO42g%3D',
            playAddr:
                'https://v16-webapp-prime.tiktok.com/video/tos/useast5/tos-useast5-pve-0068-tx/oQCIAnh6k2IoMEL8BBuAuCvEhgAzACEDzKafEW/?a=1988&ch=0&cr=3&dr=0&lr=tiktok_m&cd=0%7C0%7C1%7C3&cv=1&br=1408&bt=704&cs=0&ds=3&ft=_p.C~yIVtbsZPvLWfh_vjjcby7LYvGeSN2vJwJngjN0P&mime_type=video_mp4&qs=0&rc=aDxlZzNlZjc3ZzhlZzM5OUBpM2c4OTQ6ZmdpZTMzZzczNEBfLjUuMzE0XmExNS5jMzVfYSMtZmEzcjQwLWFgLS1k',
            width: 576,
            height: 1024,
            duration: 15.12,
        },
        stats: {
            likes: 103500,
            comments: 2853,
            saves: 3379,
            shares: 4522,
        },
        caption: 'VIRAL WORLD',
    },
    {
        id: '2',
        user: {
            id: 'techcreator',
            nickname: 'TechCreator',
            avatar: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/a63b67ab75d4d651b0c1d58681bb1638~c5_100x100.jpeg?x-expires=1714608000&x-signature=soMeFakeSignature%3D',
            verified: true,
        },
        description: 'Check out this new AI tool! #tech #ai #future',
        music: 'original sound - TechCreator',
        video: {
            cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-useast5-p-0068-tx/someothercover_1714356123?x-expires=1714608000&x-signature=anotherFakeSignature%3D',
            playAddr:
                'https://v16-webapp-prime.tiktok.com/video/tos/useast5/someotherid/?mime_type=video_mp4',
            width: 576,
            height: 1024,
            duration: 22.5,
        },
        stats: {
            likes: 45600,
            comments: 312,
            saves: 12300,
            shares: 2800,
        },
        caption: 'THE FUTURE IS NOW',
    },
    {
        id: '3',
        user: {
            id: 'memecreator',
            nickname: 'Meme_Master',
            avatar: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/fake_avatar_3.jpeg?x-expires=1714608000&x-signature=thirdFakeSignature%3D',
            verified: false,
        },
        description:
            'When you finally understand React 😂 #programming #memes #coder',
        music: 'Oh No - Kreepa',
        video: {
            cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-useast5-p-0068-tx/thirdcover_1714356000?x-expires=1714608000&x-signature=yetAnotherFakeSignature%3D',
            playAddr:
                'https://v16-webapp-prime.tiktok.com/video/tos/useast5/thirdvideo/?mime_type=video_mp4',
            width: 576,
            height: 1024,
            duration: 10.3,
        },
        stats: {
            likes: 98200,
            comments: 1243,
            saves: 8900,
            shares: 5100,
        },
        caption: 'CODING LIFE',
    },
];

export default Home;
