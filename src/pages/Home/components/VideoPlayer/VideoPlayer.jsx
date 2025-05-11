import { useState, useCallback, memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './VideoPlayer.module.scss';
import useVideoControl from '~/hooks/useVideoControl';
import VideoActions from '../VideoActions';
import { VideoControls, VideoInfo } from './components';
import LoadingSpinner from '~/components/LoadingSpinner';

const cx = classNames.bind(styles);
function VideoPlayer({
    video,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
    isLoaded,
    shouldPlay,
}) {
    const [expandedDescription, setExpandedDescription] = useState(false);
    const [videoSrc, setVideoSrc] = useState(null);
    const [videoOrientation, setVideoOrientation] = useState('vertical'); // 'vertical' hoặc 'horizontal'

    const videoContainerRef = useRef(null);

    // Use custom hook to manage video controls
    const {
        videoRef,
        videoLoaded,
        isPlaying,
        isMuted,
        showPlayPauseOverlay,
        isAutoScrollEnabled,
        isBuffering,
        togglePlay,
        toggleMute,
    } = useVideoControl({
        videoId: video.id,
        hasNext,
        onNext,
        isActive: shouldPlay,
    });

    // Detect video ratio has video when loaded
    const handleVideoMetadata = useCallback(() => {
        if (videoRef.current) {
            const { videoWidth, videoHeight } = videoRef.current;
            setVideoOrientation(
                videoWidth / videoHeight >= 0.8 ? 'horizontal' : 'vertical',
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Only set the video source when it's needed (visible or preloading)
    useEffect(() => {
        if ((shouldPlay || isLoaded) && video.file_url) {
            setVideoSrc(video.file_url);
        }

        return () => {
            // Nếu component unmount hoặc video không còn cần thiết
            // if (videoRef.current && !shouldPlay) {
            //     console.log(`Cleaning up video ${video.id} resources`);
            //     videoRef.current.pause();
            //     videoRef.current.removeAttribute('src');
            //     videoRef.current.load();
            //     setVideoSrc(null);
            // }
        };
    }, [shouldPlay, video.file_url, isLoaded, video.id]);

    const toggleDescription = useCallback((e) => {
        if (e) e.stopPropagation();
        setExpandedDescription((prev) => !prev);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div
                    className={cx('video-player')}
                    onClick={togglePlay}
                    ref={videoContainerRef}
                >
                    {!videoLoaded && (
                        <LoadingSpinner
                            video={video}
                        />
                    )}

                    <video
                        ref={videoRef}
                        src={videoSrc}
                        poster={video.thumb_url}
                        loop={!isAutoScrollEnabled}
                        playsInline
                        preload={isLoaded ? 'auto' : 'none'}
                        className={cx('video', {
                            hiden: !videoLoaded || !isLoaded,
                            loaded: videoLoaded && isLoaded,
                            'video-horizontal':
                                videoOrientation === 'horizontal',
                            'video-vertical': videoOrientation === 'vertical',
                        })}
                        onLoadedMetadata={handleVideoMetadata}
                    />

                    {videoLoaded && (
                        <VideoControls
                            videoRef={videoRef}
                            isActive={shouldPlay}
                            isPlaying={isPlaying}
                            isMuted={isMuted}
                            showPlayPauseOverlay={showPlayPauseOverlay}
                            toggleMute={toggleMute}
                            isBuffering={isBuffering}
                        />
                    )}

                    {/* Video Info (User info and description) */}
                    <VideoInfo
                        video={video}
                        expandedDescription={expandedDescription}
                        toggleDescription={toggleDescription}
                    />
                </div>
                <VideoActions video={video} />
            </div>
        </div>
    );
}

VideoPlayer.propTypes = {
    video: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    hasNext: PropTypes.bool.isRequired,
    hasPrev: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool,
    shouldPlay: PropTypes.bool,
    shouldPreload: PropTypes.bool,
};

VideoPlayer.defaultProps = {
    isLoaded: false,
    shouldPlay: false,
    shouldPreload: false,
};

export default memo(VideoPlayer);
