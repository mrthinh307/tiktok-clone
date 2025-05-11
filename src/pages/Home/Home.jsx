/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useVideoData, useVideoNavigation } from '~/hooks';
import VideoList from './components/VideoList';

const cx = classNames.bind(styles);

function Home() {
    const containerRef = useRef(null);

    const {
        videos,
        loadedMap,
        loading,
        loadVideos,
        loadMoreIfNeeded,
        preloadVideos,
    } = useVideoData();

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
    });

    // Cleanup navigation khi unmount
    useEffect(() => {
        return cleanupNavigation;
    }, [cleanupNavigation]);

    // Load videos on initial mount
    useEffect(() => {
        loadVideos();
    }, []);

    useEffect(() => {
        loadMoreIfNeeded(currentVideoIndex);
    }, [currentVideoIndex, videos.length]);

    // Update preloaded videos when current index changes
    useEffect(() => {
        preloadVideos(currentVideoIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideoIndex, videos]);

    // Tính toán video cần render bằng useMemo để tránh tính lại khi re-render
    const videosToRender = useMemo(() => {
        return videos.filter((_, index) => {
            return Math.abs(index - currentVideoIndex) <= 1;
        });
    }, [videos, currentVideoIndex]);

    return (
        <div className={cx('wrapper')} ref={containerRef}>
            {loading ? (
                <div className={cx('loading')}>Loading...</div>
            ) : (
                <>
                    <VideoList
                        videos={videos}
                        currentVideoIndex={currentVideoIndex}
                        videosToRender={videosToRender}
                        navigateToNext={navigateToNext}
                        navigateToPrev={navigateToPrev}
                        loadedMap={loadedMap}
                        className={cx('video-wrapper')}
                    />
                </>
            )}
            {process.env.NODE_ENV === 'development' && (
                <button
                    onClick={() => {
                        if (window.performance && window.performance.memory) {
                            console.log(
                                `Used JS Heap: ${
                                    window.performance.memory.usedJSHeapSize /
                                    1048576
                                } MB`,
                            );
                        }
                    }}
                    style={{
                        position: 'fixed',
                        top: 10,
                        right: 10,
                        zIndex: 9999,
                    }}
                >
                    Check Memory
                </button>
            )}
        </div>
    );
}

export default Home;
