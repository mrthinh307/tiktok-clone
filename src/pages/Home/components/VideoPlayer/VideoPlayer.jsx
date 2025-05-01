import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './VideoPlayer.module.scss';
import useVideoControl from '~/hooks/useVideoControl';
import VideoActions from '../VideoActions';
import { VideoControls, VideoInfo } from './components';

const cx = classNames.bind(styles);

function VideoPlayer({ video, onNext, onPrev, hasNext, hasPrev }) {
    const [expandedDescription, setExpandedDescription] = useState(false);

    // Use custom hook to manage video controls
    const {
        videoRef,
        isPlaying,
        isMuted,
        progress,
        showPlayPauseOverlay,
        isAutoScrollEnabled,
        togglePlay,
        toggleMute
    } = useVideoControl({
        videoId: video.id,
        hasNext,
        onNext
    });

    const toggleDescription = useCallback((e) => {
        if (e) e.stopPropagation();
        setExpandedDescription((prev) => !prev);
    }, []);

    return (
        <div className={cx('video-container')}>
            {/* Video Player */}
            <div className={cx('video-player-wrapper')} onClick={togglePlay}>
                <video
                    ref={videoRef}
                    src={video.video.playAddr}
                    poster={video.video.cover}
                    loop={!isAutoScrollEnabled}
                    playsInline
                    className={cx('video')}
                />

                {/* Video Controls (Play/Pause overlay, Progress bar, Sound Button) */}
                <VideoControls 
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    progress={progress}
                    showPlayPauseOverlay={showPlayPauseOverlay}
                    toggleMute={toggleMute}
                />

                {/* Video Info (User info and description) */}
                <VideoInfo 
                    video={video} 
                    expandedDescription={expandedDescription} 
                    toggleDescription={toggleDescription}
                />
            </div>

            {/* Action Buttons */}
            <VideoActions video={video} />
        </div>
    );
}

VideoPlayer.propTypes = {
    video: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    hasNext: PropTypes.bool.isRequired,
    hasPrev: PropTypes.bool.isRequired,
};

// Sử dụng memo để tránh re-render không cần thiết khi props không thay đổi
export default memo(VideoPlayer);