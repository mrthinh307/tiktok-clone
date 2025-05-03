/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './VideoPlayer.module.scss';
import useVideoControl from '~/hooks/useVideoControl';
import VideoActions from '../VideoActions';
import { VideoControls, VideoInfo } from './components';

const cx = classNames.bind(styles);

function VideoPlayer({ video, onNext, onPrev, hasNext, hasPrev, isLoaded, shouldPlay, shouldPreload }) {
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
        progress,
        showPlayPauseOverlay,
        isAutoScrollEnabled,
        isBuffering,
        togglePlay,
        toggleMute,
        setForcePlay,
    } = useVideoControl({
        videoId: video.id,
        hasNext,
        onNext,
        isActive: shouldPlay
    });

    // Detect video ratio has video when loaded
    const handleVideoMetadata = useCallback(() => {
        if (videoRef.current) {
            const { videoWidth, videoHeight } = videoRef.current;
            setVideoOrientation(videoWidth / videoHeight >= 0.8 ? 'horizontal' : 'vertical');
        }
    }, []);

    // Only set the video source when it's needed (visible or preloading)
    useEffect(() => {
        if ((shouldPlay || shouldPreload) && isLoaded) {
            setVideoSrc(video.video.playAddr);
        }
        return () => {
            // Clean up video source when component unmounts or when no longer needed
            if (!shouldPlay && !shouldPreload && videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
        };
    }, [shouldPlay, shouldPreload, video.video.playAddr, isLoaded, videoRef]);

    // Force play when shouldPlay changes to true
    useEffect(() => {
        if (shouldPlay && videoRef.current && videoSrc) {
            setForcePlay(true);
        }
    }, [shouldPlay, videoSrc, videoRef, setForcePlay]);

    const toggleDescription = useCallback((e) => {
        if (e) e.stopPropagation();
        setExpandedDescription((prev) => !prev);
    }, []);

    // Show skeleton loader when video is not loaded
    const renderSkeleton = !videoLoaded || !isLoaded;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('video-player')} onClick={togglePlay} ref={videoContainerRef}>
                    {renderSkeleton && (
                        <div className={cx('skeleton-loader')}>
                            <div className={cx('skeleton-shimmer')}></div>
                        </div>
                    )}
                    
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        poster={video.video.cover}
                        loop={!isAutoScrollEnabled}
                        playsInline
                        preload={shouldPreload ? "auto" : "none"}
                        className={cx('video', { 
                            'video-hidden': !videoLoaded || !videoSrc,
                            'loaded': videoLoaded && videoSrc,
                            'video-horizontal': videoOrientation === 'horizontal',
                            'video-vertical': videoOrientation === 'vertical'
                        })}
                        onLoadedMetadata={handleVideoMetadata}
                    />

                    {videoLoaded && (
                        <VideoControls
                            isPlaying={isPlaying}
                            isMuted={isMuted}
                            progress={progress}
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