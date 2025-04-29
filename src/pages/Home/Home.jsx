import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import VideoPlayer from './components/VideoPlayer';
import { fetchVideos } from '~/services/apiServices/videoService';

const cx = classNames.bind(styles);

function Home() {
    const [videos, setVideos] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

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

    // Handle scroll events to change videos
    useEffect(() => {
        const handleScroll = (event) => {
            if (loading || !containerRef.current) return;

            // Xác định hướng scroll
            const delta = event.deltaY;

            if (delta > 0 && currentVideoIndex < videos.length - 1) {
                // Scroll down - next video
                setCurrentVideoIndex((prev) => prev + 1);
            } else if (delta < 0 && currentVideoIndex > 0) {
                // Scroll up - previous video
                setCurrentVideoIndex((prev) => prev - 1);
            }
        };

        // Thêm event listener
        window.addEventListener('wheel', handleScroll);

        return () => {
            // Cleanup
            window.removeEventListener('wheel', handleScroll);
        };
    }, [currentVideoIndex, loading, videos.length]);
    // useEffect(() => {
    //     let touchStartY = 0;

    //     const handleTouchStart = (e) => {
    //         touchStartY = e.touches[0].clientY;
    //     };

    //     const handleTouchEnd = (e) => {
    //         if (loading) return;

    //         const touchEndY = e.changedTouches[0].clientY;
    //         const deltaY = touchStartY - touchEndY;

    //         // Threshold để xác định swipe
    //         if (Math.abs(deltaY) > 50) {
    //             if (deltaY > 0 && currentVideoIndex < videos.length - 1) {
    //                 // Swipe up - next video
    //                 setCurrentVideoIndex((prev) => prev + 1);
    //             } else if (deltaY < 0 && currentVideoIndex > 0) {
    //                 // Swipe down - previous video
    //                 setCurrentVideoIndex((prev) => prev - 1);
    //             }
    //         }
    //     };

    //     window.addEventListener('touchstart', handleTouchStart);
    //     window.addEventListener('touchend', handleTouchEnd);

    //     return () => {
    //         window.removeEventListener('touchstart', handleTouchStart);
    //         window.removeEventListener('touchend', handleTouchEnd);
    //     };
    // }, [currentVideoIndex, loading, videos.length]);

    // Handle change video with button
    const handleNextVideo = () => {
        if (currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
        }
    };

    const handlePrevVideo = () => {
        if (currentVideoIndex > 0) {
            setCurrentVideoIndex(currentVideoIndex - 1);
        }
    };

    return (
        <div className={cx('wrapper')} ref={containerRef}>
            {loading ? (
                <div className={cx('loading')}></div>
            ) : (
                videos.length > 0 && (
                    <div className={cx('video-wrapper')}>
                        <VideoPlayer
                            video={videos[currentVideoIndex]}
                            onNext={handleNextVideo}
                            onPrev={handlePrevVideo}
                            hasNext={currentVideoIndex < videos.length - 1}
                            hasPrev={currentVideoIndex > 0}
                        />
                    </div>
                )
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
            'KHÔNG BIẾT SAU CHUYỆN NÀY CÔ GÁI ẤY SẼ CẢM THẤY NHƯ NÀO ĐÂY KHI ĐÃ ĐƯỢC HƯỚNG DẪN Cỡ ĐÓ RỒI MÀ VẪN THẾ NÀY',
        music: 'original sound',
        video: {
            cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-useast5-p-0068-tx/470e7757182144b189c308dc60705e9f_1714356490?x-expires=1714608000&x-signature=cyC%2BDerhviDKJpE30KZbSbuO42g%3D',
            playAddr:
                'https://v16-webapp-prime.tiktok.com/video/tos/useast5/tos-useast5-pve-0068-tx/oQCIAnh6k2IoMEL8BBuAuCvEhgAzACEDzKafEW/?a=1988&ch=0&cr=3&dr=0&lr=tiktok_m&cd=0%7C0%7C1%7C3&cv=1&br=1408&bt=704&cs=0&ds=3&ft=_p.C~yIVtbsZPvLWfh_vjjcby7LYvGeSN2vJwJngjN0P&mime_type=video_mp4&qs=0&rc=aDxlZzNlZjc3ZzhlZzM5OUBpM2c4OTQ6ZmdpZTMzZzczNEBfLjUuMzE0XmExNS5jMzVfYSMtZmEzcjQwLWFgLS1kMS9zcw%3D%3D&btag=e00080000&expire=1714607187&l=202404271646220102452291050C14678E&ply_type=2&policy=2&signature=379016328bd3cf9882c89c867efb5c10&tk=0',
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
            saves: 8740,
            shares: 3210,
        },
        caption: 'CODING LIFE',
    },
];

export default Home;
