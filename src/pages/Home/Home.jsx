/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useMemo, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useVideoData, useVideoNavigation } from '~/hooks';
import VideoList from './components/VideoList';
import VideoNavButton from '~/layouts/components/VideoNavButton';
import { TiktokLoading } from '~/components/Animations';

const cx = classNames.bind(styles);

function Home({ queryPage = 'for-you' }) {
    const containerRef = useRef(null);

    const {
        videos,
        loadedMap,
        loading,
        loadVideos,
        loadMoreIfNeeded,
        preloadVideos,
    } = useVideoData(queryPage);

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

    // Memoized navigation handlers to prevent unnecessary re-renders
    const memoizedNavigateToNext = useCallback(navigateToNext, [
        navigateToNext,
    ]);
    const memoizedNavigateToPrev = useCallback(navigateToPrev, [
        navigateToPrev,
    ]);

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

    // Kiểm tra có thể điều hướng lên/xuống hay không - memoize to prevent re-renders
    const navigationState = useMemo(
        () => ({
            canNavigatePrev: currentVideoIndex > 0,
            canNavigateNext: currentVideoIndex < videos.length - 1,
        }),
        [currentVideoIndex, videos.length],
    );

    return (
        <div className={cx('wrapper')} ref={containerRef}>
            {loading ? (
                <div className='flex items-center justify-center h-full'>
                    <TiktokLoading />
                </div>
            ) : (
                <>
                    <VideoList
                        videos={videos}
                        currentVideoIndex={currentVideoIndex}
                        videosToRender={videosToRender}
                        navigateToNext={memoizedNavigateToNext}
                        navigateToPrev={memoizedNavigateToPrev}
                        loadedMap={loadedMap}
                        className={cx('video-wrapper')}
                    />
                    <VideoNavButton
                        onNext={memoizedNavigateToNext}
                        onPrev={memoizedNavigateToPrev}
                        canNavigateNext={navigationState.canNavigateNext}
                        canNavigatePrev={navigationState.canNavigatePrev}
                    />
                </>
            )}
        </div>
    );
}

export default Home;
